import { useState, useEffect, useRef } from 'react';
// import { motion } from 'framer-motion'; // Not used
import {
  Music,
  Type,
  Download,
  Share2,
  Settings,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import Button from '../ui/Button';

const SyncedLyrics = ({
  song,
  currentTime,
  // isPlaying, // Not used currently
  onClose,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const [lyrics, setLyrics] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [fontSize, setFontSize] = useState(16);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const lyricsRef = useRef(null);
  const currentLineRef = useRef(null);

  // Mock lyrics data - in real app, this would come from API
  const mockLyrics = [
    { time: 0, text: "Welcome to this amazing song", translation: "Bienvenido a esta canción increíble" },
    { time: 5, text: "The melody flows like a river", translation: "La melodía fluye como un río" },
    { time: 10, text: "Through the valleys of our hearts", translation: "A través de los valles de nuestros corazones" },
    { time: 15, text: "Music brings us all together", translation: "La música nos une a todos" },
    { time: 20, text: "In this moment we are one", translation: "En este momento somos uno" },
    { time: 25, text: "Dancing to the rhythm of life", translation: "Bailando al ritmo de la vida" },
    { time: 30, text: "Every beat tells a story", translation: "Cada latido cuenta una historia" },
    { time: 35, text: "Of love, hope, and dreams", translation: "De amor, esperanza y sueños" },
    { time: 40, text: "Let the music set you free", translation: "Deja que la música te libere" },
    { time: 45, text: "And carry you to new heights", translation: "Y te lleve a nuevas alturas" }
  ];

  useEffect(() => {
    // Simulate loading lyrics
    setIsLoading(true);
    const timer = setTimeout(() => {
      setLyrics(mockLyrics);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [song, mockLyrics]); // Added missing dependency

  useEffect(() => {
    if (lyrics.length === 0) return;

    // Find current line based on time
    let newCurrentIndex = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        newCurrentIndex = i;
      } else {
        break;
      }
    }

    if (newCurrentIndex !== currentLineIndex) {
      setCurrentLineIndex(newCurrentIndex);
    }
  }, [currentTime, lyrics, currentLineIndex]);

  useEffect(() => {
    // Auto-scroll to current line
    if (currentLineRef.current && lyricsRef.current) {
      const container = lyricsRef.current;
      const currentLine = currentLineRef.current;

      const containerHeight = container.clientHeight;
      const lineTop = currentLine.offsetTop;
      const lineHeight = currentLine.clientHeight;

      const scrollTop = lineTop - containerHeight / 2 + lineHeight / 2;

      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }, [currentLineIndex]);

  const handleDownloadLyrics = () => {
    const lyricsText = lyrics.map(line =>
      `[${formatTime(line.time)}] ${line.text}`
    ).join('\n');

    const blob = new Blob([lyricsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${song.title} - ${song.artist}.lrc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareLyrics = () => {
    if (navigator.share) {
      navigator.share({
        title: `${song.title} - ${song.artist}`,
        text: lyrics[currentLineIndex]?.text || 'Check out these lyrics!',
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      const currentLine = lyrics[currentLineIndex]?.text || '';
      navigator.clipboard.writeText(`"${currentLine}" - ${song.title} by ${song.artist}`);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const LyricLine = ({ line, index, isActive, isPast }) => (
    <motion.div
      ref={isActive ? currentLineRef : null}
      className={`
        py-2 px-4 rounded-lg transition-all duration-300 cursor-pointer
        ${isActive
          ? 'bg-green-500/20 text-green-400 font-semibold scale-105'
          : isPast
            ? 'text-gray-500'
            : 'text-gray-300 hover:text-white'
        }
      `}
      style={{ fontSize: `${fontSize}px` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: isActive ? 1.05 : 1.02 }}
    >
      <div className="text-center">
        <p className="leading-relaxed">{line.text}</p>
        {showTranslation && line.translation && (
          <p className="text-sm opacity-70 mt-1 italic">
            {line.translation}
          </p>
        )}
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Music className="w-12 h-12 text-green-500 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-400">Loading lyrics...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`
        ${isFullscreen
          ? 'fixed inset-0 bg-black/95 z-50'
          : 'bg-gray-900 rounded-lg'
        }
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Type className="w-5 h-5 text-green-500" />
          <div>
            <h3 className="font-semibold text-white">{song.title}</h3>
            <p className="text-sm text-gray-400">{song.artist}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Font Size Controls */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              className="w-8 h-8 text-gray-400 hover:text-white"
            >
              <span className="text-xs">A-</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="w-8 h-8 text-gray-400 hover:text-white"
            >
              <span className="text-xs">A+</span>
            </Button>
          </div>

          {/* Translation Toggle */}
          <Button
            variant={showTranslation ? "primary" : "ghost"}
            size="icon"
            onClick={() => setShowTranslation(!showTranslation)}
            className="w-8 h-8"
          >
            <span className="text-xs">TR</span>
          </Button>

          {/* Download */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownloadLyrics}
            className="text-gray-400 hover:text-white"
          >
            <Download className="w-4 h-4" />
          </Button>

          {/* Share */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShareLyrics}
            className="text-gray-400 hover:text-white"
          >
            <Share2 className="w-4 h-4" />
          </Button>

          {/* Fullscreen Toggle */}
          {onToggleFullscreen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleFullscreen}
              className="text-gray-400 hover:text-white"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          )}

          {/* Close */}
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

      {/* Lyrics Container */}
      <div
        ref={lyricsRef}
        className={`
          overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800
          ${isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-96'}
        `}
      >
        <div className="p-6 space-y-4">
          {lyrics.length === 0 ? (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No lyrics available</h3>
              <p className="text-gray-400">Lyrics for this song are not available yet.</p>
            </div>
          ) : (
            <AnimatePresence>
              {lyrics.map((line, index) => (
                <LyricLine
                  key={index}
                  line={line}
                  index={index}
                  isActive={index === currentLineIndex}
                  isPast={index < currentLineIndex}
                  isFuture={index > currentLineIndex}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      {lyrics.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-800 rounded-full h-1">
            <motion.div
              className="bg-green-500 h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentLineIndex + 1) / lyrics.length) * 100}%`
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Line {currentLineIndex + 1} of {lyrics.length}</span>
            <span>{Math.round(((currentLineIndex + 1) / lyrics.length) * 100)}%</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SyncedLyrics;
