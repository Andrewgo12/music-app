import React, { useState, useRef, useEffect } from 'react';
import { Heart, Plus, Share, MoreHorizontal, Play, Pause } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

function ContextMenu({ 
  song, 
  isVisible, 
  position, 
  onClose, 
  onToggleLike, 
  onPlay,
  isPlaying = false,
  isLiked = false 
}) {
  const { openAddToPlaylistModal } = useNavigation();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isVisible, onClose]);

  if (!isVisible || !song) return null;

  const menuItems = [
    {
      icon: isPlaying ? Pause : Play,
      label: isPlaying ? 'Pause' : 'Play',
      action: onPlay,
      primary: true
    },
    {
      icon: Heart,
      label: isLiked ? 'Remove from Liked Songs' : 'Add to Liked Songs',
      action: onToggleLike,
      color: isLiked ? 'var(--spotify-green)' : 'var(--spotify-text-gray)'
    },
    {
      icon: Plus,
      label: 'Add to playlist',
      action: () => {
        openAddToPlaylistModal(song);
        onClose();
      }
    },
    {
      icon: Share,
      label: 'Share',
      action: () => {
        navigator.clipboard.writeText(`Check out "${song.title}" by ${song.artist}`);
        console.log('Song shared to clipboard');
        onClose();
      }
    }
  ];

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        backgroundColor: 'var(--spotify-dark-gray)',
        borderRadius: '4px',
        boxShadow: '0 16px 24px rgba(0, 0, 0, 0.3), 0 6px 8px rgba(0, 0, 0, 0.2)',
        border: '1px solid var(--spotify-border)',
        zIndex: 1000,
        minWidth: '200px',
        padding: '4px 0',
        animation: 'spotify-fade-in 0.1s ease-out'
      }}
    >
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={index}
            onClick={() => {
              item.action();
              if (!item.keepOpen) onClose();
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: item.primary ? '600' : '400',
              color: item.color || 'var(--spotify-white)',
              transition: 'background-color 200ms ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--spotify-light-gray)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <Icon size={16} />
            {item.label}
          </button>
        );
      })}
      
      <div style={{
        height: '1px',
        backgroundColor: 'var(--spotify-border)',
        margin: '4px 0'
      }} />
      
      <div style={{
        padding: '8px 16px',
        fontSize: '12px',
        color: 'var(--spotify-text-subdued)'
      }}>
        {song.title} • {song.artist}
      </div>
    </div>
  );
}

export default ContextMenu;
