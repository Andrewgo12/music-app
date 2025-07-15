import { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Calendar, Clock, Music, User, Disc } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { searchSongs, searchArtists, searchPlaylists } from '../../utils/dataManager';

const AdvancedSearch = ({
  onResults,
  songs = [],
  artists = [],
  playlists = []
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all', // 'all', 'songs', 'artists', 'playlists'
    genre: '',
    year: '',
    duration: { min: '', max: '' },
    sortBy: 'relevance', // 'relevance', 'title', 'artist', 'year', 'duration'
    sortOrder: 'asc' // 'asc', 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Get unique genres and years for filter options
  const filterOptions = useMemo(() => {
    const genres = [...new Set(songs.map(song => song.genre).filter(Boolean))].sort();
    const years = [...new Set(songs.map(song => song.releaseYear).filter(Boolean))].sort((a, b) => b - a);

    return { genres, years };
  }, [songs]);

  useEffect(() => {
    if (query.trim() || Object.values(filters).some(v => v && v !== 'all' && v !== 'relevance' && v !== 'asc')) {
      performSearch();
    } else {
      onResults({ songs: [], artists: [], playlists: [], total: 0 });
    }
  }, [query, filters, onResults, performSearch, applyFilters, artists, playlists, songs, sortResults]); // Added missing dependencies

  const performSearch = useCallback(async () => {
    setIsSearching(true);

    try {
      let results = {
        songs: [],
        artists: [],
        playlists: []
      };

      // Basic search
      if (query.trim()) {
        if (filters.type === 'all' || filters.type === 'songs') {
          results.songs = searchSongs(query);
        }
        if (filters.type === 'all' || filters.type === 'artists') {
          results.artists = searchArtists(query);
        }
        if (filters.type === 'all' || filters.type === 'playlists') {
          results.playlists = searchPlaylists(query);
        }
      } else {
        // If no query, get all items for filtering
        if (filters.type === 'all' || filters.type === 'songs') {
          results.songs = songs;
        }
        if (filters.type === 'all' || filters.type === 'artists') {
          results.artists = artists;
        }
        if (filters.type === 'all' || filters.type === 'playlists') {
          results.playlists = playlists;
        }
      }

      // Apply filters
      results.songs = applyFilters(results.songs);

      // Sort results
      results.songs = sortResults(results.songs);

      const total = results.songs.length + results.artists.length + results.playlists.length;
      onResults({ ...results, total });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [query, filters, onResults]);

  const applyFilters = useCallback((songs) => {
    let filtered = [...songs];

    // Genre filter
    if (filters.genre) {
      filtered = filtered.filter(song =>
        song.genre?.toLowerCase() === filters.genre.toLowerCase()
      );
    }

    // Year filter
    if (filters.year) {
      filtered = filtered.filter(song =>
        song.releaseYear === parseInt(filters.year)
      );
    }

    // Duration filter
    if (filters.duration.min) {
      filtered = filtered.filter(song =>
        song.duration >= parseInt(filters.duration.min) * 60
      );
    }
    if (filters.duration.max) {
      filtered = filtered.filter(song =>
        song.duration <= parseInt(filters.duration.max) * 60
      );
    }

    return filtered;
  }, [filters]);

  const sortResults = useCallback((songs) => {
    const sorted = [...songs];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'artist':
          comparison = a.artist.localeCompare(b.artist);
          break;
        case 'year':
          comparison = (a.releaseYear || 0) - (b.releaseYear || 0);
          break;
        case 'duration':
          comparison = (a.duration || 0) - (b.duration || 0);
          break;
        case 'relevance':
        default:
          // For relevance, we could implement a scoring system
          // For now, just maintain original order
          return 0;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return sorted;
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateDurationFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      duration: {
        ...prev.duration,
        [type]: value
      }
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      genre: '',
      year: '',
      duration: { min: '', max: '' },
      sortBy: 'relevance',
      sortOrder: 'asc'
    });
  };

  const hasActiveFilters = Object.values(filters).some(v =>
    v && v !== 'all' && v !== 'relevance' && v !== 'asc'
  ) || Object.values(filters.duration).some(v => v);

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search songs, artists, albums..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon={Search}
            className="text-lg py-3"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
            </div>
          )}
        </div>

        <Button
          variant={showFilters ? 'primary' : 'outline'}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-green-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-800 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={clearFilters}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Content Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Music className="w-4 h-4 inline mr-1" />
                    Content Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => updateFilter('type', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="all">All</option>
                    <option value="songs">Songs</option>
                    <option value="artists">Artists</option>
                    <option value="playlists">Playlists</option>
                  </select>
                </div>

                {/* Genre */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Disc className="w-4 h-4 inline mr-1" />
                    Genre
                  </label>
                  <select
                    value={filters.genre}
                    onChange={(e) => updateFilter('genre', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="">All Genres</option>
                    {filterOptions.genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Release Year
                  </label>
                  <select
                    value={filters.year}
                    onChange={(e) => updateFilter('year', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    <option value="">All Years</option>
                    {filterOptions.years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sort By
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => updateFilter('sortBy', e.target.value)}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="title">Title</option>
                      <option value="artist">Artist</option>
                      <option value="year">Year</option>
                      <option value="duration">Duration</option>
                    </select>
                    <select
                      value={filters.sortOrder}
                      onChange={(e) => updateFilter('sortOrder', e.target.value)}
                      className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    >
                      <option value="asc">↑</option>
                      <option value="desc">↓</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Duration Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Duration (minutes)
                </label>
                <div className="flex items-center space-x-3">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.duration.min}
                    onChange={(e) => updateDurationFilter('min', e.target.value)}
                    className="w-20"
                  />
                  <span className="text-gray-400">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.duration.max}
                    onChange={(e) => updateDurationFilter('max', e.target.value)}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearch;
