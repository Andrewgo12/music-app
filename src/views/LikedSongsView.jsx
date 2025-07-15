import React from 'react';
import { Heart, Play, Clock } from 'lucide-react';
import Button from '../components/ui/Button';

const LikedSongsView = ({ 
  songs = [],
  isPlaying,
  currentSong,
  onPlaySong,
  formatTime
}) => {
  // For now, we'll show all songs as "liked" since we don't have a like system yet
  const likedSongs = songs;

  const SongRow = ({ song, index }) => {
    const isCurrentSong = currentSong?.id === song.id;
    const isCurrentSongPlaying = isCurrentSong && isPlaying;

    return (
      <div 
        className={`grid grid-cols-12 gap-4 px-4 py-2 rounded-md hover:bg-gray-800 group ${
          isCurrentSong ? 'bg-gray-800' : ''
        }`}
      >
        {/* Track Number / Play Button */}
        <div className="col-span-1 flex items-center">
          <div className="w-4 text-center">
            {isCurrentSongPlaying ? (
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
            ) : (
              <span className="text-gray-400 text-sm group-hover:hidden">
                {index + 1}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onPlaySong(song, likedSongs, index)}
              className="hidden group-hover:flex w-8 h-8 text-white hover:text-green-500"
            >
              <Play className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Song Info */}
        <div className="col-span-5 flex items-center space-x-3 min-w-0">
          <img
            src={song.imageUrl || '/placeholder-album.jpg'}
            alt={song.title}
            className="w-10 h-10 rounded object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className={`font-medium truncate ${
              isCurrentSong ? 'text-green-500' : 'text-white'
            }`}>
              {song.title}
            </p>
            <p className="text-sm text-gray-400 truncate">{song.artist}</p>
          </div>
        </div>

        {/* Album */}
        <div className="col-span-3 flex items-center">
          <p className="text-sm text-gray-400 truncate">{song.album}</p>
        </div>

        {/* Date Added */}
        <div className="col-span-2 flex items-center">
          <p className="text-sm text-gray-400">
            {new Date(song.addedDate || Date.now()).toLocaleDateString()}
          </p>
        </div>

        {/* Duration */}
        <div className="col-span-1 flex items-center justify-end">
          <span className="text-sm text-gray-400">
            {formatTime(song.duration)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-end space-x-6 mb-8">
        <div className="w-60 h-60 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-lg flex items-center justify-center">
          <Heart className="w-20 h-20 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white uppercase tracking-wide">
            Playlist
          </p>
          <h1 className="text-6xl font-bold text-white mb-4">
            Liked Songs
          </h1>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Your favorite tracks</span>
            <span>•</span>
            <span>{likedSongs.length} songs</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4 mb-8">
        <Button
          onClick={() => likedSongs.length > 0 && onPlaySong(likedSongs[0], likedSongs, 0)}
          disabled={likedSongs.length === 0}
          className="bg-green-500 hover:bg-green-600 w-14 h-14 rounded-full"
        >
          <Play className="w-6 h-6 ml-1" />
        </Button>
      </div>

      {/* Songs List */}
      {likedSongs.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No liked songs yet</h3>
          <p className="text-gray-400">Songs you like will appear here</p>
        </div>
      ) : (
        <div>
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-gray-800 mb-2">
            <div className="col-span-1 text-center">
              <span className="text-sm text-gray-400">#</span>
            </div>
            <div className="col-span-5">
              <span className="text-sm text-gray-400 uppercase tracking-wide">Title</span>
            </div>
            <div className="col-span-3">
              <span className="text-sm text-gray-400 uppercase tracking-wide">Album</span>
            </div>
            <div className="col-span-2">
              <span className="text-sm text-gray-400 uppercase tracking-wide">Date Added</span>
            </div>
            <div className="col-span-1 text-right">
              <Clock className="w-4 h-4 text-gray-400 ml-auto" />
            </div>
          </div>

          {/* Songs */}
          <div className="space-y-1">
            {likedSongs.map((song, index) => (
              <SongRow key={song.id} song={song} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LikedSongsView;
