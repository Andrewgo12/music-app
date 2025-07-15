import React, { useState } from 'react';
import { X, Plus, Search, Check } from 'lucide-react';
import useModal from '../../hooks/useModal';

function AddToPlaylistModal({ isOpen, onClose, song, playlists, onAddToPlaylist, onCreatePlaylist }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlaylists, setSelectedPlaylists] = useState(new Set());
  
  const { handleBackgroundClick } = useModal(isOpen, onClose);

  if (!isOpen || !song) return null;

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlaylistToggle = (playlistId) => {
    const newSelected = new Set(selectedPlaylists);
    if (newSelected.has(playlistId)) {
      newSelected.delete(playlistId);
    } else {
      newSelected.add(playlistId);
    }
    setSelectedPlaylists(newSelected);
  };

  const handleSave = () => {
    selectedPlaylists.forEach(playlistId => {
      onAddToPlaylist(song, playlistId);
    });
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    setSelectedPlaylists(new Set());
    onClose();
  };

  const handleCreateNew = () => {
    onCreatePlaylist();
    handleClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--spotify-overlay)',
        zIndex: 1003,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={handleBackgroundClick}
      data-modal="true"
      tabIndex={-1}
    >
      <div 
        className="spotify-modal"
        style={{
          backgroundColor: 'var(--spotify-dark-gray)',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '400px',
          maxHeight: '80vh',
          overflow: 'hidden',
          boxShadow: 'var(--spotify-shadow-heavy)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--spotify-border)'
        }}>
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--spotify-white)',
              margin: '0 0 4px 0'
            }}>
              Add to playlist
            </h2>
            <p style={{
              fontSize: '14px',
              color: 'var(--spotify-text-gray)',
              margin: 0
            }}>
              {song.title} • {song.artist}
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--spotify-text-gray)',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              transition: 'all 200ms ease'
            }}
            className="spotify-button-press"
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--spotify-white)';
              e.target.style.backgroundColor = 'var(--spotify-light-gray)';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--spotify-text-gray)';
              e.target.style.backgroundColor = 'transparent';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '16px 24px' }}>
          <div style={{
            position: 'relative',
            marginBottom: '16px'
          }}>
            <Search 
              size={16} 
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--spotify-text-gray)'
              }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Find a playlist"
              style={{
                width: '100%',
                height: '40px',
                paddingLeft: '40px',
                paddingRight: '12px',
                borderRadius: '20px',
                border: 'none',
                fontSize: '14px',
                backgroundColor: 'var(--spotify-light-gray)',
                color: 'var(--spotify-white)',
                outline: 'none',
                transition: 'all 200ms ease'
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = 'var(--spotify-card-gray)';
                e.target.style.boxShadow = '0 0 0 2px var(--spotify-green)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = 'var(--spotify-light-gray)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Create New Playlist */}
          <button
            onClick={handleCreateNew}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 200ms ease',
              marginBottom: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--spotify-light-gray)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--spotify-light-gray)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Plus size={20} color="var(--spotify-text-gray)" />
            </div>
            <span style={{
              fontSize: '16px',
              fontWeight: '500',
              color: 'var(--spotify-white)'
            }}>
              Create playlist
            </span>
          </button>
        </div>

        {/* Playlist List */}
        <div style={{
          maxHeight: '300px',
          overflowY: 'auto',
          padding: '0 24px 24px 24px'
        }}>
          {filteredPlaylists.length > 0 ? (
            filteredPlaylists.map((playlist) => {
              const isSelected = selectedPlaylists.has(playlist.id);
              const isAlreadyAdded = playlist.songs?.some(s => s.id === song.id);
              
              return (
                <button
                  key={playlist.id}
                  onClick={() => !isAlreadyAdded && handlePlaylistToggle(playlist.id)}
                  disabled={isAlreadyAdded}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isAlreadyAdded ? 'not-allowed' : 'pointer',
                    transition: 'background-color 200ms ease',
                    opacity: isAlreadyAdded ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isAlreadyAdded) {
                      e.target.style.backgroundColor = 'var(--spotify-light-gray)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isAlreadyAdded) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'var(--spotify-light-gray)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: 'white', fontSize: '16px' }}>♪</span>
                  </div>
                  
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: 'var(--spotify-white)',
                      marginBottom: '2px'
                    }}>
                      {playlist.name}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--spotify-text-gray)'
                    }}>
                      {isAlreadyAdded ? 'Already added' : `${playlist.songCount || 0} songs`}
                    </div>
                  </div>
                  
                  {isSelected && !isAlreadyAdded && (
                    <Check size={20} color="var(--spotify-green)" />
                  )}
                </button>
              );
            })
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: 'var(--spotify-text-gray)'
            }}>
              <p style={{ fontSize: '16px', margin: 0 }}>
                {searchTerm ? 'No playlists found' : 'No playlists yet'}
              </p>
              <p style={{ fontSize: '14px', margin: '8px 0 0 0' }}>
                Create your first playlist to get started
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedPlaylists.size > 0 && (
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--spotify-border)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <button
              onClick={handleClose}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: 'transparent',
                border: '1px solid var(--spotify-text-gray)',
                borderRadius: '20px',
                color: 'var(--spotify-white)',
                cursor: 'pointer',
                transition: 'all 200ms ease'
              }}
              className="spotify-button-press"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--spotify-light-gray)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: 'var(--spotify-green)',
                border: 'none',
                borderRadius: '20px',
                color: 'black',
                cursor: 'pointer',
                transition: 'all 200ms ease'
              }}
              className="spotify-button-press"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1ed760';
                e.target.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--spotify-green)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              Add to {selectedPlaylists.size} playlist{selectedPlaylists.size !== 1 ? 's' : ''}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddToPlaylistModal;
