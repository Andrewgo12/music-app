// Advanced API client for backend integration

class ApiClient {
  constructor(baseURL = 'http://localhost:3001/api') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
    this.refreshToken = localStorage.getItem('refresh_token');
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Set refresh token
  setRefreshToken(refreshToken) {
    this.refreshToken = refreshToken;
    localStorage.setItem('refresh_token', refreshToken);
  }

  // Clear tokens
  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  // Process failed queue after token refresh
  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  // Refresh access token
  async refreshAccessToken() {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    this.isRefreshing = true;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const { accessToken } = data;

      this.setToken(accessToken);
      this.processQueue(null, accessToken);

      return accessToken;
    } catch (error) {
      this.processQueue(error, null);
      this.clearTokens();
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Make HTTP request with automatic token refresh
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);

      // Handle 401 - Unauthorized (token expired)
      if (response.status === 401 && this.refreshToken) {
        try {
          await this.refreshAccessToken();

          // Retry original request with new token
          config.headers.Authorization = `Bearer ${this.token}`;
          const retryResponse = await fetch(url, config);

          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }

          return await retryResponse.json();
        } catch (refreshError) {
          // Refresh failed, redirect to login
          window.location.href = '/login';
          throw refreshError;
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(url, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Upload file
  async upload(endpoint, file, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      method: 'POST',
      body: formData,
      headers: {},
    };

    // Add auth token if available
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    // Handle upload progress
    if (onProgress) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch {
              reject(new Error('Invalid JSON response'));
            }
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('POST', `${this.baseURL}${endpoint}`);

        if (this.token) {
          xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
        }

        xhr.send(formData);
      });
    }

    return this.request(endpoint, config);
  }

  // Stream data (for real-time features)
  createEventSource(endpoint) {
    const url = `${this.baseURL}${endpoint}`;
    const eventSource = new EventSource(url);

    return eventSource;
  }

  // WebSocket connection
  createWebSocket(endpoint) {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}${endpoint}`;

    return new WebSocket(wsUrl);
  }
}

// API endpoints
export const endpoints = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
    updateProfile: '/auth/profile',
    changePassword: '/auth/change-password',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password'
  },

  // Songs
  songs: {
    list: '/songs',
    get: (id) => `/songs/${id}`,
    create: '/songs',
    update: (id) => `/songs/${id}`,
    delete: (id) => `/songs/${id}`,
    search: '/songs/search',
    trending: '/songs/trending',
    recommendations: '/songs/recommendations',
    upload: '/songs/upload',
    stream: (id) => `/songs/${id}/stream`,
    lyrics: (id) => `/songs/${id}/lyrics`
  },

  // Playlists
  playlists: {
    list: '/playlists',
    get: (id) => `/playlists/${id}`,
    create: '/playlists',
    update: (id) => `/playlists/${id}`,
    delete: (id) => `/playlists/${id}`,
    addSong: (id) => `/playlists/${id}/songs`,
    removeSong: (playlistId, songId) => `/playlists/${playlistId}/songs/${songId}`,
    reorder: (id) => `/playlists/${id}/reorder`,
    follow: (id) => `/playlists/${id}/follow`,
    unfollow: (id) => `/playlists/${id}/unfollow`
  },

  // Artists
  artists: {
    list: '/artists',
    get: (id) => `/artists/${id}`,
    songs: (id) => `/artists/${id}/songs`,
    albums: (id) => `/artists/${id}/albums`,
    follow: (id) => `/artists/${id}/follow`,
    unfollow: (id) => `/artists/${id}/unfollow`
  },

  // Albums
  albums: {
    list: '/albums',
    get: (id) => `/albums/${id}`,
    songs: (id) => `/albums/${id}/songs`
  },

  // User interactions
  user: {
    likes: '/user/likes',
    like: (songId) => `/user/likes/${songId}`,
    unlike: (songId) => `/user/likes/${songId}`,
    history: '/user/history',
    queue: '/user/queue',
    updateQueue: '/user/queue',
    following: '/user/following',
    followers: '/user/followers',
    stats: '/user/stats'
  },

  // Search
  search: {
    all: '/search',
    songs: '/search/songs',
    artists: '/search/artists',
    playlists: '/search/playlists',
    albums: '/search/albums',
    suggestions: '/search/suggestions'
  },

  // Analytics
  analytics: {
    track: '/analytics/track',
    stats: '/analytics/stats',
    export: '/analytics/export'
  }
};

// Create singleton instance
export const apiClient = new ApiClient();

// Service functions
export const authService = {
  login: (credentials) => apiClient.post(endpoints.auth.login, credentials),
  register: (userData) => apiClient.post(endpoints.auth.register, userData),
  logout: () => apiClient.post(endpoints.auth.logout),
  getProfile: () => apiClient.get(endpoints.auth.profile),
  updateProfile: (data) => apiClient.put(endpoints.auth.updateProfile, data),
  changePassword: (data) => apiClient.post(endpoints.auth.changePassword, data),
  forgotPassword: (email) => apiClient.post(endpoints.auth.forgotPassword, { email }),
  resetPassword: (data) => apiClient.post(endpoints.auth.resetPassword, data)
};

export const songService = {
  getAll: (params) => apiClient.get(endpoints.songs.list, params),
  getById: (id) => apiClient.get(endpoints.songs.get(id)),
  create: (data) => apiClient.post(endpoints.songs.create, data),
  update: (id, data) => apiClient.put(endpoints.songs.update(id), data),
  delete: (id) => apiClient.delete(endpoints.songs.delete(id)),
  search: (query, params) => apiClient.get(endpoints.songs.search, { q: query, ...params }),
  getTrending: (params) => apiClient.get(endpoints.songs.trending, params),
  getRecommendations: (params) => apiClient.get(endpoints.songs.recommendations, params),
  upload: (file, onProgress) => apiClient.upload(endpoints.songs.upload, file, onProgress),
  getLyrics: (id) => apiClient.get(endpoints.songs.lyrics(id))
};

export const playlistService = {
  getAll: (params) => apiClient.get(endpoints.playlists.list, params),
  getById: (id) => apiClient.get(endpoints.playlists.get(id)),
  create: (data) => apiClient.post(endpoints.playlists.create, data),
  update: (id, data) => apiClient.put(endpoints.playlists.update(id), data),
  delete: (id) => apiClient.delete(endpoints.playlists.delete(id)),
  addSong: (id, songId) => apiClient.post(endpoints.playlists.addSong(id), { songId }),
  removeSong: (playlistId, songId) => apiClient.delete(endpoints.playlists.removeSong(playlistId, songId)),
  reorder: (id, songIds) => apiClient.put(endpoints.playlists.reorder(id), { songIds }),
  follow: (id) => apiClient.post(endpoints.playlists.follow(id)),
  unfollow: (id) => apiClient.delete(endpoints.playlists.unfollow(id))
};

export const userService = {
  getLikes: () => apiClient.get(endpoints.user.likes),
  likeSong: (songId) => apiClient.post(endpoints.user.like(songId)),
  unlikeSong: (songId) => apiClient.delete(endpoints.user.unlike(songId)),
  getHistory: (params) => apiClient.get(endpoints.user.history, params),
  getQueue: () => apiClient.get(endpoints.user.queue),
  updateQueue: (songs) => apiClient.put(endpoints.user.updateQueue, { songs }),
  getStats: () => apiClient.get(endpoints.user.stats)
};

export default apiClient;
