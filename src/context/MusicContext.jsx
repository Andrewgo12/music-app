import { createContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import {
  initializeData,
  getSongs,
  getPlaylists,
  getArtists,
  getRecentlyPlayed,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSong,
  addSongToPlaylist,
  removeSongFromPlaylist,
  addToRecentlyPlayed
} from '../utils/dataManager';
import { songService, playlistService, userService } from '../services/apiClient';
import { cacheManager } from '../utils/cacheManager';
import { wsService } from '../services/websocketService';
import { analytics } from '../utils/analytics';
// import { trackEvent } from '../utils/analytics'; // Not used currently
import { RecommendationEngine } from '../utils/recommendations';

// Action Types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_SONGS: 'SET_SONGS',
  SET_PLAYLISTS: 'SET_PLAYLISTS',
  SET_ARTISTS: 'SET_ARTISTS',
  SET_RECENTLY_PLAYED: 'SET_RECENTLY_PLAYED',
  SET_CURRENT_VIEW: 'SET_CURRENT_VIEW',
  SET_CURRENT_PLAYLIST_ID: 'SET_CURRENT_PLAYLIST_ID',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_MODAL_STATE: 'SET_MODAL_STATE',
  SET_NOTIFICATION: 'SET_NOTIFICATION',
  SET_USER_PREFERENCES: 'SET_USER_PREFERENCES',
  SET_QUEUE: 'SET_QUEUE',
  SET_CURRENT_SONG: 'SET_CURRENT_SONG',
  SET_PLAYBACK_STATE: 'SET_PLAYBACK_STATE',
  UPDATE_SONG: 'UPDATE_SONG',
  UPDATE_PLAYLIST: 'UPDATE_PLAYLIST',
  ADD_TO_QUEUE: 'ADD_TO_QUEUE',
  REMOVE_FROM_QUEUE: 'REMOVE_FROM_QUEUE',
  CLEAR_QUEUE: 'CLEAR_QUEUE',

  // New actions for enhanced functionality
  SET_ONLINE_STATUS: 'SET_ONLINE_STATUS',
  SET_SYNC_STATUS: 'SET_SYNC_STATUS',
  SET_RECOMMENDATIONS: 'SET_RECOMMENDATIONS',
  SET_LIKED_SONGS: 'SET_LIKED_SONGS',
  SET_LISTENING_HISTORY: 'SET_LISTENING_HISTORY',
  SET_CACHE_STATUS: 'SET_CACHE_STATUS',
  SET_WEBSOCKET_STATUS: 'SET_WEBSOCKET_STATUS',
  SET_REAL_TIME_DATA: 'SET_REAL_TIME_DATA',
  SET_LISTENING_PARTY: 'SET_LISTENING_PARTY',
  SET_ANALYTICS_DATA: 'SET_ANALYTICS_DATA',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial State
const initialState = {
  // Data
  songs: [],
  playlists: [],
  artists: [],
  recentlyPlayed: [],
  likedSongs: [],
  listeningHistory: [],
  recommendations: {
    forYou: [],
    discover: [],
    similar: []
  },

  // UI State
  currentView: 'home',
  currentPlaylistId: null,
  isLoading: false,
  error: null,

  // Search
  searchQuery: '',
  searchResults: {
    songs: [],
    artists: [],
    playlists: []
  },

  // Modals
  modals: {
    playlist: { isOpen: false, mode: 'create', data: null },
    youtube: { isOpen: false },
    settings: { isOpen: false },
    songDetail: { isOpen: false, song: null },
    addToPlaylist: { isOpen: false, song: null },
    analytics: { isOpen: false },
    equalizer: { isOpen: false },
    queue: { isOpen: false }
  },

  // Notifications
  notification: null,

  // User Preferences
  userPreferences: {
    theme: 'dark',
    volume: 0.7,
    shuffle: false,
    repeat: 'none',
    autoplay: true,
    crossfade: false,
    gaplessPlayback: true,
    showVisualizer: false,
    equalizerPreset: 'flat',
    offlineMode: false,
    highQuality: true
  },

  // Playback
  queue: [],
  currentSong: null,
  playbackState: {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isLoading: false,
    currentIndex: 0,
    shuffle: false,
    repeat: 'none'
  },

  // System Status
  isOnline: navigator.onLine,
  syncStatus: {
    isSyncing: false,
    lastSync: null,
    pendingChanges: 0
  },
  cacheStatus: {
    size: 0,
    maxSize: 100 * 1024 * 1024, // 100MB
    isEnabled: true
  },
  websocketStatus: {
    isConnected: false,
    reconnectAttempts: 0
  },

  // Real-time data
  listeningParty: null,
  realTimeUpdates: {
    likes: {},
    comments: {},
    nowPlaying: {}
  },

  // Analytics
  analyticsData: {
    stats: null,
    dailyData: [],
    moodAnalysis: []
  }
};

// Reducer
function musicReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTIONS.SET_SONGS:
      return { ...state, songs: action.payload };

    case ACTIONS.SET_PLAYLISTS:
      return { ...state, playlists: action.payload };

    case ACTIONS.SET_ARTISTS:
      return { ...state, artists: action.payload };

    case ACTIONS.SET_RECENTLY_PLAYED:
      return { ...state, recentlyPlayed: action.payload };

    case ACTIONS.SET_CURRENT_VIEW:
      return {
        ...state,
        currentView: action.payload.view,
        currentPlaylistId: action.payload.playlistId || null
      };

    case ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };

    case ACTIONS.SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload };

    case ACTIONS.SET_MODAL_STATE:
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload.modal]: {
            ...state.modals[action.payload.modal],
            ...action.payload.state
          }
        }
      };

    case ACTIONS.SET_NOTIFICATION:
      return { ...state, notification: action.payload };

    case ACTIONS.SET_USER_PREFERENCES:
      return {
        ...state,
        userPreferences: { ...state.userPreferences, ...action.payload }
      };

    case ACTIONS.SET_QUEUE:
      return { ...state, queue: action.payload };

    case ACTIONS.SET_CURRENT_SONG:
      return { ...state, currentSong: action.payload };

    case ACTIONS.SET_PLAYBACK_STATE:
      return {
        ...state,
        playbackState: { ...state.playbackState, ...action.payload }
      };

    case ACTIONS.UPDATE_SONG:
      return {
        ...state,
        songs: state.songs.map(song =>
          song.id === action.payload.id ? { ...song, ...action.payload.updates } : song
        )
      };

    case ACTIONS.UPDATE_PLAYLIST:
      return {
        ...state,
        playlists: state.playlists.map(playlist =>
          playlist.id === action.payload.id ? { ...playlist, ...action.payload.updates } : playlist
        )
      };

    case ACTIONS.ADD_TO_QUEUE:
      return {
        ...state,
        queue: [...state.queue, action.payload]
      };

    case ACTIONS.REMOVE_FROM_QUEUE:
      return {
        ...state,
        queue: state.queue.filter((_, index) => index !== action.payload)
      };

    case ACTIONS.CLEAR_QUEUE:
      return { ...state, queue: [] };

    case ACTIONS.SET_ONLINE_STATUS:
      return { ...state, isOnline: action.payload };

    case ACTIONS.SET_SYNC_STATUS:
      return {
        ...state,
        syncStatus: { ...state.syncStatus, ...action.payload }
      };

    case ACTIONS.SET_RECOMMENDATIONS:
      return {
        ...state,
        recommendations: { ...state.recommendations, ...action.payload }
      };

    case ACTIONS.SET_LIKED_SONGS:
      return { ...state, likedSongs: action.payload };

    case ACTIONS.SET_LISTENING_HISTORY:
      return { ...state, listeningHistory: action.payload };

    case ACTIONS.SET_CACHE_STATUS:
      return {
        ...state,
        cacheStatus: { ...state.cacheStatus, ...action.payload }
      };

    case ACTIONS.SET_WEBSOCKET_STATUS:
      return {
        ...state,
        websocketStatus: { ...state.websocketStatus, ...action.payload }
      };

    case ACTIONS.SET_REAL_TIME_DATA:
      return {
        ...state,
        realTimeUpdates: { ...state.realTimeUpdates, ...action.payload }
      };

    case ACTIONS.SET_LISTENING_PARTY:
      return { ...state, listeningParty: action.payload };

    case ACTIONS.SET_ANALYTICS_DATA:
      return {
        ...state,
        analyticsData: { ...state.analyticsData, ...action.payload }
      };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };

    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
}

// Context
export const MusicContext = createContext();

// Provider Component
export function MusicProvider({ children }) {
  const [state, dispatch] = useReducer(musicReducer, initialState);
  const recommendationEngine = useMemo(() =>
    new RecommendationEngine(state.songs, state.playlists, state.recentlyPlayed),
    [state.songs, state.playlists, state.recentlyPlayed]
  );

  // Initialize app with enhanced functionality
  const initializeApp = useCallback(async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    try {
      // Initialize local data
      initializeData();

      // Load data from cache first (for offline support)
      const cachedSongs = await cacheManager.getAll('songs');
      const cachedPlaylists = await cacheManager.getAll('playlists');

      if (cachedSongs.length > 0) {
        dispatch({ type: ACTIONS.SET_SONGS, payload: cachedSongs });
      }
      if (cachedPlaylists.length > 0) {
        dispatch({ type: ACTIONS.SET_PLAYLISTS, payload: cachedPlaylists });
      }

      // Try to fetch fresh data from API
      if (navigator.onLine) {
        try {
          const [songs, playlists, artists, likedSongs] = await Promise.all([
            songService.getAll(),
            playlistService.getAll(),
            // artistService.getAll(), // Uncomment when API is ready
            getSongs(), // Fallback to local data
            userService.getLikes().catch(() => [])
          ]);

          dispatch({ type: ACTIONS.SET_SONGS, payload: songs });
          dispatch({ type: ACTIONS.SET_PLAYLISTS, payload: playlists });
          dispatch({ type: ACTIONS.SET_ARTISTS, payload: artists });
          dispatch({ type: ACTIONS.SET_LIKED_SONGS, payload: likedSongs });

          // Cache the fresh data
          songs.forEach(song => cacheManager.cacheSong(song));
          playlists.forEach(playlist => cacheManager.cachePlaylist(playlist));

        } catch (apiError) {
          console.warn('API not available, using local data:', apiError);
          // Fall back to local data
          const songs = getSongs();
          const playlists = getPlaylists();
          const artists = getArtists();

          dispatch({ type: ACTIONS.SET_SONGS, payload: songs });
          dispatch({ type: ACTIONS.SET_PLAYLISTS, payload: playlists });
          dispatch({ type: ACTIONS.SET_ARTISTS, payload: artists });
        }
      } else {
        // Offline mode - use local data
        const songs = getSongs();
        const playlists = getPlaylists();
        const artists = getArtists();

        dispatch({ type: ACTIONS.SET_SONGS, payload: songs });
        dispatch({ type: ACTIONS.SET_PLAYLISTS, payload: playlists });
        dispatch({ type: ACTIONS.SET_ARTISTS, payload: artists });
      }

      // Load recently played and other user data
      const recentlyPlayed = getRecentlyPlayed();
      dispatch({ type: ACTIONS.SET_RECENTLY_PLAYED, payload: recentlyPlayed });

      // Initialize analytics
      analytics.trackEvent('app_load', { loadTime: Date.now() });

      // Load recommendations
      const recommendations = {
        forYou: recommendationEngine.getPersonalizedRecommendations(20),
        discover: recommendationEngine.getDiscoverWeekly(30)
      };
      dispatch({ type: ACTIONS.SET_RECOMMENDATIONS, payload: recommendations });

    } catch (error) {
      console.error('Error initializing app:', error);
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: 'Failed to initialize application'
      });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, [recommendationEngine]);

  // Setup online/offline listeners
  useEffect(() => {
    const handleOnline = () => {
      dispatch({ type: ACTIONS.SET_ONLINE_STATUS, payload: true });
      // Sync pending changes when coming back online
      syncPendingChanges();
    };

    const handleOffline = () => {
      dispatch({ type: ACTIONS.SET_ONLINE_STATUS, payload: false });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncPendingChanges]); // Added missing dependency

  // Setup WebSocket listeners
  useEffect(() => {
    const handleWSConnected = () => {
      dispatch({
        type: ACTIONS.SET_WEBSOCKET_STATUS,
        payload: { isConnected: true, reconnectAttempts: 0 }
      });
    };

    const handleWSDisconnected = () => {
      dispatch({
        type: ACTIONS.SET_WEBSOCKET_STATUS,
        payload: { isConnected: false }
      });
    };

    const handleRealtimeUpdate = (data) => {
      dispatch({ type: ACTIONS.SET_REAL_TIME_DATA, payload: data });
    };

    wsService.on('connected', handleWSConnected);
    wsService.on('disconnected', handleWSDisconnected);
    wsService.on('songChanged', handleRealtimeUpdate);
    wsService.on('likeAdded', handleRealtimeUpdate);
    wsService.on('likeRemoved', handleRealtimeUpdate);

    return () => {
      wsService.off('connected', handleWSConnected);
      wsService.off('disconnected', handleWSDisconnected);
      wsService.off('songChanged', handleRealtimeUpdate);
      wsService.off('likeAdded', handleRealtimeUpdate);
      wsService.off('likeRemoved', handleRealtimeUpdate);
    };
  }, []);

  // Sync pending changes
  const syncPendingChanges = useCallback(async () => {
    if (!state.isOnline) return;

    dispatch({ type: ACTIONS.SET_SYNC_STATUS, payload: { isSyncing: true } });

    try {
      // Process sync queue from cache manager
      await cacheManager.processSyncQueue();

      dispatch({
        type: ACTIONS.SET_SYNC_STATUS,
        payload: {
          isSyncing: false,
          lastSync: new Date().toISOString(),
          pendingChanges: 0
        }
      });
    } catch (error) {
      console.error('Sync failed:', error);
      dispatch({
        type: ACTIONS.SET_SYNC_STATUS,
        payload: { isSyncing: false }
      });
    }
  }, [state.isOnline]);

  // Actions
  const actions = useMemo(() => ({
    // Navigation
    setCurrentView: (view, playlistId = null) => {
      dispatch({
        type: ACTIONS.SET_CURRENT_VIEW,
        payload: { view, playlistId }
      });
    },

    // Data Management
    refreshData: () => {
      const songs = getSongs();
      const playlists = getPlaylists();
      const artists = getArtists();
      const recentlyPlayed = getRecentlyPlayed();

      dispatch({ type: ACTIONS.SET_SONGS, payload: songs });
      dispatch({ type: ACTIONS.SET_PLAYLISTS, payload: playlists });
      dispatch({ type: ACTIONS.SET_ARTISTS, payload: artists });
      dispatch({ type: ACTIONS.SET_RECENTLY_PLAYED, payload: recentlyPlayed });
    },

    // Playlist Management
    createNewPlaylist: async (playlistData) => {
      try {
        const newPlaylist = createPlaylist(playlistData.name, playlistData.description);
        dispatch({ type: ACTIONS.SET_PLAYLISTS, payload: getPlaylists() });
        dispatch({
          type: ACTIONS.SET_NOTIFICATION,
          payload: { type: 'success', message: 'Playlist created successfully' }
        });
        return newPlaylist;
      } catch (error) {
        dispatch({
          type: ACTIONS.SET_NOTIFICATION,
          payload: { type: 'error', message: 'Error creating playlist' }
        });
        throw error;
      }
    },

    updateExistingPlaylist: async (id, updates) => {
      try {
        updatePlaylist(id, updates);
        dispatch({ type: ACTIONS.SET_PLAYLISTS, payload: getPlaylists() });
        dispatch({
          type: ACTIONS.SET_NOTIFICATION,
          payload: { type: 'success', message: 'Playlist updated successfully' }
        });
      } catch (error) {
        dispatch({
          type: ACTIONS.SET_NOTIFICATION,
          payload: { type: 'error', message: 'Error updating playlist' }
        });
        throw error;
      }
    },

    deleteExistingPlaylist: async (id) => {
      try {
        deletePlaylist(id);
        dispatch({ type: ACTIONS.SET_PLAYLISTS, payload: getPlaylists() });
        dispatch({
          type: ACTIONS.SET_NOTIFICATION,
          payload: { type: 'success', message: 'Playlist deleted successfully' }
        });
      } catch (error) {
        dispatch({
          type: ACTIONS.SET_NOTIFICATION,
          payload: { type: 'error', message: 'Error deleting playlist' }
        });
        throw error;
      }
    },

    // Song Management
    addNewSong: async (songData) => {
      try {
        const newSong = addSong(songData);
        dispatch({ type: ACTIONS.SET_SONGS, payload: getSongs() });
        dispatch({
          type: ACTIONS.SET_NOTIFICATION,
          payload: { type: 'success', message: 'Song added successfully' }
        });
        return newSong;
      } catch (error) {
        dispatch({
          type: ACTIONS.SET_NOTIFICATION,
          payload: { type: 'error', message: 'Error adding song' }
        });
        throw error;
      }
    },

    // Modal Management
    openModal: (modal, data = null) => {
      dispatch({
        type: ACTIONS.SET_MODAL_STATE,
        payload: { modal, state: { isOpen: true, data } }
      });
    },

    closeModal: (modal) => {
      dispatch({
        type: ACTIONS.SET_MODAL_STATE,
        payload: { modal, state: { isOpen: false, data: null } }
      });
    },

    // Notifications
    showNotification: (type, message, duration = 3000) => {
      dispatch({
        type: ACTIONS.SET_NOTIFICATION,
        payload: { type, message, id: Date.now() }
      });

      setTimeout(() => {
        dispatch({ type: ACTIONS.SET_NOTIFICATION, payload: null });
      }, duration);
    },

    clearNotification: () => {
      dispatch({ type: ACTIONS.SET_NOTIFICATION, payload: null });
    },

    // Playback
    setCurrentSong: (song) => {
      dispatch({ type: ACTIONS.SET_CURRENT_SONG, payload: song });
      if (song) {
        addToRecentlyPlayed(song.id);
        dispatch({ type: ACTIONS.SET_RECENTLY_PLAYED, payload: getRecentlyPlayed() });
      }
    },

    updatePlaybackState: (updates) => {
      dispatch({ type: ACTIONS.SET_PLAYBACK_STATE, payload: updates });
    },

    // Queue Management
    setQueue: (songs) => {
      dispatch({ type: ACTIONS.SET_QUEUE, payload: songs });
    },

    addToQueue: (song) => {
      dispatch({ type: ACTIONS.ADD_TO_QUEUE, payload: song });
    },

    removeFromQueue: (index) => {
      dispatch({ type: ACTIONS.REMOVE_FROM_QUEUE, payload: index });
    },

    clearQueue: () => {
      dispatch({ type: ACTIONS.CLEAR_QUEUE });
    },

    // Additional missing actions
    shuffleQueue: () => {
      const shuffled = [...state.queue].sort(() => Math.random() - 0.5);
      dispatch({ type: ACTIONS.SET_QUEUE, payload: shuffled });
    },

    toggleLikeSong: async (song) => {
      if (!song) return;

      const isLiked = state.likedSongs.some(s => s.id === song.id);
      let newLikedSongs;

      if (isLiked) {
        newLikedSongs = state.likedSongs.filter(s => s.id !== song.id);
      } else {
        newLikedSongs = [...state.likedSongs, song];
      }

      dispatch({ type: ACTIONS.SET_LIKED_SONGS, payload: newLikedSongs });

      // Save to localStorage
      localStorage.setItem('likedSongs', JSON.stringify(newLikedSongs));
    },

    // Playlist actions
    createPlaylist: async (playlistData) => {
      const newPlaylist = createPlaylist(playlistData.name, playlistData.description);
      dispatch({ type: ACTIONS.SET_PLAYLISTS, payload: getPlaylists() });
      return newPlaylist;
    },

    updatePlaylist: async (playlistId, updates) => {
      updatePlaylist(playlistId, updates);
      dispatch({ type: ACTIONS.SET_PLAYLISTS, payload: getPlaylists() });
    },

    deletePlaylist: async (playlistId) => {
      deletePlaylist(playlistId);
      dispatch({ type: ACTIONS.SET_PLAYLISTS, payload: getPlaylists() });
    },

    addSongToPlaylist: async (playlistId, songId) => {
      addSongToPlaylist(playlistId, songId);
      dispatch({ type: ACTIONS.SET_PLAYLISTS, payload: getPlaylists() });
    },

    removeSongFromPlaylist: async (playlistId, songId) => {
      removeSongFromPlaylist(playlistId, songId);
      dispatch({ type: ACTIONS.SET_PLAYLISTS, payload: getPlaylists() });
    },

    // Song actions
    addSong: async (songData) => {
      const newSong = addSong(songData);
      dispatch({ type: ACTIONS.SET_SONGS, payload: getSongs() });
      return newSong;
    },

    // Error handling
    setError: (error) => {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error });
    },

    clearError: () => {
      dispatch({ type: ACTIONS.CLEAR_ERROR });
    }
  }), [state.queue, state.likedSongs]);

  const value = useMemo(() => ({
    ...state,
    actions,
    initializeApp
  }), [state, actions, initializeApp]);

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}

// Custom hook moved to separate file to avoid fast refresh issues
// See: src/hooks/useMusic.js
