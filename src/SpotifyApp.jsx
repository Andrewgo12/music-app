import React, { useState } from 'react';
import SpotifySidebar from './components/spotify/SpotifySidebar';
import SpotifyMainContent from './components/spotify/SpotifyMainContent';
import SpotifyPlayerBar from './components/spotify/SpotifyPlayerBar';

function SpotifyApp() {
  const [currentSong, setCurrentSong] = useState({
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:20',
    image: 'https://i.scdn.co/image/ab67616d0000b273c02645b5c5d8c8e8e8e8e8e8',
    isPlaying: false
  });

  const [currentView, setCurrentView] = useState('home');
  const [playlists] = useState([
    { id: '1', name: 'Liked Songs', songCount: 234, image: null },
    { id: '2', name: 'My Playlist #1', songCount: 45, image: null },
    { id: '3', name: 'Chill Vibes', songCount: 67, image: null },
    { id: '4', name: 'Workout Mix', songCount: 89, image: null },
    { id: '5', name: 'Road Trip', songCount: 123, image: null }
  ]);

  const [recentlyPlayed] = useState([
    { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours' },
    { id: '2', title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line' },
    { id: '3', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia' },
    { id: '4', title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR' },
    { id: '5', title: 'Stay', artist: 'The Kid LAROI, Justin Bieber', album: 'F*CK LOVE 3+' },
    { id: '6', title: 'Industry Baby', artist: 'Lil Nas X, Jack Harlow', album: 'MONTERO' }
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

  return (
    <div className="h-screen flex flex-col spotify-bg-main">
      {/* Main Layout - Spotify's exact structure */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Spotify Navigation */}
        <SpotifySidebar 
          currentView={currentView}
          setCurrentView={setCurrentView}
          playlists={playlists}
        />
        
        {/* Main Content Area */}
        <SpotifyMainContent 
          currentView={currentView}
          recentlyPlayed={recentlyPlayed}
          playlists={playlists}
          onSongSelect={handleSongSelect}
          currentSong={currentSong}
        />
      </div>
      
      {/* Bottom Player Bar - Always visible */}
      <SpotifyPlayerBar 
        currentSong={currentSong}
        onTogglePlayPause={togglePlayPause}
      />
    </div>
  );
}

export default SpotifyApp;
