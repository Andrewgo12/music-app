import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion'; // Not used
import {
  X,
  BarChart3,
  TrendingUp,
  Clock,
  Music,
  Headphones,
  Calendar,
  Award,
  Heart,
  Play,
  Download,
  Users
} from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const AnalyticsDashboard = ({ isOpen, onClose }) => {
  const [timeRange, setTimeRange] = useState('week');
  // const [activeMetric, setActiveMetric] = useState('listening'); // Not used currently

  // Mock analytics data
  const [analytics] = useState({
    listening: {
      totalTime: 2847, // minutes
      sessionsCount: 156,
      averageSession: 18.2,
      topGenres: [
        { name: 'Rock', percentage: 35, time: 996 },
        { name: 'Pop', percentage: 28, time: 797 },
        { name: 'Electronic', percentage: 20, time: 569 },
        { name: 'Jazz', percentage: 17, time: 485 }
      ],
      dailyListening: [
        { day: 'Mon', minutes: 420 },
        { day: 'Tue', minutes: 380 },
        { day: 'Wed', minutes: 450 },
        { day: 'Thu', minutes: 390 },
        { day: 'Fri', minutes: 520 },
        { day: 'Sat', minutes: 380 },
        { day: 'Sun', minutes: 307 }
      ]
    },
    topSongs: [
      { title: 'Bohemian Rhapsody', artist: 'Queen', plays: 47, time: 278 },
      { title: 'Imagine', artist: 'John Lennon', plays: 42, time: 128 },
      { title: 'Hotel California', artist: 'Eagles', plays: 38, time: 248 },
      { title: 'Billie Jean', artist: 'Michael Jackson', plays: 35, time: 171 },
      { title: 'Smells Like Teen Spirit', artist: 'Nirvana', plays: 31, time: 155 }
    ],
    topArtists: [
      { name: 'Queen', plays: 89, time: 445 },
      { name: 'The Beatles', plays: 76, time: 312 },
      { name: 'Pink Floyd', plays: 65, time: 387 },
      { name: 'Led Zeppelin', plays: 58, time: 298 },
      { name: 'Eagles', plays: 52, time: 267 }
    ],
    achievements: [
      { title: 'Music Explorer', description: 'Listened to 50+ different artists', icon: '🎵', unlocked: true },
      { title: 'Night Owl', description: 'Listened to music after midnight 10 times', icon: '🦉', unlocked: true },
      { title: 'Genre Master', description: 'Explored 10+ different genres', icon: '🎭', unlocked: false },
      { title: 'Playlist Creator', description: 'Created 5+ playlists', icon: '📝', unlocked: true },
      { title: 'Social Butterfly', description: 'Shared 20+ songs', icon: '🦋', unlocked: false }
    ]
  });

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => (
    <motion.div
      className="bg-gray-800 rounded-lg p-4 border border-gray-700"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <Icon className={`w-4 h-4 text-${color}-500`} />
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
    </motion.div>
  );

  const ProgressBar = ({ percentage, color = 'blue' }) => (
    <div className="w-full bg-gray-700 rounded-full h-2">
      <motion.div
        className={`bg-${color}-500 h-2 rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, delay: 0.2 }}
      />
    </div>
  );

  const TopItem = ({ item, index, type }) => (
    <motion.div
      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
        ${index === 0 ? 'bg-yellow-500 text-black' :
          index === 1 ? 'bg-gray-400 text-black' :
            index === 2 ? 'bg-orange-600 text-white' :
              'bg-gray-700 text-gray-300'}
      `}>
        {index + 1}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">
          {type === 'songs' ? item.title : item.name}
        </p>
        {type === 'songs' && (
          <p className="text-sm text-gray-400 truncate">{item.artist}</p>
        )}
      </div>

      <div className="text-right">
        <p className="text-white font-medium">{item.plays} plays</p>
        <p className="text-xs text-gray-400">{formatTime(item.time)}</p>
      </div>
    </motion.div>
  );

  const Achievement = ({ achievement, index }) => (
    <motion.div
      className={`
        flex items-center space-x-3 p-3 rounded-lg border transition-all
        ${achievement.unlocked
          ? 'bg-green-900/20 border-green-500/30'
          : 'bg-gray-800 border-gray-700 opacity-60'
        }
      `}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="text-2xl">{achievement.icon}</div>
      <div className="flex-1">
        <h4 className={`font-medium ${achievement.unlocked ? 'text-green-400' : 'text-gray-400'}`}>
          {achievement.title}
        </h4>
        <p className="text-sm text-gray-500">{achievement.description}</p>
      </div>
      {achievement.unlocked && (
        <Award className="w-5 h-5 text-green-500" />
      )}
    </motion.div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="bg-gray-900 rounded-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
              Music Analytics
            </h2>
            <p className="text-sm text-gray-400 mt-1">Your listening insights</p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>

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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Listening Time"
              value={formatTime(analytics.listening.totalTime)}
              subtitle="This week"
              icon={Clock}
              color="blue"
            />
            <StatCard
              title="Sessions"
              value={analytics.listening.sessionsCount}
              subtitle={`Avg ${analytics.listening.averageSession}m`}
              icon={Headphones}
              color="green"
            />
            <StatCard
              title="Top Genre"
              value={analytics.listening.topGenres[0].name}
              subtitle={`${analytics.listening.topGenres[0].percentage}% of time`}
              icon={Music}
              color="purple"
            />
            <StatCard
              title="Songs Played"
              value="247"
              subtitle="Unique tracks"
              icon={Play}
              color="red"
            />
          </div>

          {/* Charts and Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Genres */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                Top Genres
              </h3>
              <div className="space-y-4">
                {analytics.listening.topGenres.map((genre) => (
                  <div key={genre.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">{genre.name}</span>
                      <span className="text-sm text-gray-400">
                        {genre.percentage}% • {formatTime(genre.time)}
                      </span>
                    </div>
                    <ProgressBar percentage={genre.percentage} color="blue" />
                  </div>
                ))}
              </div>
            </div>

            {/* Top Songs */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Music className="w-5 h-5 mr-2 text-green-500" />
                Top Songs
              </h3>
              <div className="space-y-2">
                {analytics.topSongs.map((song, index) => (
                  <TopItem key={song.title} item={song} index={index} type="songs" />
                ))}
              </div>
            </div>

            {/* Top Artists */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-500" />
                Top Artists
              </h3>
              <div className="space-y-2">
                {analytics.topArtists.map((artist, index) => (
                  <TopItem key={artist.name} item={artist} index={index} type="artists" />
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Achievements
              </h3>
              <div className="space-y-3">
                {analytics.achievements.map((achievement, index) => (
                  <Achievement key={achievement.title} achievement={achievement} index={index} />
                ))}
              </div>
            </div>
          </div>

          {/* Daily Listening Chart */}
          <div className="bg-gray-800 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-red-500" />
              Daily Listening
            </h3>
            <div className="flex items-end justify-between h-32 space-x-2">
              {analytics.listening.dailyListening.map((day, index) => (
                <div key={day.day} className="flex flex-col items-center flex-1">
                  <motion.div
                    className="bg-blue-500 rounded-t w-full"
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.minutes / 520) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                  <span className="text-xs text-gray-400 mt-2">{day.day}</span>
                  <span className="text-xs text-gray-500">{formatTime(day.minutes)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AnalyticsDashboard;
