import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion'; // Not used
import {
  Home,
  Search,
  Library,
  Heart,
  Users,
  Disc,
  Plus,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Music,
  TrendingUp,
  Clock,
  Download
} from 'lucide-react';
import Button from '../ui/Button';
import { HoverAnimation } from '../animations/PageTransitions';

const EnhancedNavigation = ({
  currentView,
  currentPlaylistId,
  playlists = [],
  onNavigate,
  onBack,
  canGoBack,
  isMobile,
  isCollapsed,
  onToggleCollapse
}) => {
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home, color: 'text-blue-500' },
    { id: 'search', label: 'Search', icon: Search, color: 'text-green-500' },
    { id: 'library', label: 'Your Library', icon: Library, color: 'text-purple-500' },
    { id: 'liked', label: 'Liked Songs', icon: Heart, color: 'text-red-500' },
    { id: 'artists', label: 'Artists', icon: Users, color: 'text-yellow-500' },
    { id: 'albums', label: 'Albums', icon: Disc, color: 'text-pink-500' }
  ];

  const NavItem = ({ item, isActive }) => (
    <HoverAnimation scale={1.02} y={-2}>
      <motion.button
        onClick={() => onNavigate(item.id)}
        className={`
          w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
          ${isActive
            ? 'bg-gray-800 text-white shadow-lg'
            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }
        `}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          animate={isActive ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <item.icon className={`w-5 h-5 ${isActive ? item.color : ''}`} />
        </motion.div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="font-medium truncate"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {isActive && (
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.button>
    </HoverAnimation>
  );

  const PlaylistItem = ({ playlist, isActive }) => (
    <HoverAnimation scale={1.01} y={-1}>
      <motion.button
        onClick={() => onNavigate('playlist', playlist.id)}
        className={`
          w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-all duration-200 group
          ${isActive
            ? 'bg-gray-800 text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }
        `}
        whileTap={{ scale: 0.98 }}
      >
        <div className={`
          w-4 h-4 rounded-sm flex items-center justify-center text-xs font-bold
          ${isActive ? 'bg-green-500 text-black' : 'bg-gray-600 text-gray-300 group-hover:bg-gray-500'}
        `}>
          <Music className="w-2.5 h-2.5" />
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm truncate flex-1"
            >
              {playlist.name}
            </motion.span>
          )}
        </AnimatePresence>

        {!isCollapsed && (
          <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
            {playlist.songIds?.length || 0}
          </span>
        )}
      </motion.button>
    </HoverAnimation>
  );

  if (isMobile) {
    return (
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-around py-2">
          {navigationItems.slice(0, 5).map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="icon"
              onClick={() => onNavigate(item.id)}
              className={`
                flex flex-col items-center space-y-1 p-2 h-auto
                ${currentView === item.id ? item.color : 'text-gray-400'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`
        bg-gray-900 border-r border-gray-800 flex flex-col h-full transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">MusicApp</h1>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="text-gray-400 hover:text-white"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            disabled={!canGoBack}
            className="text-gray-400 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-gray-400"
              >
                Navigation
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={currentView === item.id}
            />
          ))}
        </div>

        {/* Playlists Section */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.h3
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-semibold text-gray-400 uppercase tracking-wider"
                >
                  Playlists
                </motion.h3>
              )}
            </AnimatePresence>

            <HoverAnimation scale={1.1}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreatePlaylist(true)}
                className="text-gray-400 hover:text-white w-6 h-6"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </HoverAnimation>
          </div>

          <div className="space-y-1 max-h-64 overflow-y-auto">
            <AnimatePresence>
              {playlists.map((playlist, index) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <PlaylistItem
                    playlist={playlist}
                    isActive={currentView === 'playlist' && currentPlaylistId === playlist.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {playlists.length === 0 && !isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <Music className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No playlists yet</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreatePlaylist(true)}
                  className="text-gray-400 hover:text-white mt-2"
                >
                  Create your first playlist
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Storage</span>
                <span>2.1GB / 5GB</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div className="bg-blue-500 h-1 rounded-full w-2/5" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default EnhancedNavigation;
