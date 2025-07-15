import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  Share, 
  MoreHorizontal, 
  Volume2,
  Shuffle,
  Repeat,
  SkipBack,
  SkipForward,
  Mic,
  Music,
  Clock,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

function SongDetailView({ 
  song, 
  currentSong, 
  onTogglePlayPause, 
  onToggleLike, 
  onNext, 
  onPrevious,
  progress = 45,
  isLiked = false 
}) {
  const { navigateTo } = useNavigation();
  const [showLyrics, setShowLyrics] = useState(true);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const waveformRef = useRef(null);

  // Mock song metadata
  const songMetadata = {
    bpm: 171,
    key: 'F# Minor',
    loudness: -5.934,
    energy: 0.73,
    danceability: 0.514,
    valence: 0.334,
    acousticness: 0.001,
    instrumentalness: 0.000234,
    liveness: 0.0897,
    speechiness: 0.0598,
    duration: 200, // seconds
    releaseDate: '2019-11-29',
    recordLabel: 'XO/Republic Records',
    producers: ['Ahmad Balshe', 'Jason Quenneville', 'The Weeknd'],
    writers: ['The Weeknd', 'Ahmad Balshe', 'Jason Quenneville'],
    studio: 'Conway Recording Studios'
  };

  // Mock lyrics with timestamps
  const lyrics = [
    { time: 0, text: "Yeah, I feel like I'm just missin' somethin' whenever you're gone" },
    { time: 8, text: "I am not tryna waste your time, I just need you to stay" },
    { time: 16, text: "I can't sleep until you're next to me" },
    { time: 24, text: "No, I can't sleep until you're next to me" },
    { time: 32, text: "" },
    { time: 40, text: "I've been drinkin' more alcohol for the past five days" },
    { time: 48, text: "Did you check on me? Now did you look for me?" },
    { time: 56, text: "I walked in the corner with the body screamin' dolo" },
    { time: 64, text: "Never sold a bag but look like Pablo in a photo" },
    { time: 72, text: "" },
    { time: 80, text: "This gon' sound like a broken record playin' over" },
    { time: 88, text: "But you walked away, oh you just walked away" },
    { time: 96, text: "Why'd you walk away? (Why'd you walk away?)" },
    { time: 104, text: "Oh you just walked away, why'd you walk away?" }
  ];

  // Mock recommendations
  const recommendations = [
    { id: '2', title: 'The Hills', artist: 'The Weeknd', duration: '4:02' },
    { id: '3', title: 'Can\'t Feel My Face', artist: 'The Weeknd', duration: '3:35' },
    { id: '4', title: 'Starboy', artist: 'The Weeknd', duration: '3:50' },
    { id: '5', title: 'Earned It', artist: 'The Weeknd', duration: '4:37' }
  ];

  // Update current lyric based on progress
  useEffect(() => {
    const currentTime = (progress / 100) * songMetadata.duration;
    const currentIndex = lyrics.findIndex((lyric, index) => {
      const nextLyric = lyrics[index + 1];
      return currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
    });
    setCurrentLyricIndex(Math.max(0, currentIndex));
  }, [progress]);

  // Generate waveform visualization
  const generateWaveform = () => {
    return Array.from({ length: 100 }, (_, i) => ({
      height: Math.random() * 40 + 4,
      delay: i * 0.05
    }));
  };

  const waveformData = generateWaveform();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="spotify-fade-in" style={{
      padding: '32px',
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 400px',
      gap: '48px',
      minHeight: 'calc(100vh - 200px)'
    }}>
      {/* Left Column - Main Content */}
      <div>
        {/* Large Vinyl Record */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '48px'
        }}>
          <div style={{
            width: '400px',
            height: '400px',
            position: 'relative'
          }}>
            {/* Vinyl Record */}
            <div 
              className={currentSong.isPlaying ? 'spotify-vinyl-spin' : ''}
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
                  0 0 0 12px #0a0a0a,
                  0 8px 80px rgba(0, 0, 0, 0.8),
                  inset 0 0 0 2px rgba(255, 255, 255, 0.1)
                `,
                position: 'relative'
              }}
            >
              {/* Album Cover */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.3)'
              }}>
                <span style={{ 
                  color: 'white', 
                  fontSize: '80px', 
                  fontWeight: 'bold',
                  textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'
                }}>♪</span>
              </div>

              {/* Center Hole */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#0a0a0a',
                boxShadow: 'inset 0 0 12px rgba(0, 0, 0, 0.8)'
              }} />

              {/* Vinyl Grooves */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: `${280 + i * 15}px`,
                    height: `${280 + i * 15}px`,
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.02)',
                    pointerEvents: 'none'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Song Info */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '900',
            color: 'var(--spotify-white)',
            margin: '0 0 16px 0',
            lineHeight: '1.1'
          }}>
            {song.title}
          </h1>
          
          <button
            onClick={() => navigateTo('artist', { name: song.artist })}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              fontWeight: '600',
              color: 'var(--spotify-text-gray)',
              cursor: 'pointer',
              transition: 'color 200ms ease',
              marginBottom: '8px'
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
            {song.artist}
          </button>
          
          <div style={{
            fontSize: '16px',
            color: 'var(--spotify-text-subdued)'
          }}>
            {song.album} • {songMetadata.releaseDate}
          </div>
        </div>

        {/* Player Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          marginBottom: '48px'
        }}>
          <button
            onClick={onPrevious}
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
            <SkipBack size={32} />
          </button>

          <button
            onClick={onTogglePlayPause}
            style={{
              width: '80px',
              height: '80px',
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
              e.target.style.transform = 'scale(1.05)';
              e.target.style.backgroundColor = '#1ed760';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.backgroundColor = 'var(--spotify-green)';
            }}
          >
            {currentSong.isPlaying ? (
              <Pause size={32} color="black" />
            ) : (
              <Play size={32} color="black" style={{ marginLeft: '4px' }} />
            )}
          </button>

          <button
            onClick={onNext}
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
            <SkipForward size={32} />
          </button>
        </div>

        {/* Waveform Visualization */}
        <div style={{
          marginBottom: '48px',
          padding: '24px',
          backgroundColor: 'var(--spotify-card-gray)',
          borderRadius: '12px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--spotify-white)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Volume2 size={20} />
            Audio Waveform
          </h3>
          
          <div 
            ref={waveformRef}
            style={{
              display: 'flex',
              alignItems: 'end',
              gap: '2px',
              height: '60px',
              cursor: 'pointer'
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newProgress = (clickX / rect.width) * 100;
              // onProgressChange(newProgress);
            }}
          >
            {waveformData.map((bar, index) => (
              <div
                key={index}
                className={currentSong.isPlaying ? 'spotify-waveform-bar' : ''}
                style={{
                  width: '4px',
                  height: `${bar.height}px`,
                  backgroundColor: index < (progress * waveformData.length / 100) 
                    ? 'var(--spotify-green)' 
                    : 'var(--spotify-light-gray)',
                  borderRadius: '2px',
                  transition: 'all 200ms ease',
                  animationDelay: `${bar.delay}s`
                }}
              />
            ))}
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '8px',
            fontSize: '12px',
            color: 'var(--spotify-text-gray)'
          }}>
            <span>{formatTime(Math.floor((progress / 100) * songMetadata.duration))}</span>
            <span>{formatTime(songMetadata.duration)}</span>
          </div>
        </div>

        {/* Lyrics Section */}
        <div style={{
          backgroundColor: 'var(--spotify-card-gray)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--spotify-white)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Mic size={20} />
              Lyrics
            </h3>
            
            <button
              onClick={() => setShowLyrics(!showLyrics)}
              style={{
                background: 'none',
                border: '1px solid var(--spotify-border)',
                borderRadius: '20px',
                padding: '6px 12px',
                fontSize: '12px',
                color: 'var(--spotify-white)',
                cursor: 'pointer',
                transition: 'all 200ms ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--spotify-light-gray)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              {showLyrics ? 'Hide' : 'Show'} Lyrics
            </button>
          </div>

          {showLyrics && (
            <div style={{
              maxHeight: '300px',
              overflowY: 'auto',
              lineHeight: '2'
            }}>
              {lyrics.map((lyric, index) => (
                <div
                  key={index}
                  style={{
                    fontSize: '18px',
                    color: index === currentLyricIndex 
                      ? 'var(--spotify-green)' 
                      : lyric.text === '' 
                        ? 'transparent' 
                        : 'var(--spotify-text-gray)',
                    fontWeight: index === currentLyricIndex ? '600' : '400',
                    marginBottom: '12px',
                    transition: 'all 300ms ease',
                    transform: index === currentLyricIndex ? 'scale(1.05)' : 'scale(1)',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    // Seek to lyric time
                    const newProgress = (lyric.time / songMetadata.duration) * 100;
                    // onProgressChange(newProgress);
                  }}
                >
                  {lyric.text || '\u00A0'}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Metadata & Recommendations */}
      <div>
        {/* Song Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px'
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
              color: isLiked ? 'var(--spotify-green)' : 'var(--spotify-text-gray)'
            }}
            onMouseEnter={(e) => {
              if (!isLiked) e.target.style.color = 'var(--spotify-white)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              if (!isLiked) e.target.style.color = 'var(--spotify-text-gray)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
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

        {/* Song Metadata */}
        <div style={{
          backgroundColor: 'var(--spotify-card-gray)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--spotify-white)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Music size={18} />
            Song Info
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'BPM', value: songMetadata.bpm, icon: <TrendingUp size={14} /> },
              { label: 'Key', value: songMetadata.key, icon: <Music size={14} /> },
              { label: 'Energy', value: `${Math.round(songMetadata.energy * 100)}%`, icon: <Zap size={14} /> },
              { label: 'Duration', value: formatTime(songMetadata.duration), icon: <Clock size={14} /> }
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: 'var(--spotify-text-gray)'
                }}>
                  {item.icon}
                  {item.label}
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'var(--spotify-white)'
                }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Credits */}
        <div style={{
          backgroundColor: 'var(--spotify-card-gray)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--spotify-white)',
            marginBottom: '16px'
          }}>
            Credits
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{
                fontSize: '12px',
                color: 'var(--spotify-text-gray)',
                marginBottom: '4px'
              }}>
                Producers
              </div>
              <div style={{
                fontSize: '14px',
                color: 'var(--spotify-white)'
              }}>
                {songMetadata.producers.join(', ')}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '12px',
                color: 'var(--spotify-text-gray)',
                marginBottom: '4px'
              }}>
                Writers
              </div>
              <div style={{
                fontSize: '14px',
                color: 'var(--spotify-white)'
              }}>
                {songMetadata.writers.join(', ')}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '12px',
                color: 'var(--spotify-text-gray)',
                marginBottom: '4px'
              }}>
                Label
              </div>
              <div style={{
                fontSize: '14px',
                color: 'var(--spotify-white)'
              }}>
                {songMetadata.recordLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div style={{
          backgroundColor: 'var(--spotify-card-gray)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--spotify-white)',
            marginBottom: '16px'
          }}>
            Recommended
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recommendations.map((rec, index) => (
              <div
                key={rec.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
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
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '4px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <span style={{ color: 'white', fontSize: '16px' }}>♪</span>
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '14px',
                    color: 'var(--spotify-white)',
                    fontWeight: '400',
                    marginBottom: '2px'
                  }}>
                    {rec.title}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--spotify-text-gray)'
                  }}>
                    {rec.artist}
                  </div>
                </div>
                
                <div style={{
                  fontSize: '12px',
                  color: 'var(--spotify-text-gray)'
                }}>
                  {rec.duration}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SongDetailView;
