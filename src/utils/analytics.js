// Advanced analytics and statistics system

export class MusicAnalytics {
  constructor() {
    this.events = this.loadEvents();
    this.sessions = this.loadSessions();
    this.currentSession = this.createSession();
  }

  // Load events from localStorage
  loadEvents() {
    const stored = localStorage.getItem('music_analytics_events');
    return stored ? JSON.parse(stored) : [];
  }

  // Load sessions from localStorage
  loadSessions() {
    const stored = localStorage.getItem('music_analytics_sessions');
    return stored ? JSON.parse(stored) : [];
  }

  // Save events to localStorage
  saveEvents() {
    localStorage.setItem('music_analytics_events', JSON.stringify(this.events));
  }

  // Save sessions to localStorage
  saveSessions() {
    localStorage.setItem('music_analytics_sessions', JSON.stringify(this.sessions));
  }

  // Create a new session
  createSession() {
    return {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      endTime: null,
      duration: 0,
      songsPlayed: 0,
      skips: 0,
      searches: 0,
      playlistsCreated: 0,
      events: []
    };
  }

  // Track an event
  trackEvent(eventType, data = {}) {
    const event = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: eventType,
      timestamp: new Date().toISOString(),
      sessionId: this.currentSession.id,
      data
    };

    this.events.push(event);
    this.currentSession.events.push(event);

    // Update session stats
    this.updateSessionStats(eventType, data);

    // Keep only last 10000 events
    if (this.events.length > 10000) {
      this.events = this.events.slice(-10000);
    }

    this.saveEvents();
    this.saveSessions();
  }

  // Update session statistics
  updateSessionStats(eventType) {
    // const data = arguments[1]; // Not used currently
    switch (eventType) {
      case 'song_play':
        this.currentSession.songsPlayed++;
        break;
      case 'song_skip':
        this.currentSession.skips++;
        break;
      case 'search':
        this.currentSession.searches++;
        break;
      case 'playlist_create':
        this.currentSession.playlistsCreated++;
        break;
    }
  }

  // End current session
  endSession() {
    this.currentSession.endTime = new Date().toISOString();
    this.currentSession.duration = new Date() - new Date(this.currentSession.startTime);
    this.sessions.push(this.currentSession);
    this.saveSessions();
    this.currentSession = this.createSession();
  }

  // Get listening statistics
  getListeningStats(timeRange = '7d') {
    const cutoffDate = this.getCutoffDate(timeRange);
    const relevantEvents = this.events.filter(event =>
      new Date(event.timestamp) >= cutoffDate
    );

    const playEvents = relevantEvents.filter(event => event.type === 'song_play');
    const skipEvents = relevantEvents.filter(event => event.type === 'song_skip');

    // Calculate total listening time
    const totalListeningTime = playEvents.reduce((total, event) => {
      const duration = event.data.duration || 0;
      const skipEvent = skipEvents.find(skip =>
        skip.data.songId === event.data.songId &&
        new Date(skip.timestamp) > new Date(event.timestamp)
      );

      if (skipEvent) {
        const playTime = new Date(skipEvent.timestamp) - new Date(event.timestamp);
        return total + Math.min(playTime / 1000, duration);
      }

      return total + duration;
    }, 0);

    // Top artists
    const artistCounts = {};
    playEvents.forEach(event => {
      const artist = event.data.artist;
      if (artist) {
        artistCounts[artist] = (artistCounts[artist] || 0) + 1;
      }
    });

    const topArtists = Object.entries(artistCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([artist, plays]) => ({ artist, plays }));

    // Top genres
    const genreCounts = {};
    playEvents.forEach(event => {
      const genre = event.data.genre;
      if (genre) {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      }
    });

    const topGenres = Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([genre, plays]) => ({ genre, plays }));

    // Listening patterns by hour
    const hourlyPattern = new Array(24).fill(0);
    playEvents.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hourlyPattern[hour]++;
    });

    // Skip rate
    const skipRate = playEvents.length > 0 ? (skipEvents.length / playEvents.length) * 100 : 0;

    return {
      totalSongs: playEvents.length,
      totalListeningTime: Math.round(totalListeningTime),
      averageSessionLength: this.getAverageSessionLength(timeRange),
      skipRate: Math.round(skipRate * 100) / 100,
      topArtists,
      topGenres,
      hourlyPattern,
      uniqueArtists: Object.keys(artistCounts).length,
      uniqueGenres: Object.keys(genreCounts).length
    };
  }

  // Get average session length
  getAverageSessionLength(timeRange = '7d') {
    const cutoffDate = this.getCutoffDate(timeRange);
    const relevantSessions = this.sessions.filter(session =>
      new Date(session.startTime) >= cutoffDate && session.endTime
    );

    if (relevantSessions.length === 0) return 0;

    const totalDuration = relevantSessions.reduce((total, session) =>
      total + session.duration, 0
    );

    return Math.round(totalDuration / relevantSessions.length / 1000 / 60); // in minutes
  }

  // Get cutoff date for time range
  getCutoffDate(timeRange) {
    const now = new Date();
    switch (timeRange) {
      case '1d':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '1y':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(0);
    }
  }

  // Get daily listening data for charts
  getDailyListeningData(days = 30) {
    const data = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const dayEvents = this.events.filter(event => {
        const eventDate = new Date(event.timestamp);
        return eventDate >= dayStart && eventDate < dayEnd && event.type === 'song_play';
      });

      const totalTime = dayEvents.reduce((total, event) => {
        return total + (event.data.duration || 0);
      }, 0);

      data.push({
        date: dayStart.toISOString().split('T')[0],
        songs: dayEvents.length,
        minutes: Math.round(totalTime / 60)
      });
    }

    return data;
  }

  // Get mood analysis based on genres and tempo
  getMoodAnalysis(timeRange = '7d') {
    const cutoffDate = this.getCutoffDate(timeRange);
    const playEvents = this.events.filter(event =>
      event.type === 'song_play' && new Date(event.timestamp) >= cutoffDate
    );

    const moodMap = {
      'Pop': 'happy',
      'Rock': 'energetic',
      'Hip Hop': 'confident',
      'Electronic': 'focused',
      'Jazz': 'relaxed',
      'Classical': 'peaceful',
      'Country': 'nostalgic',
      'R&B': 'romantic',
      'Alternative': 'contemplative'
    };

    const moodCounts = {};
    playEvents.forEach(event => {
      const genre = event.data.genre;
      const mood = moodMap[genre] || 'neutral';
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });

    return Object.entries(moodCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([mood, count]) => ({ mood, count }));
  }

  // Get discovery rate (new vs familiar music)
  getDiscoveryRate(timeRange = '7d') {
    const cutoffDate = this.getCutoffDate(timeRange);
    const playEvents = this.events.filter(event =>
      event.type === 'song_play' && new Date(event.timestamp) >= cutoffDate
    );

    const songCounts = {};
    playEvents.forEach(event => {
      const songId = event.data.songId;
      songCounts[songId] = (songCounts[songId] || 0) + 1;
    });

    const newSongs = Object.values(songCounts).filter(count => count === 1).length;
    const totalUniqueSongs = Object.keys(songCounts).length;

    return totalUniqueSongs > 0 ? (newSongs / totalUniqueSongs) * 100 : 0;
  }

  // Export analytics data
  exportData() {
    const data = {
      events: this.events,
      sessions: this.sessions,
      stats: this.getListeningStats('all'),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `music-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Clear all analytics data
  clearData() {
    this.events = [];
    this.sessions = [];
    this.currentSession = this.createSession();
    localStorage.removeItem('music_analytics_events');
    localStorage.removeItem('music_analytics_sessions');
  }

  // Get performance metrics
  getPerformanceMetrics() {
    const loadEvents = this.events.filter(event => event.type === 'app_load');
    const errorEvents = this.events.filter(event => event.type === 'error');

    const averageLoadTime = loadEvents.length > 0
      ? loadEvents.reduce((total, event) => total + (event.data.loadTime || 0), 0) / loadEvents.length
      : 0;

    return {
      averageLoadTime: Math.round(averageLoadTime),
      errorRate: this.events.length > 0 ? (errorEvents.length / this.events.length) * 100 : 0,
      totalSessions: this.sessions.length,
      averageSessionDuration: this.getAverageSessionLength('all')
    };
  }
}

// Create singleton instance
export const analytics = new MusicAnalytics();

// Convenience functions
export const trackEvent = (eventType, data) => analytics.trackEvent(eventType, data);
export const getListeningStats = (timeRange) => analytics.getListeningStats(timeRange);
export const getDailyListeningData = (days) => analytics.getDailyListeningData(days);
export const getMoodAnalysis = (timeRange) => analytics.getMoodAnalysis(timeRange);
export const getDiscoveryRate = (timeRange) => analytics.getDiscoveryRate(timeRange);
