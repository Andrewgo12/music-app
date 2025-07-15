import React, { useState } from 'react';
import { Play, Pause, MoreHorizontal, Heart, Plus } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

function SpotifyCardRedesigned({
  title,
  subtitle,
  image,
  type = 'album',
  isPlaying = false,
  onPlay,
  onClick
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (onPlay) onPlay();
  };

  const cardStyle = {
    width: '200px',
    backgroundColor: 'var(--spotify-card-gray)',
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 200ms ease',
    position: 'relative',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: '1px solid var(--spotify-border)'
  };

  const imageStyle = {
    width: '100%',
    aspectRatio: '1',
    borderRadius: type === 'artist' ? '50%' : '8px',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
  };

  const playButtonStyle = {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    width: '56px',
    height: '56px',
    backgroundColor: 'var(--spotify-green)',
    borderRadius: '50%',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    transition: 'all 200ms ease',
    opacity: isHovered || isPlaying ? 1 : 0,
    transform: `translateY(${isHovered || isPlaying ? '0' : '8px'}) scale(${isHovered ? '1.05' : '1'})`,
    zIndex: 2
  };

  const titleStyle = {
    fontSize: 'var(--font-size-body)',
    fontWeight: '600',
    color: 'var(--spotify-white)',
    marginBottom: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: '1.3'
  };

  const subtitleStyle = {
    fontSize: 'var(--font-size-small)',
    color: 'var(--spotify-text-gray)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: '1.3'
  };

  const gradients = [
    'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)'
  ];

  const gradientIndex = title ? title.length % gradients.length : 0;

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--spotify-light-gray)';
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--spotify-card-gray)';
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
    >
      {/* Album/Playlist Cover */}
      <div style={imageStyle}>
        {image ? (
          <img
            src={image}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: gradients[gradientIndex],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              color: 'white',
              fontSize: '48px',
              fontWeight: 'bold'
            }}>♪</span>
          </div>
        )}

        {/* Play Button */}
        <button
          style={playButtonStyle}
          onClick={handlePlayClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.backgroundColor = 'var(--spotify-green-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = 'var(--spotify-green)';
          }}
        >
          {isPlaying ? (
            <Pause size={20} fill="black" style={{ color: 'black' }} />
          ) : (
            <Play size={20} fill="black" style={{ color: 'black', marginLeft: '2px' }} />
          )}
        </button>
      </div>

      {/* Title and Subtitle */}
      <div>
        <div style={titleStyle}>
          {title}
        </div>
        <div style={subtitleStyle}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}

export default SpotifyCardRedesigned;
