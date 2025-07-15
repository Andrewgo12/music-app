import React, { useState } from 'react';
// import { AnimatePresence } from 'framer-motion'; // Not used
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Heart,
  MoreHorizontal,
  Maximize2,
  List,
  Mic2,
  Download
} from 'lucide-react';
import Button from '../ui/Button';
import Slider from '../ui/Slider';
import VinylRecord from '../animations/VinylRecord';
import MusicVisualizer from '../animations/MusicVisualizer';

const PlayerBar = ({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  shuffle,
  repeat,
  isLiked = false,
  queue = [],
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleShuffle,
  onToggleRepeat,
  onLike,
  onShowQueue,
  onShowLyrics,
  // onShowVisualizer, // Not used currently
  onMiniPlayer,
  formatTime
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [isExpanded] = useState(false); // Used in className
  if (!currentSong) {
    return (
      <motion.div
        className="h-20 bg-gray-900 border-t border-gray-800 flex items-center justify-center"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-gray-400">No song selected</p>
      </motion.div>
    );
  }

  const getRepeatIcon = () => {
    if (repeat === 'one') return <Repeat className="w-4 h-4" />;
    return <Repeat className="w-4 h-4" />;
  };

  return (
    <motion.div
      className={`${isExpanded ? 'h-32' : 'h-20'} bg-gray-900 border-t border-gray-800 px-4 transition-all duration-300`}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Visualizer Bar */}
      <AnimatePresence>
        {showVisualizer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="py-2 border-b border-gray-800"
          >
            <MusicVisualizer
              type="spectrum"
              isPlaying={isPlaying}
              size="small"
              color="blue"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between h-20">
        {/* Current Song Info with Vinyl Animation */}
        <div className="flex items-center space-x-3 w-1/4 min-w-0">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <VinylRecord
              isPlaying={isPlaying}
              albumArt={currentSong.imageUrl || '/placeholder-album.jpg'}
              size="small"
              showNeedle={false}
            />
          </motion.div>

          <div className="min-w-0 flex-1">
            <motion.p
              className="text-white text-sm font-medium truncate"
              key={currentSong.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {currentSong.title}
            </motion.p>
            <motion.p
              className="text-gray-400 text-xs truncate"
              key={currentSong.artist}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {currentSong.artist}
            </motion.p>
          </div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onLike}
              className={`${isLiked ? 'text-red-500' : 'text-gray-400'} hover:text-red-400 transition-colors`}
            >
              <motion.div
                animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </motion.div>
            </Button>
          </motion.div>
        </div>

        {/* Enhanced Player Controls */}
        <div className="flex flex-col items-center space-y-2 w-1/2 max-w-md">
          {/* Control Buttons with Animations */}
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleShuffle}
                className={`${shuffle ? 'text-green-500' : 'text-gray-400'} hover:text-white transition-colors`}
              >
                <motion.div
                  animate={shuffle ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Shuffle className="w-4 h-4" />
                </motion.div>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrevious}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Enhanced Play/Pause Button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={isPlaying ? {
                boxShadow: [
                  '0 0 0 0 rgba(255, 255, 255, 0.7)',
                  '0 0 0 10px rgba(255, 255, 255, 0)',
                  '0 0 0 0 rgba(255, 255, 255, 0)'
                ]
              } : {}}
              transition={{
                boxShadow: { duration: 1.5, repeat: Infinity },
                scale: { duration: 0.2 }
              }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={onPlayPause}
                className="bg-white text-black hover:bg-gray-200 w-10 h-10 rounded-full shadow-lg"
              >
                <AnimatePresence mode="wait">
                  {isPlaying ? (
                    <motion.div
                      key="pause"
                      initial={{ scale: 0, rotate: 90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Pause className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="play"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Play className="w-5 h-5 ml-0.5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleRepeat}
                className={`${repeat !== 'none' ? 'text-green-500' : 'text-gray-400'} hover:text-white transition-colors`}
              >
                <motion.div
                  animate={repeat !== 'none' ? { rotate: [0, 360] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {getRepeatIcon()}
                </motion.div>
              </Button>
            </motion.div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="flex items-center space-x-2 w-full">
            <motion.span
              className="text-xs text-gray-400 w-10 text-right font-mono"
              key={currentTime}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {formatTime(currentTime)}
            </motion.span>

            <div className="flex-1 relative">
              <Slider
                value={currentTime}
                max={duration || 100}
                onChange={onSeek}
                className="flex-1"
              />
              {/* Progress glow effect */}
              {isPlaying && (
                <motion.div
                  className="absolute top-1/2 left-0 h-1 bg-blue-500 rounded-full opacity-30"
                  style={{ width: `${(currentTime / (duration || 100)) * 100}%` }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>

            <motion.span
              className="text-xs text-gray-400 w-10 font-mono"
              key={duration}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {formatTime(duration)}
            </motion.span>
          </div>
        </div>

        {/* Enhanced Volume and Additional Controls */}
        <div className="flex items-center space-x-3 w-1/4 justify-end">
          {/* Additional Controls */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowVisualizer(!showVisualizer)}
              className={`${showVisualizer ? 'text-blue-500' : 'text-gray-400'} hover:text-white transition-colors`}
            >
              <Mic2 className="w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onShowQueue}
              className="text-gray-400 hover:text-white transition-colors relative"
            >
              <List className="w-4 h-4" />
              {queue.length > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {queue.length}
                </motion.span>
              )}
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onShowLyrics}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Mic2 className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Volume Control */}
          <div
            className="flex items-center space-x-2 relative"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onVolumeChange(volume > 0 ? 0 : 0.7)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <AnimatePresence mode="wait">
                  {volume === 0 ? (
                    <motion.div
                      key="muted"
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: -180 }}
                      transition={{ duration: 0.2 }}
                    >
                      <VolumeX className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="volume"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Volume2 className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            <AnimatePresence>
              {showVolumeSlider && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 80 }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <Slider
                    value={volume}
                    max={1}
                    step={0.01}
                    onChange={onVolumeChange}
                    className="w-20"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Expand/Mini Player Toggle */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onMiniPlayer}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerBar;
