import React, { useState } from 'react';
import { X, Volume2, Wifi, Bell, Shield, Palette, Download } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import useModal from '../../hooks/useModal';

function SettingsModal({ isOpen, onClose }) {
  const { theme, toggleTheme } = useTheme();
  const [audioQuality, setAudioQuality] = useState('high');
  const [notifications, setNotifications] = useState({
    newMusic: true,
    playlists: true,
    friends: false,
    concerts: true
  });
  const [autoplay, setAutoplay] = useState(true);
  const [crossfade, setCrossfade] = useState(0);
  const [downloadQuality, setDownloadQuality] = useState('high');
  
  const { handleBackgroundClick } = useModal(isOpen, onClose);

  if (!isOpen) return null;

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
        zIndex: 1004,
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
          maxWidth: '600px',
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
            Settings
          </h2>
          <button
            onClick={onClose}
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
        <div style={{
          padding: '24px',
          maxHeight: 'calc(90vh - 120px)',
          overflowY: 'auto'
        }}>
          {/* Appearance */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <Palette size={20} color="var(--spotify-green)" />
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--spotify-white)',
                margin: 0
              }}>
                Appearance
              </h3>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0'
            }}>
              <div>
                <div style={{
                  fontSize: '16px',
                  color: 'var(--spotify-white)',
                  marginBottom: '4px'
                }}>
                  Theme
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--spotify-text-gray)'
                }}>
                  Choose your preferred theme
                </div>
              </div>
              <button
                onClick={toggleTheme}
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
                {theme === 'dark' ? 'Dark' : 'Light'}
              </button>
            </div>
          </div>

          {/* Audio Quality */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <Volume2 size={20} color="var(--spotify-green)" />
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--spotify-white)',
                margin: 0
              }}>
                Audio Quality
              </h3>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              marginBottom: '12px'
            }}>
              <div>
                <div style={{
                  fontSize: '16px',
                  color: 'var(--spotify-white)',
                  marginBottom: '4px'
                }}>
                  Streaming quality
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--spotify-text-gray)'
                }}>
                  Higher quality uses more data
                </div>
              </div>
              <select
                value={audioQuality}
                onChange={(e) => setAudioQuality(e.target.value)}
                style={{
                  padding: '8px 12px',
                  fontSize: '14px',
                  backgroundColor: 'var(--spotify-light-gray)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'var(--spotify-white)',
                  cursor: 'pointer'
                }}
              >
                <option value="low">Low (96 kbps)</option>
                <option value="normal">Normal (160 kbps)</option>
                <option value="high">High (320 kbps)</option>
              </select>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0'
            }}>
              <div>
                <div style={{
                  fontSize: '16px',
                  color: 'var(--spotify-white)',
                  marginBottom: '4px'
                }}>
                  Autoplay
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--spotify-text-gray)'
                }}>
                  Play similar songs when your music ends
                </div>
              </div>
              <label style={{
                position: 'relative',
                display: 'inline-block',
                width: '44px',
                height: '24px'
              }}>
                <input
                  type="checkbox"
                  checked={autoplay}
                  onChange={(e) => setAutoplay(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: autoplay ? 'var(--spotify-green)' : 'var(--spotify-light-gray)',
                  borderRadius: '24px',
                  transition: 'all 200ms ease'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '',
                    height: '18px',
                    width: '18px',
                    left: autoplay ? '23px' : '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    transition: 'all 200ms ease'
                  }} />
                </span>
              </label>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0'
            }}>
              <div>
                <div style={{
                  fontSize: '16px',
                  color: 'var(--spotify-white)',
                  marginBottom: '4px'
                }}>
                  Crossfade
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--spotify-text-gray)'
                }}>
                  {crossfade}s
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                value={crossfade}
                onChange={(e) => setCrossfade(parseInt(e.target.value))}
                style={{
                  width: '120px',
                  accentColor: 'var(--spotify-green)'
                }}
              />
            </div>
          </div>

          {/* Download Quality */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <Download size={20} color="var(--spotify-green)" />
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--spotify-white)',
                margin: 0
              }}>
                Download
              </h3>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0'
            }}>
              <div>
                <div style={{
                  fontSize: '16px',
                  color: 'var(--spotify-white)',
                  marginBottom: '4px'
                }}>
                  Download quality
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--spotify-text-gray)'
                }}>
                  Higher quality takes more space
                </div>
              </div>
              <select
                value={downloadQuality}
                onChange={(e) => setDownloadQuality(e.target.value)}
                style={{
                  padding: '8px 12px',
                  fontSize: '14px',
                  backgroundColor: 'var(--spotify-light-gray)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'var(--spotify-white)',
                  cursor: 'pointer'
                }}
              >
                <option value="normal">Normal (160 kbps)</option>
                <option value="high">High (320 kbps)</option>
              </select>
            </div>
          </div>

          {/* Notifications */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <Bell size={20} color="var(--spotify-green)" />
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--spotify-white)',
                margin: 0
              }}>
                Notifications
              </h3>
            </div>
            
            {Object.entries({
              newMusic: 'New music from artists you follow',
              playlists: 'Playlist updates',
              friends: 'Friend activity',
              concerts: 'Concert recommendations'
            }).map(([key, label]) => (
              <div key={key} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0'
              }}>
                <div style={{
                  fontSize: '16px',
                  color: 'var(--spotify-white)'
                }}>
                  {label}
                </div>
                <label style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '44px',
                  height: '24px'
                }}>
                  <input
                    type="checkbox"
                    checked={notifications[key]}
                    onChange={() => handleNotificationChange(key)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: notifications[key] ? 'var(--spotify-green)' : 'var(--spotify-light-gray)',
                    borderRadius: '24px',
                    transition: 'all 200ms ease'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '18px',
                      width: '18px',
                      left: notifications[key] ? '23px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: 'all 200ms ease'
                    }} />
                  </span>
                </label>
              </div>
            ))}
          </div>

          {/* Privacy */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <Shield size={20} color="var(--spotify-green)" />
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--spotify-white)',
                margin: 0
              }}>
                Privacy
              </h3>
            </div>
            
            <button
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                fontWeight: '500',
                backgroundColor: 'transparent',
                border: '1px solid var(--spotify-border)',
                borderRadius: '4px',
                color: 'var(--spotify-white)',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--spotify-light-gray)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Privacy Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
