import React from 'react';
import { useNavigation } from '../../context/NavigationContext';
import UserProfile from './UserProfile';
import SongModal from './SongModal';
import PlaylistModal from './PlaylistModal';
import AddToPlaylistModal from './AddToPlaylistModal';
import SettingsModal from './SettingsModal';

function ModalManager({ 
  currentSong, 
  onToggleLike, 
  onSongSelect, 
  userPlaylists, 
  onCreatePlaylist, 
  onAddToPlaylist 
}) {
  const {
    showUserProfile,
    showSongModal,
    showPlaylistModal,
    showAddToPlaylistModal,
    showSettingsModal,
    selectedSongForPlaylist,
    closeUserProfile,
    closeSongModal,
    closePlaylistModal,
    closeAddToPlaylistModal,
    openPlaylistModal,
    closeSettingsModal
  } = useNavigation();

  return (
    <>
      {/* User Profile Modal */}
      <UserProfile />

      {/* Song Detail Modal */}
      <SongModal
        currentSong={currentSong}
        onToggleLike={onToggleLike}
        onSongSelect={onSongSelect}
      />

      {/* Create Playlist Modal */}
      <PlaylistModal
        isOpen={showPlaylistModal}
        onClose={closePlaylistModal}
        onCreatePlaylist={onCreatePlaylist}
      />

      {/* Add to Playlist Modal */}
      <AddToPlaylistModal
        isOpen={showAddToPlaylistModal}
        onClose={closeAddToPlaylistModal}
        song={selectedSongForPlaylist}
        playlists={userPlaylists}
        onAddToPlaylist={onAddToPlaylist}
        onCreatePlaylist={() => {
          closeAddToPlaylistModal();
          openPlaylistModal();
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={closeSettingsModal}
      />
    </>
  );
}

export default ModalManager;
