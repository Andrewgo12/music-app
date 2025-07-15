import React from 'react';
import { 
  Home, 
  Search, 
  Library, 
  Plus, 
  Heart,
  Download
} from 'lucide-react';

function SpotifySidebar({ currentView, setCurrentView, playlists }) {
  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Your Library', icon: Library }
  ];

  return (
    <div className="w-60 spotify-bg-sidebar flex flex-col h-full">
      {/* Spotify Logo */}
      <div className="p-6">
        <div className="flex items-center">
          <div className="w-8 h-8 spotify-green-bg rounded-full flex items-center justify-center mr-3">
            <span className="text-black font-bold text-lg">♪</span>
          </div>
          <span className="text-white font-bold text-xl">Spotify</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="px-6 mb-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center px-0 py-2 rounded text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-white' 
                      : 'spotify-text-gray hover:text-white'
                  }`}
                >
                  <Icon size={24} className="mr-4" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Create Playlist & Liked Songs */}
      <div className="px-6 mb-6">
        <ul className="space-y-2">
          <li>
            <button className="w-full flex items-center px-0 py-2 text-sm font-medium spotify-text-gray hover:text-white transition-colors">
              <div className="w-6 h-6 bg-gray-600 rounded-sm flex items-center justify-center mr-4">
                <Plus size={16} />
              </div>
              Create Playlist
            </button>
          </li>
          <li>
            <button className="w-full flex items-center px-0 py-2 text-sm font-medium spotify-text-gray hover:text-white transition-colors">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-700 to-blue-300 rounded-sm flex items-center justify-center mr-4">
                <Heart size={14} fill="white" />
              </div>
              Liked Songs
            </button>
          </li>
          <li>
            <button className="w-full flex items-center px-0 py-2 text-sm font-medium spotify-text-gray hover:text-white transition-colors">
              <div className="w-6 h-6 bg-green-700 rounded-sm flex items-center justify-center mr-4">
                <Download size={14} />
              </div>
              Downloaded
            </button>
          </li>
        </ul>
      </div>

      {/* Separator */}
      <div className="px-6 mb-4">
        <div className="border-t border-gray-800"></div>
      </div>

      {/* Playlists */}
      <div className="flex-1 px-6 overflow-y-auto">
        <ul className="space-y-1">
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              <button className="w-full text-left px-0 py-2 text-sm spotify-text-gray hover:text-white transition-colors truncate">
                {playlist.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Install App */}
      <div className="p-6 border-t border-gray-800">
        <button className="flex items-center text-sm font-medium spotify-text-gray hover:text-white transition-colors">
          <Download size={20} className="mr-3" />
          Install App
        </button>
      </div>
    </div>
  );
}

export default SpotifySidebar;
