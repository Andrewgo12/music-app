import React from 'react';
import { Play } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const AlbumsView = ({ 
  songs = [],
  onPlaySong
}) => {
  // Group songs by album
  const albums = songs.reduce((acc, song) => {
    const albumKey = `${song.album}-${song.artist}`;
    if (!acc[albumKey]) {
      acc[albumKey] = {
        id: albumKey,
        title: song.album,
        artist: song.artist,
        imageUrl: song.imageUrl,
        releaseYear: song.releaseYear,
        songs: []
      };
    }
    acc[albumKey].songs.push(song);
    return acc;
  }, {});

  const albumList = Object.values(albums);

  const AlbumCard = ({ album }) => (
    <Card hover className="group">
      <div className="relative">
        <img
          src={album.imageUrl || '/placeholder-album.jpg'}
          alt={album.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
          <Button
            variant="primary"
            size="icon"
            onClick={() => album.songs.length > 0 && onPlaySong(album.songs[0], album.songs, 0)}
            className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-200 rounded-full w-12 h-12"
          >
            <Play className="w-5 h-5 ml-0.5" />
          </Button>
        </div>
      </div>
      <Card.Content className="p-4">
        <h3 className="font-medium text-white truncate">{album.title}</h3>
        <p className="text-sm text-gray-400 truncate">{album.artist}</p>
        <p className="text-xs text-gray-500">
          {album.releaseYear} • {album.songs.length} songs
        </p>
      </Card.Content>
    </Card>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Albums</h1>
        <p className="text-gray-400">{albumList.length} albums</p>
      </div>

      {albumList.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-white mb-2">No albums found</h3>
          <p className="text-gray-400">Add some songs to see albums here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {albumList.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AlbumsView;
