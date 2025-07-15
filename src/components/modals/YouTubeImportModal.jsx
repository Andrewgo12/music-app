import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion'; // Not used
import {
  X,
  Youtube,
  Download,
  Search,
  Play,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  Music
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { CircularMusicLoader } from '../animations/MusicLoadingAnimations';
import youtubeService from '../../services/youtubeService';

const YouTubeImportModal = ({ isOpen, onClose, onImport }) => {
  const [url, setUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('url'); // 'url' or 'search'
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setSearchQuery('');
      setVideoInfo(null);
      setSearchResults([]);
      setError('');
      setDownloadProgress(0);
      setIsDownloading(false);
    }
  }, [isOpen]);

  const validateYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    if (!validateYouTubeUrl(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setVideoInfo(null);

    try {
      const videoId = youtubeService.extractVideoId(url);
      const info = await youtubeService.getVideoInfo(videoId);
      setVideoInfo(info);
    } catch (error) {
      setError('Failed to fetch video information. Please check the URL and try again.');
      console.error('Error fetching video info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setIsSearching(true);
    setError('');
    setSearchResults([]);

    try {
      const results = await youtubeService.searchVideos(searchQuery, 10);
      setSearchResults(results);

      if (results.length === 0) {
        setError('No videos found for your search query');
      }
    } catch (error) {
      setError('Failed to search videos. Please try again.');
      console.error('Error searching videos:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImport = async (videoData) => {
    setIsDownloading(true);
    setDownloadProgress(0);
    setError('');

    try {
      // Convert video data to song format
      const songData = await youtubeService.convertToSong(videoData.url || `https://www.youtube.com/watch?v=${videoData.id}`);

      // Simulate download progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setDownloadProgress(100);

      // Wait a bit to show completion
      await new Promise(resolve => setTimeout(resolve, 500));

      // Call the import callback
      await onImport(songData);

      // Close modal
      onClose();

    } catch (error) {
      setError('Failed to import video. Please try again.');
      console.error('Error importing video:', error);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const VideoCard = ({ video, showImportButton = true }) => (
    <motion.div
      className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex space-x-3">
        <div className="relative flex-shrink-0">
          <img
            src={video.thumbnails?.medium || video.thumbnails?.default}
            alt={video.title}
            className="w-24 h-18 object-cover rounded"
            onError={(e) => {
              e.target.src = '/placeholder-video.jpg';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded">
            <Play className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium text-sm line-clamp-2 mb-1">
            {video.title}
          </h4>
          <p className="text-gray-400 text-xs mb-2">{video.channelTitle}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {video.formattedDuration && (
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {video.formattedDuration}
                </span>
              )}
              {video.viewCount && (
                <span>{video.viewCount.toLocaleString()} views</span>
              )}
            </div>

            {showImportButton && (
              <Button
                size="sm"
                onClick={() => handleImport(video)}
                disabled={isDownloading}
                className="bg-red-600 hover:bg-red-700"
              >
                <Download className="w-3 h-3 mr-1" />
                Import
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="bg-gray-900 rounded-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Import from YouTube</h2>
              <p className="text-sm text-gray-400">Add music from YouTube to your library</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isDownloading}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('url')}
            className={`
              flex-1 px-6 py-3 text-sm font-medium transition-colors
              ${activeTab === 'url'
                ? 'text-white border-b-2 border-red-500 bg-gray-800'
                : 'text-gray-400 hover:text-white'
              }
            `}
          >
            Import by URL
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`
              flex-1 px-6 py-3 text-sm font-medium transition-colors
              ${activeTab === 'search'
                ? 'text-white border-b-2 border-red-500 bg-gray-800'
                : 'text-gray-400 hover:text-white'
              }
            `}
          >
            Search YouTube
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'url' ? (
              <motion.div
                key="url-tab"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {/* URL Input Form */}
                <form onSubmit={handleUrlSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      YouTube URL
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="flex-1"
                        disabled={isLoading || isDownloading}
                      />
                      <Button
                        type="submit"
                        disabled={isLoading || isDownloading || !url.trim()}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isLoading ? (
                          <CircularMusicLoader size="small" />
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Fetch
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>

                {/* Video Info */}
                {videoInfo && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <VideoCard video={videoInfo} />
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="search-tab"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Search Form */}
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Search Query
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for songs, artists, or albums..."
                        className="flex-1"
                        disabled={isSearching || isDownloading}
                      />
                      <Button
                        type="submit"
                        disabled={isSearching || isDownloading || !searchQuery.trim()}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isSearching ? (
                          <CircularMusicLoader size="small" />
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Search
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Search Results</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {searchResults.map((video, index) => (
                        <motion.div
                          key={video.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <VideoCard video={video} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-center space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Download Progress */}
          {isDownloading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-400 font-medium">Importing...</span>
                <span className="text-blue-400 text-sm">{Math.round(downloadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${downloadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Supported: YouTube videos and music</span>
            <span>High quality audio extraction</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default YouTubeImportModal;
