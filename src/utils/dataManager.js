// Data management utilities for JSON-based storage
import songsData from '../data/songs.json';
import playlistsData from '../data/playlists.json';
import artistsData from '../data/artists.json';

// Local storage keys
const STORAGE_KEYS = {
  SONGS: 'music_app_songs',
  PLAYLISTS: 'music_app_playlists',
  ARTISTS: 'music_app_artists',
  USER_PREFERENCES: 'music_app_preferences',
  RECENTLY_PLAYED: 'music_app_recently_played',
  CURRENT_QUEUE: 'music_app_queue'
};

// Initialize data from JSON files or localStorage
export const initializeData = () => {
  // Load songs
  const storedSongs = localStorage.getItem(STORAGE_KEYS.SONGS);
  if (!storedSongs) {
    localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(songsData));
  }

  // Load playlists
  const storedPlaylists = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
  if (!storedPlaylists) {
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlistsData));
  }

  // Load artists
  const storedArtists = localStorage.getItem(STORAGE_KEYS.ARTISTS);
  if (!storedArtists) {
    localStorage.setItem(STORAGE_KEYS.ARTISTS, JSON.stringify(artistsData));
  }

  // Initialize user preferences
  const storedPreferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
  if (!storedPreferences) {
    const defaultPreferences = {
      volume: 0.7,
      shuffle: false,
      repeat: 'none', // 'none', 'one', 'all'
      theme: 'dark',
      autoplay: true
    };
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(defaultPreferences));
  }

  // Initialize recently played
  const storedRecentlyPlayed = localStorage.getItem(STORAGE_KEYS.RECENTLY_PLAYED);
  if (!storedRecentlyPlayed) {
    localStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify([]));
  }

  // Initialize current queue
  const storedQueue = localStorage.getItem(STORAGE_KEYS.CURRENT_QUEUE);
  if (!storedQueue) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_QUEUE, JSON.stringify([]));
  }
};

// Songs management
export const getSongs = () => {
  const songs = localStorage.getItem(STORAGE_KEYS.SONGS);
  return songs ? JSON.parse(songs) : [];
};

export const getSongById = (id) => {
  const songs = getSongs();
  return songs.find(song => song.id === id);
};

export const addSong = (song) => {
  const songs = getSongs();
  const newSong = {
    ...song,
    id: Date.now().toString(),
    addedDate: new Date().toISOString()
  };
  songs.push(newSong);
  localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(songs));
  return newSong;
};

export const updateSong = (id, updates) => {
  const songs = getSongs();
  const index = songs.findIndex(song => song.id === id);
  if (index !== -1) {
    songs[index] = { ...songs[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(songs));
    return songs[index];
  }
  return null;
};

export const deleteSong = (id) => {
  const songs = getSongs();
  const filteredSongs = songs.filter(song => song.id !== id);
  localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(filteredSongs));

  // Also remove from playlists
  const playlists = getPlaylists();
  const updatedPlaylists = playlists.map(playlist => ({
    ...playlist,
    songIds: playlist.songIds.filter(songId => songId !== id)
  }));
  localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(updatedPlaylists));
};

// Playlists management
export const getPlaylists = () => {
  const playlists = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
  return playlists ? JSON.parse(playlists) : [];
};

export const getPlaylistById = (id) => {
  const playlists = getPlaylists();
  return playlists.find(playlist => playlist.id === id);
};

export const createPlaylist = (name, description = '') => {
  const playlists = getPlaylists();
  const newPlaylist = {
    id: `playlist-${Date.now()}`,
    name,
    description,
    imageUrl: '/images/default-playlist.jpg',
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
    songIds: [],
    isPublic: false,
    createdBy: 'user'
  };
  playlists.push(newPlaylist);
  localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
  return newPlaylist;
};

export const updatePlaylist = (id, updates) => {
  const playlists = getPlaylists();
  const index = playlists.findIndex(playlist => playlist.id === id);
  if (index !== -1) {
    playlists[index] = {
      ...playlists[index],
      ...updates,
      updatedDate: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    return playlists[index];
  }
  return null;
};

export const deletePlaylist = (id) => {
  const playlists = getPlaylists();
  const filteredPlaylists = playlists.filter(playlist => playlist.id !== id);
  localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(filteredPlaylists));
};

export const addSongToPlaylist = (playlistId, songId) => {
  const playlists = getPlaylists();
  const playlist = playlists.find(p => p.id === playlistId);
  if (playlist && !playlist.songIds.includes(songId)) {
    playlist.songIds.push(songId);
    playlist.updatedDate = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    return true;
  }
  return false;
};

export const removeSongFromPlaylist = (playlistId, songId) => {
  const playlists = getPlaylists();
  const playlist = playlists.find(p => p.id === playlistId);
  if (playlist) {
    playlist.songIds = playlist.songIds.filter(id => id !== songId);
    playlist.updatedDate = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    return true;
  }
  return false;
};

// Artists management
export const getArtists = () => {
  const artists = localStorage.getItem(STORAGE_KEYS.ARTISTS);
  return artists ? JSON.parse(artists) : [];
};

export const getArtistById = (id) => {
  const artists = getArtists();
  return artists.find(artist => artist.id === id);
};

// User preferences
export const getUserPreferences = () => {
  const preferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
  return preferences ? JSON.parse(preferences) : {};
};

export const updateUserPreferences = (updates) => {
  const preferences = getUserPreferences();
  const updatedPreferences = { ...preferences, ...updates };
  localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updatedPreferences));
  return updatedPreferences;
};

// Recently played management
export const getRecentlyPlayed = () => {
  const recentlyPlayed = localStorage.getItem(STORAGE_KEYS.RECENTLY_PLAYED);
  return recentlyPlayed ? JSON.parse(recentlyPlayed) : [];
};

export const addToRecentlyPlayed = (songId) => {
  let recentlyPlayed = getRecentlyPlayed();

  // Remove if already exists
  recentlyPlayed = recentlyPlayed.filter(id => id !== songId);

  // Add to beginning
  recentlyPlayed.unshift(songId);

  // Keep only last 50 songs
  recentlyPlayed = recentlyPlayed.slice(0, 50);

  localStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(recentlyPlayed));
};

// Queue management
export const getQueue = () => {
  const queue = localStorage.getItem(STORAGE_KEYS.CURRENT_QUEUE);
  return queue ? JSON.parse(queue) : [];
};

export const setQueue = (songIds) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_QUEUE, JSON.stringify(songIds));
};

export const addToQueue = (songId) => {
  const queue = getQueue();
  queue.push(songId);
  localStorage.setItem(STORAGE_KEYS.CURRENT_QUEUE, JSON.stringify(queue));
};

export const removeFromQueue = (index) => {
  const queue = getQueue();
  queue.splice(index, 1);
  localStorage.setItem(STORAGE_KEYS.CURRENT_QUEUE, JSON.stringify(queue));
};

// Search functionality
export const searchSongs = (query) => {
  const songs = getSongs();
  const lowercaseQuery = query.toLowerCase();

  return songs.filter(song =>
    song.title.toLowerCase().includes(lowercaseQuery) ||
    song.artist.toLowerCase().includes(lowercaseQuery) ||
    song.album.toLowerCase().includes(lowercaseQuery) ||
    song.genre.toLowerCase().includes(lowercaseQuery)
  );
};

export const searchArtists = (query) => {
  const artists = getArtists();
  const lowercaseQuery = query.toLowerCase();

  return artists.filter(artist =>
    artist.name.toLowerCase().includes(lowercaseQuery) ||
    artist.genre.toLowerCase().includes(lowercaseQuery)
  );
};

export const searchPlaylists = (query) => {
  const playlists = getPlaylists();
  const lowercaseQuery = query.toLowerCase();

  return playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(lowercaseQuery) ||
    playlist.description.toLowerCase().includes(lowercaseQuery)
  );
};

// YouTube URL utilities
export const extractYouTubeVideoId = (url) => {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const isValidYouTubeUrl = (url) => {
  return extractYouTubeVideoId(url) !== null;
};

// Export/Import functionality
export const exportData = () => {
  const data = {
    songs: getSongs(),
    playlists: getPlaylists(),
    artists: getArtists(),
    preferences: getUserPreferences(),
    recentlyPlayed: getRecentlyPlayed(),
    exportDate: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `music-app-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        if (data.songs) localStorage.setItem(STORAGE_KEYS.SONGS, JSON.stringify(data.songs));
        if (data.playlists) localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(data.playlists));
        if (data.artists) localStorage.setItem(STORAGE_KEYS.ARTISTS, JSON.stringify(data.artists));
        if (data.preferences) localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(data.preferences));
        if (data.recentlyPlayed) localStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(data.recentlyPlayed));

        resolve(data);
      } catch {
        reject(new Error('Invalid backup file format'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
