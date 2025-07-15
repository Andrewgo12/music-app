import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  X, 
  GripVertical, 
  Clock, 
  Heart,
  MoreHorizontal,
  Shuffle,
  Repeat,
  SkipForward,
  List,
  History
} from 'lucide-react';

function QueueView({ 
  queue, 
  currentSong, 
  onSongSelect, 
  onRemoveFromQueue, 
  onReorderQueue,
  onToggleLike,
  likedSongs,
  queueHistory = []
}) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem !== null && draggedItem !== dropIndex) {
      onReorderQueue(draggedItem, dropIndex);
    }
    setDraggedItem(null);
  };

  const formatDuration = (duration) => {
    return duration || '3:20';
  };

  const getTotalDuration = () => {
    // Mock calculation - in real app would sum actual durations
    const totalMinutes = queue.length * 3.5; // Average 3.5 minutes per song
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div style={{
      backgroundColor: 'var(--spotify-black)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '24px 32px',
        borderBottom: '1px solid var(--spotify-border)',
        backgroundColor: 'var(--spotify-dark-gray)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '900',
            color: 'var(--spotify-white)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <List size={32} />
            Queue
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setShowHistory(!showHistory)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: showHistory ? 'var(--spotify-green)' : 'transparent',
                border: '1px solid var(--spotify-border)',
                borderRadius: '20px',
                color: showHistory ? 'black' : 'var(--spotify-white)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 200ms ease'
              }}
              onMouseEnter={(e) => {
                if (!showHistory) {
                  e.target.style.backgroundColor = 'var(--spotify-light-gray)';
                }
              }}
              onMouseLeave={(e) => {
                if (!showHistory) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <History size={16} />
              History
            </button>

            <button
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid var(--spotify-border)',
                borderRadius: '20px',
                color: 'var(--spotify-white)',
                fontSize: '14px',
                fontWeight: '600',
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
              Clear queue
            </button>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          fontSize: '14px',
          color: 'var(--spotify-text-gray)'
        }}>
          <span>{queue.length} songs</span>
          <span>•</span>
          <span>{getTotalDuration()}</span>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 32px'
      }}>
        {showHistory ? (
          /* History View */
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--spotify-white)',
              marginBottom: '16px'
            }}>
              Recently Played
            </h2>
            
            {queueHistory.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {queueHistory.map((song, index) => (
                  <div
                    key={`history-${song.id}-${index}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '40px 1fr auto auto',
                      gap: '16px',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'background-color 200ms ease',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--spotify-light-gray)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onClick={() => onSongSelect(song)}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '4px',
                      background: 'linear-gradient(135deg, #666 0%, #333 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ color: 'white', fontSize: '12px' }}>♪</span>
                    </div>

                    <div>
                      <div style={{
                        fontSize: '16px',
                        color: 'var(--spotify-white)',
                        fontWeight: '400',
                        marginBottom: '2px'
                      }}>
                        {song.title}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: 'var(--spotify-text-gray)'
                      }}>
                        {song.artist}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(song.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '50%',
                        transition: 'all 200ms ease',
                        color: likedSongs?.has(song.id) ? 'var(--spotify-green)' : 'var(--spotify-text-gray)'
                      }}
                      onMouseEnter={(e) => {
                        if (!likedSongs?.has(song.id)) {
                          e.target.style.color = 'var(--spotify-white)';
                        }
                        e.target.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        if (!likedSongs?.has(song.id)) {
                          e.target.style.color = 'var(--spotify-text-gray)';
                        }
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      <Heart size={16} fill={likedSongs?.has(song.id) ? 'currentColor' : 'none'} />
                    </button>

                    <div style={{
                      fontSize: '14px',
                      color: 'var(--spotify-text-gray)'
                    }}>
                      {formatDuration(song.duration)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: 'var(--spotify-text-gray)'
              }}>
                <History size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p style={{ fontSize: '16px', margin: 0 }}>
                  No listening history yet
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Queue View */
          <div>
            {/* Now Playing */}
            {currentSong && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: 'var(--spotify-white)',
                  marginBottom: '16px'
                }}>
                  Now Playing
                </h2>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr auto auto auto',
                  gap: '16px',
                  padding: '12px',
                  backgroundColor: 'var(--spotify-card-gray)',
                  borderRadius: '8px',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '4px',
                    background: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div className={currentSong.isPlaying ? 'spotify-pulse' : ''}>
                      <span style={{ color: 'white', fontSize: '12px' }}>♪</span>
                    </div>
                  </div>

                  <div>
                    <div style={{
                      fontSize: '16px',
                      color: 'var(--spotify-green)',
                      fontWeight: '500',
                      marginBottom: '2px'
                    }}>
                      {currentSong.title}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--spotify-text-gray)'
                    }}>
                      {currentSong.artist}
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleLike(currentSong.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '8px',
                      borderRadius: '50%',
                      transition: 'all 200ms ease',
                      color: likedSongs?.has(currentSong.id) ? 'var(--spotify-green)' : 'var(--spotify-text-gray)'
                    }}
                    onMouseEnter={(e) => {
                      if (!likedSongs?.has(currentSong.id)) {
                        e.target.style.color = 'var(--spotify-white)';
                      }
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      if (!likedSongs?.has(currentSong.id)) {
                        e.target.style.color = 'var(--spotify-text-gray)';
                      }
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <Heart size={16} fill={likedSongs?.has(currentSong.id) ? 'currentColor' : 'none'} />
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
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--spotify-text-gray)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  <div style={{
                    fontSize: '14px',
                    color: 'var(--spotify-text-gray)'
                  }}>
                    {formatDuration(currentSong.duration)}
                  </div>
                </div>
              </div>
            )}

            {/* Next Up */}
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--spotify-white)',
                marginBottom: '16px'
              }}>
                Next Up
              </h2>

              {queue.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {queue.map((song, index) => (
                    <div
                      key={`queue-${song.id}-${index}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '20px 40px 1fr auto auto auto',
                        gap: '16px',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'background-color 200ms ease',
                        alignItems: 'center',
                        opacity: draggedItem === index ? 0.5 : 1
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--spotify-light-gray)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <GripVertical 
                        size={16} 
                        color="var(--spotify-text-gray)" 
                        style={{ cursor: 'grab' }}
                      />

                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '4px',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ color: 'white', fontSize: '12px' }}>♪</span>
                      </div>

                      <div onClick={() => onSongSelect(song)}>
                        <div style={{
                          fontSize: '16px',
                          color: 'var(--spotify-white)',
                          fontWeight: '400',
                          marginBottom: '2px'
                        }}>
                          {song.title}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: 'var(--spotify-text-gray)'
                        }}>
                          {song.artist}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleLike(song.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '8px',
                          borderRadius: '50%',
                          transition: 'all 200ms ease',
                          color: likedSongs?.has(song.id) ? 'var(--spotify-green)' : 'var(--spotify-text-gray)'
                        }}
                        onMouseEnter={(e) => {
                          if (!likedSongs?.has(song.id)) {
                            e.target.style.color = 'var(--spotify-white)';
                          }
                          e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          if (!likedSongs?.has(song.id)) {
                            e.target.style.color = 'var(--spotify-text-gray)';
                          }
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <Heart size={16} fill={likedSongs?.has(song.id) ? 'currentColor' : 'none'} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFromQueue(index);
                        }}
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
                          e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = 'var(--spotify-text-gray)';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <X size={16} />
                      </button>

                      <div style={{
                        fontSize: '14px',
                        color: 'var(--spotify-text-gray)'
                      }}>
                        {formatDuration(song.duration)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: 'var(--spotify-text-gray)'
                }}>
                  <List size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <p style={{ fontSize: '16px', margin: 0 }}>
                    Your queue is empty
                  </p>
                  <p style={{ fontSize: '14px', margin: '8px 0 0 0' }}>
                    Add songs to see them here
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QueueView;
