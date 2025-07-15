import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { NavigationProvider } from './context/NavigationContext';
import SpotifySidebarEnhanced from './components/spotify-enhanced/SpotifySidebarEnhanced';
import SpotifyContentEnhanced from './components/spotify-enhanced/SpotifyContentEnhanced';
import SpotifyPlayerEnhanced from './components/spotify-enhanced/SpotifyPlayerEnhanced';
import ModalManager from './components/spotify-enhanced/ModalManager';

function SpotifyEnhanced() {
  const [currentSong, setCurrentSong] = useState({
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: '3:20',
    image: null,
    isPlaying: false,
    isLiked: false
  });

  const [likedSongs, setLikedSongs] = useState(new Set(['1']));
  const [userPlaylists, setUserPlaylists] = useState([
    { id: '1', name: 'My Playlist #1', songCount: 12, songs: [] },
    { id: '2', name: 'Favorites', songCount: 8, songs: [] },
    { id: '3', name: 'Workout Mix', songCount: 25, songs: [] }
  ]);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // off, all, one
  const [volume, setVolume] = useState(75);
  const [progress, setProgress] = useState(0);

  const [playlists, setPlaylists] = useState([
    {
      id: '1',
      name: 'Liked Songs',
      songCount: 234,
      image: null,
      type: 'liked',
      songs: []
    },
    {
      id: '2',
      name: 'My Playlist #1',
      songCount: 45,
      image: null,
      type: 'playlist',
      songs: []
    },
    {
      id: '3',
      name: 'Chill Vibes',
      songCount: 67,
      image: null,
      type: 'playlist',
      songs: []
    },
    {
      id: '4',
      name: 'Workout Mix',
      songCount: 89,
      image: null,
      type: 'playlist',
      songs: []
    },
    {
      id: '5',
      name: 'Road Trip Songs',
      songCount: 123,
      image: null,
      type: 'playlist',
      songs: []
    }
  ]);

  const [recentlyPlayed] = useState([
    {
      id: '1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: '3:20',
      type: 'song'
    },
    {
      id: '2',
      title: 'Watermelon Sugar',
      artist: 'Harry Styles',
      album: 'Fine Line',
      duration: '2:54',
      type: 'song'
    },
    {
      id: '3',
      title: 'Levitating',
      artist: 'Dua Lipa',
      album: 'Future Nostalgia',
      duration: '3:23',
      type: 'song'
    },
    {
      id: '4',
      title: 'Good 4 U',
      artist: 'Olivia Rodrigo',
      album: 'SOUR',
      duration: '2:58',
      type: 'song'
    },
    {
      id: '5',
      title: 'Stay',
      artist: 'The Kid LAROI, Justin Bieber',
      album: 'F*CK LOVE 3+',
      duration: '2:21',
      type: 'song'
    },
    {
      id: '6',
      title: 'Industry Baby',
      artist: 'Lil Nas X, Jack Harlow',
      album: 'MONTERO',
      duration: '3:32',
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

  // Initialize queue with recently played songs
  useEffect(() => {
    if (queue.length === 0) {
      setQueue(recentlyPlayed);
    }
  }, [recentlyPlayed, queue.length]);

  const togglePlayPause = () => {
    setCurrentSong(prev => ({
      ...prev,
      isPlaying: !prev.isPlaying
    }));
  };

  const handleTogglePlayPause = () => {
    togglePlayPause();
  };

  const handleSongSelect = (song, newQueue = null) => {
    const songQueue = newQueue || queue;
    const songIndex = songQueue.findIndex(s => s.id === song.id);

    setCurrentSong({
      ...song,
      isPlaying: true,
      isLiked: likedSongs.has(song.id)
    });

    if (newQueue) {
      setQueue(newQueue);
    }

    setCurrentIndex(songIndex >= 0 ? songIndex : 0);
    setProgress(0);
  };

  const handleNext = () => {
    if (queue.length === 0) return;

    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        nextIndex = repeatMode === 'all' ? 0 : currentIndex;
      }
    }

    if (nextIndex !== currentIndex || repeatMode === 'one') {
      const nextSong = queue[nextIndex];
      if (nextSong) {
        handleSongSelect(nextSong);
        setCurrentIndex(nextIndex);
      }
    }
  };

  const handlePrevious = () => {
    if (queue.length === 0) return;

    let prevIndex;
    if (isShuffled) {
      prevIndex = Math.floor(Math.random() * queue.length);
    } else {
      prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = repeatMode === 'all' ? queue.length - 1 : 0;
      }
    }

    const prevSong = queue[prevIndex];
    if (prevSong) {
      handleSongSelect(prevSong);
      setCurrentIndex(prevIndex);
    }
  };

  const toggleLike = (songId) => {
    const newLikedSongs = new Set(likedSongs);
    if (newLikedSongs.has(songId)) {
      newLikedSongs.delete(songId);
    } else {
      newLikedSongs.add(songId);
    }
    setLikedSongs(newLikedSongs);

    // Update current song if it's the one being liked/unliked
    if (currentSong.id === songId) {
      setCurrentSong(prev => ({
        ...prev,
        isLiked: newLikedSongs.has(songId)
      }));
    }
  };

  const handleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const handleRepeat = () => {
    const modes = ['off', 'all', 'one'];
    const currentModeIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentModeIndex + 1) % modes.length]);
  };

  const handleProgressChange = (newProgress) => {
    setProgress(newProgress);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
  };

  // Playlist Management Functions
  const handleCreatePlaylist = (newPlaylist) => {
    setUserPlaylists(prev => [...prev, newPlaylist]);
    console.log('✅ Playlist created:', newPlaylist.name);
  };

  const handleAddToPlaylist = (song, playlistId) => {
    setUserPlaylists(prev => prev.map(playlist => {
      if (playlist.id === playlistId) {
        const songExists = playlist.songs?.some(s => s.id === song.id);
        if (!songExists) {
          return {
            ...playlist,
            songs: [...(playlist.songs || []), song],
            songCount: (playlist.songCount || 0) + 1
          };
        }
      }
      return playlist;
    }));
    console.log('✅ Song added to playlist:', song.title);
  };

  // Playlist management functions (for future use)
  // const createPlaylist = (name) => {
  //   const newPlaylist = {
  //     id: Date.now().toString(),
  //     name,
  //     songCount: 0,
  //     image: null,
  //     type: 'playlist',
  //     songs: []
  //   };
  //   setPlaylists(prev => [...prev, newPlaylist]);
  //   return newPlaylist;
  // };

  // const addToPlaylist = (playlistId, song) => {
  //   setPlaylists(prev => prev.map(playlist => {
  //     if (playlist.id === playlistId) {
  //       return {
  //         ...playlist,
  //         songs: [...playlist.songs, song],
  //         songCount: playlist.songs.length + 1
  //       };
  //     }
  //     return playlist;
  //   }));
  // };

  return (
    <ThemeProvider>
      <NavigationProvider>
        <div className="spotify-layout">
          {/* Main Container */}
          <div className="spotify-main-container">
            {/* Sidebar */}
            <SpotifySidebarEnhanced
              playlists={playlists}
            />

            {/* Main Content */}
            <SpotifyContentEnhanced
              recentlyPlayed={recentlyPlayed}
              madeForYou={madeForYou}
              playlists={playlists}
              onSongSelect={handleSongSelect}
              currentSong={currentSong}
              likedSongs={likedSongs}
              onToggleLike={toggleLike}
              onTogglePlayPause={handleTogglePlayPause}
              onNext={handleNext}
              onPrevious={handlePrevious}
              queue={queue}
              queueHistory={[]}
              onRemoveFromQueue={(index) => {
                const newQueue = [...queue];
                newQueue.splice(index, 1);
                setQueue(newQueue);
              }}
              onReorderQueue={(fromIndex, toIndex) => {
                const newQueue = [...queue];
                const [removed] = newQueue.splice(fromIndex, 1);
                newQueue.splice(toIndex, 0, removed);
                setQueue(newQueue);
              }}
              progress={progress}
            />
          </div>

          {/* Player Bar */}
          <SpotifyPlayerEnhanced
            currentSong={currentSong}
            onTogglePlayPause={togglePlayPause}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onToggleLike={() => toggleLike(currentSong.id)}
            isShuffled={isShuffled}
            onShuffle={handleShuffle}
            repeatMode={repeatMode}
            onRepeat={handleRepeat}
            volume={volume}
            onVolumeChange={handleVolumeChange}
            progress={progress}
            onProgressChange={handleProgressChange}
          />

          {/* Modals */}
          <ModalManager
            currentSong={currentSong}
            onToggleLike={() => toggleLike(currentSong.id)}
            onSongSelect={handleSongSelect}
            userPlaylists={userPlaylists}
            onCreatePlaylist={handleCreatePlaylist}
            onAddToPlaylist={handleAddToPlaylist}
          />
        </div>
      </NavigationProvider>
    </ThemeProvider>
  );
}

export default SpotifyEnhanced;
