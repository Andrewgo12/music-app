// Advanced cache manager with offline support and synchronization

class CacheManager {
  constructor() {
    this.dbName = 'MusicAppCache';
    this.dbVersion = 1;
    this.db = null;
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    this.maxCacheSize = 100 * 1024 * 1024; // 100MB

    this.initializeDB();
    this.setupOnlineListener();
  }

  // Initialize IndexedDB
  async initializeDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Songs store
        if (!db.objectStoreNames.contains('songs')) {
          const songsStore = db.createObjectStore('songs', { keyPath: 'id' });
          songsStore.createIndex('artist', 'artist', { unique: false });
          songsStore.createIndex('genre', 'genre', { unique: false });
          songsStore.createIndex('lastAccessed', 'lastAccessed', { unique: false });
        }

        // Playlists store
        if (!db.objectStoreNames.contains('playlists')) {
          const playlistsStore = db.createObjectStore('playlists', { keyPath: 'id' });
          playlistsStore.createIndex('userId', 'userId', { unique: false });
          playlistsStore.createIndex('lastModified', 'lastModified', { unique: false });
        }

        // Audio files store
        if (!db.objectStoreNames.contains('audioFiles')) {
          const audioStore = db.createObjectStore('audioFiles', { keyPath: 'songId' });
          audioStore.createIndex('size', 'size', { unique: false });
          audioStore.createIndex('downloadDate', 'downloadDate', { unique: false });
        }

        // Sync queue store
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
          syncStore.createIndex('type', 'type', { unique: false });
        }

        // User data store
        if (!db.objectStoreNames.contains('userData')) {
          db.createObjectStore('userData', { keyPath: 'key' });
        }
      };
    });
  }

  // Setup online/offline listeners
  setupOnlineListener() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Generic get method
  async get(storeName, key) {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          // Update last accessed time
          this.updateLastAccessed(storeName, key);
          resolve(result);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  // Generic set method
  async set(storeName, data) {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      // Add timestamp
      const dataWithTimestamp = {
        ...data,
        lastAccessed: Date.now(),
        lastModified: Date.now()
      };

      const request = store.put(dataWithTimestamp);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Generic delete method
  async delete(storeName, key) {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get all items from store
  async getAll(storeName, indexName = null, query = null) {
    if (!this.db) await this.initializeDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);

      let request;
      if (indexName && query) {
        const index = store.index(indexName);
        request = index.getAll(query);
      } else {
        request = store.getAll();
      }

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Update last accessed time
  async updateLastAccessed(storeName, key) {
    try {
      const item = await this.get(storeName, key);
      if (item) {
        item.lastAccessed = Date.now();
        await this.set(storeName, item);
      }
    } catch (error) {
      console.error('Error updating last accessed:', error);
    }
  }

  // Cache song data
  async cacheSong(song) {
    try {
      await this.set('songs', song);
      await this.cleanupOldEntries('songs');
    } catch (error) {
      console.error('Error caching song:', error);
    }
  }

  // Get cached song
  async getCachedSong(songId) {
    return this.get('songs', songId);
  }

  // Cache playlist data
  async cachePlaylist(playlist) {
    try {
      await this.set('playlists', playlist);
    } catch (error) {
      console.error('Error caching playlist:', error);
    }
  }

  // Get cached playlist
  async getCachedPlaylist(playlistId) {
    return this.get('playlists', playlistId);
  }

  // Cache audio file
  async cacheAudioFile(songId, audioBlob) {
    try {
      const audioData = {
        songId,
        audioBlob,
        size: audioBlob.size,
        downloadDate: Date.now()
      };

      await this.set('audioFiles', audioData);
      await this.manageCacheSize();
    } catch (error) {
      console.error('Error caching audio file:', error);
    }
  }

  // Get cached audio file
  async getCachedAudioFile(songId) {
    const audioData = await this.get('audioFiles', songId);
    return audioData ? audioData.audioBlob : null;
  }

  // Add to sync queue
  async addToSyncQueue(action) {
    try {
      const syncItem = {
        ...action,
        timestamp: Date.now(),
        retryCount: 0
      };

      await this.set('syncQueue', syncItem);

      if (this.isOnline) {
        this.processSyncQueue();
      }
    } catch (error) {
      console.error('Error adding to sync queue:', error);
    }
  }

  // Process sync queue
  async processSyncQueue() {
    if (!this.isOnline) return;

    try {
      const queueItems = await this.getAll('syncQueue');

      for (const item of queueItems) {
        try {
          await this.processSyncItem(item);
          await this.delete('syncQueue', item.id);
        } catch (error) {
          console.error('Error processing sync item:', error);

          // Increment retry count
          item.retryCount = (item.retryCount || 0) + 1;

          // Remove from queue if too many retries
          if (item.retryCount > 3) {
            await this.delete('syncQueue', item.id);
          } else {
            await this.set('syncQueue', item);
          }
        }
      }
    } catch (error) {
      console.error('Error processing sync queue:', error);
    }
  }

  // Process individual sync item
  async processSyncItem(item) {
    const { type } = item;
    // const { data, endpoint, method } = item; // Not used currently

    switch (type) {
      case 'CREATE_PLAYLIST':
        // Sync playlist creation
        break;
      case 'UPDATE_PLAYLIST':
        // Sync playlist update
        break;
      case 'DELETE_PLAYLIST':
        // Sync playlist deletion
        break;
      case 'LIKE_SONG':
        // Sync song like
        break;
      case 'UNLIKE_SONG':
        // Sync song unlike
        break;
      default:
        console.warn('Unknown sync item type:', type);
    }
  }

  // Manage cache size
  async manageCacheSize() {
    try {
      const audioFiles = await this.getAll('audioFiles');
      const totalSize = audioFiles.reduce((sum, file) => sum + file.size, 0);

      if (totalSize > this.maxCacheSize) {
        // Sort by last accessed (oldest first)
        audioFiles.sort((a, b) => (a.lastAccessed || 0) - (b.lastAccessed || 0));

        // Remove oldest files until under limit
        let currentSize = totalSize;
        for (const file of audioFiles) {
          if (currentSize <= this.maxCacheSize * 0.8) break; // Keep 20% buffer

          await this.delete('audioFiles', file.songId);
          currentSize -= file.size;
        }
      }
    } catch (error) {
      console.error('Error managing cache size:', error);
    }
  }

  // Clean up old entries
  async cleanupOldEntries(storeName, maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 days
    try {
      const items = await this.getAll(storeName);
      const cutoffTime = Date.now() - maxAge;

      for (const item of items) {
        if ((item.lastAccessed || 0) < cutoffTime) {
          await this.delete(storeName, item.id);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old entries:', error);
    }
  }

  // Get cache statistics
  async getCacheStats() {
    try {
      const [songs, playlists, audioFiles] = await Promise.all([
        this.getAll('songs'),
        this.getAll('playlists'),
        this.getAll('audioFiles')
      ]);

      const audioSize = audioFiles.reduce((sum, file) => sum + file.size, 0);

      return {
        songs: songs.length,
        playlists: playlists.length,
        audioFiles: audioFiles.length,
        audioSize,
        audioSizeMB: Math.round(audioSize / (1024 * 1024) * 100) / 100,
        isOnline: this.isOnline
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return null;
    }
  }

  // Clear all cache
  async clearCache() {
    try {
      const stores = ['songs', 'playlists', 'audioFiles', 'syncQueue', 'userData'];

      for (const storeName of stores) {
        const items = await this.getAll(storeName);
        for (const item of items) {
          await this.delete(storeName, item.id || item.key);
        }
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Export cache data
  async exportCache() {
    try {
      const [songs, playlists, userData] = await Promise.all([
        this.getAll('songs'),
        this.getAll('playlists'),
        this.getAll('userData')
      ]);

      const exportData = {
        songs,
        playlists,
        userData,
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `music-app-cache-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting cache:', error);
    }
  }
}

// Create singleton instance
export const cacheManager = new CacheManager();

// Utility functions
export const cacheUtils = {
  // Check if item is cached
  isCached: async (type, id) => {
    const item = await cacheManager.get(type, id);
    return !!item;
  },

  // Get cache size
  getCacheSize: async () => {
    const stats = await cacheManager.getCacheStats();
    return stats ? stats.audioSizeMB : 0;
  },

  // Preload songs for offline use
  preloadSongs: async (songs) => {
    for (const song of songs) {
      try {
        // Cache song metadata
        await cacheManager.cacheSong(song);

        // Download and cache audio file if not already cached
        const cachedAudio = await cacheManager.getCachedAudioFile(song.id);
        if (!cachedAudio && song.audioUrl) {
          const response = await fetch(song.audioUrl);
          const audioBlob = await response.blob();
          await cacheManager.cacheAudioFile(song.id, audioBlob);
        }
      } catch (error) {
        console.error(`Error preloading song ${song.id}:`, error);
      }
    }
  }
};

export default cacheManager;
