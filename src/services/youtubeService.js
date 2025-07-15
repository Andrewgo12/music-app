// YouTube Integration and Download Service
import { formatTime } from '../utils/helpers';

class YouTubeService {
  constructor() {
    this.downloadQueue = new Map();
    this.downloadProgress = new Map();
    this.cache = new Map();
    this.apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || '';
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
  }

  // Extract video ID from YouTube URL
  extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  // Get video information from YouTube API
  async getVideoInfo(videoId) {
    try {
      const response = await fetch(
        `${this.baseUrl}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch video info');
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        return this.formatVideoInfo(video);
      }

      throw new Error('Video not found');
    } catch (error) {
      console.error('Error fetching video info:', error);
      throw error;
    }
  }

  // Format video information
  formatVideoInfo(video) {
    const snippet = video.snippet;
    const contentDetails = video.contentDetails;
    const statistics = video.statistics;

    // Parse ISO 8601 duration (PT4M33S -> 273 seconds)
    const duration = this.parseDuration(contentDetails.duration);

    return {
      id: video.id,
      title: snippet.title,
      description: snippet.description,
      channelTitle: snippet.channelTitle,
      publishedAt: snippet.publishedAt,
      thumbnails: {
        default: snippet.thumbnails.default?.url,
        medium: snippet.thumbnails.medium?.url,
        high: snippet.thumbnails.high?.url,
        maxres: snippet.thumbnails.maxres?.url
      },
      duration: duration,
      formattedDuration: formatTime(duration),
      viewCount: parseInt(statistics.viewCount || 0),
      likeCount: parseInt(statistics.likeCount || 0),
      tags: snippet.tags || [],
      categoryId: snippet.categoryId
    };
  }

  // Parse ISO 8601 duration to seconds
  parseDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);
    return hours * 3600 + minutes * 60 + seconds;
  }

  // Search YouTube videos
  async searchVideos(query, maxResults = 10) {
    try {
      const response = await fetch(
        `${this.baseUrl}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to search videos');
      }

      const data = await response.json();

      return data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        thumbnails: item.snippet.thumbnails,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }));
    } catch (error) {
      console.error('Error searching videos:', error);
      throw error;
    }
  }

  // Download audio from YouTube (simulated - in real app would use backend service)
  async downloadAudio(videoId, onProgress = () => { }) {
    return new Promise((resolve, reject) => {
      // Simulate download process
      let progress = 0;
      const downloadId = `download_${videoId}_${Date.now()}`;

      this.downloadQueue.set(downloadId, {
        videoId,
        status: 'downloading',
        progress: 0,
        startTime: Date.now()
      });

      const interval = setInterval(() => {
        progress += Math.random() * 15;

        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          // Simulate successful download
          const audioBlob = new Blob(['fake audio data'], { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(audioBlob);

          this.downloadQueue.set(downloadId, {
            videoId,
            status: 'completed',
            progress: 100,
            audioUrl,
            completedAt: Date.now()
          });

          this.cache.set(videoId, audioUrl);
          resolve({ audioUrl, downloadId });
        } else {
          this.downloadQueue.set(downloadId, {
            ...this.downloadQueue.get(downloadId),
            progress: Math.floor(progress)
          });
        }

        onProgress(Math.floor(progress));
      }, 100);

      // Simulate potential failure
      setTimeout(() => {
        if (Math.random() < 0.05) { // 5% chance of failure
          clearInterval(interval);
          this.downloadQueue.set(downloadId, {
            ...this.downloadQueue.get(downloadId),
            status: 'failed',
            error: 'Download failed'
          });
          reject(new Error('Download failed'));
        }
      }, 1000);
    });
  }

  // Get download status
  getDownloadStatus(downloadId) {
    return this.downloadQueue.get(downloadId);
  }

  // Get all downloads
  getAllDownloads() {
    return Array.from(this.downloadQueue.entries()).map(([id, data]) => ({
      id,
      ...data
    }));
  }

  // Cancel download
  cancelDownload(downloadId) {
    const download = this.downloadQueue.get(downloadId);
    if (download && download.status === 'downloading') {
      this.downloadQueue.set(downloadId, {
        ...download,
        status: 'cancelled'
      });
      return true;
    }
    return false;
  }

  // Clear completed downloads
  clearCompletedDownloads() {
    for (const [id, download] of this.downloadQueue.entries()) {
      if (download.status === 'completed' || download.status === 'failed') {
        this.downloadQueue.delete(id);
      }
    }
  }

  // Get cached audio URL
  getCachedAudio(videoId) {
    return this.cache.get(videoId);
  }

  // Clear cache
  clearCache() {
    // Revoke object URLs to free memory
    for (const url of this.cache.values()) {
      URL.revokeObjectURL(url);
    }
    this.cache.clear();
  }

  // Convert YouTube video to song format
  async convertToSong(videoUrl, additionalInfo = {}) {
    const videoId = this.extractVideoId(videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    try {
      const videoInfo = await this.getVideoInfo(videoId);

      // Extract artist and title from video title
      const { artist, title } = this.parseTitle(videoInfo.title);

      return {
        id: `youtube_${videoId}`,
        title: title || videoInfo.title,
        shortDescription: videoInfo.description.substring(0, 200) + '...',
        artists: [artist || videoInfo.channelTitle],
        primaryArtist: artist || videoInfo.channelTitle,
        album: additionalInfo.album || 'YouTube Import',
        albumArt: videoInfo.thumbnails.high || videoInfo.thumbnails.medium,
        duration: videoInfo.duration,
        genre: additionalInfo.genre || 'Unknown',
        subGenres: [],
        releaseYear: new Date(videoInfo.publishedAt).getFullYear(),
        youtubeUrl: videoUrl,
        youtubeVideoId: videoId,
        lyrics: [],
        mood: additionalInfo.mood || 'Unknown',
        energy: 0.5,
        danceability: 0.5,
        valence: 0.5,
        tempo: 120,
        key: 'Unknown',
        tags: videoInfo.tags.slice(0, 5),
        playCount: videoInfo.viewCount,
        likes: videoInfo.likeCount,
        isExplicit: false,
        language: 'Unknown',
        country: 'Unknown',
        source: 'youtube'
      };
    } catch (error) {
      console.error('Error converting YouTube video:', error);
      throw error;
    }
  }

  // Parse title to extract artist and song name
  parseTitle(title) {
    // Common patterns for YouTube music titles
    const patterns = [
      /^(.+?)\s*-\s*(.+?)(?:\s*\(.*\))?(?:\s*\[.*\])?$/,  // Artist - Song
      /^(.+?)\s*–\s*(.+?)(?:\s*\(.*\))?(?:\s*\[.*\])?$/,  // Artist – Song
      /^(.+?)\s*:\s*(.+?)(?:\s*\(.*\))?(?:\s*\[.*\])?$/,  // Artist : Song
      /^(.+?)\s*\|\s*(.+?)(?:\s*\(.*\))?(?:\s*\[.*\])?$/   // Artist | Song
    ];

    for (const pattern of patterns) {
      const match = title.match(pattern);
      if (match) {
        return {
          artist: match[1].trim(),
          title: match[2].trim()
        };
      }
    }

    // If no pattern matches, return the full title
    return {
      artist: null,
      title: title.trim()
    };
  }

  // Batch download multiple videos
  async batchDownload(videoIds, onProgress = () => { }) {
    const downloads = [];
    let completed = 0;

    for (const videoId of videoIds) {
      try {
        const result = await this.downloadAudio(videoId, (progress) => {
          onProgress(videoId, progress, completed, videoIds.length);
        });
        downloads.push({ videoId, success: true, result });
        completed++;
      } catch (error) {
        downloads.push({ videoId, success: false, error: error.message });
        completed++;
      }
    }

    return downloads;
  }
}

// Create singleton instance
const youtubeService = new YouTubeService();

export default youtubeService;
