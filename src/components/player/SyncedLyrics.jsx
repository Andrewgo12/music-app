import React, { useState, useEffect, useRef } from 'react';
// import { motion } from 'framer-motion'; // Not used
import {
  X,
  Mic2,
  Volume2,
  VolumeX,
  Settings,
  Download,
  Share,
  Heart
} from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const SyncedLyrics = ({
  song,
  currentTime = 0,
  isPlaying = false,
  onClose
}) => {
  const [fontSize, setFontSize] = useState(16);
  const [showSettings, setShowSettings] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const lyricsRef = useRef(null);

  // Sample lyrics if none provided
  const defaultLyrics = [
    { time: 0, text: "♪ Instrumental ♪", translation: "" },
    { time: 10, text: "This is a sample lyric line", translation: "" },
    { time: 15, text: "Synchronized with the music", translation: "" },
    { time: 20, text: "Add real lyrics to see them here", translation: "" },
    { time: 25, text: "♪ Music continues ♪", translation: "" }
  ];

  const lyrics = song?.lyrics && song.lyrics.length > 0 ? song.lyrics : defaultLyrics;

  // Find current lyric line based on time
  useEffect(() => {
    const currentIndex = lyrics.findIndex((line, index) => {
      const nextLine = lyrics[index + 1];
      return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
    });

    if (currentIndex !== -1 && currentIndex !== currentLineIndex) {
      setCurrentLineIndex(currentIndex);
    }
  }, [currentTime, lyrics, currentLineIndex]);

  // Auto-scroll to current line
  useEffect(() => {
    if (lyricsRef.current && currentLineIndex >= 0) {
      const currentElement = lyricsRef.current.children[currentLineIndex];
      if (currentElement) {
        currentElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [currentLineIndex]);

  const LyricLine = ({ line, index, isActive, isPast }) => (
    <motion.div
      className={`
        py-3 px-4 rounded-lg transition-all duration-300 cursor-pointer
        ${isActive
          ? 'bg-blue-900/30 border border-blue-500/30 text-white scale-105'
          : isPast
            ? 'text-gray-500 hover:text-gray-400'
            : 'text-gray-400 hover:text-gray-300'
        }
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isActive ? 1.02 : 1
      }}
      transition={{
        duration: 0.3,
        delay: index * 0.05
      }}
      whileHover={{ scale: 1.01 }}
    >
      <div className={`
        text-lg leading-relaxed font-medium
        ${isActive ? 'text-xl font-semibold' : ''}
      `}>
        {line.text}
      </div>

      {line.translation && (
        <div className="text-sm text-gray-500 mt-1 italic">
          {line.translation}
        </div>
      )}

      {isActive && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );

  return (
    <Modal isOpen={true} onClose={onClose} size="xl">
      <div className="bg-gray-900 rounded-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800/50">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={song?.imageUrl || '/placeholder-album.jpg'}
                alt={song?.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              {isPlaying && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-white flex items-center">
                <Mic2 className="w-5 h-5 mr-2 text-blue-500" />
                Lyrics
              </h2>
              <p className="text-sm text-gray-400">
                {song?.title} • {song?.artist}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className={`${showSettings ? 'text-blue-400' : 'text-gray-400'} hover:text-white`}
            >
              <Settings className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
            >
              <Share className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-red-400"
            >
              <Heart className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-b border-gray-700 bg-gray-800/30 overflow-hidden"
            >
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Font Size</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                      className="text-gray-400 hover:text-white"
                    >
                      A-
                    </Button>
                    <span className="text-sm text-white w-8 text-center">{fontSize}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                      className="text-gray-400 hover:text-white"
                    >
                      A+
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lyrics Content */}
        <div
          ref={lyricsRef}
          className="flex-1 overflow-y-auto p-6 space-y-2"
          style={{ fontSize: `${fontSize}px` }}
        >
          {lyrics.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Mic2 className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No lyrics available</h3>
              <p className="text-sm text-gray-500">
                Lyrics for this song are not available yet
              </p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <AnimatePresence>
                {lyrics.map((line, index) => (
                  <LyricLine
                    key={index}
                    line={line}
                    index={index}
                    isActive={index === currentLineIndex}
                    isPast={index < currentLineIndex}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              Line {currentLineIndex + 1} of {lyrics.length}
            </span>
            <span>
              {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SyncedLyrics;
