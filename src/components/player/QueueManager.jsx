import React, { useState } from 'react';
// import { motion } from 'framer-motion'; // Not used
import {
  X,
  Play,
  Pause,
  Trash2,
  GripVertical,
  Shuffle,
  RotateCcw,
  Music,
  Clock
} from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import VinylRecord from '../animations/VinylRecord';

const QueueManager = ({
  isOpen,
  onClose,
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
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const newQueue = [...queue];
    const draggedSong = newQueue[draggedItem];
    newQueue.splice(draggedItem, 1);
    newQueue.splice(dropIndex, 0, draggedSong);

    onReorderQueue(newQueue);
    setDraggedItem(null);
  };

  const QueueItem = ({ song, index, isCurrentSong }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={`
        flex items-center space-x-3 p-3 rounded-lg group cursor-pointer
        ${isCurrentSong ? 'bg-blue-900/30 border border-blue-500/30' : 'hover:bg-gray-800'}
      `}
      draggable
      onDragStart={(e) => handleDragStart(e, index)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, index)}
      onClick={() => onPlaySong(song, queue, index)}
    >
      {/* Drag Handle */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-gray-500" />
      </div>

      {/* Song Info */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="relative">
          {isCurrentSong ? (
            <VinylRecord
              isPlaying={isPlaying}
              albumArt={song.imageUrl || '/placeholder-album.jpg'}
              size="small"
              showNeedle={false}
            />
          ) : (
            <img
              src={song.imageUrl || '/placeholder-album.jpg'}
              alt={song.title}
              className="w-10 h-10 rounded object-cover"
            />
          )}

          {isCurrentSong && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isCurrentSong ? 'text-blue-400' : 'text-white'}`}>
            {song.title}
          </p>
          <p className="text-xs text-gray-400 truncate">{song.artist}</p>
        </div>

        <div className="text-xs text-gray-500 flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {formatTime(song.duration)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onPlaySong(song, queue, index);
          }}
          className="w-6 h-6 text-gray-400 hover:text-white"
        >
          {isCurrentSong && isPlaying ? (
            <Pause className="w-3 h-3" />
          ) : (
            <Play className="w-3 h-3" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onRemoveFromQueue(index);
          }}
          className="w-6 h-6 text-gray-400 hover:text-red-400"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </motion.div>
  );

  const totalDuration = queue.reduce((total, song) => total + (song.duration || 0), 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="bg-gray-900 rounded-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <Music className="w-5 h-5 mr-2 text-blue-500" />
              Queue
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {queue.length} songs • {formatTime(totalDuration)}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onShuffleQueue}
              className="text-gray-400 hover:text-white"
              disabled={queue.length < 2}
            >
              <Shuffle className="w-4 h-4 mr-1" />
              Shuffle
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onClearQueue}
              className="text-gray-400 hover:text-red-400"
              disabled={queue.length === 0}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear
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

        {/* Queue List */}
        <div className="flex-1 overflow-y-auto p-4">
          {queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Music className="w-16 h-16 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">Queue is empty</h3>
              <p className="text-sm text-gray-500">
                Add songs to your queue to see them here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {queue.map((song, index) => (
                  <QueueItem
                    key={`${song.id}-${index}`}
                    song={song}
                    index={index}
                    isCurrentSong={currentSong && song.id === currentSong.id && index === currentIndex}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        {queue.length > 0 && (
          <div className="p-4 border-t border-gray-700 bg-gray-800/50">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>
                Playing {currentIndex + 1} of {queue.length}
              </span>
              <span>
                {queue.length - currentIndex - 1} songs remaining
              </span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default QueueManager;
