import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Heart, MoreHorizontal, Share } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import useModal from '../../hooks/useModal';

function SongModal({ currentSong, onToggleLike, onSongSelect }) {
  const { showSongModal, closeSongModal, navigateTo } = useNavigation();
  const [isClosing, setIsClosing] = useState(false);

  // Use modal hook for ESC key and background click handling
  const { handleBackgroundClick } = useModal(showSongModal, closeSongModal);

  if (!showSongModal || !currentSong) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeSongModal();
      setIsClosing(false);
    }, 200);
  };

  const mockLyrics = [
    "Yeah, I feel like I'm just missin' somethin' whenever you're gone",
    "I am not tryna waste your time, I just need you to stay",
    "I can't sleep until you're next to me",
    "No, I can't sleep until you're next to me",
    "",
    "I've been drinkin' more alcohol for the past five days",
    "Did you check on me? Now did you look for me?",
    "I walked in the corner with the body screamin' dolo",
    "Never sold a bag but look like Pablo in a photo",
    "",
    "This gon' sound like a broken record playin' over",
    "But you walked away, oh you just walked away",
    "Why'd you walk away? (Why'd you walk away?)",
    "Oh you just walked away, why'd you walk away?"
  ];

  const relatedSongs = [
    { id: '2', title: 'The Hills', artist: 'The Weeknd', duration: '4:02' },
    { id: '3', title: 'Can\'t Feel My Face', artist: 'The Weeknd', duration: '3:35' },
    { id: '4', title: 'Starboy', artist: 'The Weeknd', duration: '3:50' },
    { id: '5', title: 'Earned It', artist: 'The Weeknd', duration: '4:37' }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--spotify-overlay)',
        zIndex: 1001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={handleBackgroundClick}
      data-modal="true"
      tabIndex={-1}
    >
      <div style={{
        backgroundColor: 'var(--spotify-dark-gray)',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: 'var(--spotify-shadow-heavy)',
        display: 'flex',
        flexDirection: 'column'
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
            Now Playing
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
        <div style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden'
        }}>
          {/* Left Side - Album Art and Info */}
          <div style={{
            width: '40%',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* Large Album Art with Rotation */}
            <div style={{
              width: '280px',
              height: '280px',
              marginBottom: '24px',
              position: 'relative'
            }}>
              <div
                className={currentSong.isPlaying ? 'spotify-rotate' : ''}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--spotify-shadow-heavy)',
                  position: 'relative'
                }}
              >
                <span style={{
                  color: 'white',
                  fontSize: '80px',
                  fontWeight: 'bold'
                }}>♪</span>
                {/* CD hole effect */}
                <div style={{
                  position: 'absolute',
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--spotify-dark-gray)',
                  borderRadius: '50%',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }} />
              </div>
            </div>

            {/* Song Info */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: 'var(--spotify-white)',
                margin: '0 0 8px 0'
              }}>
                {currentSong.title}
              </h1>
              <button
                onClick={() => navigateTo('artist', { name: currentSong.artist, id: currentSong.id })}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  color: 'var(--spotify-text-gray)',
                  cursor: 'pointer',
                  transition: 'color 200ms ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--spotify-white)';
                  e.target.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--spotify-text-gray)';
                  e.target.style.textDecoration = 'none';
                }}
              >
                {currentSong.artist}
              </button>
              <div style={{
                fontSize: '14px',
                color: 'var(--spotify-text-subdued)',
                marginTop: '4px'
              }}>
                {currentSong.album} • {currentSong.duration}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <button
                onClick={onToggleLike}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '12px',
                  borderRadius: '50%',
                  transition: 'all 200ms ease',
                  color: currentSong.isLiked ? 'var(--spotify-green)' : 'var(--spotify-text-gray)'
                }}
                onMouseEnter={(e) => {
                  if (!currentSong.isLiked) e.target.style.color = 'var(--spotify-white)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  if (!currentSong.isLiked) e.target.style.color = 'var(--spotify-text-gray)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <Heart size={24} fill={currentSong.isLiked ? 'currentColor' : 'none'} />
              </button>

              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '12px',
                  borderRadius: '50%',
                  transition: 'all 200ms ease',
                  color: 'var(--spotify-text-gray)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--spotify-white)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--spotify-text-gray)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <Share size={24} />
              </button>

              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '12px',
                  borderRadius: '50%',
                  transition: 'all 200ms ease',
                  color: 'var(--spotify-text-gray)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--spotify-white)';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--spotify-text-gray)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <MoreHorizontal size={24} />
              </button>
            </div>
          </div>

          {/* Right Side - Lyrics and Related */}
          <div style={{
            flex: 1,
            padding: '32px',
            overflowY: 'auto',
            borderLeft: '1px solid var(--spotify-border)'
          }}>
            {/* Lyrics Section */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: 'var(--spotify-white)',
                marginBottom: '16px'
              }}>
                Lyrics
              </h3>
              <div style={{ lineHeight: '1.8' }}>
                {mockLyrics.map((line, index) => (
                  <div
                    key={index}
                    style={{
                      fontSize: '16px',
                      color: line === '' ? 'transparent' : 'var(--spotify-text-gray)',
                      marginBottom: '8px',
                      cursor: 'pointer',
                      transition: 'color 200ms ease'
                    }}
                    onMouseEnter={(e) => {
                      if (line !== '') e.target.style.color = 'var(--spotify-white)';
                    }}
                    onMouseLeave={(e) => {
                      if (line !== '') e.target.style.color = 'var(--spotify-text-gray)';
                    }}
                  >
                    {line || '\u00A0'}
                  </div>
                ))}
              </div>
            </div>

            {/* Related Songs */}
            <div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: 'var(--spotify-white)',
                marginBottom: '16px'
              }}>
                More from {currentSong.artist}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {relatedSongs.map((song, index) => (
                  <div
                    key={song.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'background-color 200ms ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--spotify-light-gray)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onClick={() => onSongSelect(song)}
                  >
                    <span style={{
                      width: '20px',
                      fontSize: '14px',
                      color: 'var(--spotify-text-gray)',
                      marginRight: '12px'
                    }}>
                      {index + 1}
                    </span>

                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '14px',
                        color: 'var(--spotify-white)',
                        fontWeight: '400',
                        marginBottom: '2px'
                      }}>
                        {song.title}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--spotify-text-gray)'
                      }}>
                        {song.artist}
                      </div>
                    </div>

                    <div style={{
                      fontSize: '12px',
                      color: 'var(--spotify-text-gray)',
                      marginLeft: '12px'
                    }}>
                      {song.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SongModal;
