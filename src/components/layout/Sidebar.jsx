import React from 'react';
import { 
  Home, 
  Search, 
  Library, 
  Plus, 
  Heart,
  Music,
  User,
  Settings
} from 'lucide-react';
import Button from '../ui/Button';

const Sidebar = ({ 
  currentView, 
  onViewChange, 
  playlists = [], 
  onCreatePlaylist,
  onOpenSettings 
}) => {
  const mainMenuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Your Library', icon: Library }
  ];

  const libraryItems = [
    { id: 'liked', label: 'Liked Songs', icon: Heart },
    { id: 'artists', label: 'Artists', icon: User },
    { id: 'albums', label: 'Albums', icon: Music }
  ];

  return (
    <div className="w-64 bg-black text-white flex flex-col h-full">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-green-500">MusicStream</h1>
      </div>

      {/* Main Navigation */}
      <nav className="px-3">
        <ul className="space-y-2">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                    currentView === item.id
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Library Section */}
      <div className="mt-8 px-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Library
        </h2>
        <ul className="space-y-2">
          {libraryItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                    currentView === item.id
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Playlists Section */}
      <div className="mt-8 px-3 flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Playlists
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCreatePlaylist}
            className="text-gray-400 hover:text-white"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="overflow-y-auto max-h-64">
          <ul className="space-y-1">
            {playlists.map((playlist) => (
              <li key={playlist.id}>
                <button
                  onClick={() => onViewChange('playlist', playlist.id)}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors truncate ${
                    currentView === 'playlist'
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                  title={playlist.name}
                >
                  {playlist.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Settings */}
      <div className="p-3 border-t border-gray-800">
        <Button
          variant="ghost"
          onClick={onOpenSettings}
          className="w-full justify-start text-gray-300 hover:text-white"
        >
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
