import { useState, useEffect, useCallback } from 'react';
// import { motion } from 'framer-motion';
import {
  BarChart3,
  // TrendingUp,
  Clock,
  Music,
  Users,
  // Heart,
  Zap,
  // Calendar,
  Download
} from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { analytics, getListeningStats, getDailyListeningData, getMoodAnalysis } from '../../utils/analytics';

const AnalyticsDashboard = ({ isOpen, onClose }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadAnalytics();
    }
  }, [isOpen, timeRange]); // Removed loadAnalytics to avoid circular dependency

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, dailyListening, moodAnalysis] = await Promise.all([
        getListeningStats(timeRange),
        getDailyListeningData(30),
        getMoodAnalysis(timeRange)
      ]);

      setStats(statsData);
      setDailyData(dailyListening);
      setMoodData(moodAnalysis);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'text-green-500' }) => (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </Card>
  );

  const SimpleBarChart = ({ data, dataKey, color = '#10b981' }) => {
    const maxValue = Math.max(...data.map(item => item[dataKey]));

    return (
      <div className="flex items-end space-x-1 h-32">
        {data.slice(-14).map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <motion.div
              className="w-full rounded-t"
              style={{ backgroundColor: color }}
              initial={{ height: 0 }}
              animate={{ height: `${(item[dataKey] / maxValue) * 100}%` }}
              transition={{ delay: index * 0.1 }}
            />
            <span className="text-xs text-gray-400 mt-1">
              {new Date(item.date).getDate()}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const TopList = ({ title, data, renderItem }) => (
    <Card className="p-4">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {data.slice(0, 5).map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between"
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </div>
    </Card>
  );

  const HourlyChart = ({ data }) => {
    const maxValue = Math.max(...data);

    return (
      <div className="flex items-end space-x-1 h-24">
        {data.map((value, hour) => (
          <div key={hour} className="flex-1 flex flex-col items-center">
            <motion.div
              className="w-full bg-green-500 rounded-t"
              initial={{ height: 0 }}
              animate={{ height: `${(value / maxValue) * 100}%` }}
              transition={{ delay: hour * 0.02 }}
            />
            {hour % 4 === 0 && (
              <span className="text-xs text-gray-400 mt-1">{hour}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-xl w-full max-w-6xl h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-white">Music Analytics</h2>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
              >
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="1y">Last year</option>
              </select>

              <Button
                variant="outline"
                size="small"
                onClick={() => analytics.exportData()}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              <Button variant="ghost" onClick={onClose}>
                ✕
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-full">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  title="Total Songs"
                  value={stats?.totalSongs || 0}
                  subtitle="played"
                  icon={Music}
                />
                <StatCard
                  title="Listening Time"
                  value={formatTime(stats?.totalListeningTime || 0)}
                  subtitle="total"
                  icon={Clock}
                  color="text-blue-500"
                />
                <StatCard
                  title="Skip Rate"
                  value={`${stats?.skipRate || 0}%`}
                  subtitle="of songs"
                  icon={Zap}
                  color="text-yellow-500"
                />
                <StatCard
                  title="Unique Artists"
                  value={stats?.uniqueArtists || 0}
                  subtitle="discovered"
                  icon={Users}
                  color="text-purple-500"
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Listening */}
                <Card className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Daily Listening</h3>
                  <SimpleBarChart data={dailyData} dataKey="minutes" />
                </Card>

                {/* Hourly Pattern */}
                <Card className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Listening by Hour</h3>
                  <HourlyChart data={stats?.hourlyPattern || []} />
                </Card>
              </div>

              {/* Top Lists Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Artists */}
                <TopList
                  title="Top Artists"
                  data={stats?.topArtists || []}
                  renderItem={(item, index) => (
                    <>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-400 w-4">#{index + 1}</span>
                        <div>
                          <p className="text-white font-medium">{item.artist}</p>
                          <p className="text-xs text-gray-400">{item.plays} plays</p>
                        </div>
                      </div>
                      <div className="w-12 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-green-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.plays / (stats?.topArtists[0]?.plays || 1)) * 100}%` }}
                          transition={{ delay: index * 0.1 }}
                        />
                      </div>
                    </>
                  )}
                />

                {/* Top Genres */}
                <TopList
                  title="Top Genres"
                  data={stats?.topGenres || []}
                  renderItem={(item, index) => (
                    <>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-400 w-4">#{index + 1}</span>
                        <div>
                          <p className="text-white font-medium">{item.genre}</p>
                          <p className="text-xs text-gray-400">{item.plays} plays</p>
                        </div>
                      </div>
                      <div className="w-12 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.plays / (stats?.topGenres[0]?.plays || 1)) * 100}%` }}
                          transition={{ delay: index * 0.1 }}
                        />
                      </div>
                    </>
                  )}
                />

                {/* Mood Analysis */}
                <TopList
                  title="Mood Analysis"
                  data={moodData}
                  renderItem={(item, index) => (
                    <>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-400 w-4">#{index + 1}</span>
                        <div>
                          <p className="text-white font-medium capitalize">{item.mood}</p>
                          <p className="text-xs text-gray-400">{item.count} songs</p>
                        </div>
                      </div>
                      <div className="w-12 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.count / (moodData[0]?.count || 1)) * 100}%` }}
                          transition={{ delay: index * 0.1 }}
                        />
                      </div>
                    </>
                  )}
                />
              </div>

              {/* Additional Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Listening Insights</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Average session</span>
                      <span className="text-white">{stats?.averageSessionLength || 0} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Discovery rate</span>
                      <span className="text-white">
                        {Math.round(analytics.getDiscoveryRate(timeRange))}% new music
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Most active hour</span>
                      <span className="text-white">
                        {stats?.hourlyPattern ?
                          `${stats.hourlyPattern.indexOf(Math.max(...stats.hourlyPattern))}:00` :
                          'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
                  <div className="space-y-3">
                    {(() => {
                      const perfMetrics = analytics.getPerformanceMetrics();
                      return (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total sessions</span>
                            <span className="text-white">{perfMetrics.totalSessions}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Avg load time</span>
                            <span className="text-white">{perfMetrics.averageLoadTime}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Error rate</span>
                            <span className="text-white">{perfMetrics.errorRate.toFixed(2)}%</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;
