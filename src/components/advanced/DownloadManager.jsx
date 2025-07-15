import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Download,
  Pause,
  Play,
  X,
  CheckCircle,
  AlertCircle,
  Music,
  Trash2,
  RefreshCw
} from 'lucide-react';
import Button from '../ui/Button';
import { CircularMusicLoader } from '../animations/MusicLoadingAnimations';
import youtubeService from '../../services/youtubeService';

const DownloadManager = ({ isOpen, onClose }) => {
  const [downloads, setDownloads] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load existing downloads
      const existingDownloads = youtubeService.getAllDownloads();
      setDownloads(existingDownloads);

      // Set up polling for download updates
      const interval = setInterval(() => {
        const updatedDownloads = youtubeService.getAllDownloads();
        setDownloads(updatedDownloads);
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleCancelDownload = (downloadId) => {
    youtubeService.cancelDownload(downloadId);
  };

  const handleRetryDownload = async (download) => {
    try {
      await youtubeService.downloadAudio(download.videoId);
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  const handleRemoveDownload = (downloadId) => {
    setDownloads(prev => prev.filter(d => d.id !== downloadId));
  };

  const handleClearCompleted = () => {
    youtubeService.clearCompletedDownloads();
    setDownloads(prev => prev.filter(d =>
      d.status !== 'completed' && d.status !== 'failed'
    ));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'downloading':
        return <CircularMusicLoader size="small" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-gray-500" />;
      default:
        return <Download className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'downloading':
        return 'text-blue-500';
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'cancelled':
        return 'text-gray-500';
      default:
        return 'text-gray-400';
    }
  };

  const activeDownloads = downloads.filter(d => d.status === 'downloading').length;
  const completedDownloads = downloads.filter(d => d.status === 'completed').length;
  const failedDownloads = downloads.filter(d => d.status === 'failed').length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`fixed bottom-4 right-4 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 ${isMinimized ? 'w-80' : 'w-96'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-white">Download Manager</h3>
            {activeDownloads > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {activeDownloads}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-400 hover:text-white"
            >
              {isMinimized ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
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

        {!isMinimized && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            {/* Stats */}
            <div className="p-4 border-b border-gray-700">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-blue-500 font-semibold">{activeDownloads}</div>
                  <div className="text-xs text-gray-400">Active</div>
                </div>
                <div>
                  <div className="text-green-500 font-semibold">{completedDownloads}</div>
                  <div className="text-xs text-gray-400">Completed</div>
                </div>
                <div>
                  <div className="text-red-500 font-semibold">{failedDownloads}</div>
                  <div className="text-xs text-gray-400">Failed</div>
                </div>
              </div>
            </div>

            {/* Downloads List */}
            <div className="max-h-64 overflow-y-auto">
              {downloads.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No downloads yet</p>
                  <p className="text-sm">Start downloading music from YouTube</p>
                </div>
              ) : (
                <div className="space-y-2 p-4">
                  <AnimatePresence>
                    {downloads.map((download) => (
                      <motion.div
                        key={download.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg"
                      >
                        {/* Status Icon */}
                        <div className="flex-shrink-0">
                          {getStatusIcon(download.status)}
                        </div>

                        {/* Download Info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white truncate">
                            Video ID: {download.videoId}
                          </div>
                          <div className={`text-xs ${getStatusColor(download.status)} capitalize`}>
                            {download.status}
                            {download.status === 'downloading' && ` (${download.progress}%)`}
                          </div>

                          {/* Progress Bar */}
                          {download.status === 'downloading' && (
                            <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                              <motion.div
                                className="bg-blue-500 h-1 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${download.progress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-1">
                          {download.status === 'downloading' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCancelDownload(download.id)}
                              className="text-gray-400 hover:text-red-400 w-6 h-6"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}

                          {download.status === 'failed' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRetryDownload(download)}
                              className="text-gray-400 hover:text-blue-400 w-6 h-6"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </Button>
                          )}

                          {(download.status === 'completed' || download.status === 'failed' || download.status === 'cancelled') && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveDownload(download.id)}
                              className="text-gray-400 hover:text-red-400 w-6 h-6"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {downloads.length > 0 && (
              <div className="p-4 border-t border-gray-700">
                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearCompleted}
                    className="text-gray-400 hover:text-white"
                    disabled={completedDownloads === 0 && failedDownloads === 0}
                  >
                    Clear Completed
                  </Button>

                  <div className="text-xs text-gray-400">
                    {downloads.length} total downloads
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default DownloadManager;
