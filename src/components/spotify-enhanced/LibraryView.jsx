import React, { useState } from 'react';
import { 
  Grid, 
  List, 
  Search, 
  Filter, 
  SortAsc, 
  Play,
  Heart,
  Download,
  Clock,
  Calendar,
  User,
  Music,
  Disc,
  Folder
} from 'lucide-react';
import SpotifyCardRedesigned from '../spotify-redesigned/SpotifyCardRedesigned';

function LibraryView({ 
  playlists, 
  likedSongs, 
  recentlyPlayed, 
  onSongSelect, 
  currentSong,
  onToggleLike 
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', 'compact'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'alphabetical', 'creator', 'custom'
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'playlists', 'artists', 'albums'
  const [searchTerm, setSearchTerm] = useState('');

  // Mock library data
  const libraryItems = [
    {
      id: 'liked',
      type: 'playlist',
      name: 'Liked Songs',
      creator: 'You',
      songCount: likedSongs?.size || 0,
      image: null,
      isLiked: true,
      lastPlayed: '2024-01-15',
      pinned: true
    },
    {
      id: 'recent',
      type: 'playlist',
      name: 'Recently Played',
      creator: 'Spotify',
      songCount: recentlyPlayed?.length || 0,
      image: null,
      lastPlayed: '2024-01-15',
      pinned: false
    },
    ...playlists.map(playlist => ({
      ...playlist,
      type: 'playlist',
      creator: 'You',
      lastPlayed: '2024-01-14',
      pinned: false
    })),
    // Mock artists
    {
      id: 'artist-1',
      type: 'artist',
      name: 'The Weeknd',
      creator: 'Artist',
      songCount: 156,
      image: null,
      lastPlayed: '2024-01-15',
      pinned: false
    },
    {
      id: 'artist-2',
      type: 'artist',
      name: 'Dua Lipa',
      creator: 'Artist',
      songCount: 89,
      image: null,
      lastPlayed: '2024-01-14',
      pinned: false
    },
    // Mock albums
    {
      id: 'album-1',
      type: 'album',
      name: 'After Hours',
      creator: 'The Weeknd',
      songCount: 14,
      image: null,
      lastPlayed: '2024-01-15',
      pinned: false
    },
    {
      id: 'album-2',
      type: 'album',
      name: 'Future Nostalgia',
      creator: 'Dua Lipa',
      songCount: 11,
      image: null,
      lastPlayed: '2024-01-13',
      pinned: false
    }
  ];

  // Filter and sort items
  const filteredItems = libraryItems
    .filter(item => {
      if (filterBy !== 'all' && item.type !== filterBy.slice(0, -1)) return false;
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        case 'creator':
          return a.creator.localeCompare(b.creator);
        case 'recent':
        default:
          return new Date(b.lastPlayed) - new Date(a.lastPlayed);
      }
    });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'playlist': return <Music size={16} />;
      case 'artist': return <User size={16} />;
      case 'album': return <Disc size={16} />;
      default: return <Folder size={16} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'playlist': return '#1DB954';
      case 'artist': return '#1ed760';
      case 'album': return '#8B5CF6';
      default: return '#666';
    }
  };

  const formatLastPlayed = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="spotify-fade-in" style={{ padding: '0 32px 32px 32px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        padding: '32px 0 16px 0'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '900',
          color: 'var(--spotify-white)',
          margin: 0
        }}>
          Your Library
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search 
              size={16} 
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--spotify-text-gray)'
              }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in Your Library"
              style={{
                width: '240px',
                height: '32px',
                paddingLeft: '36px',
                paddingRight: '12px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '14px',
                backgroundColor: 'var(--spotify-light-gray)',
                color: 'var(--spotify-white)',
                outline: 'none',
                transition: 'all 200ms ease'
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = 'var(--spotify-card-gray)';
                e.target.style.boxShadow = '0 0 0 2px var(--spotify-green)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = 'var(--spotify-light-gray)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* View Mode Toggle */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--spotify-light-gray)',
            borderRadius: '4px',
            padding: '2px'
          }}>
            {[
              { mode: 'grid', icon: Grid },
              { mode: 'list', icon: List }
            ].map(({ mode, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '6px',
                  backgroundColor: viewMode === mode ? 'var(--spotify-white)' : 'transparent',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon 
                  size={16} 
                  color={viewMode === mode ? 'black' : 'var(--spotify-text-gray)'} 
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {/* Filter Buttons */}
        {[
          { id: 'all', label: 'All' },
          { id: 'playlists', label: 'Playlists' },
          { id: 'artists', label: 'Artists' },
          { id: 'albums', label: 'Albums' }
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setFilterBy(filter.id)}
            style={{
              padding: '6px 12px',
              backgroundColor: filterBy === filter.id ? 'var(--spotify-white)' : 'var(--spotify-light-gray)',
              border: 'none',
              borderRadius: '16px',
              color: filterBy === filter.id ? 'black' : 'var(--spotify-white)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => {
              if (filterBy !== filter.id) {
                e.target.style.backgroundColor = 'var(--spotify-card-gray)';
              }
            }}
            onMouseLeave={(e) => {
              if (filterBy !== filter.id) {
                e.target.style.backgroundColor = 'var(--spotify-light-gray)';
              }
            }}
          >
            {filter.label}
          </button>
        ))}

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '6px 12px',
            backgroundColor: 'var(--spotify-light-gray)',
            border: 'none',
            borderRadius: '4px',
            color: 'var(--spotify-white)',
            fontSize: '14px',
            cursor: 'pointer',
            marginLeft: 'auto'
          }}
        >
          <option value="recent">Recently Played</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="creator">Creator</option>
        </select>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? (
        /* Grid View */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '24px'
        }}>
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="spotify-stagger-item spotify-card-lift"
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <SpotifyCardRedesigned
                title={item.name}
                subtitle={`${item.type === 'playlist' ? 'Playlist' : item.type} • ${item.creator}`}
                type={item.type}
                onClick={() => {
                  if (item.type === 'playlist') {
                    // Navigate to playlist
                    console.log('Navigate to playlist:', item.name);
                  } else if (item.type === 'artist') {
                    // Navigate to artist
                    console.log('Navigate to artist:', item.name);
                  } else if (item.type === 'album') {
                    // Navigate to album
                    console.log('Navigate to album:', item.name);
                  }
                }}
                onPlay={() => {
                  if (item.id === 'liked') {
                    // Play liked songs
                    console.log('Play liked songs');
                  } else if (item.id === 'recent') {
                    // Play recently played
                    console.log('Play recently played');
                  } else {
                    console.log('Play:', item.name);
                  }
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div>
          {/* List Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '40px 1fr auto auto',
            gap: '16px',
            padding: '8px 16px',
            borderBottom: '1px solid var(--spotify-border)',
            marginBottom: '8px'
          }}>
            <div></div>
            <div style={{
              fontSize: '14px',
              color: 'var(--spotify-text-gray)',
              fontWeight: '500'
            }}>
              Title
            </div>
            <div style={{
              fontSize: '14px',
              color: 'var(--spotify-text-gray)',
              fontWeight: '500'
            }}>
              <Calendar size={16} />
            </div>
            <div style={{
              fontSize: '14px',
              color: 'var(--spotify-text-gray)',
              fontWeight: '500'
            }}>
              <Clock size={16} />
            </div>
          </div>

          {/* List Items */}
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="spotify-stagger-item"
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr auto auto',
                gap: '16px',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 200ms ease',
                alignItems: 'center',
                animationDelay: `${index * 30}ms`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--spotify-light-gray)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => {
                if (item.type === 'playlist') {
                  console.log('Navigate to playlist:', item.name);
                } else if (item.type === 'artist') {
                  console.log('Navigate to artist:', item.name);
                } else if (item.type === 'album') {
                  console.log('Navigate to album:', item.name);
                }
              }}
            >
              {/* Icon/Image */}
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: item.type === 'artist' ? '50%' : '4px',
                backgroundColor: getTypeColor(item.type),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {item.id === 'liked' ? (
                  <Heart size={16} color="white" fill="white" />
                ) : (
                  getTypeIcon(item.type)
                )}
              </div>

              {/* Title and Info */}
              <div>
                <div style={{
                  fontSize: '16px',
                  color: 'var(--spotify-white)',
                  fontWeight: '400',
                  marginBottom: '2px'
                }}>
                  {item.name}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--spotify-text-gray)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {item.pinned && (
                    <span style={{ color: 'var(--spotify-green)' }}>📌</span>
                  )}
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {item.creator}
                </div>
              </div>

              {/* Last Played */}
              <div style={{
                fontSize: '14px',
                color: 'var(--spotify-text-gray)'
              }}>
                {formatLastPlayed(item.lastPlayed)}
              </div>

              {/* Song Count */}
              <div style={{
                fontSize: '14px',
                color: 'var(--spotify-text-gray)'
              }}>
                {item.songCount} songs
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '80px 40px',
          color: 'var(--spotify-text-gray)'
        }}>
          <Music size={64} style={{ marginBottom: '24px', opacity: 0.3 }} />
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--spotify-white)',
            marginBottom: '8px'
          }}>
            {searchTerm ? 'No results found' : 'Your library is empty'}
          </h3>
          <p style={{ fontSize: '16px', margin: 0 }}>
            {searchTerm 
              ? `Try searching for something else` 
              : 'Start by saving some music to your library'
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default LibraryView;
