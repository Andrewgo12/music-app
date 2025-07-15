import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  User,
  Search
} from 'lucide-react';
import SpotifyCardRedesigned from './SpotifyCardRedesigned';

function SpotifyContentRedesigned({ 
  currentView, 
  recentlyPlayed, 
  madeForYou, 
  playlists, 
  onSongSelect, 
  currentSong 
}) {
  
  const headerStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: 'linear-gradient(rgba(18,18,18,0.8), rgba(18,18,18,0.9))',
    backdropFilter: 'blur(10px)',
    padding: '16px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const contentStyle = {
    padding: '0 32px 32px 32px'
  };

  const sectionStyle = {
    marginBottom: '48px'
  };

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 'var(--grid-gap)',
    width: '100%'
  };

  const quickAccessGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '16px',
    marginBottom: '48px'
  };

  const renderQuickAccessCard = (item, index) => {
    const gradients = [
      'linear-gradient(135deg, #450af5, #c4efd9)',
      'linear-gradient(135deg, #1DB954, #191414)',
      'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
      'linear-gradient(135deg, #667eea, #764ba2)',
      'linear-gradient(135deg, #f093fb, #f5576c)',
      'linear-gradient(135deg, #4facfe, #00f2fe)'
    ];

    return (
      <div
        key={index}
        style={{
          backgroundColor: 'var(--spotify-light-gray)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'background-color var(--transition-fast)',
          height: '80px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--spotify-card-gray)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--spotify-light-gray)';
        }}
      >
        <div style={{
          width: '80px',
          height: '80px',
          background: gradients[index % gradients.length],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ color: 'white', fontSize: '24px' }}>♪</span>
        </div>
        <div style={{
          flex: 1,
          padding: '0 16px',
          fontSize: 'var(--font-size-body)',
          fontWeight: '600',
          color: 'var(--spotify-white)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {item.name}
        </div>
      </div>
    );
  };

  const renderHomeView = () => (
    <div style={contentStyle}>
      {/* Good morning section */}
      <div style={sectionStyle}>
        <h1 className="spotify-text-xl" style={{ marginBottom: '24px' }}>
          Good morning
        </h1>
        <div style={quickAccessGridStyle}>
          {playlists.slice(0, 6).map((playlist, index) => 
            renderQuickAccessCard(playlist, index)
          )}
        </div>
      </div>

      {/* Recently played */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 className="spotify-text-large">Recently played</h2>
          <button style={{
            background: 'none',
            border: 'none',
            color: 'var(--spotify-text-gray)',
            fontSize: 'var(--font-size-small)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'color var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--spotify-white)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--spotify-text-gray)'}
          >
            Show all
          </button>
        </div>
        <div style={gridStyle}>
          {recentlyPlayed.map((song) => (
            <SpotifyCardRedesigned
              key={song.id}
              title={song.title}
              subtitle={song.artist}
              type="album"
              isPlaying={currentSong.id === song.id && currentSong.isPlaying}
              onPlay={() => onSongSelect(song)}
              onClick={() => onSongSelect(song)}
            />
          ))}
        </div>
      </div>

      {/* Made for you */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <h2 className="spotify-text-large">Made for you</h2>
          <button style={{
            background: 'none',
            border: 'none',
            color: 'var(--spotify-text-gray)',
            fontSize: 'var(--font-size-small)',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'color var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--spotify-white)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--spotify-text-gray)'}
          >
            Show all
          </button>
        </div>
        <div style={gridStyle}>
          {madeForYou.map((item) => (
            <SpotifyCardRedesigned
              key={item.id}
              title={item.title}
              subtitle={item.subtitle}
              type="playlist"
              onPlay={() => console.log('Playing:', item.title)}
              onClick={() => console.log('Clicked:', item.title)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderSearchView = () => (
    <div style={contentStyle}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          position: 'relative',
          maxWidth: '364px'
        }}>
          <Search 
            size={16} 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'black'
            }}
          />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            style={{
              width: '100%',
              height: '48px',
              paddingLeft: '40px',
              paddingRight: '12px',
              borderRadius: '24px',
              border: 'none',
              fontSize: 'var(--font-size-body)',
              backgroundColor: 'white',
              color: 'black'
            }}
          />
        </div>
      </div>

      <h2 className="spotify-text-large" style={{ marginBottom: '24px' }}>
        Browse all
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '24px'
      }}>
        {[
          { name: 'Pop', color: '#ff6b6b' },
          { name: 'Hip-Hop', color: '#4ecdc4' },
          { name: 'Rock', color: '#45b7d1' },
          { name: 'Latin', color: '#96ceb4' },
          { name: 'Indie', color: '#feca57' },
          { name: 'Electronic', color: '#ff9ff3' },
          { name: 'Country', color: '#54a0ff' },
          { name: 'R&B', color: '#5f27cd' }
        ].map((genre, index) => (
          <div
            key={index}
            style={{
              backgroundColor: genre.color,
              borderRadius: 'var(--card-radius)',
              padding: '20px',
              cursor: 'pointer',
              transition: 'transform var(--transition-fast)',
              position: 'relative',
              overflow: 'hidden',
              height: '180px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <h3 style={{
              fontSize: 'var(--font-size-large)',
              fontWeight: 'bold',
              color: 'white',
              margin: 0
            }}>
              {genre.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLibraryView = () => (
    <div style={contentStyle}>
      <h1 className="spotify-text-xl" style={{ marginBottom: '32px' }}>
        Your Library
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--spotify-light-gray)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--spotify-gray)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <span style={{ color: 'white', fontSize: '16px' }}>♪</span>
            </div>
            <div style={{ flex: 1 }}>
              <div className="spotify-text-body" style={{ fontWeight: '600' }}>
                {playlist.name}
              </div>
              <div className="spotify-text-small">
                {playlist.songCount} songs
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="spotify-content">
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            border: 'none',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <ChevronLeft size={18} color="white" />
          </button>
          <button style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            border: 'none',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <ChevronRight size={18} color="white" />
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '24px',
            fontSize: 'var(--font-size-small)',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Upgrade
          </button>
          <button style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            border: 'none',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}>
            <User size={18} color="white" />
          </button>
        </div>
      </div>

      {/* Content */}
      {currentView === 'home' && renderHomeView()}
      {currentView === 'search' && renderSearchView()}
      {currentView === 'library' && renderLibraryView()}
    </div>
  );
}

export default SpotifyContentRedesigned;
