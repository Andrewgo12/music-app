import React from 'react';
import { 
  Home, 
  Search, 
  Library, 
  Plus, 
  Heart,
  Download
} from 'lucide-react';

function SpotifySidebarRedesigned({ currentView, onViewChange, playlists }) {
  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Your Library', icon: Library }
  ];

  return (
    <div className="spotify-sidebar">
      {/* Spotify Logo */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'var(--spotify-green)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px'
          }}>
            <span style={{ 
              color: 'black', 
              fontWeight: 'bold', 
              fontSize: '18px' 
            }}>♪</span>
          </div>
          <span className="spotify-text-large" style={{ fontWeight: 'bold' }}>
            Spotify
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav style={{ marginBottom: '32px' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id} style={{ marginBottom: '8px' }}>
                <button
                  onClick={() => onViewChange(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-body)',
                    fontWeight: isActive ? '600' : '400',
                    color: isActive ? 'var(--spotify-white)' : 'var(--spotify-text-gray)',
                    transition: 'color var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.target.style.color = 'var(--spotify-white)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.target.style.color = 'var(--spotify-text-gray)';
                  }}
                >
                  <Icon size={24} style={{ marginRight: '16px' }} />
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
            <button style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '8px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'var(--font-size-body)',
              color: 'var(--spotify-text-gray)',
              transition: 'color var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--spotify-white)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--spotify-text-gray)'}
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
            <button style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '8px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'var(--font-size-body)',
              color: 'var(--spotify-text-gray)',
              transition: 'color var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--spotify-white)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--spotify-text-gray)'}
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
        borderTop: '1px solid var(--spotify-gray)', 
        marginBottom: '16px' 
      }}></div>

      {/* Playlists */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        marginBottom: '16px'
      }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {playlists.map((playlist) => (
            <li key={playlist.id} style={{ marginBottom: '4px' }}>
              <button style={{
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

      {/* Install App */}
      <div style={{ 
        borderTop: '1px solid var(--spotify-gray)', 
        paddingTop: '16px' 
      }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 'var(--font-size-body)',
          fontWeight: '600',
          color: 'var(--spotify-text-gray)',
          transition: 'color var(--transition-fast)'
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

export default SpotifySidebarRedesigned;
