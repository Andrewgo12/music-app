
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getUserPreferences,
  updateUserPreferences,
  addToRecentlyPlayed,
  getQueue,
  setQueue
} from '../utils/dataManager';

export const useAudioPlayer = () => {
  const audioRef = useRef(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [queue, setQueueState] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('none'); // 'none', 'one', 'all'

  // Initialize audio element and preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';

      // Load user preferences
      const preferences = getUserPreferences();
      setVolume(preferences.volume || 0.7);
      setShuffle(preferences.shuffle || false);
      setRepeat(preferences.repeat || 'none');

      // Load saved queue
      const savedQueue = getQueue();
      setQueueState(savedQueue);
    }

    return () => {
      if (audioRef.current) {
        if (audioRef.current.timeInterval) {
          clearInterval(audioRef.current.timeInterval);
        }
        audioRef.current = null;
      }
    };
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleEnded = () => {
      handleNext();
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = (e) => {
      console.error('Audio error:', e);
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [handleNext]); // Added missing dependency

  // Update audio volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Play a specific song
  const playSong = useCallback((song, songQueue = null, index = 0) => {
    if (!audioRef.current || !song) return;

    setCurrentSong(song);
    setIsLoading(true);

    // Update queue if provided
    if (songQueue) {
      setQueueState(songQueue);
      setQueue(songQueue.map(s => s.id));
      setCurrentIndex(index);
    }

    // For demo purposes, we'll simulate audio playback since we don't have real audio files
    // In a real app, you would set the actual audio source
    // audioRef.current.src = song.audioUrl;

    // Simulate loading and playing
    setTimeout(() => {
      setIsLoading(false);
      setIsPlaying(true);
      setDuration(song.duration || 180); // Use song duration or default to 3 minutes
      addToRecentlyPlayed(song.id);

      // Simulate time progression
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= (song.duration || 180)) {
            clearInterval(interval);
            handleNext();
            return 0;
          }
          return newTime;
        });
      }, 1000);

      // Store interval reference for cleanup
      audioRef.current.timeInterval = interval;
    }, 500);
  }, [handleNext]); // Added missing dependency

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      // Pause simulation
      if (audioRef.current.timeInterval) {
        clearInterval(audioRef.current.timeInterval);
        audioRef.current.timeInterval = null;
      }
      setIsPlaying(false);
    } else {
      // Resume simulation
      setIsPlaying(true);
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= duration) {
            clearInterval(interval);
            handleNext();
            return 0;
          }
          return newTime;
        });
      }, 1000);
      audioRef.current.timeInterval = interval;
    }
  }, [isPlaying, currentSong, duration, handleNext]); // Added missing dependency

  // Seek to specific time
  const seekTo = useCallback((time) => {
    setCurrentTime(time);
  }, []);

  // Change volume
  const changeVolume = useCallback((newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    updateUserPreferences({ volume: clampedVolume });
  }, []);

  // Get next song index
  const getNextIndex = useCallback(() => {
    if (queue.length === 0) return 0;

    if (shuffle) {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * queue.length);
      } while (nextIndex === currentIndex && queue.length > 1);
      return nextIndex;
    }

    return (currentIndex + 1) % queue.length;
  }, [queue.length, currentIndex, shuffle]);

  // Get previous song index
  const getPreviousIndex = useCallback(() => {
    if (queue.length === 0) return 0;

    if (shuffle) {
      let prevIndex;
      do {
        prevIndex = Math.floor(Math.random() * queue.length);
      } while (prevIndex === currentIndex && queue.length > 1);
      return prevIndex;
    }

    return currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
  }, [queue.length, currentIndex, shuffle]);

  // Play next song
  const handleNext = useCallback(() => {
    if (queue.length === 0) return;

    if (repeat === 'one') {
      // Repeat current song
      seekTo(0);
      if (!isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true));
      }
      return;
    }

    const nextIndex = getNextIndex();
    const nextSong = queue[nextIndex];

    if (nextSong) {
      setCurrentIndex(nextIndex);
      playSong(nextSong, queue, nextIndex);
    } else if (repeat === 'all' && queue.length > 0) {
      // Restart from beginning
      setCurrentIndex(0);
      playSong(queue[0], queue, 0);
    }
  }, [queue, currentIndex, repeat, isPlaying, getNextIndex, playSong, seekTo]);

  // Play previous song
  const handlePrevious = useCallback(() => {
    if (queue.length === 0) return;

    // If more than 3 seconds have passed, restart current song
    if (currentTime > 3) {
      seekTo(0);
      return;
    }

    const prevIndex = getPreviousIndex();
    const prevSong = queue[prevIndex];

    if (prevSong) {
      setCurrentIndex(prevIndex);
      playSong(prevSong, queue, prevIndex);
    }
  }, [queue, currentIndex, currentTime, getPreviousIndex, playSong, seekTo]);

  // Toggle shuffle
  const toggleShuffle = useCallback(() => {
    const newShuffle = !shuffle;
    setShuffle(newShuffle);
    updateUserPreferences({ shuffle: newShuffle });
  }, [shuffle]);

  // Toggle repeat
  const toggleRepeat = useCallback(() => {
    const modes = ['none', 'all', 'one'];
    const currentModeIndex = modes.indexOf(repeat);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setRepeat(nextMode);
    updateUserPreferences({ repeat: nextMode });
  }, [repeat]);

  // Add song to queue
  const addToQueue = useCallback((song) => {
    const newQueue = [...queue, song];
    setQueueState(newQueue);
    setQueue(newQueue.map(s => s.id));
  }, [queue]);

  // Remove song from queue
  const removeFromQueue = useCallback((index) => {
    const newQueue = queue.filter((_, i) => i !== index);
    setQueueState(newQueue);
    setQueue(newQueue.map(s => s.id));

    // Adjust current index if necessary
    if (index < currentIndex) {
      setCurrentIndex(currentIndex - 1);
    } else if (index === currentIndex && currentIndex >= newQueue.length) {
      setCurrentIndex(Math.max(0, newQueue.length - 1));
    }
  }, [queue, currentIndex]);

  // Clear queue
  const clearQueue = useCallback(() => {
    setQueueState([]);
    setQueue([]);
    setCurrentIndex(0);
  }, []);

  // Format time helper
  const formatTime = useCallback((seconds) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    // State
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoading,
    queue,
    currentIndex,
    shuffle,
    repeat,

    // Actions
    playSong,
    togglePlayPause,
    seekTo,
    changeVolume,
    handleNext,
    handlePrevious,
    toggleShuffle,
    toggleRepeat,
    addToQueue,
    removeFromQueue,
    clearQueue,

    // Utilities
    formatTime
  };
};
