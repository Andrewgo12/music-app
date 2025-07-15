import React, { useState } from 'react';
import { Play, Plus, MoreHorizontal, Grid, List } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const LibraryView = ({
  playlists = [],
  songs = [],
  onPlayPlaylist,
  onCreatePlaylist,
  // onEditPlaylist, // Not used currently
  // onDeletePlaylist // Not used currently
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'name', 'creator'

  const sortedPlaylists = [...playlists].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'creator':
        return a.createdBy.localeCompare(b.createdBy);
      case 'recent':
      default:
        return new Date(b.updatedDate) - new Date(a.updatedDate);
    }
  });

  const getPlaylistSongs = (playlist) => {
    return playlist.songIds
      ?.map(songId => songs.find(song => song.id === songId))
      .filter(Boolean) || [];
  };

  const PlaylistGridCard = ({ playlist }) => {
    const playlistSongs = getPlaylistSongs(playlist);

    return (
      <Card hover className="group">
        <div className="relative">
          <img
            src={playlist.imageUrl || '/placeholder-playlist.jpg'}
            alt={playlist.name}
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
            <Button
              variant="primary"
              size="icon"
              onClick={() => onPlayPlaylist(playlist)}
              className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-200 rounded-full w-12 h-12"
            >
              <Play className="w-5 h-5 ml-0.5" />
            </Button>
          </div>
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 text-white hover:bg-black hover:bg-opacity-50"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Card.Content className="p-3">
          <h3 className="font-medium text-white truncate">{playlist.name}</h3>
          <p className="text-sm text-gray-400 truncate">
            {playlistSongs.length} songs
          </p>
          {playlist.description && (
            <p className="text-xs text-gray-500 truncate mt-1">
              {playlist.description}
            </p>
          )}
        </Card.Content>
      </Card>
    );
  };

  const PlaylistListItem = ({ playlist }) => {
    const playlistSongs = getPlaylistSongs(playlist);

    return (
      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 group">
        <img
          src={playlist.imageUrl || '/placeholder-playlist.jpg'}
          alt={playlist.name}
          className="w-12 h-12 rounded object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate">{playlist.name}</h3>
          <p className="text-sm text-gray-400 truncate">
            {playlistSongs.length} songs • {playlist.createdBy}
          </p>
        </div>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPlayPlaylist(playlist)}
            className="text-gray-400 hover:text-white"
          >
            <Play className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Your Library</h1>
          <p className="text-gray-400">{playlists.length} playlists</p>
        </div>
        <Button onClick={onCreatePlaylist} className="bg-green-500 hover:bg-green-600">
          <Plus className="w-4 h-4 mr-2" />
          Create Playlist
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-1 text-sm"
          >
            <option value="recent">Recently Updated</option>
            <option value="name">Name</option>
            <option value="creator">Creator</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Playlists */}
      {playlists.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Create your first playlist</h3>
          <p className="text-gray-400 mb-6">It's easy, we'll help you</p>
          <Button onClick={onCreatePlaylist} className="bg-green-500 hover:bg-green-600">
            Create Playlist
          </Button>
        </div>
      ) : (
        <div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {sortedPlaylists.map((playlist) => (
                <PlaylistGridCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedPlaylists.map((playlist) => (
                <PlaylistListItem key={playlist.id} playlist={playlist} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LibraryView;
