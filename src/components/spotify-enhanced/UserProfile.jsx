import React, { useState } from 'react';
import { Edit3, Settings, X, Camera } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { useTheme } from '../../context/ThemeContext';
import useModal from '../../hooks/useModal';

function UserProfile({ onClose }) {
  const { showUserProfile, closeUserProfile } = useNavigation();
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Use modal hook for ESC key and background click handling
  const { handleBackgroundClick } = useModal(showUserProfile, closeUserProfile);

  const [userProfile, setUserProfile] = useState({
    displayName: 'Music Lover',
    username: 'musiclover2024',
    email: 'user@example.com',
    bio: 'Passionate about discovering new music and creating the perfect playlists.',
    avatar: null,
    followers: 234,
    following: 156,
    playlistsCreated: 12,
    songsLiked: 1247,
    totalListeningTime: '2,456 hours'
  });

  const [editForm, setEditForm] = useState({
    displayName: userProfile.displayName,
    bio: userProfile.bio
  });

  const recentActivity = [
    { id: '1', action: 'Liked', item: 'Blinding Lights', artist: 'The Weeknd', time: '2 hours ago' },
    { id: '2', action: 'Added to playlist', item: 'Watermelon Sugar', artist: 'Harry Styles', time: '5 hours ago' },
    { id: '3', action: 'Followed', item: 'Dua Lipa', artist: null, time: '1 day ago' },
    { id: '4', action: 'Created playlist', item: 'Summer Vibes 2024', artist: null, time: '2 days ago' },
    { id: '5', action: 'Liked', item: 'Levitating', artist: 'Dua Lipa', time: '3 days ago' }
  ];

  const handleSaveProfile = () => {
    setUserProfile(prev => ({
      ...prev,
      displayName: editForm.displayName,
      bio: editForm.bio
    }));
    setIsEditing(false);
  };

  const handleClose = () => {
    console.log('🔧 UserProfile: handleClose called');
    closeUserProfile();
    if (onClose) onClose();
  };

  // Don't render if modal is not supposed to be shown
  if (!showUserProfile) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--spotify-overlay)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'spotify-fade-in 0.2s ease-out'
      }}
      onClick={handleBackgroundClick}
      data-modal="true"
      tabIndex={-1}
    >
      <div style={{
        backgroundColor: 'var(--spotify-dark-gray)',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: 'var(--spotify-shadow-heavy)'
      }}>
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
            Profile
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
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--spotify-white)';
              e.target.style.backgroundColor = 'var(--spotify-light-gray)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--spotify-text-gray)';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', maxHeight: 'calc(90vh - 96px)' }}>
          {!showSettings ? (
            <>
              {/* Profile Info */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '32px' }}>
                {/* Avatar */}
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1DB954 0%, #1ED760 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {userProfile.displayName.charAt(0)}
                  </div>
                  {isEditing && (
                    <button style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      width: '32px',
                      height: '32px',
                      backgroundColor: 'var(--spotify-dark-gray)',
                      border: '2px solid var(--spotify-white)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                      <Camera size={16} color="white" />
                    </button>
                  )}
                </div>

                {/* Profile Details */}
                <div style={{ flex: 1 }}>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <input
                        type="text"
                        value={editForm.displayName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                        style={{
                          backgroundColor: 'var(--spotify-light-gray)',
                          border: '1px solid var(--spotify-border)',
                          borderRadius: '4px',
                          padding: '12px',
                          color: 'var(--spotify-white)',
                          fontSize: '16px'
                        }}
                        placeholder="Display Name"
                      />
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                        style={{
                          backgroundColor: 'var(--spotify-light-gray)',
                          border: '1px solid var(--spotify-border)',
                          borderRadius: '4px',
                          padding: '12px',
                          color: 'var(--spotify-white)',
                          fontSize: '14px',
                          resize: 'vertical',
                          minHeight: '80px'
                        }}
                        placeholder="Bio"
                      />
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={handleSaveProfile}
                          style={{
                            backgroundColor: 'var(--spotify-green)',
                            color: 'black',
                            border: 'none',
                            borderRadius: '24px',
                            padding: '8px 24px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          style={{
                            backgroundColor: 'transparent',
                            color: 'var(--spotify-text-gray)',
                            border: '1px solid var(--spotify-border)',
                            borderRadius: '24px',
                            padding: '8px 24px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h3 style={{
                          fontSize: '32px',
                          fontWeight: '700',
                          color: 'var(--spotify-white)',
                          margin: 0
                        }}>
                          {userProfile.displayName}
                        </h3>
                        <button
                          onClick={() => setIsEditing(true)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--spotify-text-gray)',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            transition: 'color 200ms ease'
                          }}
                          onMouseEnter={(e) => e.target.style.color = 'var(--spotify-white)'}
                          onMouseLeave={(e) => e.target.style.color = 'var(--spotify-text-gray)'}
                        >
                          <Edit3 size={16} />
                        </button>
                      </div>
                      <p style={{
                        fontSize: '14px',
                        color: 'var(--spotify-text-gray)',
                        margin: '0 0 8px 0'
                      }}>
                        @{userProfile.username}
                      </p>
                      <p style={{
                        fontSize: '14px',
                        color: 'var(--spotify-text-subdued)',
                        margin: '0 0 16px 0',
                        lineHeight: '1.4'
                      }}>
                        {userProfile.bio}
                      </p>

                      {/* Stats */}
                      <div style={{ display: 'flex', gap: '24px' }}>
                        <div>
                          <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--spotify-white)' }}>
                            {userProfile.followers}
                          </span>
                          <span style={{ fontSize: '14px', color: 'var(--spotify-text-gray)', marginLeft: '4px' }}>
                            Followers
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--spotify-white)' }}>
                            {userProfile.following}
                          </span>
                          <span style={{ fontSize: '14px', color: 'var(--spotify-text-gray)', marginLeft: '4px' }}>
                            Following
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Music Stats */}
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--spotify-white)',
                  marginBottom: '16px'
                }}>
                  Your Music
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '16px'
                }}>
                  <div style={{
                    backgroundColor: 'var(--spotify-card-gray)',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--spotify-green)' }}>
                      {userProfile.playlistsCreated}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--spotify-text-gray)' }}>
                      Playlists Created
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: 'var(--spotify-card-gray)',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--spotify-green)' }}>
                      {userProfile.songsLiked}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--spotify-text-gray)' }}>
                      Songs Liked
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: 'var(--spotify-card-gray)',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--spotify-green)' }}>
                      {userProfile.totalListeningTime}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--spotify-text-gray)' }}>
                      Total Listening
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'var(--spotify-white)',
                  marginBottom: '16px'
                }}>
                  Recent Activity
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        backgroundColor: 'var(--spotify-card-gray)',
                        borderRadius: '4px'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', color: 'var(--spotify-white)' }}>
                          <span style={{ color: 'var(--spotify-text-gray)' }}>{activity.action}</span>
                          {' '}
                          <span style={{ fontWeight: '600' }}>{activity.item}</span>
                          {activity.artist && (
                            <>
                              {' by '}
                              <span style={{ color: 'var(--spotify-text-gray)' }}>{activity.artist}</span>
                            </>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--spotify-text-subdued)' }}>
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--spotify-light-gray)',
                  border: 'none',
                  borderRadius: '24px',
                  padding: '12px 24px',
                  color: 'var(--spotify-white)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 200ms ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--spotify-card-gray)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--spotify-light-gray)'}
              >
                <Settings size={16} />
                Settings
              </button>
            </>
          ) : (
            /* Settings View */
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <button
                  onClick={() => setShowSettings(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--spotify-text-gray)',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  ←
                </button>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: 'var(--spotify-white)',
                  margin: 0
                }}>
                  Settings
                </h3>
              </div>

              {/* Theme Toggle */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 0',
                borderBottom: '1px solid var(--spotify-border)'
              }}>
                <div>
                  <div style={{ fontSize: '16px', color: 'var(--spotify-white)', marginBottom: '4px' }}>
                    Theme
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--spotify-text-gray)' }}>
                    Choose your preferred theme
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  style={{
                    backgroundColor: theme === 'dark' ? 'var(--spotify-green)' : 'var(--spotify-light-gray)',
                    border: 'none',
                    borderRadius: '24px',
                    padding: '8px 16px',
                    color: theme === 'dark' ? 'black' : 'var(--spotify-white)',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 200ms ease'
                  }}
                >
                  {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                </button>
              </div>

              {/* Account Info */}
              <div style={{ padding: '16px 0' }}>
                <div style={{ fontSize: '16px', color: 'var(--spotify-white)', marginBottom: '8px' }}>
                  Account Information
                </div>
                <div style={{ fontSize: '14px', color: 'var(--spotify-text-gray)', marginBottom: '4px' }}>
                  Email: {userProfile.email}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--spotify-text-gray)' }}>
                  Username: @{userProfile.username}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
