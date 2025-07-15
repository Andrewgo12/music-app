import React, { useState } from 'react';
import { X, Camera, Lock, Users } from 'lucide-react';
import useModal from '../../hooks/useModal';

function PlaylistModal({ isOpen, onClose, onCreatePlaylist }) {
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  
  const { handleBackgroundClick } = useModal(isOpen, onClose);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playlistName.trim()) {
      const newPlaylist = {
        id: Date.now().toString(),
        name: playlistName.trim(),
        description: description.trim(),
        isPrivate,
        isCollaborative,
        coverImage,
        songs: [],
        createdAt: new Date().toISOString(),
        owner: 'You'
      };
      
      onCreatePlaylist(newPlaylist);
      handleClose();
    }
  };

  const handleClose = () => {
    setPlaylistName('');
    setDescription('');
    setIsPrivate(false);
    setIsCollaborative(false);
    setCoverImage(null);
    onClose();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCoverImage(e.target.result);
      reader.readAsDataURL(file);
    }
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
        zIndex: 1002,
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
          maxWidth: '500px',
          maxHeight: '90vh',
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
          padding: '24px',
          borderBottom: '1px solid var(--spotify-border)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--spotify-white)',
            margin: 0
          }}>
            Create playlist
          </h2>
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
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Cover Image */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '24px',
            marginBottom: '24px'
          }}>
            <div style={{
              position: 'relative',
              width: '180px',
              height: '180px',
              backgroundColor: 'var(--spotify-light-gray)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--spotify-card-gray)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'var(--spotify-light-gray)';
            }}
            onClick={() => document.getElementById('cover-upload').click()}
            >
              {coverImage ? (
                <img 
                  src={coverImage} 
                  alt="Playlist cover" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Camera size={48} color="var(--spotify-text-gray)" />
                  <span style={{
                    fontSize: '14px',
                    color: 'var(--spotify-text-gray)',
                    textAlign: 'center'
                  }}>
                    Choose photo
                  </span>
                </div>
              )}
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>

            {/* Form Fields */}
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="text"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="My Playlist #1"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    fontWeight: '700',
                    backgroundColor: 'var(--spotify-light-gray)',
                    border: 'none',
                    borderRadius: '4px',
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
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add an optional description"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    backgroundColor: 'var(--spotify-light-gray)',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'var(--spotify-white)',
                    outline: 'none',
                    resize: 'none',
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

              {/* Privacy Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '4px',
                  transition: 'background-color 200ms ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--spotify-light-gray)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
                >
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: 'var(--spotify-green)'
                    }}
                  />
                  <Lock size={16} color="var(--spotify-text-gray)" />
                  <span style={{
                    fontSize: '14px',
                    color: 'var(--spotify-white)'
                  }}>
                    Make private
                  </span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '4px',
                  transition: 'background-color 200ms ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--spotify-light-gray)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
                >
                  <input
                    type="checkbox"
                    checked={isCollaborative}
                    onChange={(e) => setIsCollaborative(e.target.checked)}
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: 'var(--spotify-green)'
                    }}
                  />
                  <Users size={16} color="var(--spotify-text-gray)" />
                  <span style={{
                    fontSize: '14px',
                    color: 'var(--spotify-white)'
                  }}>
                    Collaborative playlist
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            paddingTop: '24px',
            borderTop: '1px solid var(--spotify-border)'
          }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: 'transparent',
                border: '1px solid var(--spotify-text-gray)',
                borderRadius: '24px',
                color: 'var(--spotify-white)',
                cursor: 'pointer',
                transition: 'all 200ms ease'
              }}
              className="spotify-button-press"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--spotify-light-gray)';
                e.target.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'scale(1)';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!playlistName.trim()}
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: playlistName.trim() ? 'var(--spotify-green)' : 'var(--spotify-light-gray)',
                border: 'none',
                borderRadius: '24px',
                color: playlistName.trim() ? 'black' : 'var(--spotify-text-gray)',
                cursor: playlistName.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 200ms ease'
              }}
              className={playlistName.trim() ? 'spotify-button-press' : ''}
              onMouseEnter={(e) => {
                if (playlistName.trim()) {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.backgroundColor = '#1ed760';
                }
              }}
              onMouseLeave={(e) => {
                if (playlistName.trim()) {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.backgroundColor = 'var(--spotify-green)';
                }
              }}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlaylistModal;
