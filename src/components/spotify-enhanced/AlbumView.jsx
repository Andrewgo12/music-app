import React, { useState } from 'react';
import { Play, Pause, Heart, MoreHorizontal, Clock, Download } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import ContextMenu from './ContextMenu';

function AlbumView({ album, currentSong, onSongSelect, onToggleLike, likedSongs }) {
  const { navigateTo, openAddToPlaylistModal } = useNavigation();
  const [contextMenu, setContextMenu] = useState({ visible: false, position: { x: 0, y: 0 }, song: null });

  // Mock album data
  const albumData = {
    id: album?.id || '1',
    title: album?.title || 'After Hours',
    artist: album?.artist || 'The Weeknd',
    year: album?.year || '2020',
    duration: '56 min 16 sec',
    trackCount: 14,
    description: 'The fourth studio album by Canadian singer The Weeknd.',
    tracks: [
      { id: '1', title: 'Alone Again', duration: '4:10', trackNumber: 1 },
      { id: '2', title: 'Too Late', duration: '3:59', trackNumber: 2 },
      { id: '3', title: 'Hardest to Love', duration: '3:31', trackNumber: 3 },
      { id: '4', title: 'Scared to Live', duration: '3:10', trackNumber: 4 },
      { id: '5', title: 'Snowchild', duration: '4:07', trackNumber: 5 },
      { id: '6', title: 'Escape from LA', duration: '5:55', trackNumber: 6 },
      { id: '7', title: 'Heartless', duration: '3:18', trackNumber: 7 },
      { id: '8', title: 'Faith', duration: '4:43', trackNumber: 8 },
      { id: '9', title: 'Blinding Lights', duration: '3:20', trackNumber: 9 },
      { id: '10', title: 'In Your Eyes', duration: '3:57', trackNumber: 10 },
      { id: '11', title: 'Save Your Tears', duration: '3:35', trackNumber: 11 },
      { id: '12', title: 'Repeat After Me', duration: '3:15', trackNumber: 12 },
      { id: '13', title: 'After Hours', duration: '6:01', trackNumber: 13 },
      { id: '14', title: 'Until I Bleed Out', duration: '8:03', trackNumber: 14 }
    ]
  };

  const handleContextMenu = (e, song) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      position: { x: e.clientX, y: e.clientY },
      song: { ...song, artist: albumData.artist, album: albumData.title }
    });
  };

  const handlePlayAll = () => {
    const firstTrack = albumData.tracks[0];
    if (firstTrack) {
      onSongSelect({
        ...firstTrack,
        artist: albumData.artist,
        album: albumData.title
      });
    }
  };

  const formatDuration = (duration) => {
    return duration;
  };

  return (
    <div className="spotify-fade-in" style={{ padding: '0 32px 32px 32px' }}>
      {/* Album Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '24px',
        marginBottom: '32px',
        padding: '32px 0'
      }}>
        {/* Animated Vinyl Record */}
        <div style={{
          width: '232px',
          height: '232px',
          position: 'relative',
          flexShrink: 0,
          cursor: 'pointer'
        }}
          onClick={() => {
            // Toggle zoom functionality
            const element = document.querySelector('.album-cover-zoom');
            if (element) {
              element.classList.toggle('zoomed');
            }
          }}
        >
          {/* Vinyl Record */}
          <div
            className={`album-cover-zoom ${currentSong.isPlaying ? 'spotify-vinyl-spin' : ''}`}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `
                radial-gradient(circle at center,
                  #1a1a1a 0%,
                  #1a1a1a 15%,
                  #2a2a2a 15%,
                  #2a2a2a 16%,
                  #1a1a1a 16%,
                  #1a1a1a 30%,
                  #2a2a2a 30%,
                  #2a2a2a 31%,
                  #1a1a1a 31%,
                  #1a1a1a 45%,
                  #2a2a2a 45%,
                  #2a2a2a 46%,
                  #1a1a1a 46%,
                  #1a1a1a 100%
                )
              `,
              boxShadow: `
                0 0 0 8px #0a0a0a,
                0 4px 60px rgba(0, 0, 0, 0.8),
                inset 0 0 0 1px rgba(255, 255, 255, 0.1)
              `,
              position: 'relative',
              transition: 'all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            {/* Album Cover in Center */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden'
            }}>
              <span style={{
                color: 'white',
                fontSize: '48px',
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
              }}>♪</span>
            </div>

            {/* Center Hole */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#0a0a0a',
              boxShadow: 'inset 0 0 8px rgba(0, 0, 0, 0.8)'
            }} />

            {/* Vinyl Grooves */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: `${180 + i * 12}px`,
                  height: `${180 + i * 12}px`,
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.03)',
                  pointerEvents: 'none'
                }}
              />
            ))}

            {/* Reflection Effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              background: `
                linear-gradient(
                  135deg,
                  rgba(255, 255, 255, 0.1) 0%,
                  transparent 30%,
                  transparent 70%,
                  rgba(255, 255, 255, 0.05) 100%
                )
              `,
              pointerEvents: 'none'
            }} />
          </div>

          {/* Tonearm */}
          <div
            className={currentSong.isPlaying ? 'tonearm-playing' : 'tonearm-idle'}
            style={{
              position: 'absolute',
              top: '20px',
              right: '-40px',
              width: '120px',
              height: '4px',
              backgroundColor: '#666',
              borderRadius: '2px',
              transformOrigin: 'right center',
              transform: currentSong.isPlaying ? 'rotate(-25deg)' : 'rotate(-45deg)',
              transition: 'transform 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Tonearm Head */}
            <div style={{
              position: 'absolute',
              left: '-8px',
              top: '-6px',
              width: '16px',
              height: '16px',
              backgroundColor: '#888',
              borderRadius: '50%',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }} />
          </div>
        </div>

        {/* Album Info */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--spotify-white)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Album
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 8vw, 96px)',
            fontWeight: '900',
            color: 'var(--spotify-white)',
            margin: '0 0 24px 0',
            lineHeight: '1.1'
          }}>
            {albumData.title}
          </h1>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: 'var(--spotify-white)'
          }}>
            <button
              onClick={() => navigateTo('artist', { name: albumData.artist })}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--spotify-white)',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                padding: 0,
                transition: 'color 200ms ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.target.style.textDecoration = 'none';
              }}
            >
              {albumData.artist}
            </button>
            <span>•</span>
            <span>{albumData.year}</span>
            <span>•</span>
            <span>{albumData.trackCount} songs, {albumData.duration}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        marginBottom: '32px'
      }}>
        <button
          onClick={handlePlayAll}
          style={{
            width: '56px',
            height: '56px',
            backgroundColor: 'var(--spotify-green)',
            border: 'none',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 200ms ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.04)';
            e.target.style.backgroundColor = '#1ed760';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.backgroundColor = 'var(--spotify-green)';
          }}
        >
          <Play size={24} color="black" style={{ marginLeft: '2px' }} />
        </button>

        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            transition: 'all 200ms ease',
            color: 'var(--spotify-text-gray)'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = 'var(--spotify-white)';
            e.target.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'var(--spotify-text-gray)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <Heart size={32} />
        </button>

        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            transition: 'all 200ms ease',
            color: 'var(--spotify-text-gray)'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = 'var(--spotify-white)';
            e.target.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'var(--spotify-text-gray)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <Download size={32} />
        </button>

        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            transition: 'all 200ms ease',
            color: 'var(--spotify-text-gray)'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = 'var(--spotify-white)';
            e.target.style.transform = 'scale(1.04)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'var(--spotify-text-gray)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <MoreHorizontal size={32} />
        </button>
      </div>

      {/* Track List */}
      <div>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '16px 1fr auto',
          gap: '16px',
          padding: '0 16px 8px 16px',
          borderBottom: '1px solid var(--spotify-border)',
          marginBottom: '16px'
        }}>
          <div style={{
            fontSize: '14px',
            color: 'var(--spotify-text-gray)',
            fontWeight: '500'
          }}>
            #
          </div>
          <div style={{
            fontSize: '14px',
            color: 'var(--spotify-text-gray)',
            fontWeight: '500'
          }}>
            Title
          </div>
          <Clock size={16} color="var(--spotify-text-gray)" />
        </div>

        {/* Tracks */}
        {albumData.tracks.map((track, index) => {
          const isCurrentTrack = currentSong.id === track.id;
          const isLiked = likedSongs?.has(track.id);

          return (
            <div
              key={track.id}
              className="spotify-stagger-item"
              style={{
                display: 'grid',
                gridTemplateColumns: '16px 1fr auto',
                gap: '16px',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 200ms ease',
                animationDelay: `${index * 50}ms`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--spotify-light-gray)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => onSongSelect({
                ...track,
                artist: albumData.artist,
                album: albumData.title
              })}
              onContextMenu={(e) => handleContextMenu(e, track)}
            >
              <div style={{
                fontSize: '16px',
                color: isCurrentTrack ? 'var(--spotify-green)' : 'var(--spotify-text-gray)',
                fontWeight: '400',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {isCurrentTrack && currentSong.isPlaying ? (
                  <div className="spotify-pulse" style={{ color: 'var(--spotify-green)' }}>♪</div>
                ) : (
                  track.trackNumber
                )}
              </div>

              <div>
                <div style={{
                  fontSize: '16px',
                  color: isCurrentTrack ? 'var(--spotify-green)' : 'var(--spotify-white)',
                  fontWeight: '400',
                  marginBottom: '4px'
                }}>
                  {track.title}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--spotify-text-gray)'
                }}>
                  {albumData.artist}
                </div>
              </div>

              <div style={{
                fontSize: '14px',
                color: 'var(--spotify-text-gray)',
                display: 'flex',
                alignItems: 'center'
              }}>
                {formatDuration(track.duration)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Context Menu */}
      <ContextMenu
        song={contextMenu.song}
        isVisible={contextMenu.visible}
        position={contextMenu.position}
        onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        onToggleLike={() => {
          if (contextMenu.song) {
            onToggleLike(contextMenu.song.id);
          }
        }}
        onPlay={() => {
          if (contextMenu.song) {
            onSongSelect({
              ...contextMenu.song,
              artist: albumData.artist,
              album: albumData.title
            });
          }
        }}
        isPlaying={currentSong.id === contextMenu.song?.id && currentSong.isPlaying}
        isLiked={likedSongs?.has(contextMenu.song?.id)}
      />
    </div>
  );
}

export default AlbumView;
