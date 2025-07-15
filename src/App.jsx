import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Music2,
  Settings,
  User,
  Search,
  ChevronLeft,
  ChevronRight,
  WifiOff
} from 'lucide-react';

// Enhanced Components
// import EnhancedNavigation from './components/navigation/EnhancedNavigation';
import EnhancedPlayerBar from './components/layout/PlayerBar';
import PlaylistModal from './components/modals/PlaylistModal';
import YouTubeImportModal from './components/modals/YouTubeImportModal';
import AdvancedSettings from './components/settings/AdvancedSettings';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import QueueManager from './components/player/QueueManager';
import MiniPlayer from './components/player/MiniPlayer';
import SyncedLyrics from './components/player/SyncedLyrics';
import TestingSuite from './components/testing/TestingSuite';
import NotificationSystem from './components/ui/NotificationSystem';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Button from './components/ui/Button';
import Input from './components/ui/Input';

// Enhanced Views
import HomeView from './views/HomeView';
import SearchView from './views/SearchView';
import LibraryView from './views/LibraryView';
import PlaylistView from './views/PlaylistView';
import ArtistsView from './views/ArtistsView';
import AlbumsView from './views/AlbumsView';
import LikedSongsView from './views/LikedSongsView';

// Layout Components
import Sidebar from './components/layout/Sidebar';

// Context and Services
import { AuthProvider } from './context/AuthContext';
import { MusicProvider } from './context/MusicContext';
import { useAuth } from './hooks/useAuth';
import { useMusic } from './hooks/useMusic';
import { themeSystem } from './utils/themeSystem';
import { trackEvent } from './utils/analytics';

// Hooks and Utils
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useResponsive } from './hooks/useResponsive';
import { formatTime } from './utils/helpers';

// Main App Component
function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const {
    // State
    currentView,
    currentPlaylistId,
    songs,
    playlists,
    artists,
    recentlyPlayed,
    likedSongs,
    queue,
    currentSong,
    playbackState,
    modals,
    isOnline,
    syncStatus,

    // Actions
    actions
  } = useMusic();

  const { isDesktop } = useResponsive();
  // const isMobile = !isDesktop; // Not used currently
  const audioPlayer = useAudioPlayer();
  // Local state for UI
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [showTestingSuite, setShowTestingSuite] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState(['home']);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  // Initialize app on mount
  useEffect(() => {
    actions.initializeApp();
    themeSystem.initialize();

    // Track app load
    trackEvent('app_load', {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`
    });

    // Keyboard shortcut for testing suite (Ctrl+Shift+T)
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        setShowTestingSuite(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions]);

  // Enhanced Navigation with History
  const handleNavigation = useCallback((view, playlistId = null) => {
    const newLocation = playlistId ? `${view}:${playlistId}` : view;

    // Add to history if it's a new location
    if (navigationHistory[currentHistoryIndex] !== newLocation) {
      const newHistory = navigationHistory.slice(0, currentHistoryIndex + 1);
      newHistory.push(newLocation);
      setNavigationHistory(newHistory);
      setCurrentHistoryIndex(newHistory.length - 1);
    }

    actions.setCurrentView(view);
    if (playlistId) actions.setCurrentPlaylistId(playlistId);

    // Track navigation
    trackEvent('navigation', { from: currentView, to: view, playlistId });
  }, [navigationHistory, currentHistoryIndex, currentView, actions]);

  const handleBack = useCallback(() => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      const location = navigationHistory[newIndex];
      const [view, playlistId] = location.split(':');

      setCurrentHistoryIndex(newIndex);
      actions.setCurrentView(view);
      if (playlistId) actions.setCurrentPlaylistId(playlistId);
    }
  }, [currentHistoryIndex, navigationHistory, actions]);

  const handleForward = useCallback(() => {
    if (currentHistoryIndex < navigationHistory.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      const location = navigationHistory[newIndex];
      const [view, playlistId] = location.split(':');

      setCurrentHistoryIndex(newIndex);
      actions.setCurrentView(view);
      if (playlistId) actions.setCurrentPlaylistId(playlistId);
    }
  }, [currentHistoryIndex, navigationHistory, actions]);

  // Enhanced Audio Handlers
  const handlePlaySong = useCallback((song, songQueue = null, index = 0) => {
    const queue = songQueue || [song];
    audioPlayer.playSong(song, queue, index);
    actions.setCurrentSong(song);
    actions.setQueue(queue);

    // Track play event
    trackEvent('song_play', {
      songId: song.id,
      title: song.title,
      artist: song.artist,
      source: songQueue ? 'playlist' : 'single'
    });
  }, [audioPlayer, actions]);

  const handlePlayPlaylist = useCallback((playlist) => {
    const playlistSongs = playlist.songIds
      ?.map(songId => songs.find(song => song.id === songId))
      .filter(Boolean) || [];

    if (playlistSongs.length > 0) {
      handlePlaySong(playlistSongs[0], playlistSongs, 0);
    }
  }, [songs, handlePlaySong]);

  const handleAddToQueue = useCallback((song) => {
    audioPlayer.addToQueue(song);
    actions.addToQueue(song);

    // Show notification
    actions.showNotification({
      type: 'success',
      message: `Added "${song.title}" to queue`
    });
  }, [audioPlayer, actions]);

  // Enhanced Playlist Handlers
  const handleCreatePlaylist = useCallback(() => {
    actions.openModal('playlist', { mode: 'create', data: null });
  }, [actions]);

  const handleEditPlaylist = useCallback((playlist) => {
    actions.openModal('playlist', { mode: 'edit', data: playlist });
  }, [actions]);

  const handleSavePlaylist = useCallback(async (playlistData) => {
    try {
      const modal = modals.playlist;
      if (modal.mode === 'edit' && modal.data) {
        await actions.updatePlaylist(modal.data.id, playlistData);
        actions.showNotification({
          type: 'success',
          message: 'Playlist updated successfully'
        });
      } else {
        await actions.createPlaylist(playlistData);
        actions.showNotification({
          type: 'success',
          message: 'Playlist created successfully'
        });
      }
      actions.closeModal('playlist');
    } catch (error) {
      console.error('Failed to save playlist:', error);
      actions.showNotification({
        type: 'error',
        message: 'Failed to save playlist'
      });
    }
  }, [modals.playlist, actions]);

  const handleDeletePlaylist = useCallback(async (playlistId) => {
    try {
      await actions.deletePlaylist(playlistId);
      if (currentPlaylistId === playlistId) {
        handleNavigation('library');
      }
      actions.showNotification({
        type: 'success',
        message: 'Playlist deleted successfully'
      });
    } catch (error) {
      console.error('Failed to delete playlist:', error);
      actions.showNotification({
        type: 'error',
        message: 'Failed to delete playlist'
      });
    }
  }, [currentPlaylistId, actions, handleNavigation]);

  const handleAddSongToPlaylist = useCallback(async (playlistId, song) => {
    try {
      await actions.addSongToPlaylist(playlistId, song.id);
      actions.showNotification({
        type: 'success',
        message: `Added "${song.title}" to playlist`
      });
    } catch (error) {
      console.error('Failed to add song to playlist:', error);
      actions.showNotification({
        type: 'error',
        message: 'Failed to add song to playlist'
      });
    }
  }, [actions]);

  const handleRemoveFromPlaylist = useCallback(async (playlistId, songId) => {
    try {
      await actions.removeSongFromPlaylist(playlistId, songId);
      actions.showNotification({
        type: 'success',
        message: 'Song removed from playlist'
      });
    } catch (error) {
      console.error('Failed to remove song from playlist:', error);
      actions.showNotification({
        type: 'error',
        message: 'Failed to remove song from playlist'
      });
    }
  }, [actions]);

  // Enhanced YouTube import handler
  const handleYouTubeImport = useCallback(async (songData) => {
    try {
      const newSong = await actions.addSong(songData);
      actions.closeModal('youtube');
      actions.showNotification({
        type: 'success',
        message: `Imported "${songData.title}" from YouTube`
      });
      return newSong;
    } catch (error) {
      console.error('Failed to import from YouTube:', error);
      actions.showNotification({
        type: 'error',
        message: 'Failed to import from YouTube'
      });
    }
  }, [actions]);

  // Enhanced view rendering with animations
  const renderCurrentView = useMemo(() => {
    const commonProps = {
      onPlaySong: handlePlaySong,
      onPlayPlaylist: handlePlayPlaylist,
      onAddToQueue: handleAddToQueue,
      onAddSongToPlaylist: handleAddSongToPlaylist,
      formatTime: formatTime,
      isPlaying: playbackState.isPlaying,
      currentSong: currentSong
    };

    switch (currentView) {
      case 'search':
        return (
          <SearchView
            {...commonProps}
            songs={songs}
            artists={artists}
            playlists={playlists}
          />
        );

      case 'library':
        return (
          <LibraryView
            {...commonProps}
            playlists={playlists}
            songs={songs}
            onCreatePlaylist={handleCreatePlaylist}
            onEditPlaylist={handleEditPlaylist}
            onDeletePlaylist={handleDeletePlaylist}
          />
        );

      case 'liked':
        return (
          <LikedSongsView
            {...commonProps}
            songs={likedSongs}
          />
        );

      case 'artists':
        return (
          <ArtistsView
            {...commonProps}
            artists={artists}
            songs={songs}
          />
        );

      case 'albums':
        return (
          <AlbumsView
            {...commonProps}
            songs={songs}
          />
        );

      case 'playlist': {
        const currentPlaylist = playlists.find(p => p.id === currentPlaylistId);
        return (
          <PlaylistView
            {...commonProps}
            playlist={currentPlaylist}
            songs={songs}
            onRemoveFromPlaylist={handleRemoveFromPlaylist}
            onEditPlaylist={handleEditPlaylist}
            onDeletePlaylist={handleDeletePlaylist}
          />
        );
      }

      case 'home':
      default:
        return (
          <HomeView
            {...commonProps}
            songs={songs}
            playlists={playlists}
            recentlyPlayed={recentlyPlayed}
          />
        );
    }
  }, [
    currentView,
    songs,
    playlists,
    artists,
    likedSongs,
    recentlyPlayed,
    currentPlaylistId,
    playbackState.isPlaying,
    currentSong,
    handlePlaySong,
    handlePlayPlaylist,
    handleAddToQueue,
    handleAddSongToPlaylist,
    handleCreatePlaylist,
    handleEditPlaylist,
    handleDeletePlaylist,
    handleRemoveFromPlaylist
  ]);



  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Connection Status */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            className="bg-red-600 text-white px-4 py-2 text-center text-sm"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <WifiOff className="w-4 h-4 inline mr-2" />
            You're offline. Some features may be limited.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigation}
          playlists={playlists}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          user={user}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Top Bar */}
          <div className="h-16 bg-gray-900/95 backdrop-blur-lg flex items-center justify-between px-6 border-b border-gray-800/50">
            <div className="flex items-center space-x-4">
              {/* Navigation Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  disabled={currentHistoryIndex === 0}
                  className="text-gray-400 hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleForward}
                  disabled={currentHistoryIndex >= navigationHistory.length - 1}
                  className="text-gray-400 hover:text-white disabled:opacity-30"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Current View Title */}
              <motion.h2
                className="text-xl font-semibold capitalize"
                key={currentView}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {currentView === 'playlist'
                  ? playlists.find(p => p.id === currentPlaylistId)?.name || 'Playlist'
                  : currentView.replace(/([A-Z])/g, ' $1').trim()
                }
              </motion.h2>
            </div>

            {/* Top Bar Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Bar for Desktop */}
              {isDesktop && currentView !== 'search' && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search songs, artists..."
                    className="pl-10 w-64 bg-gray-800 border-gray-700"
                    onFocus={() => handleNavigation('search')}
                  />
                </div>
              )}

              {/* Sync Status */}
              {syncStatus.isSyncing && (
                <div className="flex items-center space-x-2 text-gray-400">
                  <LoadingSpinner size="small" type="dots" />
                  <span className="text-sm">Syncing...</span>
                </div>
              )}

              {/* Action Buttons */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => actions.openModal('youtube')}
                className="text-gray-400 hover:text-white"
                title="Import from YouTube"
              >
                <Music2 className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => actions.openModal('settings')}
                className="text-gray-400 hover:text-white"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </Button>

              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                  title="Profile"
                >
                  <User className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Content Area with Page Transitions */}
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentView}-${currentPlaylistId}`}
                className="absolute inset-0 overflow-y-auto"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {renderCurrentView}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Enhanced Player Bar */}
      <EnhancedPlayerBar
        currentSong={currentSong}
        isPlaying={playbackState.isPlaying}
        currentTime={playbackState.currentTime}
        duration={playbackState.duration}
        volume={audioPlayer.volume}
        shuffle={playbackState.shuffle}
        repeat={playbackState.repeat}
        isLiked={likedSongs.some(song => song.id === currentSong?.id)}
        queue={queue}
        onPlayPause={audioPlayer.togglePlayPause}
        onNext={audioPlayer.handleNext}
        onPrevious={audioPlayer.handlePrevious}
        onSeek={audioPlayer.seekTo}
        onVolumeChange={audioPlayer.changeVolume}
        onShuffle={audioPlayer.toggleShuffle}
        onRepeat={audioPlayer.toggleRepeat}
        onLike={() => actions.toggleLikeSong(currentSong)}
        onShowQueue={() => actions.openModal('queue')}
        onShowLyrics={() => actions.openModal('lyrics')}
        onShowVisualizer={() => actions.openModal('visualizer')}
        onMiniPlayer={() => setShowMiniPlayer(true)}
        formatTime={formatTime}
      />

      {/* Mini Player */}
      <AnimatePresence>
        {showMiniPlayer && currentSong && (
          <MiniPlayer
            currentSong={currentSong}
            isPlaying={playbackState.isPlaying}
            currentTime={playbackState.currentTime}
            duration={playbackState.duration}
            volume={audioPlayer.volume}
            onPlayPause={audioPlayer.togglePlayPause}
            onNext={audioPlayer.handleNext}
            onPrevious={audioPlayer.handlePrevious}
            onSeek={audioPlayer.seekTo}
            onVolumeChange={audioPlayer.changeVolume}
            onExpand={() => setShowMiniPlayer(false)}
            onClose={() => setShowMiniPlayer(false)}
            formatTime={formatTime}
          />
        )}
      </AnimatePresence>

      {/* Enhanced Modals */}
      <PlaylistModal
        isOpen={modals.playlist.isOpen}
        onClose={() => actions.closeModal('playlist')}
        onSave={handleSavePlaylist}
        playlist={modals.playlist.data}
        mode={modals.playlist.mode || 'create'}
      />

      <YouTubeImportModal
        isOpen={modals.youtube.isOpen}
        onClose={() => actions.closeModal('youtube')}
        onImport={handleYouTubeImport}
      />

      <AdvancedSettings
        isOpen={modals.settings.isOpen}
        onClose={() => actions.closeModal('settings')}
      />

      <AnalyticsDashboard
        isOpen={modals.analytics.isOpen}
        onClose={() => actions.closeModal('analytics')}
      />

      <QueueManager
        isOpen={modals.queue.isOpen}
        onClose={() => actions.closeModal('queue')}
        queue={queue}
        currentSong={currentSong}
        currentIndex={playbackState.currentIndex}
        isPlaying={playbackState.isPlaying}
        onPlaySong={handlePlaySong}
        onRemoveFromQueue={(index) => actions.removeFromQueue(index)}
        onReorderQueue={(newQueue) => actions.setQueue(newQueue)}
        onClearQueue={() => actions.clearQueue()}
        onShuffleQueue={() => actions.shuffleQueue()}
        formatTime={formatTime}
      />

      {modals.lyrics.isOpen && currentSong && (
        <SyncedLyrics
          song={currentSong}
          currentTime={playbackState.currentTime}
          isPlaying={playbackState.isPlaying}
          onClose={() => actions.closeModal('lyrics')}
        />
      )}

      {/* Testing Suite */}
      {showTestingSuite && (
        <TestingSuite onClose={() => setShowTestingSuite(false)} />
      )}

      {/* Notification System */}
      <NotificationSystem />
    </div>
  );
}

// Main App Wrapper with Providers
function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        <AppContent />
      </MusicProvider>
    </AuthProvider>
  );
}

export default App;
