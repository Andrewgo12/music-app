import { useState } from 'react';
import { Reorder } from 'framer-motion';
import {
  Play,
  Pause,
  X,
  GripVertical,
  MoreHorizontal,
  Shuffle,
  RotateCcw,
  Clock,
  Music
} from 'lucide-react';
import Button from '../ui/Button';
import { listItemAnimations, staggerContainer } from '../../utils/animations';

const QueueManager = ({
  queue = [],
  currentSong,
  currentIndex = 0,
  isPlaying,
  onPlaySong,
  onRemoveFromQueue,
  onReorderQueue,
  onClearQueue,
  onShuffleQueue,
  formatTime
}) => {
  const [showMenu, setShowMenu] = useState(null);

  const handleReorder = (newQueue) => {
    onReorderQueue(newQueue);
  };

  const QueueItem = ({ song, index, isDragging }) => {
    const isCurrentSong = currentSong?.id === song.id;
    const isCurrentSongPlaying = isCurrentSong && isPlaying;
    const isPastSong = index < currentIndex;

    return (
      <motion.div
        layout
        className={`
          flex items-center space-x-3 p-3 rounded-lg group cursor-pointer
          ${isCurrentSong ? 'bg-green-500/20 border border-green-500/30' : 'hover:bg-gray-800'}
          ${isPastSong ? 'opacity-60' : ''}
          ${isDragging ? 'shadow-lg z-10' : ''}
        `}
        variants={listItemAnimations}
        whileHover={listItemAnimations.hover}
        onClick={() => onPlaySong(song, queue, index)}
      >
        {/* Drag Handle */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
        </div>

        {/* Track Number / Play Indicator */}
        <div className="flex-shrink-0 w-8 flex items-center justify-center">
          {isCurrentSongPlaying ? (
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-green-500 animate-pulse" />
              <div className="w-1 h-4 bg-green-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-1 h-4 bg-green-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          ) : isCurrentSong ? (
            <Pause className="w-4 h-4 text-green-500" />
          ) : (
            <span className="text-sm text-gray-400 group-hover:hidden">
              {index + 1}
            </span>
          )}
          <Play className="w-4 h-4 text-white hidden group-hover:block" />
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <img
              src={song.imageUrl || '/placeholder-album.jpg'}
              alt={song.title}
              className="w-10 h-10 rounded object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className={`font-medium truncate ${isCurrentSong ? 'text-green-400' : 'text-white'
                }`}>
                {song.title}
              </p>
              <p className="text-sm text-gray-400 truncate">
                {song.artist}
              </p>
            </div>
          </div>
        </div>

        {/* Duration */}
        <div className="flex-shrink-0 text-sm text-gray-400">
          {formatTime(song.duration)}
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(showMenu === song.id ? null : song.id);
              }}
              className="text-gray-400 hover:text-white w-8 h-8"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>

            {showMenu === song.id && (
              <div className="absolute right-0 top-8 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-20 min-w-48">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromQueue(index);
                    setShowMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Remove from queue</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const totalDuration = queue.reduce((total, song) => total + (song.duration || 0), 0);
  const remainingDuration = queue.slice(currentIndex).reduce((total, song) => total + (song.duration || 0), 0);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Queue</h2>
            <p className="text-sm text-gray-400">
              {queue.length} songs • {formatTime(totalDuration)}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onShuffleQueue}
              className="text-gray-400 hover:text-white"
              title="Shuffle queue"
            >
              <Shuffle className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClearQueue}
              className="text-gray-400 hover:text-red-400"
              title="Clear queue"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Queue Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-gray-400 mb-1">
              <Clock className="w-4 h-4" />
              <span>Remaining</span>
            </div>
            <p className="text-white font-medium">{formatTime(remainingDuration)}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-gray-400 mb-1">
              <Music className="w-4 h-4" />
              <span>Up Next</span>
            </div>
            <p className="text-white font-medium">{Math.max(0, queue.length - currentIndex - 1)} songs</p>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Music className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Queue is empty</h3>
            <p className="text-gray-400">Add songs to start building your queue</p>
          </div>
        ) : (
          <motion.div
            className="p-4 space-y-1"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <Reorder.Group
              axis="y"
              values={queue}
              onReorder={handleReorder}
              className="space-y-1"
            >
              {queue.map((song, index) => (
                <Reorder.Item
                  key={song.id}
                  value={song}
                  className="list-none"
                  whileDrag={{ scale: 1.02, zIndex: 10 }}
                >
                  <QueueItem
                    song={song}
                    index={index}
                    isDragging={false}
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </motion.div>
        )}
      </div>

      {/* Now Playing */}
      {currentSong && (
        <div className="p-4 border-t border-gray-800 bg-gray-800/50">
          <div className="flex items-center space-x-3">
            <img
              src={currentSong.imageUrl || '/placeholder-album.jpg'}
              alt={currentSong.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">Now Playing</p>
              <p className="text-sm text-green-400 truncate">{currentSong.title}</p>
              <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1 h-4 bg-green-500 animate-pulse" />
              <div className="w-1 h-4 bg-green-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-1 h-4 bg-green-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueManager;
