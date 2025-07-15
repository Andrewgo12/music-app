import React, { useState, useRef, useEffect } from 'react';
import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  Heart,
  PictureInPicture,
  List,
  Maximize2
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import useSlider from '../../hooks/useSlider';

function SpotifyPlayerEnhanced({
  currentSong,
  onTogglePlayPause,
  onNext,
  onPrevious,
  onToggleLike,
  isShuffled,
  onShuffle,
  repeatMode,
  onRepeat,
  volume,
  onVolumeChange,
  progress,
  onProgressChange
}) {
  const { navigateTo } = useNavigation();
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  // Interactive sliders
  const progressSlider = useSlider(progress, 0, 100, onProgressChange);
  const volumeSlider = useSlider(volume, 0, 100, onVolumeChange);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Update volume slider when volume changes externally
  useEffect(() => {
    volumeSlider.setValue(volume);
  }, [volume]);

  // Update progress slider when progress changes externally
  useEffect(() => {
    if (!progressSlider.isDragging) {
      progressSlider.setValue(progress);
    }
  }, [progress, progressSlider.isDragging]);

  const handleMuteToggle = () => {
    if (isMuted || volume === 0) {
      const newVolume = previousVolume > 0 ? previousVolume : 50;
      onVolumeChange(newVolume);
      volumeSlider.setValue(newVolume);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      onVolumeChange(0);
      volumeSlider.setValue(0);
      setIsMuted(true);
    }
  };

  const handleArtistClick = () => {
    navigateTo('artist', { name: currentSong.artist, id: currentSong.id });
  };

  const handleSongClick = () => {
    navigateTo('song', currentSong);
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
    width: `${isMuted ? 0 : volume}%`
  };

  const getRepeatIcon = () => {
    if (repeatMode === 'one') {
      return (
        <div style={{ position: 'relative' }}>
          <Repeat size={16} />
          <div style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            width: '4px',
            height: '4px',
            backgroundColor: 'var(--spotify-green)',
            borderRadius: '50%'
          }} />
        </div>
      );
    }
    return <Repeat size={16} />;
  };

  return (
    <div style={playerStyle} className="spotify-player-enhanced">
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
          <div
            onClick={handleSongClick}
            style={{
              fontSize: 'var(--font-size-body)',
              color: 'var(--spotify-white)',
              fontWeight: '400',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'color var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            {currentSong.title}
          </div>
          <div
            onClick={handleArtistClick}
            style={{
              fontSize: 'var(--font-size-caption)',
              color: 'var(--spotify-text-gray)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'color var(--transition-fast)'
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
            color: currentSong.isLiked ? 'var(--spotify-green)' : 'var(--spotify-text-gray)',
            marginLeft: '8px'
          }}
          onClick={() => {
            onToggleLike();
            // Add heart animation
            const button = document.activeElement;
            button.classList.add('spotify-heart-animation');
            setTimeout(() => button.classList.remove('spotify-heart-animation'), 300);
          }}
          onMouseEnter={(e) => {
            if (!currentSong.isLiked) e.target.style.color = 'var(--spotify-white)';
            e.target.style.transform = 'scale(1.06)';
          }}
          onMouseLeave={(e) => {
            if (!currentSong.isLiked) e.target.style.color = 'var(--spotify-text-gray)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <Heart size={16} fill={currentSong.isLiked ? 'currentColor' : 'none'} />
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
            onClick={onShuffle}
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
            onClick={onPrevious}
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
            onClick={onNext}
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
            onClick={onRepeat}
            onMouseEnter={(e) => {
              if (repeatMode === 'off') e.target.style.color = 'var(--spotify-white)';
              e.target.style.transform = 'scale(1.06)';
            }}
            onMouseLeave={(e) => {
              if (repeatMode === 'off') e.target.style.color = 'var(--spotify-text-gray)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            {getRepeatIcon()}
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          gap: '12px',
          marginTop: '8px'
        }}>
          <span style={{
            fontSize: 'var(--font-size-caption)',
            color: 'var(--spotify-text-gray)',
            minWidth: '40px',
            textAlign: 'right'
          }}>
            {formatTime(Math.floor((progressSlider.percentage / 100) * 200))}
          </span>
          <div
            {...progressSlider.sliderProps}
            style={{
              flex: 1,
              height: '4px',
              backgroundColor: 'var(--spotify-light-gray)',
              borderRadius: '2px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.height = '6px';
            }}
            onMouseLeave={(e) => {
              if (!progressSlider.isDragging) {
                e.target.style.height = '4px';
              }
            }}
          >
            <div style={{
              height: '100%',
              backgroundColor: progressSlider.isHovered || progressSlider.isDragging ? 'var(--spotify-green)' : 'var(--spotify-white)',
              borderRadius: '2px',
              width: `${progressSlider.percentage}%`,
              position: 'relative',
              transition: 'background-color 200ms ease'
            }}>
              <div style={{
                position: 'absolute',
                right: '-6px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '12px',
                height: '12px',
                backgroundColor: 'var(--spotify-white)',
                borderRadius: '50%',
                opacity: progressSlider.isHovered || progressSlider.isDragging ? 1 : 0,
                transition: 'opacity 200ms ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
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
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              transition: 'all 200ms ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--spotify-text-gray)'
            }}
            className="spotify-button-press"
            onClick={handleMuteToggle}
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--spotify-white)';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--spotify-text-gray)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            {isMuted || volumeSlider.value === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <div
            {...volumeSlider.sliderProps}
            style={{
              width: '93px',
              height: '4px',
              backgroundColor: 'var(--spotify-light-gray)',
              borderRadius: '2px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.height = '6px';
            }}
            onMouseLeave={(e) => {
              if (!volumeSlider.isDragging) {
                e.target.style.height = '4px';
              }
            }}
          >
            <div style={{
              height: '100%',
              backgroundColor: volumeSlider.isHovered || volumeSlider.isDragging ? 'var(--spotify-green)' : 'var(--spotify-white)',
              borderRadius: '2px',
              width: `${volumeSlider.percentage}%`,
              position: 'relative',
              transition: 'background-color 200ms ease'
            }}>
              <div style={{
                position: 'absolute',
                right: '-6px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '12px',
                height: '12px',
                backgroundColor: 'var(--spotify-white)',
                borderRadius: '50%',
                opacity: volumeSlider.isHovered || volumeSlider.isDragging ? 1 : 0,
                transition: 'opacity 200ms ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpotifyPlayerEnhanced;
