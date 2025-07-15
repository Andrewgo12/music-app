import React, { useState } from 'react';
// import { motion } from 'framer-motion'; // Not used
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Heart
} from 'lucide-react';
import Button from '../ui/Button';
import Slider from '../ui/Slider';
import VinylRecord from '../animations/VinylRecord';
import MusicVisualizer from '../animations/MusicVisualizer';

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
  formatTime
}) => {
  const [showControls, setShowControls] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  if (!currentSong) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-4 right-4 w-80 bg-gray-900/95 backdrop-blur-lg border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        drag
        dragConstraints={{
          top: -window.innerHeight + 200,
          left: -window.innerWidth + 320,
          right: 0,
          bottom: 0
        }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        whileDrag={{ scale: 1.05, rotate: 2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700/50">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400 font-medium">Now Playing</span>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onExpand}
              className="w-6 h-6 text-gray-400 hover:text-white"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-6 h-6 text-gray-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4">
          {/* Song Info */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              <VinylRecord
                isPlaying={isPlaying}
                albumArt={currentSong.imageUrl || '/placeholder-album.jpg'}
                size="small"
                showNeedle={false}
              />
            </div>

            <div className="flex-1 min-w-0">
              <motion.h3
                className="text-white text-sm font-medium truncate"
                key={currentSong.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {currentSong.title}
              </motion.h3>
              <motion.p
                className="text-gray-400 text-xs truncate"
                key={currentSong.artist}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {currentSong.artist}
              </motion.p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 text-gray-400 hover:text-red-400"
            >
              <Heart className="w-3 h-3" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
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

          {/* Controls */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {/* Playback Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onPrevious}
                    className="w-8 h-8 text-gray-400 hover:text-white"
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onPlayPause}
                      className="w-10 h-10 bg-white text-black hover:bg-gray-200 rounded-full"
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
                            <Pause className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="play"
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Play className="w-4 h-4 ml-0.5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onNext}
                    className="w-8 h-8 text-gray-400 hover:text-white"
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onVolumeChange(volume > 0 ? 0 : 0.7)}
                    className="w-6 h-6 text-gray-400 hover:text-white"
                  >
                    {volume === 0 ? (
                      <VolumeX className="w-3 h-3" />
                    ) : (
                      <Volume2 className="w-3 h-3" />
                    )}
                  </Button>

                  <Slider
                    value={volume}
                    max={1}
                    step={0.01}
                    onChange={onVolumeChange}
                    className="flex-1"
                  />
                </div>

                {/* Visualizer */}
                <div className="flex justify-center">
                  <MusicVisualizer
                    type="bars"
                    isPlaying={isPlaying}
                    size="small"
                    color="blue"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Drag Handle */}
        {isDragging && (
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-600 rounded-full" />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default MiniPlayer;
