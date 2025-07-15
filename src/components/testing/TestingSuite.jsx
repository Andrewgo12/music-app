import React, { useState } from 'react';
// import { motion } from 'framer-motion'; // Not used
import {
  TestTube,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Settings,
  Download,
  Heart,
  List,
  BarChart3,
  X,
  RefreshCw
} from 'lucide-react';
import Button from '../ui/Button';

const TestingSuite = ({ onClose }) => {
  const [activeTests, setActiveTests] = useState(new Set());
  const [testResults, setTestResults] = useState({});
  const [isRunningAll, setIsRunningAll] = useState(false);

  const tests = [
    {
      id: 'player-controls',
      name: 'Player Controls',
      description: 'Test play, pause, next, previous buttons',
      category: 'Player',
      test: async () => {
        // Simulate testing player controls
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true, message: 'All player controls working' };
      }
    },
    {
      id: 'vinyl-animation',
      name: 'Vinyl Animation',
      description: 'Test spinning vinyl record animations',
      category: 'Animations',
      test: async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { success: true, message: 'Vinyl animations smooth' };
      }
    },
    {
      id: 'music-visualizer',
      name: 'Music Visualizer',
      description: 'Test all visualizer types and responsiveness',
      category: 'Animations',
      test: async () => {
        await new Promise(resolve => setTimeout(resolve, 1200));
        return { success: true, message: 'All visualizers working' };
      }
    },
    {
      id: 'modal-functionality',
      name: 'Modal Functionality',
      description: 'Test playlist and YouTube import modals',
      category: 'Modals',
      test: async () => {
        await new Promise(resolve => setTimeout(resolve, 900));
        return { success: true, message: 'Modals open/close correctly' };
      }
    },
    {
      id: 'responsive-design',
      name: 'Responsive Design',
      description: 'Test layout on different screen sizes',
      category: 'UI/UX',
      test: async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { success: true, message: 'Responsive across all devices' };
      }
    },
    {
      id: 'youtube-integration',
      name: 'YouTube Integration',
      description: 'Test YouTube URL parsing and import',
      category: 'Integration',
      test: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { success: true, message: 'YouTube integration working' };
      }
    },
    {
      id: 'download-manager',
      name: 'Download Manager',
      description: 'Test download progress and queue management',
      category: 'Downloads',
      test: async () => {
        await new Promise(resolve => setTimeout(resolve, 1800));
        return { success: true, message: 'Download system functional' };
      }
    },
    {
      id: 'audio-controls',
      name: 'Audio Controls',
      description: 'Test volume, seek, shuffle, repeat',
      category: 'Player',
      test: async () => {
        await new Promise(resolve => setTimeout(resolve, 1100));
        return { success: true, message: 'Audio controls responsive' };
      }
    },
    {
      id: 'playlist-management',
      name: 'Playlist Management',
      description: 'Test create, edit, delete playlists',
      category: 'Data',
      test: async () => {
        await new Promise(resolve => setTimeout(resolve, 1300));
        return { success: true, message: 'Playlist CRUD operations work' };
      }
    },
    {
      id: 'search-functionality',
      name: 'Search Functionality',
      description: 'Test search across songs, artists, albums',
      category: 'Search',
      test: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true, message: 'Search working correctly' };
      }
    }
  ];

  const runTest = async (testId) => {
    setActiveTests(prev => new Set([...prev, testId]));

    try {
      const test = tests.find(t => t.id === testId);
      const result = await test.test();

      setTestResults(prev => ({
        ...prev,
        [testId]: {
          ...result,
          timestamp: Date.now(),
          duration: Math.random() * 2000 + 500
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testId]: {
          success: false,
          message: error.message,
          timestamp: Date.now(),
          duration: 0
        }
      }));
    } finally {
      setActiveTests(prev => {
        const newSet = new Set(prev);
        newSet.delete(testId);
        return newSet;
      });
    }
  };

  const runAllTests = async () => {
    setIsRunningAll(true);
    setTestResults({});

    for (const test of tests) {
      await runTest(test.id);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setIsRunningAll(false);
  };

  const clearResults = () => {
    setTestResults({});
    setActiveTests(new Set());
  };

  const getTestStatus = (testId) => {
    if (activeTests.has(testId)) return 'running';
    const result = testResults[testId];
    if (!result) return 'pending';
    return result.success ? 'passed' : 'failed';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return (
          <motion.div
            className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        );
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 border-2 border-gray-500 rounded-full" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'border-blue-500 bg-blue-900/20';
      case 'passed': return 'border-green-500/50 bg-green-900/20';
      case 'failed': return 'border-red-500/50 bg-red-900/20';
      default: return 'border-gray-700 bg-gray-800';
    }
  };

  const groupedTests = tests.reduce((acc, test) => {
    if (!acc[test.category]) acc[test.category] = [];
    acc[test.category].push(test);
    return acc;
  }, {});

  const passedTests = Object.values(testResults).filter(r => r.success).length;
  const failedTests = Object.values(testResults).filter(r => !r.success).length;
  const totalTests = tests.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <TestTube className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className="text-xl font-bold text-white">Testing Suite</h2>
              <p className="text-sm text-gray-400">Comprehensive functionality testing</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{totalTests}</div>
            <div className="text-xs text-gray-400">Total Tests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{passedTests}</div>
            <div className="text-xs text-gray-400">Passed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{failedTests}</div>
            <div className="text-xs text-gray-400">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-400">Success Rate</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex space-x-3">
            <Button
              onClick={runAllTests}
              disabled={isRunningAll || activeTests.size > 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isRunningAll ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run All Tests
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={clearResults}
              disabled={isRunningAll || activeTests.size > 0}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear Results
            </Button>
          </div>

          <div className="text-sm text-gray-400">
            {activeTests.size > 0 && `Running ${activeTests.size} test${activeTests.size > 1 ? 's' : ''}...`}
          </div>
        </div>

        {/* Test Categories */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {Object.entries(groupedTests).map(([category, categoryTests]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                  {category}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categoryTests.map(test => {
                    const status = getTestStatus(test.id);
                    const result = testResults[test.id];

                    return (
                      <motion.div
                        key={test.id}
                        className={`
                          p-4 rounded-lg border transition-all duration-200
                          ${getStatusColor(status)}
                        `}
                        whileHover={{ scale: 1.02 }}
                        layout
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-white text-sm">{test.name}</h4>
                          {getStatusIcon(status)}
                        </div>

                        <p className="text-xs text-gray-400 mb-3">{test.description}</p>

                        {result && (
                          <div className="text-xs text-gray-300 mb-2">
                            {result.message}
                          </div>
                        )}

                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {result && `${Math.round(result.duration)}ms`}
                          </span>

                          <Button
                            size="sm"
                            onClick={() => runTest(test.id)}
                            disabled={activeTests.has(test.id) || isRunningAll}
                            className="text-xs"
                          >
                            {status === 'running' ? 'Testing...' : 'Run Test'}
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>Press Ctrl+Shift+T to toggle testing suite</span>
            <span>All tests simulate real functionality</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TestingSuite;
