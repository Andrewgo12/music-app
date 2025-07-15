import React from 'react';
import { Play } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const ArtistsView = ({ 
  artists = [],
  songs = [],
  onPlaySong
}) => {
  const getArtistSongs = (artistName) => {
    return songs.filter(song => song.artist === artistName);
  };

  const ArtistCard = ({ artist }) => {
    const artistSongs = getArtistSongs(artist.name);
    
    return (
      <Card hover className="group">
        <div className="relative">
          <img
            src={artist.imageUrl || '/placeholder-artist.jpg'}
            alt={artist.name}
            className="w-full h-48 object-cover rounded-full mx-auto mt-6"
            style={{ width: '150px', height: '150px' }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
            <Button
              variant="primary"
              size="icon"
              onClick={() => artistSongs.length > 0 && onPlaySong(artistSongs[0], artistSongs, 0)}
              className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-200 rounded-full w-12 h-12"
            >
              <Play className="w-5 h-5 ml-0.5" />
            </Button>
          </div>
        </div>
        <Card.Content className="text-center p-4">
          <h3 className="font-medium text-white truncate">{artist.name}</h3>
          <p className="text-sm text-gray-400">Artist</p>
          <p className="text-xs text-gray-500">{artistSongs.length} songs</p>
        </Card.Content>
      </Card>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Artists</h1>
        <p className="text-gray-400">{artists.length} artists</p>
      </div>

      {artists.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-white mb-2">No artists found</h3>
          <p className="text-gray-400">Add some songs to see artists here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistsView;
