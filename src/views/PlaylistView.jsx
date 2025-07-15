import { useState } from 'react';
import {
  Play,
  Pause,
  Plus,
  MoreHorizontal,
  Heart,
  Download,
  Share,
  // Edit, // Not used
  Trash2,
  Clock
} from 'lucide-react';
// import Card from '../components/ui/Card'; // Not used
import Button from '../components/ui/Button';

const PlaylistView = ({
  playlist,
  songs = [],
  isPlaying,
  currentSong,
  onPlaySong,
  onPlayPlaylist,
  onAddToQueue,
  onRemoveFromPlaylist,
  // onEditPlaylist, // Not used currently
  // onDeletePlaylist, // Not used currently
  formatTime
}) => {
  const [showMenu, setShowMenu] = useState(null);

  if (!playlist) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Playlist not found</h2>
        <p className="text-gray-400">The playlist you're looking for doesn't exist.</p>
      </div>
    );
  }

  const playlistSongs = playlist.songIds
    ?.map(songId => songs.find(song => song.id === songId))
    .filter(Boolean) || [];

  const totalDuration = playlistSongs.reduce((total, song) => total + (song.duration || 0), 0);
  const isCurrentPlaylistPlaying = currentSong && playlistSongs.some(song => song.id === currentSong.id);

  const SongRow = ({ song, index }) => {
    const isCurrentSong = currentSong?.id === song.id;
    const isCurrentSongPlaying = isCurrentSong && isPlaying;

    return (
      <div
        className={`grid grid-cols-12 gap-4 px-4 py-2 rounded-md hover:bg-gray-800 group ${isCurrentSong ? 'bg-gray-800' : ''
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
              onClick={() => onPlaySong(song, playlistSongs, index)}
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
            <p className={`font-medium truncate ${isCurrentSong ? 'text-green-500' : 'text-white'
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

        {/* Duration & Actions */}
        <div className="col-span-1 flex items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white w-8 h-8"
          >
            <Heart className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-400 w-12 text-right">
            {formatTime(song.duration)}
          </span>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMenu(showMenu === song.id ? null : song.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white w-8 h-8"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>

            {showMenu === song.id && (
              <div className="absolute right-0 top-8 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-10 min-w-48">
                <button
                  onClick={() => {
                    onAddToQueue(song);
                    setShowMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to queue</span>
                </button>
                <button
                  onClick={() => {
                    onRemoveFromPlaylist(playlist.id, song.id);
                    setShowMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove from playlist</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Playlist Header */}
      <div className="flex items-end space-x-6 mb-8">
        <img
          src={playlist.imageUrl || '/placeholder-playlist.jpg'}
          alt={playlist.name}
          className="w-60 h-60 rounded-lg shadow-lg object-cover"
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white uppercase tracking-wide">
            {playlist.isPublic ? 'Public' : 'Private'} Playlist
          </p>
          <h1 className="text-6xl font-bold text-white mb-4 truncate">
            {playlist.name}
          </h1>
          {playlist.description && (
            <p className="text-gray-300 mb-4">{playlist.description}</p>
          )}
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>{playlist.createdBy}</span>
            <span>•</span>
            <span>{playlistSongs.length} songs</span>
            {totalDuration > 0 && (
              <>
                <span>•</span>
                <span>{Math.floor(totalDuration / 60)} min</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4 mb-8">
        <Button
          onClick={() => onPlayPlaylist(playlist)}
          disabled={playlistSongs.length === 0}
          className="bg-green-500 hover:bg-green-600 w-14 h-14 rounded-full"
        >
          {isCurrentPlaylistPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-1" />
          )}
        </Button>

        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Heart className="w-6 h-6" />
        </Button>

        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Download className="w-6 h-6" />
        </Button>

        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <Share className="w-6 h-6" />
        </Button>

        <div className="relative">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <MoreHorizontal className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Songs List */}
      {playlistSongs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-white mb-2">This playlist is empty</h3>
          <p className="text-gray-400 mb-6">Search for songs and add them to this playlist</p>
          <Button className="bg-green-500 hover:bg-green-600">
            Find songs
          </Button>
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
            {playlistSongs.map((song, index) => (
              <SongRow key={song.id} song={song} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistView;
