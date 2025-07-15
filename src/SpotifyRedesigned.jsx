import React, { useState } from 'react';
import SpotifySidebarRedesigned from './components/spotify-redesigned/SpotifySidebarRedesigned';
import SpotifyContentRedesigned from './components/spotify-redesigned/SpotifyContentRedesigned';
import SpotifyPlayerRedesigned from './components/spotify-redesigned/SpotifyPlayerRedesigned';

function SpotifyRedesigned() {
  const [currentSong, setCurrentSong] = useState({
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:20',
    image: null,
    isPlaying: false
  });

  const [currentView, setCurrentView] = useState('home');
  
  const [playlists] = useState([
    { id: '1', name: 'Liked Songs', songCount: 234, image: null, type: 'liked' },
    { id: '2', name: 'My Playlist #1', songCount: 45, image: null, type: 'playlist' },
    { id: '3', name: 'Chill Vibes', songCount: 67, image: null, type: 'playlist' },
    { id: '4', name: 'Workout Mix', songCount: 89, image: null, type: 'playlist' },
    { id: '5', name: 'Road Trip Songs', songCount: 123, image: null, type: 'playlist' },
    { id: '6', name: 'Focus Music', songCount: 56, image: null, type: 'playlist' },
    { id: '7', name: 'Party Hits', songCount: 78, image: null, type: 'playlist' }
  ]);

  const [recentlyPlayed] = useState([
    { 
      id: '1', 
      title: 'Blinding Lights', 
      artist: 'The Weeknd', 
      album: 'After Hours',
      type: 'song'
    },
    { 
      id: '2', 
      title: 'Watermelon Sugar', 
      artist: 'Harry Styles', 
      album: 'Fine Line',
      type: 'song'
    },
    { 
      id: '3', 
      title: 'Levitating', 
      artist: 'Dua Lipa', 
      album: 'Future Nostalgia',
      type: 'song'
    },
    { 
      id: '4', 
      title: 'Good 4 U', 
      artist: 'Olivia Rodrigo', 
      album: 'SOUR',
      type: 'song'
    },
    { 
      id: '5', 
      title: 'Stay', 
      artist: 'The Kid LAROI, Justin Bieber', 
      album: 'F*CK LOVE 3+',
      type: 'song'
    },
    { 
      id: '6', 
      title: 'Industry Baby', 
      artist: 'Lil Nas X, Jack Harlow', 
      album: 'MONTERO',
      type: 'song'
    }
  ]);

  const [madeForYou] = useState([
    { id: '1', title: 'Daily Mix 1', subtitle: 'The Weeknd, Dua Lipa, Harry Styles and more', type: 'playlist' },
    { id: '2', title: 'Daily Mix 2', subtitle: 'Olivia Rodrigo, Taylor Swift, Billie Eilish and more', type: 'playlist' },
    { id: '3', title: 'Discover Weekly', subtitle: 'Your weekly mixtape of fresh music', type: 'playlist' },
    { id: '4', title: 'Release Radar', subtitle: 'Catch all the latest music from artists you follow', type: 'playlist' },
    { id: '5', title: 'Your Top Songs 2023', subtitle: 'Your most played songs this year', type: 'playlist' },
    { id: '6', title: 'Repeat Rewind', subtitle: 'Songs you can\'t stop playing', type: 'playlist' }
  ]);

  const togglePlayPause = () => {
    setCurrentSong(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }));
  };

  const handleSongSelect = (song) => {
    setCurrentSong({
      ...song,
      isPlaying: true
    });
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="spotify-layout">
      {/* Main Container */}
      <div className="spotify-main-container">
        {/* Sidebar */}
        <SpotifySidebarRedesigned 
          currentView={currentView}
          onViewChange={handleViewChange}
          playlists={playlists}
        />
        
        {/* Main Content */}
        <SpotifyContentRedesigned 
          currentView={currentView}
          recentlyPlayed={recentlyPlayed}
          madeForYou={madeForYou}
          playlists={playlists}
          onSongSelect={handleSongSelect}
          currentSong={currentSong}
        />
      </div>
      
      {/* Player Bar */}
      <SpotifyPlayerRedesigned 
        currentSong={currentSong}
        onTogglePlayPause={togglePlayPause}
      />
    </div>
  );
}

export default SpotifyRedesigned;
