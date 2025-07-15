import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  User,
  ChevronDown,
  Play,
  Pause
} from 'lucide-react';
import SpotifyCard from './SpotifyCard';
import SpotifySearchBar from './SpotifySearchBar';

function SpotifyMainContent({ currentView, recentlyPlayed, playlists, onSongSelect, currentSong }) {
  const renderHomeView = () => (
    <div className="p-8">
      {/* Good morning section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-6">Good morning</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Liked Songs', color: 'from-purple-700 to-blue-300' },
            { name: 'Recently Played', color: 'from-green-700 to-green-500' },
            { name: 'My Playlist #1', color: 'from-red-700 to-red-500' },
            { name: 'Discover Weekly', color: 'from-blue-700 to-blue-500' },
            { name: 'Release Radar', color: 'from-yellow-700 to-yellow-500' },
            { name: 'Daily Mix 1', color: 'from-pink-700 to-pink-500' }
          ].map((item, index) => (
            <div key={index} className="spotify-bg-hover rounded-md flex items-center overflow-hidden group cursor-pointer">
              <div className={`w-20 h-20 bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                <span className="text-white text-2xl">♪</span>
              </div>
              <div className="flex-1 px-4">
                <span className="text-white font-medium">{item.name}</span>
              </div>
              <div className="pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-12 h-12 spotify-green-bg rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                  <Play size={20} fill="black" className="text-black ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently played */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Recently played</h2>
          <button className="text-sm font-medium spotify-text-gray hover:text-white">Show all</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {recentlyPlayed.map((song) => (
            <SpotifyCard
              key={song.id}
              title={song.title}
              subtitle={song.artist}
              type="album"
              isPlaying={currentSong.id === song.id && currentSong.isPlaying}
              onPlay={() => onSongSelect(song)}
              onClick={() => onSongSelect(song)}
            />
          ))}
        </div>
      </div>

      {/* Made for you */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Made for you</h2>
          <button className="text-sm font-medium spotify-text-gray hover:text-white">Show all</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {['Daily Mix 1', 'Daily Mix 2', 'Discover Weekly', 'Release Radar', 'Your Top Songs 2023', 'Repeat Rewind'].map((item, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="spotify-bg-card p-4 rounded-lg hover:spotify-bg-hover transition-colors">
                <div className="relative mb-4">
                  <div className="w-full aspect-square bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-4xl">♪</span>
                  </div>
                  <button className="absolute bottom-2 right-2 w-12 h-12 spotify-green-bg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 hover:scale-105">
                    <Play size={20} fill="black" className="text-black ml-1" />
                  </button>
                </div>
                <h3 className="text-white font-medium text-sm mb-1 truncate">{item}</h3>
                <p className="spotify-text-gray text-sm">Made for you</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSearchView = () => (
    <div className="p-8">
      <div className="mb-8">
        <SpotifySearchBar onSearch={(term) => console.log('Searching:', term)} />
      </div>
      <h2 className="text-2xl font-bold text-white mb-6">Browse all</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[
          { name: 'Pop', color: 'bg-pink-500' },
          { name: 'Hip-Hop', color: 'bg-red-600' },
          { name: 'Rock', color: 'bg-orange-600' },
          { name: 'Latin', color: 'bg-green-600' },
          { name: 'Indie', color: 'bg-blue-600' },
          { name: 'Electronic', color: 'bg-purple-600' },
          { name: 'Country', color: 'bg-yellow-600' },
          { name: 'R&B', color: 'bg-indigo-600' }
        ].map((genre, index) => (
          <div key={index} className={`${genre.color} rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform relative overflow-hidden`}>
            <h3 className="text-white font-bold text-xl mb-2">{genre.name}</h3>
            <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-black bg-opacity-20 rounded-lg transform rotate-12"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLibraryView = () => (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Your Library</h1>
      <div className="space-y-2">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="flex items-center p-2 rounded hover:spotify-bg-hover cursor-pointer group">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded flex items-center justify-center mr-3">
              <span className="text-white">♪</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">{playlist.name}</h3>
              <p className="spotify-text-gray text-sm">{playlist.songCount} songs</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col spotify-bg-main">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between p-4 bg-black bg-opacity-60">
        <div className="flex items-center space-x-4">
          <button className="w-8 h-8 bg-black bg-opacity-70 rounded-full flex items-center justify-center">
            <ChevronLeft size={20} className="text-white" />
          </button>
          <button className="w-8 h-8 bg-black bg-opacity-70 rounded-full flex items-center justify-center">
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button className="bg-black bg-opacity-70 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-opacity-80 transition-colors">
            Upgrade
          </button>
          <button className="bg-black bg-opacity-70 rounded-full p-1 hover:bg-opacity-80 transition-colors">
            <div className="w-7 h-7 bg-gray-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {currentView === 'home' && renderHomeView()}
        {currentView === 'search' && renderSearchView()}
        {currentView === 'library' && renderLibraryView()}
      </div>
    </div>
  );
}

export default SpotifyMainContent;
