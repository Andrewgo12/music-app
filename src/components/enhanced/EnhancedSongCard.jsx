import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Heart, 
  MoreHorizontal, 
  Plus,
  Share,
  Download,
  Clock,
  Music
} from 'lucide-react';
import Button from '../ui/Button';
import { cardAnimations } from '../../utils/animations';

const EnhancedSongCard = ({
  song,
  isPlaying = false,
  isLiked = false,
  onPlay,
  onPause,
  onLike,
  onAddToQueue,
  onAddToPlaylist,
  onShare,
  onDownload,
  formatTime,
  showAlbumArt = true,
  layout = 'horizontal', // 'horizontal' | 'vertical' | 'compact'
  className = ''
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform values for subtle 3D effect
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const handleMouseMove = (event) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
    setShowActions(false);
  };

  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      onPause?.(song);
    } else {
      onPlay?.(song);
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    onLike?.(song);
  };

  const ActionButton = ({ icon: Icon, onClick, className: btnClassName = '', ...props }) => (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onClick}
        className={`text-white/80 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm ${btnClassName}`}
        {...props}
      >
        <Icon className="w-4 h-4" />
      </Button>
    </motion.div>
  );

  const renderHorizontalLayout = () => (
    <div className="flex items-center space-x-4 p-4">
      {/* Album Art */}
      {showAlbumArt && (
        <div className="relative flex-shrink-0">
          <motion.img
            src={song.imageUrl || '/placeholder-album.jpg'}
            alt={song.title}
            className="w-16 h-16 rounded-lg object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          
          {/* Play overlay */}
          <AnimatePresence>
            {(isHovered || isPlaying) && (
              <motion.div
                className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePlayPause}
                  className="text-white hover:text-green-400 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <motion.h3 
          className="font-semibold text-white truncate"
          layoutId={`title-${song.id}`}
        >
          {song.title}
        </motion.h3>
        <motion.p 
          className="text-gray-400 text-sm truncate"
          layoutId={`artist-${song.id}`}
        >
          {song.artist}
        </motion.p>
        {song.album && (
          <p className="text-gray-500 text-xs truncate">{song.album}</p>
        )}
      </div>

      {/* Duration */}
      <div className="flex-shrink-0 text-gray-400 text-sm">
        {formatTime(song.duration)}
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center space-x-2">
        <AnimatePresence>
          {(isHovered || showActions) && (
            <>
              <ActionButton
                icon={Heart}
                onClick={handleLike}
                className={isLiked ? 'text-red-500 hover:text-red-400' : ''}
              />
              <ActionButton
                icon={Plus}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToQueue?.(song);
                }}
              />
            </>
          )}
        </AnimatePresence>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-gray-400 hover:text-white"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
          
          {/* Context Menu */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-8 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 z-20 min-w-48"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToPlaylist?.(song);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to playlist</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare?.(song);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Share className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload?.(song);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  const renderVerticalLayout = () => (
    <div className="p-4 space-y-3">
      {/* Album Art */}
      <div className="relative aspect-square">
        <motion.img
          src={song.imageUrl || '/placeholder-album.jpg'}
          alt={song.title}
          className="w-full h-full rounded-lg object-cover"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        
        {/* Play overlay */}
        <AnimatePresence>
          {(isHovered || isPlaying) && (
            <motion.div
              className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayPause}
                className="text-white hover:text-green-400 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full w-12 h-12"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" />
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute top-2 right-2 flex space-x-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <ActionButton
                icon={Heart}
                onClick={handleLike}
                className={isLiked ? 'text-red-500 hover:text-red-400' : ''}
              />
              <ActionButton
                icon={MoreHorizontal}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Song Info */}
      <div className="space-y-1">
        <motion.h3 
          className="font-semibold text-white truncate"
          layoutId={`title-${song.id}`}
        >
          {song.title}
        </motion.h3>
        <motion.p 
          className="text-gray-400 text-sm truncate"
          layoutId={`artist-${song.id}`}
        >
          {song.artist}
        </motion.p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{song.album}</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{formatTime(song.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompactLayout = () => (
    <div className="flex items-center space-x-3 p-2">
      {/* Play button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePlayPause}
        className="text-gray-400 hover:text-white flex-shrink-0 w-8 h-8"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 ml-0.5" />
        )}
      </Button>

      {/* Song info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white text-sm truncate">{song.title}</p>
        <p className="text-gray-400 text-xs truncate">{song.artist}</p>
      </div>

      {/* Duration */}
      <span className="text-gray-400 text-xs flex-shrink-0">
        {formatTime(song.duration)}
      </span>

      {/* Like button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLike}
        className={`flex-shrink-0 w-8 h-8 ${
          isLiked ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-white'
        }`}
      >
        <Heart className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <motion.div
      ref={cardRef}
      className={`bg-gray-800 rounded-lg overflow-hidden cursor-pointer group ${className}`}
      style={{ rotateX, rotateY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onPlay?.(song)}
      {...cardAnimations}
      whileHover={{
        ...cardAnimations.hover,
        transition: { duration: 0.2 }
      }}
      whileTap={cardAnimations.tap}
    >
      {layout === 'horizontal' && renderHorizontalLayout()}
      {layout === 'vertical' && renderVerticalLayout()}
      {layout === 'compact' && renderCompactLayout()}
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      
      {/* Playing indicator */}
      {isPlaying && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-green-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default EnhancedSongCard;
