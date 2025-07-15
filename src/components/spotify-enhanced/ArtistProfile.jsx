import React, { useState } from 'react';
import {
  Play,
  Pause,
  Heart,
  MoreHorizontal,
  Shuffle,
  UserPlus,
  Share,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Music,
  Disc,
  Star,
  ExternalLink
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import SpotifyCardRedesigned from '../spotify-redesigned/SpotifyCardRedesigned';

function ArtistProfile({ artist, currentSong, onSongSelect }) {
  const { navigateTo } = useNavigation();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showAllAlbums, setShowAllAlbums] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for artist
  const artistData = {
    name: artist?.name || 'The Weeknd',
    image: null,
    verified: true,
    monthlyListeners: '85,583,009',
    followers: '32,456,789',
    bio: 'Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer, songwriter, and record producer. He has won multiple Grammy Awards and is known for his distinctive voice and dark, atmospheric music.',
    genres: ['R&B', 'Pop', 'Alternative R&B', 'Dark Pop'],
    location: 'Toronto, Canada',
    careerStart: '2010',
    recordLabel: 'XO/Republic Records',
    awards: ['4× Grammy Winner', 'Billboard Artist of the Decade'],
    topSongs: [
      { id: '1', title: 'Blinding Lights', plays: '3,234,567,890', duration: '3:20', album: 'After Hours' },
      { id: '2', title: 'The Hills', plays: '2,876,543,210', duration: '4:02', album: 'Beauty Behind the Madness' },
      { id: '3', title: 'Can\'t Feel My Face', plays: '2,654,321,098', duration: '3:35', album: 'Beauty Behind the Madness' },
      { id: '4', title: 'Starboy', plays: '2,432,109,876', duration: '3:50', album: 'Starboy' },
      { id: '5', title: 'Earned It', plays: '2,210,987,654', duration: '4:37', album: 'Beauty Behind the Madness' }
    ],
    albums: [
      { id: '1', title: 'After Hours', year: '2020', type: 'Album', tracks: 14 },
      { id: '2', title: 'Starboy', year: '2016', type: 'Album', tracks: 18 },
      { id: '3', title: 'Beauty Behind the Madness', year: '2015', type: 'Album', tracks: 14 },
      { id: '4', title: 'Kiss Land', year: '2013', type: 'Album', tracks: 10 }
    ],
    relatedArtists: [
      { id: '1', name: 'Drake', image: null },
      { id: '2', name: 'Travis Scott', image: null },
      { id: '3', name: 'Post Malone', image: null },
      { id: '4', name: 'Dua Lipa', image: null },
      { id: '5', name: 'Ariana Grande', image: null },
      { id: '6', name: 'Justin Bieber', image: null }
    ],
    upcomingShows: [
      {
        id: '1',
        date: '2024-03-15',
        venue: 'Madison Square Garden',
        city: 'New York, NY',
        ticketsAvailable: true,
        price: '$89 - $299'
      },
      {
        id: '2',
        date: '2024-03-18',
        venue: 'Staples Center',
        city: 'Los Angeles, CA',
        ticketsAvailable: true,
        price: '$95 - $350'
      },
      {
        id: '3',
        date: '2024-03-22',
        venue: 'United Center',
        city: 'Chicago, IL',
        ticketsAvailable: false,
        price: 'Sold Out'
      }
    ]
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const handlePlayArtist = () => {
    if (artistData.topSongs.length > 0) {
      onSongSelect(artistData.topSongs[0]);
    }
  };

  return (
    <div className="spotify-fade-in" style={{ padding: '0 32px 32px 32px' }}>
      {/* Artist Header */}
      <div style={{
        background: 'linear-gradient(180deg, rgba(29, 185, 84, 0.8) 0%, rgba(18, 18, 18, 0.8) 100%)',
        margin: '0 -32px 32px -32px',
        padding: '64px 32px 32px 32px',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px' }}>
          {/* Artist Image */}
          <div style={{
            width: '232px',
            height: '232px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--spotify-shadow-heavy)'
          }}>
            <span style={{ fontSize: '80px', color: 'white' }}>♪</span>
          </div>

          {/* Artist Info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              {artistData.verified && (
                <div style={{
                  backgroundColor: 'var(--spotify-green)',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'black', fontSize: '14px', fontWeight: 'bold' }}>✓</span>
                </div>
              )}
              <span style={{ fontSize: '14px', color: 'white', fontWeight: '600' }}>
                Verified Artist
              </span>
            </div>

            <h1 style={{
              fontSize: '96px',
              fontWeight: '900',
              color: 'white',
              margin: '0 0 24px 0',
              lineHeight: '1'
            }}>
              {artistData.name}
            </h1>

            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0 0 16px 0'
            }}>
              {artistData.monthlyListeners} monthly listeners
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '48px' }}>
        <button
          onClick={handlePlayArtist}
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
            e.target.style.transform = 'scale(1.05)';
            e.target.style.backgroundColor = 'var(--spotify-green-hover)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.backgroundColor = 'var(--spotify-green)';
          }}
        >
          <Play size={24} fill="black" style={{ color: 'black', marginLeft: '2px' }} />
        </button>

        <button
          onClick={handleFollowToggle}
          style={{
            padding: '8px 32px',
            backgroundColor: isFollowing ? 'transparent' : 'transparent',
            border: `1px solid ${isFollowing ? 'var(--spotify-text-gray)' : 'var(--spotify-white)'}`,
            borderRadius: '4px',
            color: isFollowing ? 'var(--spotify-text-gray)' : 'var(--spotify-white)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 200ms ease'
          }}
          onMouseEnter={(e) => {
            if (isFollowing) {
              e.target.style.borderColor = 'var(--spotify-white)';
              e.target.style.color = 'var(--spotify-white)';
              e.target.textContent = 'Unfollow';
            } else {
              e.target.style.transform = 'scale(1.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (isFollowing) {
              e.target.style.borderColor = 'var(--spotify-text-gray)';
              e.target.style.color = 'var(--spotify-text-gray)';
              e.target.textContent = 'Following';
            } else {
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>

        <button style={{
          background: 'none',
          border: 'none',
          color: 'var(--spotify-text-gray)',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '50%',
          transition: 'all 200ms ease'
        }}
          onMouseEnter={(e) => {
            e.target.style.color = 'var(--spotify-white)';
            e.target.style.backgroundColor = 'var(--spotify-light-gray)';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'var(--spotify-text-gray)';
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          <MoreHorizontal size={24} />
        </button>
      </div>

      {/* Popular Songs */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: 'var(--spotify-white)',
          marginBottom: '24px'
        }}>
          Popular
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {artistData.topSongs.slice(0, 5).map((song, index) => (
            <div
              key={song.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
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
                width: '16px',
                fontSize: '16px',
                color: 'var(--spotify-text-gray)',
                marginRight: '16px'
              }}>
                {index + 1}
              </span>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '16px',
                  color: 'var(--spotify-white)',
                  fontWeight: '400',
                  marginBottom: '4px'
                }}>
                  {song.title}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--spotify-text-gray)'
                }}>
                  {song.plays} plays
                </div>
              </div>

              <div style={{
                fontSize: '14px',
                color: 'var(--spotify-text-gray)',
                marginLeft: '16px'
              }}>
                {song.duration}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Albums */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--spotify-white)'
          }}>
            Albums
          </h2>
          <button
            onClick={() => setShowAllAlbums(!showAllAlbums)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--spotify-text-gray)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'color 200ms ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--spotify-white)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--spotify-text-gray)'}
          >
            {showAllAlbums ? 'Show less' : 'Show all'}
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '24px'
        }}>
          {artistData.albums.slice(0, showAllAlbums ? artistData.albums.length : 4).map((album) => (
            <SpotifyCardRedesigned
              key={album.id}
              title={album.title}
              subtitle={`${album.year} • ${album.type}`}
              type="album"
              onClick={() => navigateTo('album', album)}
            />
          ))}
        </div>
      </div>

      {/* Related Artists */}
      <div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: 'var(--spotify-white)',
          marginBottom: '24px'
        }}>
          Fans also like
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '24px'
        }}>
          {artistData.relatedArtists.map((relatedArtist) => (
            <SpotifyCardRedesigned
              key={relatedArtist.id}
              title={relatedArtist.name}
              subtitle="Artist"
              type="artist"
              onClick={() => navigateTo('artist', relatedArtist)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ArtistProfile;
