// Advanced recommendation system for music discovery

export class RecommendationEngine {
  constructor(songs = [], playlists = [], recentlyPlayed = []) {
    this.songs = songs;
    this.playlists = playlists;
    this.recentlyPlayed = recentlyPlayed;
    this.userProfile = this.buildUserProfile();
  }

  // Build user profile based on listening history
  buildUserProfile() {
    const profile = {
      genres: {},
      artists: {},
      decades: {},
      tempo: { fast: 0, medium: 0, slow: 0 },
      timeOfDay: { morning: 0, afternoon: 0, evening: 0, night: 0 },
      totalPlays: 0
    };

    this.recentlyPlayed.forEach(songId => {
      const song = this.songs.find(s => s.id === songId);
      if (!song) return;

      profile.totalPlays++;

      // Genre preferences
      if (song.genre) {
        profile.genres[song.genre] = (profile.genres[song.genre] || 0) + 1;
      }

      // Artist preferences
      if (song.artist) {
        profile.artists[song.artist] = (profile.artists[song.artist] || 0) + 1;
      }

      // Decade preferences
      if (song.releaseYear) {
        const decade = Math.floor(song.releaseYear / 10) * 10;
        profile.decades[decade] = (profile.decades[decade] || 0) + 1;
      }

      // Tempo analysis (based on duration as proxy)
      if (song.duration) {
        if (song.duration < 180) profile.tempo.fast++;
        else if (song.duration < 240) profile.tempo.medium++;
        else profile.tempo.slow++;
      }
    });

    // Normalize scores
    Object.keys(profile.genres).forEach(genre => {
      profile.genres[genre] /= profile.totalPlays;
    });

    Object.keys(profile.artists).forEach(artist => {
      profile.artists[artist] /= profile.totalPlays;
    });

    return profile;
  }

  // Calculate similarity between two songs
  calculateSongSimilarity(song1, song2) {
    let similarity = 0;
    let factors = 0;

    // Genre similarity (40% weight)
    if (song1.genre && song2.genre) {
      similarity += song1.genre === song2.genre ? 0.4 : 0;
      factors++;
    }

    // Artist similarity (30% weight)
    if (song1.artist && song2.artist) {
      similarity += song1.artist === song2.artist ? 0.3 : 0;
      factors++;
    }

    // Year similarity (20% weight)
    if (song1.releaseYear && song2.releaseYear) {
      const yearDiff = Math.abs(song1.releaseYear - song2.releaseYear);
      const yearSimilarity = Math.max(0, 1 - yearDiff / 20); // 20-year window
      similarity += yearSimilarity * 0.2;
      factors++;
    }

    // Duration similarity (10% weight)
    if (song1.duration && song2.duration) {
      const durationDiff = Math.abs(song1.duration - song2.duration);
      const durationSimilarity = Math.max(0, 1 - durationDiff / 120); // 2-minute window
      similarity += durationSimilarity * 0.1;
      factors++;
    }

    return factors > 0 ? similarity : 0;
  }

  // Get recommendations based on a seed song
  getRecommendationsForSong(seedSong, limit = 10) {
    const recommendations = this.songs
      .filter(song => song.id !== seedSong.id)
      .map(song => ({
        song,
        score: this.calculateSongSimilarity(seedSong, song)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.song);

    return recommendations;
  }

  // Get personalized recommendations based on user profile
  getPersonalizedRecommendations(limit = 20) {
    if (this.userProfile.totalPlays === 0) {
      // New user - return popular songs
      return this.getPopularSongs(limit);
    }

    const recommendations = this.songs
      .filter(song => !this.recentlyPlayed.includes(song.id))
      .map(song => ({
        song,
        score: this.calculatePersonalizationScore(song)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.song);

    return recommendations;
  }

  // Calculate personalization score for a song
  calculatePersonalizationScore(song) {
    let score = 0;

    // Genre preference
    if (song.genre && this.userProfile.genres[song.genre]) {
      score += this.userProfile.genres[song.genre] * 0.4;
    }

    // Artist preference
    if (song.artist && this.userProfile.artists[song.artist]) {
      score += this.userProfile.artists[song.artist] * 0.3;
    }

    // Decade preference
    if (song.releaseYear) {
      const decade = Math.floor(song.releaseYear / 10) * 10;
      if (this.userProfile.decades[decade]) {
        score += (this.userProfile.decades[decade] / this.userProfile.totalPlays) * 0.2;
      }
    }

    // Add some randomness for discovery
    score += Math.random() * 0.1;

    return score;
  }

  // Get popular songs (fallback for new users)
  getPopularSongs(limit = 20) {
    // In a real app, this would be based on play counts, likes, etc.
    // For now, we'll use a simple shuffle
    return this.songs
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  }

  // Get recommendations for a playlist
  getPlaylistRecommendations(playlist, limit = 10) {
    const playlistSongs = playlist.songIds
      .map(id => this.songs.find(s => s.id === id))
      .filter(Boolean);

    if (playlistSongs.length === 0) {
      return this.getPersonalizedRecommendations(limit);
    }

    // Calculate average characteristics of the playlist
    const playlistProfile = this.analyzePlaylistCharacteristics(playlistSongs);
    
    const recommendations = this.songs
      .filter(song => !playlist.songIds.includes(song.id))
      .map(song => ({
        song,
        score: this.calculatePlaylistFitScore(song, playlistProfile)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.song);

    return recommendations;
  }

  // Analyze playlist characteristics
  analyzePlaylistCharacteristics(songs) {
    const profile = {
      genres: {},
      artists: {},
      avgYear: 0,
      avgDuration: 0
    };

    let totalYear = 0;
    let totalDuration = 0;
    let yearCount = 0;
    let durationCount = 0;

    songs.forEach(song => {
      // Genre distribution
      if (song.genre) {
        profile.genres[song.genre] = (profile.genres[song.genre] || 0) + 1;
      }

      // Artist distribution
      if (song.artist) {
        profile.artists[song.artist] = (profile.artists[song.artist] || 0) + 1;
      }

      // Average year
      if (song.releaseYear) {
        totalYear += song.releaseYear;
        yearCount++;
      }

      // Average duration
      if (song.duration) {
        totalDuration += song.duration;
        durationCount++;
      }
    });

    profile.avgYear = yearCount > 0 ? totalYear / yearCount : 0;
    profile.avgDuration = durationCount > 0 ? totalDuration / durationCount : 0;

    // Normalize genre and artist counts
    Object.keys(profile.genres).forEach(genre => {
      profile.genres[genre] /= songs.length;
    });

    Object.keys(profile.artists).forEach(artist => {
      profile.artists[artist] /= songs.length;
    });

    return profile;
  }

  // Calculate how well a song fits a playlist
  calculatePlaylistFitScore(song, playlistProfile) {
    let score = 0;

    // Genre fit
    if (song.genre && playlistProfile.genres[song.genre]) {
      score += playlistProfile.genres[song.genre] * 0.4;
    }

    // Artist fit
    if (song.artist && playlistProfile.artists[song.artist]) {
      score += playlistProfile.artists[song.artist] * 0.3;
    }

    // Year similarity
    if (song.releaseYear && playlistProfile.avgYear) {
      const yearDiff = Math.abs(song.releaseYear - playlistProfile.avgYear);
      const yearSimilarity = Math.max(0, 1 - yearDiff / 15);
      score += yearSimilarity * 0.2;
    }

    // Duration similarity
    if (song.duration && playlistProfile.avgDuration) {
      const durationDiff = Math.abs(song.duration - playlistProfile.avgDuration);
      const durationSimilarity = Math.max(0, 1 - durationDiff / 60);
      score += durationSimilarity * 0.1;
    }

    return score;
  }

  // Get discover weekly style recommendations
  getDiscoverWeekly(limit = 30) {
    const recommendations = [];
    const usedSongs = new Set();

    // 40% based on similar artists
    const artistRecs = this.getArtistBasedRecommendations(Math.floor(limit * 0.4));
    artistRecs.forEach(song => {
      if (!usedSongs.has(song.id)) {
        recommendations.push(song);
        usedSongs.add(song.id);
      }
    });

    // 30% based on similar genres
    const genreRecs = this.getGenreBasedRecommendations(Math.floor(limit * 0.3));
    genreRecs.forEach(song => {
      if (!usedSongs.has(song.id) && recommendations.length < limit) {
        recommendations.push(song);
        usedSongs.add(song.id);
      }
    });

    // 30% completely new discoveries
    const discoveryRecs = this.getDiscoveryRecommendations(limit - recommendations.length);
    discoveryRecs.forEach(song => {
      if (!usedSongs.has(song.id) && recommendations.length < limit) {
        recommendations.push(song);
        usedSongs.add(song.id);
      }
    });

    return recommendations;
  }

  // Get recommendations based on favorite artists
  getArtistBasedRecommendations(limit) {
    const favoriteArtists = Object.entries(this.userProfile.artists)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([artist]) => artist);

    return this.songs
      .filter(song => 
        favoriteArtists.includes(song.artist) && 
        !this.recentlyPlayed.includes(song.id)
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  }

  // Get recommendations based on favorite genres
  getGenreBasedRecommendations(limit) {
    const favoriteGenres = Object.entries(this.userProfile.genres)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);

    return this.songs
      .filter(song => 
        favoriteGenres.includes(song.genre) && 
        !this.recentlyPlayed.includes(song.id) &&
        !this.userProfile.artists[song.artist] // Exclude known artists
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  }

  // Get completely new discoveries
  getDiscoveryRecommendations(limit) {
    return this.songs
      .filter(song => 
        !this.recentlyPlayed.includes(song.id) &&
        !this.userProfile.artists[song.artist] &&
        (!song.genre || !this.userProfile.genres[song.genre])
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  }

  // Update user profile with new listening data
  updateProfile(songId) {
    if (!this.recentlyPlayed.includes(songId)) {
      this.recentlyPlayed.unshift(songId);
      // Keep only last 100 plays
      this.recentlyPlayed = this.recentlyPlayed.slice(0, 100);
      this.userProfile = this.buildUserProfile();
    }
  }
}
