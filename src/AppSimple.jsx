import React, { useState } from 'react';

function AppSimple() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState({
    title: "Test Song",
    artist: "Test Artist",
    duration: "3:45"
  });

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4">
        <h1 className="text-2xl font-bold text-green-500">🎵 Music Streaming App</h1>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-8">Welcome to Your Music App</h2>
          
          {/* Simple Player */}
          <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
            <div className="mb-4">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">🎵</span>
              </div>
              <h3 className="text-xl font-semibold">{currentSong.title}</h3>
              <p className="text-gray-400">{currentSong.artist}</p>
            </div>
            
            {/* Controls */}
            <div className="flex justify-center items-center space-x-4">
              <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                ⏮️
              </button>
              <button 
                onClick={togglePlay}
                className="p-4 rounded-full bg-green-500 hover:bg-green-600 text-2xl"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600">
                ⏭️
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-1/3"></div>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>1:23</span>
                <span>{currentSong.duration}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="mt-8 p-4 bg-green-900 rounded-lg max-w-md mx-auto">
            <p className="text-green-300">✅ React is working!</p>
            <p className="text-green-300">✅ Tailwind CSS is working!</p>
            <p className="text-green-300">✅ State management is working!</p>
            <p className="text-green-300">Status: {isPlaying ? 'Playing' : 'Paused'}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AppSimple;
