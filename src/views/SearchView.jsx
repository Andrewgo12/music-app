import { useState } from 'react';
import { Search, Play, Plus } from 'lucide-react';
// import { motion } from 'framer-motion'; // Not used
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import AdvancedSearch from '../components/advanced/AdvancedSearch';

const SearchView = ({
  onPlaySong,
  onPlayPlaylist,
  onAddToQueue,
  songs = [],
  artists = [],
  playlists = []
}) => {
  const [searchResults, setSearchResults] = useState({
    songs: [],
    artists: [],
    playlists: [],
    total: 0
  });
  const [activeTab, setActiveTab] = useState('all');

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'songs', label: `Songs (${searchResults.songs.length})` },
    { id: 'artists', label: `Artists (${searchResults.artists.length})` },
    { id: 'playlists', label: `Playlists (${searchResults.playlists.length})` }
  ];

  const SongResult = ({ song }) => (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 group">
      <img
        src={song.imageUrl || '/placeholder-album.jpg'}
        alt={song.title}
        className="w-12 h-12 rounded object-cover"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-white truncate">{song.title}</h3>
        <p className="text-sm text-gray-400 truncate">{song.artist} • {song.album}</p>
      </div>
      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onAddToQueue(song)}
          className="text-gray-400 hover:text-white"
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPlaySong(song)}
          className="text-gray-400 hover:text-white"
        >
          <Play className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const ArtistResult = ({ artist }) => (
    <Card hover className="group">
      <div className="relative">
        <img
          src={artist.imageUrl || '/placeholder-artist.jpg'}
          alt={artist.name}
          className="w-full h-40 object-cover rounded-full mx-auto mt-4"
          style={{ width: '120px', height: '120px' }}
        />
      </div>
      <Card.Content className="text-center p-4">
        <h3 className="font-medium text-white truncate">{artist.name}</h3>
        <p className="text-sm text-gray-400">Artist • {artist.genre}</p>
      </Card.Content>
    </Card>
  );

  const PlaylistResult = ({ playlist }) => (
    <Card hover onClick={() => onPlayPlaylist(playlist)} className="group">
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
            className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-200 rounded-full w-12 h-12"
          >
            <Play className="w-5 h-5 ml-0.5" />
          </Button>
        </div>
      </div>
      <Card.Content className="p-3">
        <h3 className="font-medium text-white truncate">{playlist.name}</h3>
        <p className="text-sm text-gray-400 truncate">
          {playlist.songIds?.length || 0} songs
        </p>
      </Card.Content>
    </Card>
  );

  const renderResults = () => {
    if (searchResults.total === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            {searchResults.total === 0 && searchResults.songs.length === 0 && searchResults.artists.length === 0 && searchResults.playlists.length === 0
              ? "Search for music"
              : "No results found"
            }
          </h3>
          <p className="text-gray-400">
            {searchResults.total === 0 && searchResults.songs.length === 0 && searchResults.artists.length === 0 && searchResults.playlists.length === 0
              ? "Find songs, artists, and playlists"
              : "Try searching for something else"
            }
          </p>
        </motion.div>
      );
    }

    const hasResults = searchResults.songs.length > 0 ||
      searchResults.artists.length > 0 ||
      searchResults.playlists.length > 0;

    if (!hasResults) {
      return (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
          <p className="text-gray-400">Try searching for something else</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'songs':
        return (
          <div className="space-y-2">
            {searchResults.songs.map((song) => (
              <SongResult key={song.id} song={song} />
            ))}
          </div>
        );

      case 'artists':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {searchResults.artists.map((artist) => (
              <ArtistResult key={artist.id} artist={artist} />
            ))}
          </div>
        );

      case 'playlists':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {searchResults.playlists.map((playlist) => (
              <PlaylistResult key={playlist.id} playlist={playlist} />
            ))}
          </div>
        );

      default: // 'all'
        return (
          <div className="space-y-8">
            {searchResults.songs.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-4">Songs</h2>
                <div className="space-y-2">
                  {searchResults.songs.slice(0, 5).map((song) => (
                    <SongResult key={song.id} song={song} />
                  ))}
                </div>
              </section>
            )}

            {searchResults.artists.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-4">Artists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {searchResults.artists.slice(0, 6).map((artist) => (
                    <ArtistResult key={artist.id} artist={artist} />
                  ))}
                </div>
              </section>
            )}

            {searchResults.playlists.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-4">Playlists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {searchResults.playlists.slice(0, 6).map((playlist) => (
                    <PlaylistResult key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              </section>
            )}
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      {/* Advanced Search */}
      <div className="mb-6">
        <AdvancedSearch
          onResults={handleSearchResults}
          songs={songs}
          artists={artists}
          playlists={playlists}
        />
      </div>

      {/* Tabs */}
      {searchResults.total > 0 && (
        <div className="flex space-x-6 mb-6 border-b border-gray-800">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-1 text-sm font-medium transition-colors ${activeTab === tab.id
                ? 'text-white border-b-2 border-green-500'
                : 'text-gray-400 hover:text-white'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      )}

      {/* Results */}
      {renderResults()}
    </div>
  );
};

export default SearchView;
