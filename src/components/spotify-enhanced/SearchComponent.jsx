import React, { useState, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import SpotifyCardRedesigned from '../spotify-redesigned/SpotifyCardRedesigned';

function SearchComponent({ onSongSelect, currentSong }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState({
    songs: [],
    artists: [],
    albums: [],
    playlists: []
  });

  // Mock data for search
  const mockData = {
    songs: [
      { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', type: 'song' },
      { id: '2', title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', duration: '2:54', type: 'song' },
      { id: '3', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: '3:23', type: 'song' },
      { id: '4', title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', duration: '2:58', type: 'song' },
      { id: '5', title: 'Stay', artist: 'The Kid LAROI, Justin Bieber', album: 'F*CK LOVE 3+', duration: '2:21', type: 'song' },
      { id: '6', title: 'Industry Baby', artist: 'Lil Nas X, Jack Harlow', album: 'MONTERO', duration: '3:32', type: 'song' },
      { id: '7', title: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland', duration: '3:58', type: 'song' },
      { id: '8', title: 'Bad Habits', artist: 'Ed Sheeran', album: '=', duration: '3:51', type: 'song' }
    ],
    artists: [
      { id: '1', name: 'The Weeknd', type: 'artist', followers: '85M' },
      { id: '2', name: 'Harry Styles', type: 'artist', followers: '42M' },
      { id: '3', name: 'Dua Lipa', type: 'artist', followers: '38M' },
      { id: '4', name: 'Olivia Rodrigo', type: 'artist', followers: '28M' },
      { id: '5', name: 'Ed Sheeran', type: 'artist', followers: '67M' }
    ],
    albums: [
      { id: '1', title: 'After Hours', artist: 'The Weeknd', year: '2020', type: 'album' },
      { id: '2', title: 'Fine Line', artist: 'Harry Styles', year: '2019', type: 'album' },
      { id: '3', title: 'Future Nostalgia', artist: 'Dua Lipa', year: '2020', type: 'album' },
      { id: '4', title: 'SOUR', artist: 'Olivia Rodrigo', year: '2021', type: 'album' }
    ]
  };

  // Real-time search with debouncing
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults({ songs: [], artists: [], albums: [], playlists: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      performSearch(searchTerm);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const performSearch = (term) => {
    const lowerTerm = term.toLowerCase();
    
    const filteredSongs = mockData.songs.filter(song => 
      song.title.toLowerCase().includes(lowerTerm) ||
      song.artist.toLowerCase().includes(lowerTerm) ||
      song.album.toLowerCase().includes(lowerTerm)
    );

    const filteredArtists = mockData.artists.filter(artist =>
      artist.name.toLowerCase().includes(lowerTerm)
    );

    const filteredAlbums = mockData.albums.filter(album =>
      album.title.toLowerCase().includes(lowerTerm) ||
      album.artist.toLowerCase().includes(lowerTerm)
    );

    setSearchResults({
      songs: filteredSongs,
      artists: filteredArtists,
      albums: filteredAlbums,
      playlists: []
    });
    setIsSearching(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults({ songs: [], artists: [], albums: [], playlists: [] });
  };

  const hasResults = searchResults.songs.length > 0 || 
                    searchResults.artists.length > 0 || 
                    searchResults.albums.length > 0;

  return (
    <div className="spotify-fade-in" style={{ padding: '0 32px 32px 32px' }}>
      {/* Search Bar */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          position: 'relative',
          maxWidth: '400px'
        }}>
          <Search 
            size={16} 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: searchTerm ? 'black' : '#666',
              transition: 'color 200ms ease'
            }}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="What do you want to listen to?"
            style={{
              width: '100%',
              height: '48px',
              paddingLeft: '40px',
              paddingRight: searchTerm ? '40px' : '12px',
              borderRadius: '24px',
              border: 'none',
              fontSize: '14px',
              backgroundColor: 'white',
              color: 'black',
              boxShadow: 'var(--spotify-shadow)',
              transition: 'all 200ms ease'
            }}
            onFocus={(e) => {
              e.target.style.transform = 'scale(1.02)';
              e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'var(--spotify-shadow)';
            }}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '50%',
                transition: 'all 200ms ease'
              }}
              className="spotify-button-press"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f0f0f0';
                e.target.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <X size={16} color="black" />
            </button>
          )}
        </div>
        
        {/* Search Status */}
        {isSearching && (
          <div style={{
            marginTop: '16px',
            fontSize: '14px',
            color: 'var(--spotify-text-gray)'
          }}>
            Searching...
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchTerm && !isSearching && (
        <>
          {hasResults ? (
            <div>
              {/* Top Result */}
              {searchResults.songs.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: 'var(--spotify-white)',
                    marginBottom: '16px'
                  }}>
                    Top result
                  </h2>
                  <div style={{
                    backgroundColor: 'var(--spotify-card-gray)',
                    borderRadius: '8px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    maxWidth: '400px'
                  }}
                  className="spotify-card-lift"
                  onClick={() => onSongSelect(searchResults.songs[0])}
                  >
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px'
                    }}>
                      <span style={{ color: 'white', fontSize: '32px' }}>♪</span>
                    </div>
                    <h3 style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: 'var(--spotify-white)',
                      marginBottom: '8px'
                    }}>
                      {searchResults.songs[0].title}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: 'var(--spotify-text-gray)',
                      marginBottom: '8px'
                    }}>
                      Song • {searchResults.songs[0].artist}
                    </p>
                  </div>
                </div>
              )}

              {/* Songs */}
              {searchResults.songs.length > 1 && (
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: 'var(--spotify-white)',
                    marginBottom: '16px'
                  }}>
                    Songs
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {searchResults.songs.slice(1, 5).map((song, index) => (
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
                        className="spotify-stagger-item"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--spotify-light-gray)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        onClick={() => onSongSelect(song)}
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
                        
                        <div style={{
                          fontSize: '14px',
                          color: 'var(--spotify-text-gray)',
                          marginLeft: '12px'
                        }}>
                          {song.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Artists */}
              {searchResults.artists.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: 'var(--spotify-white)',
                    marginBottom: '16px'
                  }}>
                    Artists
                  </h2>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '24px'
                  }}>
                    {searchResults.artists.map((artist) => (
                      <SpotifyCardRedesigned
                        key={artist.id}
                        title={artist.name}
                        subtitle={`${artist.followers} followers`}
                        type="artist"
                        onClick={() => console.log('Navigate to artist:', artist.name)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Albums */}
              {searchResults.albums.length > 0 && (
                <div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: 'var(--spotify-white)',
                    marginBottom: '16px'
                  }}>
                    Albums
                  </h2>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '24px'
                  }}>
                    {searchResults.albums.map((album) => (
                      <SpotifyCardRedesigned
                        key={album.id}
                        title={album.title}
                        subtitle={`${album.year} • ${album.artist}`}
                        type="album"
                        onClick={() => console.log('Navigate to album:', album.title)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: 'var(--spotify-text-gray)'
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: 'var(--spotify-white)',
                marginBottom: '8px'
              }}>
                No results found for "{searchTerm}"
              </h3>
              <p style={{ fontSize: '16px' }}>
                Please make sure your words are spelled correctly or use less or different keywords.
              </p>
            </div>
          )}
        </>
      )}

      {/* Browse Categories (when no search) */}
      {!searchTerm && (
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--spotify-white)',
            marginBottom: '24px'
          }}>
            Browse all
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '24px'
          }}>
            {[
              { name: 'Pop', color: '#ff6b6b' },
              { name: 'Hip-Hop', color: '#4ecdc4' },
              { name: 'Rock', color: '#45b7d1' },
              { name: 'Latin', color: '#96ceb4' },
              { name: 'Indie', color: '#feca57' },
              { name: 'Electronic', color: '#ff9ff3' },
              { name: 'Country', color: '#54a0ff' },
              { name: 'R&B', color: '#5f27cd' }
            ].map((genre, index) => (
              <div
                key={index}
                className="spotify-card-lift spotify-stagger-item"
                style={{
                  backgroundColor: genre.color,
                  borderRadius: '8px',
                  padding: '20px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  height: '180px',
                  boxShadow: 'var(--spotify-shadow)',
                  animationDelay: `${index * 50}ms`
                }}
              >
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: 0
                }}>
                  {genre.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchComponent;
