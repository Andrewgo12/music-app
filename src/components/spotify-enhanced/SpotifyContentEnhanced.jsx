import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  User,
  Search
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { useTheme } from '../../context/ThemeContext';
import SpotifyCardRedesigned from '../spotify-redesigned/SpotifyCardRedesigned';
import ArtistProfile from './ArtistProfile';
import SearchComponent from './SearchComponent';
import AlbumView from './AlbumView';
import SongDetailView from './SongDetailView';
import QueueView from './QueueView';
import LibraryView from './LibraryView';

function SpotifyContentEnhanced({
  recentlyPlayed,
  madeForYou,
  playlists,
  onSongSelect,
  currentSong,
  likedSongs,
  onToggleLike,
  onTogglePlayPause,
  onNext,
  onPrevious,
  queue = [],
  queueHistory = [],
  onRemoveFromQueue,
  onReorderQueue,
  progress = 0
}) {
  const {
    currentView,
    selectedArtist,
    selectedAlbum,
    selectedSong,
    navigateTo,
    goBack,
    canGoBack
  } = useNavigation();
  const { toggleTheme } = useTheme();

  const headerStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: 'linear-gradient(rgba(18,18,18,0.8), rgba(18,18,18,0.9))',
    backdropFilter: 'blur(10px)',
    padding: '16px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--spotify-border)'
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
        className="spotify-fade-in"
        style={{
          backgroundColor: 'var(--spotify-light-gray)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
          height: '80px',
          boxShadow: 'var(--spotify-shadow)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--spotify-card-gray)';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--spotify-light-gray)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        onClick={() => {
          if (item.type === 'liked') {
            navigateTo('liked');
          } else {
            navigateTo('playlist', item);
          }
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
    <div style={contentStyle} className="spotify-fade-in">
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
          {recentlyPlayed.map((song, index) => (
            <div
              key={song.id}
              className="spotify-stagger-item"
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <SpotifyCardRedesigned
                title={song.title}
                subtitle={song.artist}
                type="album"
                isPlaying={currentSong.id === song.id && currentSong.isPlaying}
                onPlay={() => onSongSelect(song, recentlyPlayed)}
                onClick={() => {
                  // Navigate to artist when clicking on card
                  navigateTo('artist', { name: song.artist, id: song.id });
                }}
              />
            </div>
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
          {madeForYou.map((item, index) => (
            <div
              key={item.id}
              className="spotify-stagger-item"
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <SpotifyCardRedesigned
                title={item.title}
                subtitle={item.subtitle}
                type="playlist"
                onPlay={() => console.log('Playing:', item.title)}
                onClick={() => navigateTo('playlist', item)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSearchView = () => (
    <SearchComponent
      onSongSelect={onSongSelect}
      currentSong={currentSong}
    />
  );

  const renderLibraryView = () => (
    <LibraryView
      playlists={playlists}
      likedSongs={likedSongs}
      recentlyPlayed={recentlyPlayed}
      onSongSelect={onSongSelect}
      currentSong={currentSong}
      onToggleLike={onToggleLike}
    />
  );

  return (
    <div className="spotify-content">
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={goBack}
            disabled={!canGoBack}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: canGoBack ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.3)',
              border: 'none',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: canGoBack ? 'pointer' : 'not-allowed',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              if (canGoBack) e.target.style.backgroundColor = 'rgba(0,0,0,0.9)';
            }}
            onMouseLeave={(e) => {
              if (canGoBack) e.target.style.backgroundColor = 'rgba(0,0,0,0.7)';
            }}
          >
            <ChevronLeft size={18} color={canGoBack ? "white" : "#666"} />
          </button>
          <button style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            border: 'none',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'not-allowed'
          }}>
            <ChevronRight size={18} color="#666" />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigateTo('profile')}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              border: 'none',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.9)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.7)'}
          >
            <User size={18} color="white" />
          </button>
        </div>
      </div>

      {/* Content */}
      {currentView === 'home' && renderHomeView()}
      {currentView === 'search' && renderSearchView()}
      {currentView === 'library' && renderLibraryView()}
      {currentView === 'artist' && selectedArtist && (
        <ArtistProfile
          artist={selectedArtist}
          currentSong={currentSong}
          onSongSelect={onSongSelect}
        />
      )}
      {currentView === 'album' && selectedAlbum && (
        <AlbumView
          album={selectedAlbum}
          currentSong={currentSong}
          onSongSelect={onSongSelect}
          onToggleLike={onToggleLike}
          likedSongs={likedSongs}
        />
      )}
      {currentView === 'song' && selectedSong && (
        <SongDetailView
          song={selectedSong}
          currentSong={currentSong}
          onTogglePlayPause={onTogglePlayPause}
          onToggleLike={onToggleLike}
          onNext={onNext}
          onPrevious={onPrevious}
          progress={progress}
          isLiked={likedSongs?.has(selectedSong.id)}
        />
      )}
      {currentView === 'queue' && (
        <QueueView
          queue={queue}
          currentSong={currentSong}
          onSongSelect={onSongSelect}
          onRemoveFromQueue={onRemoveFromQueue}
          onReorderQueue={onReorderQueue}
          onToggleLike={onToggleLike}
          likedSongs={likedSongs}
          queueHistory={queueHistory}
        />
      )}
    </div>
  );
}

export default SpotifyContentEnhanced;
