import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion'; // Not used
import {
  Home,
  Search,
  Library,
  Heart,
  Clock,
  TrendingUp,
  Radio,
  Mic2,
  ChevronRight,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import Button from '../ui/Button';
import { listItemAnimations, staggerContainer } from '../../utils/animations';

const EnhancedNavigation = ({
  currentView,
  currentPlaylistId,
  playlists = [],
  onNavigate,
  onBack,
  canGoBack = false,
  isMobile = false,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: ['Home'],
      color: 'text-green-500'
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      path: ['Search'],
      color: 'text-blue-500'
    },
    {
      id: 'library',
      label: 'Your Library',
      icon: Library,
      path: ['Library'],
      color: 'text-purple-500'
    },
    {
      id: 'liked',
      label: 'Liked Songs',
      icon: Heart,
      path: ['Library', 'Liked Songs'],
      color: 'text-red-500'
    },
    {
      id: 'recent',
      label: 'Recently Played',
      icon: Clock,
      path: ['Library', 'Recently Played'],
      color: 'text-yellow-500'
    },
    {
      id: 'discover',
      label: 'Discover',
      icon: TrendingUp,
      path: ['Discover'],
      color: 'text-orange-500'
    },
    {
      id: 'radio',
      label: 'Radio',
      icon: Radio,
      path: ['Radio'],
      color: 'text-indigo-500'
    },
    {
      id: 'podcasts',
      label: 'Podcasts',
      icon: Mic2,
      path: ['Podcasts'],
      color: 'text-pink-500'
    }
  ];

  const getCurrentBreadcrumb = () => {
    const currentItem = navigationItems.find(item => item.id === currentView);
    if (currentItem) {
      if (currentView === 'playlist' && currentPlaylistId) {
        const playlist = playlists.find(p => p.id === currentPlaylistId);
        return [...currentItem.path, playlist?.name || 'Playlist'];
      }
      return currentItem.path;
    }
    return ['Home'];
  };

  const NavItem = ({ item, isActive, isMobile: itemIsMobile = false }) => {
    const Icon = item.icon;

    return (
      <motion.div
        className="relative"
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
        variants={listItemAnimations}
      >
        <motion.button
          onClick={() => {
            onNavigate(item.id);
            if (itemIsMobile) setShowMobileMenu(false);
          }}
          className={`
            w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
            ${isActive
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }
            ${isCollapsed && !itemIsMobile ? 'justify-center px-2' : ''}
          `}
          whileHover={{ scale: 1.02, x: isActive ? 0 : 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <Icon className={`w-5 h-5 ${isActive ? item.color : ''}`} />

          {(!isCollapsed || itemIsMobile) && (
            <motion.span
              className="font-medium"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {item.label}
            </motion.span>
          )}

          {/* Active indicator */}
          {isActive && (
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-r"
              layoutId="activeIndicator"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>

        {/* Tooltip for collapsed state */}
        <AnimatePresence>
          {isCollapsed && !itemIsMobile && hoveredItem === item.id && (
            <motion.div
              className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap z-50"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              {item.label}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const Breadcrumb = () => {
    const breadcrumb = getCurrentBreadcrumb();

    return (
      <motion.div
        className="flex items-center space-x-2 text-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {breadcrumb.map((crumb, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
            <span className={`
              ${index === breadcrumb.length - 1
                ? 'text-white font-medium'
                : 'text-gray-400 hover:text-white cursor-pointer'
              }
            `}>
              {crumb}
            </span>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const PlaylistSection = () => (
    <div className="mt-8">
      {(!isCollapsed || isMobile) && (
        <motion.h3
          className="text-gray-400 text-sm font-semibold mb-4 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your Playlists
        </motion.h3>
      )}

      <motion.div
        className="space-y-1"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {playlists.slice(0, isCollapsed ? 3 : 10).map((playlist) => (
          <motion.div
            key={playlist.id}
            variants={listItemAnimations}
            className="relative"
            onMouseEnter={() => setHoveredItem(`playlist-${playlist.id}`)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <motion.button
              onClick={() => {
                onNavigate('playlist', playlist.id);
                if (isMobile) setShowMobileMenu(false);
              }}
              className={`
                w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left transition-all duration-200
                ${currentView === 'playlist' && currentPlaylistId === playlist.id
                  ? 'bg-green-500/20 text-green-400'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }
                ${isCollapsed && !isMobile ? 'justify-center px-2' : ''}
              `}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex-shrink-0" />

              {(!isCollapsed || isMobile) && (
                <span className="font-medium truncate">{playlist.name}</span>
              )}
            </motion.button>

            {/* Tooltip for collapsed state */}
            <AnimatePresence>
              {isCollapsed && !isMobile && hoveredItem === `playlist-${playlist.id}` && (
                <motion.div
                  className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap z-50"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  {playlist.name}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );

  // Mobile Navigation
  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            {canGoBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <Breadcrumb />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMobileMenu(true)}
            className="text-gray-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
            >
              <motion.div
                className="absolute right-0 top-0 bottom-0 w-80 bg-gray-900 p-6 overflow-y-auto"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMobileMenu(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <motion.div
                  className="space-y-2"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {navigationItems.map((item) => (
                    <NavItem
                      key={item.id}
                      item={item}
                      isActive={currentView === item.id}
                      isMobile={true}
                    />
                  ))}
                </motion.div>

                <PlaylistSection />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop Navigation
  return (
    <motion.div
      className={`bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'
        }`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.h1
              className="text-xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Music App
            </motion.h1>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="text-gray-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {!isCollapsed && canGoBack && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-400 hover:text-white flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </motion.div>
        )}

        {!isCollapsed && <div className="mt-4"><Breadcrumb /></div>}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          className="space-y-2"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {navigationItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={currentView === item.id}
            />
          ))}
        </motion.div>

        <PlaylistSection />
      </div>
    </motion.div>
  );
};

export default EnhancedNavigation;
