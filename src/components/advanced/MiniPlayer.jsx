import { useState, useEffect } from 'react';
import { motion, useDragControls, useMotionValue, useTransform } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import Button from '../ui/Button';
import Slider from '../ui/Slider';
import AudioVisualizer from './AudioVisualizer';

const MiniPlayer = ({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onExpand,
  onClose,
  formatTime,
  isVisible = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transform values for drag constraints
  const rotateX = useTransform(y, [-100, 100], [-10, 10]);
  const rotateY = useTransform(x, [-100, 100], [10, -10]);

  useEffect(() => {
    // Auto-hide volume slider after 3 seconds
    if (showVolumeSlider) {
      const timer = setTimeout(() => {
        setShowVolumeSlider(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showVolumeSlider]);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    if (onExpand) onExpand(!isExpanded);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  if (!isVisible || !currentSong) return null;

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-40"
      initial={{ opacity: 0, scale: 0.8, y: 100 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 100 }}
      style={{ x, y, rotateX, rotateY }}
      drag
      dragControls={dragControls}
      dragConstraints={{
        top: -window.innerHeight + 200,
        left: -window.innerWidth + 200,
        right: 0,
        bottom: 0
      }}
      dragElastic={0.1}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05, zIndex: 50 }}
    >
      <motion.div
        className={`bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        animate={{
          width: isExpanded ? 400 : 280,
          height: isExpanded ? 300 : 80
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Compact View */}
        {!isExpanded && (
          <div className="p-3 flex items-center space-x-3">
            {/* Album Art */}
            <div className="relative">
              <img
                src={currentSong.imageUrl || '/placeholder-album.jpg'}
                alt={currentSong.title}
                className="w-14 h-14 rounded-lg object-cover"
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                  <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-white animate-pulse" />
                    <div className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Song Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">
                {currentSong.title}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {currentSong.artist}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrevious}
                className="text-gray-400 hover:text-white w-8 h-8"
              >
                <SkipBack className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onPlayPause}
                className="bg-green-500 hover:bg-green-600 text-white w-8 h-8 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                className="text-gray-400 hover:text-white w-8 h-8"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {/* Expand/Close */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExpand}
                className="text-gray-400 hover:text-white w-6 h-6"
              >
                <Maximize2 className="w-3 h-3" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white w-6 h-6"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Expanded View */}
        {isExpanded && (
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Now Playing</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleExpand}
                  className="text-gray-400 hover:text-white w-6 h-6"
                >
                  <Minimize2 className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white w-6 h-6"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Album Art & Info */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={currentSong.imageUrl || '/placeholder-album.jpg'}
                  alt={currentSong.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  animate={isPlaying ? {
                    boxShadow: [
                      '0 0 0 0 rgba(16, 185, 129, 0.4)',
                      '0 0 0 10px rgba(16, 185, 129, 0)',
                      '0 0 0 0 rgba(16, 185, 129, 0)'
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {currentSong.title}
                </p>
                <p className="text-gray-400 text-sm truncate">
                  {currentSong.artist}
                </p>
                <p className="text-gray-500 text-xs truncate">
                  {currentSong.album}
                </p>
              </div>
            </div>

            {/* Visualizer */}
            <div className="h-16 rounded-lg overflow-hidden">
              <AudioVisualizer
                isPlaying={isPlaying}
                currentSong={currentSong}
                visualizerType="bars"
                className="h-full"
              />
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <Slider
                value={currentTime}
                max={duration || 100}
                onChange={onSeek}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrevious}
                className="text-gray-400 hover:text-white"
              >
                <SkipBack className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onPlayPause}
                className="bg-green-500 hover:bg-green-600 text-white w-12 h-12 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                className="text-gray-400 hover:text-white"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className="text-gray-400 hover:text-white"
              >
                <Volume2 className="w-4 h-4" />
              </Button>

              <motion.div
                className="flex-1"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{
                  opacity: showVolumeSlider ? 1 : 0,
                  scaleX: showVolumeSlider ? 1 : 0
                }}
                transition={{ duration: 0.2 }}
              >
                <Slider
                  value={volume}
                  max={1}
                  step={0.01}
                  onChange={onVolumeChange}
                  className="w-full"
                />
              </motion.div>

              <span className="text-xs text-gray-400 w-8 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Progress Bar (always visible at bottom) */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
          <motion.div
            className="h-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MiniPlayer;
