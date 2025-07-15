import React from 'react';
// import { motion } from 'framer-motion'; // Not used
import { Play, Plus, Download, Heart, MoreHorizontal, TrendingUp, Clock, Music } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import VinylRecord from '../components/animations/VinylRecord';
import MusicVisualizer from '../components/animations/MusicVisualizer';
import MusicLoadingAnimation from '../components/animations/MusicLoadingAnimations';
import { StaggeredContainer, StaggeredItem, HoverAnimation, FloatingAnimation } from '../components/animations/PageTransitions';
import { formatTime } from '../utils/helpers';

const HomeView = ({
  songs = [],
  playlists = [],
  recentlyPlayed = [],
  onPlaySong,
  onPlayPlaylist,
  onAddToQueue
}) => {
  const getRecentlyPlayedSongs = () => {
    return recentlyPlayed
      .map(songId => songs.find(song => song.id === songId))
      .filter(Boolean)
      .slice(0, 6);
  };

  const getPopularSongs = () => {
    return songs.slice(0, 8);
  };

  const getFeaturedPlaylists = () => {
    return playlists.slice(0, 6);
  };

  const SongCard = ({ song, showArtist = true, isPlaying = false }) => (
    <HoverAnimation scale={1.03} y={-8}>
      <Card hover onClick={() => onPlaySong(song)} className="group relative overflow-hidden">
        <div className="relative">
          {/* Vinyl Record Animation */}
          <div className="absolute top-2 left-2 z-10">
            <VinylRecord
              isPlaying={isPlaying}
              albumArt={song.imageUrl || '/placeholder-album.jpg'}
              size="small"
              showNeedle={false}
            />
          </div>

          <img
            src={song.imageUrl || '/placeholder-album.jpg'}
            alt={song.title}
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Hover Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Button
                variant="primary"
                size="icon"
                className="rounded-full w-12 h-12 shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlaySong(song);
                }}
              >
                <Play className="w-5 h-5 ml-0.5" />
              </Button>
            </motion.div>

            {/* Additional Controls */}
            <div className="absolute top-2 right-2 flex space-x-1">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToQueue(song);
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 bg-black/50 hover:bg-black/70 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle like
                  }}
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Playing Indicator */}
          {isPlaying && (
            <div className="absolute bottom-2 left-2">
              <MusicVisualizer type="bars" isPlaying={true} size="small" color="blue" />
            </div>
          )}
        </div>

        <Card.Content className="p-3">
          <motion.h3
            className="font-medium text-white truncate"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {song.title}
          </motion.h3>
          {showArtist && (
            <motion.p
              className="text-sm text-gray-400 truncate"
              initial={{ opacity: 0.6 }}
              whileHover={{ opacity: 0.8 }}
            >
              {song.artist}
            </motion.p>
          )}

          {/* Duration */}
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {formatTime(song.duration)}
            </span>
            {song.playCount && (
              <span className="flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {song.playCount.toLocaleString()}
              </span>
            )}
          </div>
        </Card.Content>
      </Card>
    </HoverAnimation>
  );

  const PlaylistCard = ({ playlist }) => (
    <HoverAnimation scale={1.03} y={-8}>
      <Card hover onClick={() => onPlayPlaylist(playlist)} className="group relative overflow-hidden">
        <div className="relative">
          <img
            src={playlist.imageUrl || '/placeholder-playlist.jpg'}
            alt={playlist.name}
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Hover Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Button
                variant="primary"
                size="icon"
                className="rounded-full w-12 h-12 shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayPlaylist(playlist);
                }}
              >
                <Play className="w-5 h-5 ml-0.5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Song Count Badge */}
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {playlist.songIds?.length || 0} songs
          </div>
        </div>

        <Card.Content className="p-3">
          <motion.h3
            className="font-medium text-white truncate"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {playlist.name}
          </motion.h3>
          <motion.p
            className="text-sm text-gray-400 truncate"
            initial={{ opacity: 0.6 }}
            whileHover={{ opacity: 0.8 }}
          >
            {playlist.description || `${playlist.songIds?.length || 0} songs`}
          </motion.p>

          {/* Additional Info */}
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span className="flex items-center">
              <Music className="w-3 h-3 mr-1" />
              {playlist.totalDuration ? formatTime(playlist.totalDuration) : 'Unknown'}
            </span>
            {playlist.followers && (
              <span>{playlist.followers.toLocaleString()} followers</span>
            )}
          </div>
        </Card.Content>
      </Card>
    </HoverAnimation>
  );

  return (
    <motion.div
      className="p-6 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Welcome Message */}
      <StaggeredContainer className="relative">
        <StaggeredItem>
          <div className="relative">
            <motion.h1
              className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
            </motion.h1>

            <motion.p
              className="text-gray-400 text-lg"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Welcome back to your music
            </motion.p>

            {/* Floating Music Notes */}
            <div className="absolute -top-4 -right-4">
              <FloatingAnimation amplitude={15} duration={4}>
                <MusicLoadingAnimation type="notes" size="small" />
              </FloatingAnimation>
            </div>
          </div>
        </StaggeredItem>
      </StaggeredContainer>

      {/* Recently Played with Enhanced Animations */}
      {recentlyPlayed.length > 0 && (
        <StaggeredContainer>
          <StaggeredItem>
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Clock className="w-6 h-6 mr-2 text-blue-500" />
                  Recently Played
                </h2>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" className="text-gray-400 hover:text-white">
                    View All
                  </Button>
                </motion.div>
              </div>

              <StaggeredContainer staggerDelay={0.1}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {getRecentlyPlayedSongs().map((song, index) => (
                    <StaggeredItem key={song.id} delay={index * 0.1}>
                      <SongCard song={song} />
                    </StaggeredItem>
                  ))}
                </div>
              </StaggeredContainer>
            </motion.section>
          </StaggeredItem>
        </StaggeredContainer>
      )}

      {/* Featured Playlists with Enhanced Animations */}
      <StaggeredContainer>
        <StaggeredItem>
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Music className="w-6 h-6 mr-2 text-green-500" />
                Your Playlists
              </h2>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" className="text-gray-400 hover:text-white flex items-center">
                  <Plus className="w-4 h-4 mr-1" />
                  Create Playlist
                </Button>
              </motion.div>
            </div>

            <StaggeredContainer staggerDelay={0.1}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {getFeaturedPlaylists().map((playlist, index) => (
                  <StaggeredItem key={playlist.id} delay={index * 0.1}>
                    <PlaylistCard playlist={playlist} />
                  </StaggeredItem>
                ))}
              </div>
            </StaggeredContainer>
          </motion.section>
        </StaggeredItem>
      </StaggeredContainer>

      {/* Popular Songs with Enhanced Animations */}
      <StaggeredContainer>
        <StaggeredItem>
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-red-500" />
                Popular Right Now
              </h2>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  View Charts
                </Button>
              </motion.div>
            </div>

            <StaggeredContainer staggerDelay={0.1}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {getPopularSongs().map((song, index) => (
                  <StaggeredItem key={song.id} delay={index * 0.1}>
                    <SongCard song={song} />
                  </StaggeredItem>
                ))}
              </div>
            </StaggeredContainer>
          </motion.section>
        </StaggeredItem>
      </StaggeredContainer>

      {/* Quick Actions */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Made for You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-purple-600 to-blue-600">
            <Card.Content className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Discover Weekly</h3>
              <p className="text-gray-200 mb-4">Your weekly mixtape of fresh music</p>
              <Button variant="secondary">
                <Play className="w-4 h-4 mr-2" />
                Play
              </Button>
            </Card.Content>
          </Card>

          <Card className="bg-gradient-to-br from-green-600 to-teal-600">
            <Card.Content className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Daily Mix</h3>
              <p className="text-gray-200 mb-4">Songs you love and new discoveries</p>
              <Button variant="secondary">
                <Play className="w-4 h-4 mr-2" />
                Play
              </Button>
            </Card.Content>
          </Card>

          <Card className="bg-gradient-to-br from-red-600 to-pink-600">
            <Card.Content className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Release Radar</h3>
              <p className="text-gray-200 mb-4">New releases from artists you follow</p>
              <Button variant="secondary">
                <Play className="w-4 h-4 mr-2" />
                Play
              </Button>
            </Card.Content>
          </Card>
        </div>
      </section>
    </motion.div>
  );
};

export default HomeView;
