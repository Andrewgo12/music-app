import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export function NavigationProvider({ children }) {
  const [currentView, setCurrentView] = useState('home');
  const [viewHistory, setViewHistory] = useState(['home']);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showSongModal, setShowSongModal] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState(null);

  const navigateTo = (view, data = null) => {
    setViewHistory(prev => [...prev, view]);
    setCurrentView(view);

    // Set specific data based on view type
    switch (view) {
      case 'artist':
        setSelectedArtist(data);
        break;
      case 'album':
        setSelectedAlbum(data);
        break;
      case 'song':
        setSelectedSong(data);
        setShowSongModal(true);
        break;
      case 'profile':
        setShowUserProfile(true);
        break;
      default:
        break;
    }
  };

  const goBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop(); // Remove current view
      const previousView = newHistory[newHistory.length - 1];

      setViewHistory(newHistory);
      setCurrentView(previousView);

      // Clear specific data when going back
      if (currentView === 'artist') setSelectedArtist(null);
      if (currentView === 'album') setSelectedAlbum(null);
      if (currentView === 'song') {
        setSelectedSong(null);
        setShowSongModal(false);
      }
      if (currentView === 'profile') setShowUserProfile(false);
    }
  };

  const closeSongModal = () => {
    setShowSongModal(false);
    setSelectedSong(null);
  };

  const closeUserProfile = () => {
    console.log('🔧 Closing user profile modal');
    setShowUserProfile(false);
    if (currentView === 'profile') {
      goBack();
    }
  };

  const closeAllModals = () => {
    setShowUserProfile(false);
    setShowSongModal(false);
    setShowPlaylistModal(false);
    setShowAddToPlaylistModal(false);
    setShowSettingsModal(false);
    setSelectedSong(null);
    setSelectedSongForPlaylist(null);
  };

  // Playlist Modal Functions
  const openPlaylistModal = () => {
    closeAllModals();
    setShowPlaylistModal(true);
  };

  const closePlaylistModal = () => {
    setShowPlaylistModal(false);
  };

  // Add to Playlist Modal Functions
  const openAddToPlaylistModal = (song) => {
    closeAllModals();
    setSelectedSongForPlaylist(song);
    setShowAddToPlaylistModal(true);
  };

  const closeAddToPlaylistModal = () => {
    setShowAddToPlaylistModal(false);
    setSelectedSongForPlaylist(null);
  };

  // Settings Modal Functions
  const openSettingsModal = () => {
    closeAllModals();
    setShowSettingsModal(true);
  };

  const closeSettingsModal = () => {
    setShowSettingsModal(false);
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [];

    viewHistory.forEach((view, index) => {
      switch (view) {
        case 'home':
          breadcrumbs.push({ label: 'Home', view: 'home' });
          break;
        case 'search':
          breadcrumbs.push({ label: 'Search', view: 'search' });
          break;
        case 'library':
          breadcrumbs.push({ label: 'Your Library', view: 'library' });
          break;
        case 'artist':
          breadcrumbs.push({
            label: selectedArtist?.name || 'Artist',
            view: 'artist',
            data: selectedArtist
          });
          break;
        case 'album':
          breadcrumbs.push({
            label: selectedAlbum?.title || 'Album',
            view: 'album',
            data: selectedAlbum
          });
          break;
        case 'profile':
          breadcrumbs.push({ label: 'Profile', view: 'profile' });
          break;
        default:
          break;
      }
    });

    return breadcrumbs;
  };

  const value = {
    currentView,
    viewHistory,
    selectedArtist,
    selectedAlbum,
    selectedSong,
    selectedSongForPlaylist,
    showUserProfile,
    showSongModal,
    showPlaylistModal,
    showAddToPlaylistModal,
    showSettingsModal,
    navigateTo,
    goBack,
    closeSongModal,
    closeUserProfile,
    closeAllModals,
    openPlaylistModal,
    closePlaylistModal,
    openAddToPlaylistModal,
    closeAddToPlaylistModal,
    openSettingsModal,
    closeSettingsModal,
    getBreadcrumbs,
    canGoBack: viewHistory.length > 1
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
