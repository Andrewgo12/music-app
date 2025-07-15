import React, { useState } from 'react';
import { 
  Shuffle, 
  SkipBack, 
  Play, 
  Pause, 
  SkipForward, 
  Repeat,
  Volume2,
  Heart,
  PictureInPicture,
  List,
  Maximize2
} from 'lucide-react';

function SpotifyPlayerBar({ currentSong, onTogglePlayPause }) {
  const [volume, setVolume] = useState(75);
  const [progress, setProgress] = useState(45);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // off, all, one

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-24 bg-gray-900 border-t border-gray-800 flex items-center px-4">
      {/* Left Section - Current Song Info */}
      <div className="flex items-center w-80">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded flex items-center justify-center mr-3">
          <span className="text-white text-lg">♪</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-medium truncate hover:underline cursor-pointer">
            {currentSong.title}
          </div>
          <div className="spotify-text-gray text-xs truncate hover:underline cursor-pointer hover:text-white">
            {currentSong.artist}
          </div>
        </div>
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="ml-2 p-2 hover:scale-105 transition-transform"
        >
          <Heart 
            size={16} 
            className={isLiked ? 'text-green-500 fill-current' : 'spotify-text-gray hover:text-white'} 
          />
        </button>
        <button className="ml-1 p-2 hover:scale-105 transition-transform">
          <PictureInPicture size={16} className="spotify-text-gray hover:text-white" />
        </button>
      </div>

      {/* Center Section - Player Controls */}
      <div className="flex-1 flex flex-col items-center max-w-2xl mx-8">
        {/* Control Buttons */}
        <div className="flex items-center space-x-4 mb-2">
          <button 
            onClick={() => setIsShuffled(!isShuffled)}
            className="p-2 hover:scale-105 transition-transform"
          >
            <Shuffle 
              size={16} 
              className={isShuffled ? 'text-green-500' : 'spotify-text-gray hover:text-white'} 
            />
          </button>
          
          <button className="p-2 hover:scale-105 transition-transform">
            <SkipBack size={16} className="spotify-text-gray hover:text-white" />
          </button>
          
          <button 
            onClick={onTogglePlayPause}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {currentSong.isPlaying ? (
              <Pause size={16} className="text-black" />
            ) : (
              <Play size={16} className="text-black ml-0.5" />
            )}
          </button>
          
          <button className="p-2 hover:scale-105 transition-transform">
            <SkipForward size={16} className="spotify-text-gray hover:text-white" />
          </button>
          
          <button 
            onClick={() => {
              const modes = ['off', 'all', 'one'];
              const currentIndex = modes.indexOf(repeatMode);
              setRepeatMode(modes[(currentIndex + 1) % modes.length]);
            }}
            className="p-2 hover:scale-105 transition-transform"
          >
            <Repeat 
              size={16} 
              className={repeatMode !== 'off' ? 'text-green-500' : 'spotify-text-gray hover:text-white'} 
            />
            {repeatMode === 'one' && (
              <span className="absolute -mt-1 -ml-1 w-1 h-1 bg-green-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center w-full space-x-2">
          <span className="text-xs spotify-text-gray min-w-10 text-right">
            {formatTime(Math.floor((progress / 100) * 200))}
          </span>
          <div className="flex-1 group">
            <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full relative group-hover:bg-green-500 transition-colors"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>
          <span className="text-xs spotify-text-gray min-w-10">
            {currentSong.duration}
          </span>
        </div>
      </div>

      {/* Right Section - Volume and Additional Controls */}
      <div className="flex items-center space-x-3 w-80 justify-end">
        <button className="p-2 hover:scale-105 transition-transform">
          <List size={16} className="spotify-text-gray hover:text-white" />
        </button>
        
        <button className="p-2 hover:scale-105 transition-transform">
          <Maximize2 size={16} className="spotify-text-gray hover:text-white" />
        </button>
        
        <div className="flex items-center space-x-2 group">
          <button className="p-2 hover:scale-105 transition-transform">
            <Volume2 size={16} className="spotify-text-gray hover:text-white" />
          </button>
          <div className="w-24">
            <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full relative group-hover:bg-green-500 transition-colors"
                style={{ width: `${volume}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpotifyPlayerBar;
