import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion'; // Not used
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  MoreHorizontal,
  Maximize2,
  Queue,
  Mic2,
  Settings,
  Cast,
  PictureInPicture
} from 'lucide-react';
import Button from '../ui/Button';
import Slider from '../ui/Slider';
import AudioVisualizer from '../advanced/AudioVisualizer';
import { playerBarAnimations } from '../../utils/animations';

const EnhancedPlayerBar = ({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  shuffle,
  repeat,
  isLiked,
  queue = [],
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onShuffle,
  onRepeat,
  onLike,
  onShowQueue,
  onShowLyrics,
  onShowVisualizer,
  onMiniPlayer,
  formatTime,
  className = ''
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (showVolumeSlider) {
      const timer = setTimeout(() => setShowVolumeSlider(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showVolumeSlider]);

  const handleVolumeToggle = () => {
    if (volume > 0) {
      setPreviousVolume(volume);
      onVolumeChange(0);
    } else {
      onVolumeChange(previousVolume || 0.5);
    }
  };

  const getRepeatIcon = () => {
    switch (repeat) {
      case 'one':
        return <Repeat className="w-4 h-4" />;
      case 'all':
        return <Repeat className="w-4 h-4" />;
      default:
        return <Repeat className="w-4 h-4" />;
    }
  };

  const getRepeatColor = () => {
    return repeat !== 'none' ? 'text-green-500' : 'text-gray-400 hover:text-white';
  };

  if (!currentSong) {
    return (
      <motion.div
        className={`bg-gray-900 border-t border-gray-800 p-4 ${className}`}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-center text-gray-500">
          <Mic2 className="w-6 h-6 mr-2" />
          <span>No song playing</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 ${className}`}
      {...playerBarAnimations}
    >
      {/* Expanded Visualizer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 120, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-gray-800"
          >
            <AudioVisualizer
              isPlaying={isPlaying}
              currentSong={currentSong}
              visualizerType="bars"
              className="h-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 py-3">
        {/* Progress Bar */}
        <div className="mb-3">
          <Slider
            value={currentTime}
            max={duration || 100}
            onChange={onSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between">
          {/* Song Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <img
                src={currentSong.imageUrl || '/placeholder-album.jpg'}
                alt={currentSong.title}
                className="w-14 h-14 rounded-lg object-cover"
              />

              {/* Playing animation overlay */}
              {isPlaying && (
                <motion.div
                  className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex space-x-1">
                    <motion.div
                      className="w-1 h-3 bg-green-500 rounded-full"
                      animate={{ scaleY: [1, 1.5, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="w-1 h-3 bg-green-500 rounded-full"
                      animate={{ scaleY: [1, 1.5, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    />
                    <motion.div
                      className="w-1 h-3 bg-green-500 rounded-full"
                      animate={{ scaleY: [1, 1.5, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>

            <div className="min-w-0 flex-1">
              <motion.h3
                className="font-semibold text-white truncate"
                layoutId={`player-title-${currentSong.id}`}
              >
                {currentSong.title}
              </motion.h3>
              <motion.p
                className="text-gray-400 text-sm truncate"
                layoutId={`player-artist-${currentSong.id}`}
              >
                {currentSong.artist}
              </motion.p>
            </div>

            {/* Like Button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={onLike}
                className={`${isLiked ? 'text-red-500 hover:text-red-400' : 'text-gray-400 hover:text-white'
                  }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
            </motion.div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center space-x-4">
            {/* Secondary Controls */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onShuffle}
                className={shuffle ? 'text-green-500' : 'text-gray-400 hover:text-white'}
              >
                <Shuffle className="w-4 h-4" />
              </Button>
            </div>

            {/* Primary Controls */}
            <div className="flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onPrevious}
                  className="text-gray-400 hover:text-white"
                >
                  <SkipBack className="w-5 h-5" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onPlayPause}
                  className="bg-green-500 hover:bg-green-600 text-white w-12 h-12 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onNext}
                  className="text-gray-400 hover:text-white"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>

            {/* Secondary Controls */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onRepeat}
                className={getRepeatColor()}
              >
                {getRepeatIcon()}
              </Button>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 flex-1 justify-end">
            {/* Queue */}
            <div className="hidden lg:block">
              <Button
                variant="ghost"
                size="icon"
                onClick={onShowQueue}
                className="text-gray-400 hover:text-white relative"
              >
                <Queue className="w-4 h-4" />
                {queue.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {queue.length}
                  </span>
                )}
              </Button>
            </div>

            {/* Volume Control */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleVolumeToggle}
                onMouseEnter={() => setShowVolumeSlider(true)}
                className="text-gray-400 hover:text-white"
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>

              <AnimatePresence>
                {showVolumeSlider && (
                  <motion.div
                    className="w-24"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0 }}
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <Slider
                      value={volume}
                      max={1}
                      step={0.01}
                      onChange={onVolumeChange}
                      className="w-full"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Advanced Controls */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className={`text-gray-400 hover:text-white ${isExpanded ? 'text-green-500' : ''}`}
              >
                <Settings className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onMiniPlayer}
                className="text-gray-400 hover:text-white"
              >
                <PictureInPicture className="w-4 h-4" />
              </Button>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAdvancedControls(!showAdvancedControls)}
                  className="text-gray-400 hover:text-white"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>

                <AnimatePresence>
                  {showAdvancedControls && (
                    <motion.div
                      className="absolute bottom-full right-0 mb-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 min-w-48"
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    >
                      <button
                        onClick={() => {
                          onShowLyrics?.();
                          setShowAdvancedControls(false);
                        }}
                        className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <Mic2 className="w-4 h-4" />
                        <span>Show lyrics</span>
                      </button>
                      <button
                        onClick={() => {
                          onShowVisualizer?.();
                          setShowAdvancedControls(false);
                        }}
                        className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Visualizer</span>
                      </button>
                      <button
                        onClick={() => {
                          // Cast functionality
                          setShowAdvancedControls(false);
                        }}
                        className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <Cast className="w-4 h-4" />
                        <span>Cast to device</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedPlayerBar;
