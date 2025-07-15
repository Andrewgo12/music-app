import React from 'react';
import {
  Home,
  Search,
  Library,
  Plus,
  Heart,
  Download,
  Sun,
  Moon,
  Settings,
  List
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { useTheme } from '../../context/ThemeContext';

function SpotifySidebarEnhanced({ playlists }) {
  const {
    currentView,
    navigateTo,
    openPlaylistModal,
    openSettingsModal
  } = useNavigation();
  const { theme, toggleTheme, isDark } = useTheme();

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Your Library', icon: Library },
    { id: 'queue', label: 'Queue', icon: List }
  ];

  return (
    <div style={{
      width: '280px',
      backgroundColor: 'var(--spotify-black)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      borderRight: '1px solid var(--spotify-border)',
      height: '100%'
    }}>
      {/* Spotify Logo */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'var(--spotify-green)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px'
          }}>
            <span style={{
              color: 'black',
              fontWeight: 'bold',
              fontSize: '20px'
            }}>♪</span>
          </div>
          <span style={{
            fontSize: '28px',
            fontWeight: '900',
            color: 'var(--spotify-white)'
          }}>
            Spotify
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav style={{ marginBottom: '40px' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <li key={item.id} style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => navigateTo(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: isActive ? '700' : '500',
                    color: isActive ? 'var(--spotify-white)' : 'var(--spotify-text-gray)',
                    transition: 'all 200ms ease',
                    borderRadius: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.color = 'var(--spotify-white)';
                      e.target.style.backgroundColor = 'var(--spotify-light-gray)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.color = 'var(--spotify-text-gray)';
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon size={28} style={{ marginRight: '20px' }} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Create Playlist & Liked Songs */}
      <div style={{ marginBottom: '32px' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginBottom: '8px' }}>
            <button
              onClick={openPlaylistModal}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                color: 'var(--spotify-text-gray)',
                transition: 'all 200ms ease',
                borderRadius: '8px'
              }}
              className="spotify-button-press"
              onMouseEnter={(e) => {
                e.target.style.color = 'var(--spotify-white)';
                e.target.style.backgroundColor = 'var(--spotify-light-gray)';
                e.target.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = 'var(--spotify-text-gray)';
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                backgroundColor: 'var(--spotify-text-gray)',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}>
                <Plus size={16} />
              </div>
              Create Playlist
            </button>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <button
              onClick={() => navigateTo('liked')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '8px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 'var(--font-size-body)',
                color: currentView === 'liked' ? 'var(--spotify-white)' : 'var(--spotify-text-gray)',
                fontWeight: currentView === 'liked' ? '600' : '400',
                transition: 'color var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                if (currentView !== 'liked') e.target.style.color = 'var(--spotify-white)';
              }}
              onMouseLeave={(e) => {
                if (currentView !== 'liked') e.target.style.color = 'var(--spotify-text-gray)';
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                background: 'linear-gradient(135deg, #450af5, #c4efd9)',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '16px'
              }}>
                <Heart size={12} fill="white" />
              </div>
              Liked Songs
            </button>
          </li>
        </ul>
      </div>

      {/* Separator */}
      <div style={{
        borderTop: '1px solid var(--spotify-border)',
        marginBottom: '16px'
      }}></div>

      {/* Playlists */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: '16px'
      }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {playlists.filter(p => p.type === 'playlist').map((playlist) => (
            <li key={playlist.id} style={{ marginBottom: '4px' }}>
              <button
                onClick={() => navigateTo('playlist', playlist)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-body)',
                  color: 'var(--spotify-text-gray)',
                  transition: 'color var(--transition-fast)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--spotify-white)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--spotify-text-gray)'}
              >
                {playlist.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Theme Toggle & Install App */}
      <div style={{
        borderTop: '1px solid var(--spotify-border)',
        paddingTop: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'var(--font-size-body)',
            fontWeight: '600',
            color: 'var(--spotify-text-gray)',
            transition: 'color var(--transition-fast)',
            padding: '8px 0'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--spotify-white)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--spotify-text-gray)'}
        >
          {isDark ? (
            <>
              <Sun size={20} style={{ marginRight: '12px' }} />
              Light Theme
            </>
          ) : (
            <>
              <Moon size={20} style={{ marginRight: '12px' }} />
              Dark Theme
            </>
          )}
        </button>

        {/* Settings */}
        <button
          onClick={openSettingsModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'var(--font-size-body)',
            fontWeight: '600',
            color: 'var(--spotify-text-gray)',
            transition: 'all 200ms ease',
            padding: '8px 0',
            borderRadius: '4px',
            marginBottom: '8px'
          }}
          className="spotify-button-press"
          onMouseEnter={(e) => {
            e.target.style.color = 'var(--spotify-white)';
            e.target.style.backgroundColor = 'var(--spotify-light-gray)';
            e.target.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'var(--spotify-text-gray)';
            e.target.style.backgroundColor = 'transparent';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <Settings size={20} style={{ marginRight: '12px' }} />
          Settings
        </button>

        {/* Install App */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 'var(--font-size-body)',
          fontWeight: '600',
          color: 'var(--spotify-text-gray)',
          transition: 'color var(--transition-fast)',
          padding: '8px 0'
        }}
          onMouseEnter={(e) => e.target.style.color = 'var(--spotify-white)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--spotify-text-gray)'}
        >
          <Download size={20} style={{ marginRight: '12px' }} />
          Install App
        </button>
      </div>
    </div>
  );
}

export default SpotifySidebarEnhanced;
