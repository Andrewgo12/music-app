import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';

function SpotifyCard({ 
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

  return (
    <div 
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="spotify-bg-card p-4 rounded-lg hover:spotify-bg-hover transition-all duration-300">
        {/* Album/Playlist Cover */}
        <div className="relative mb-4">
          <div className={`w-full aspect-square ${type === 'artist' ? 'rounded-full' : 'rounded-lg'} overflow-hidden`}>
            {image ? (
              <img 
                src={image} 
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full spotify-gradient-purple flex items-center justify-center">
                <span className="text-white text-4xl">♪</span>
              </div>
            )}
          </div>
          
          {/* Play Button - Appears on hover */}
          <button 
            onClick={handlePlayClick}
            className={`absolute bottom-2 right-2 w-12 h-12 spotify-green-bg rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105 ${
              isHovered || isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            {isPlaying ? (
              <Pause size={20} fill="black" className="text-black" />
            ) : (
              <Play size={20} fill="black" className="text-black ml-1" />
            )}
          </button>
        </div>

        {/* Title and Subtitle */}
        <div>
          <h3 className="text-white font-medium text-sm mb-1 truncate hover:underline">
            {title}
          </h3>
          <p className="spotify-text-gray text-sm truncate">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SpotifyCard;
