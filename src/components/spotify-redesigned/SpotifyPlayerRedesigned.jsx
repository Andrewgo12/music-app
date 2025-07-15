import React, { useState } from 'react';
import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Volume2,
  Heart,
  PictureInPicture,
  List,
  Maximize2
} from 'lucide-react';

function SpotifyPlayerRedesigned({ currentSong, onTogglePlayPause }) {
  const [volume, setVolume] = useState(75);
  const [progress, setProgress] = useState(45);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // off, all, one

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playerStyle = {
    height: 'var(--player-height)',
    backgroundColor: 'var(--spotify-gray)',
    borderTop: '1px solid var(--spotify-border)',
    boxShadow: 'var(--spotify-shadow)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 var(--base-padding)',
    gap: '16px'
  };

  const leftSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '30%',
    minWidth: '180px'
  };

  const centerSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    maxWidth: '722px'
  };

  const rightSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '30%',
    minWidth: '180px',
    gap: '16px'
  };

  const controlButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    transition: 'all var(--transition-fast)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const playButtonStyle = {
    width: '32px',
    height: '32px',
    backgroundColor: 'var(--spotify-white)',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform var(--transition-fast)'
  };

  const progressBarStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: '12px',
    marginTop: '8px'
  };

  const progressTrackStyle = {
    flex: 1,
    height: '4px',
    backgroundColor: 'var(--spotify-light-gray)',
    borderRadius: '2px',
    position: 'relative',
    cursor: 'pointer'
  };

  const progressFillStyle = {
    height: '100%',
    backgroundColor: 'var(--spotify-white)',
    borderRadius: '2px',
    width: `${progress}%`,
    position: 'relative'
  };

  const volumeBarStyle = {
    width: '93px',
    height: '4px',
    backgroundColor: 'var(--spotify-light-gray)',
    borderRadius: '2px',
    position: 'relative',
    cursor: 'pointer'
  };

  const volumeFillStyle = {
    height: '100%',
    backgroundColor: 'var(--spotify-white)',
    borderRadius: '2px',
    width: `${volume}%`
  };

  return (
    <div style={playerStyle}>
      {/* Left Section - Current Song Info */}
      <div style={leftSectionStyle}>
        <div style={{
          width: '56px',
          height: '56px',
          backgroundColor: 'var(--spotify-light-gray)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '12px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div
            className={currentSong.isPlaying ? 'spotify-rotate' : ''}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <span style={{ color: 'white', fontSize: '16px' }}>♪</span>
            {/* CD hole effect */}
            <div style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              backgroundColor: 'var(--spotify-light-gray)',
              borderRadius: '50%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 'var(--font-size-body)',
            color: 'var(--spotify-white)',
            fontWeight: '400',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'pointer'
          }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            {currentSong.title}
          </div>
          <div style={{
            fontSize: 'var(--font-size-caption)',
            color: 'var(--spotify-text-gray)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'pointer'
          }}
            onMouseEnter={(e) => {
              e.target.style.textDecoration = 'underline';
              e.target.style.color = 'var(--spotify-white)';
            }}
            onMouseLeave={(e) => {
              e.target.style.textDecoration = 'none';
              e.target.style.color = 'var(--spotify-text-gray)';
            }}
          >
            {currentSong.artist}
          </div>
        </div>
        <button
          style={{
            ...controlButtonStyle,
            color: isLiked ? 'var(--spotify-green)' : 'var(--spotify-text-gray)',
            marginLeft: '8px'
          }}
          onClick={() => setIsLiked(!isLiked)}
          onMouseEnter={(e) => {
            if (!isLiked) e.target.style.color = 'var(--spotify-white)';
            e.target.style.transform = 'scale(1.06)';
          }}
          onMouseLeave={(e) => {
            if (!isLiked) e.target.style.color = 'var(--spotify-text-gray)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
        <button
          style={{
            ...controlButtonStyle,
            color: 'var(--spotify-text-gray)'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = 'var(--spotify-white)';
            e.target.style.transform = 'scale(1.06)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'var(--spotify-text-gray)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <PictureInPicture size={16} />
        </button>
      </div>

      {/* Center Section - Player Controls */}
      <div style={centerSectionStyle}>
        {/* Control Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <button
            style={{
              ...controlButtonStyle,
              color: isShuffled ? 'var(--spotify-green)' : 'var(--spotify-text-gray)'
            }}
            onClick={() => setIsShuffled(!isShuffled)}
            onMouseEnter={(e) => {
              if (!isShuffled) e.target.style.color = 'var(--spotify-white)';
              e.target.style.transform = 'scale(1.06)';
            }}
            onMouseLeave={(e) => {
              if (!isShuffled) e.target.style.color = 'var(--spotify-text-gray)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <Shuffle size={16} />
          </button>

          <button
            style={{
              ...controlButtonStyle,
              color: 'var(--spotify-text-gray)'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--spotify-white)';
              e.target.style.transform = 'scale(1.06)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--spotify-text-gray)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <SkipBack size={16} />
          </button>

          <button
            style={playButtonStyle}
            onClick={onTogglePlayPause}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.06)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            {currentSong.isPlaying ? (
              <Pause size={16} color="black" />
            ) : (
              <Play size={16} color="black" style={{ marginLeft: '1px' }} />
            )}
          </button>

          <button
            style={{
              ...controlButtonStyle,
              color: 'var(--spotify-text-gray)'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--spotify-white)';
              e.target.style.transform = 'scale(1.06)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--spotify-text-gray)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <SkipForward size={16} />
          </button>

          <button
            style={{
              ...controlButtonStyle,
              color: repeatMode !== 'off' ? 'var(--spotify-green)' : 'var(--spotify-text-gray)',
              position: 'relative'
            }}
            onClick={() => {
              const modes = ['off', 'all', 'one'];
              const currentIndex = modes.indexOf(repeatMode);
              setRepeatMode(modes[(currentIndex + 1) % modes.length]);
            }}
            onMouseEnter={(e) => {
              if (repeatMode === 'off') e.target.style.color = 'var(--spotify-white)';
              e.target.style.transform = 'scale(1.06)';
            }}
            onMouseLeave={(e) => {
              if (repeatMode === 'off') e.target.style.color = 'var(--spotify-text-gray)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <Repeat size={16} />
            {repeatMode === 'one' && (
              <div style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                width: '4px',
                height: '4px',
                backgroundColor: 'var(--spotify-green)',
                borderRadius: '50%'
              }} />
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div style={progressBarStyle}>
          <span style={{
            fontSize: 'var(--font-size-caption)',
            color: 'var(--spotify-text-gray)',
            minWidth: '40px',
            textAlign: 'right'
          }}>
            {formatTime(Math.floor((progress / 100) * 200))}
          </span>
          <div style={progressTrackStyle}>
            <div style={progressFillStyle}>
              <div style={{
                position: 'absolute',
                right: '-6px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '12px',
                height: '12px',
                backgroundColor: 'var(--spotify-white)',
                borderRadius: '50%',
                opacity: 0,
                transition: 'opacity var(--transition-fast)'
              }} />
            </div>
          </div>
          <span style={{
            fontSize: 'var(--font-size-caption)',
            color: 'var(--spotify-text-gray)',
            minWidth: '40px'
          }}>
            {currentSong.duration}
          </span>
        </div>
      </div>

      {/* Right Section - Volume and Additional Controls */}
      <div style={rightSectionStyle}>
        <button
          style={{
            ...controlButtonStyle,
            color: 'var(--spotify-text-gray)'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = 'var(--spotify-white)';
            e.target.style.transform = 'scale(1.06)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'var(--spotify-text-gray)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <List size={16} />
        </button>

        <button
          style={{
            ...controlButtonStyle,
            color: 'var(--spotify-text-gray)'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = 'var(--spotify-white)';
            e.target.style.transform = 'scale(1.06)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'var(--spotify-text-gray)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <Maximize2 size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            style={{
              ...controlButtonStyle,
              color: 'var(--spotify-text-gray)'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--spotify-white)';
              e.target.style.transform = 'scale(1.06)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--spotify-text-gray)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <Volume2 size={16} />
          </button>
          <div style={volumeBarStyle}>
            <div style={volumeFillStyle} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpotifyPlayerRedesigned;
