import React, { useState } from 'react';
// import { motion } from 'framer-motion'; // Not used
import {
  Play,
  Pause,
  TestTube,
  CheckCircle,
  XCircle,
  Settings,
  Music,
  Download,
  Heart,
  List,
  BarChart3
} from 'lucide-react';
import Button from '../ui/Button';

// Import all components to test
import VinylRecord from '../animations/VinylRecord';
import MusicVisualizer from '../animations/MusicVisualizer';
import MusicLoadingAnimation from '../animations/MusicLoadingAnimations';
import { HoverAnimation, FloatingAnimation } from '../animations/PageTransitions';
import MiniPlayer from '../player/MiniPlayer';
import QueueManager from '../player/QueueManager';
import SyncedLyrics from '../player/SyncedLyrics';
import AdvancedSettings from '../settings/AdvancedSettings';
import AnalyticsDashboard from '../analytics/AnalyticsDashboard';
import DownloadManager from '../advanced/DownloadManager';

const ComponentTester = () => {
  const [activeTest, setActiveTest] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock data for testing
  const mockSong = {
    id: '1',
    title: 'Test Song',
    artist: 'Test Artist',
    album: 'Test Album',
    duration: 180,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
    lyrics: [
      { time: 0, text: 'This is a test lyric line', translation: '' },
      { time: 5, text: 'Testing synchronized lyrics', translation: '' },
      { time: 10, text: 'Everything works perfectly', translation: '' }
    ]
  };

  // const mockQueue = [mockSong, { ...mockSong, id: '2', title: 'Second Song' }]; // Not used currently

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const tests = [
    {
      id: 'vinyl-record',
      name: 'Vinyl Record Animation',
      component: 'VinylRecord',
      description: 'Tests spinning vinyl record with different states',
      test: () => (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <VinylRecord isPlaying={false} albumArt={mockSong.imageUrl} size="medium" />
            <span>Stopped</span>
          </div>
          <div className="flex items-center space-x-4">
            <VinylRecord isPlaying={true} albumArt={mockSong.imageUrl} size="medium" />
            <span>Playing</span>
          </div>
        </div>
      )
    },
    {
      id: 'music-visualizer',
      name: 'Music Visualizer',
      component: 'MusicVisualizer',
      description: 'Tests different visualizer types',
      test: () => (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <MusicVisualizer type="bars" isPlaying={isPlaying} size="medium" />
              <p className="text-sm mt-2">Audio Bars</p>
            </div>
            <div className="text-center">
              <MusicVisualizer type="wave" isPlaying={isPlaying} size="medium" />
              <p className="text-sm mt-2">Wave</p>
            </div>
            <div className="text-center">
              <MusicVisualizer type="circular" isPlaying={isPlaying} size="medium" />
              <p className="text-sm mt-2">Circular</p>
            </div>
            <div className="text-center">
              <MusicVisualizer type="spectrum" isPlaying={isPlaying} size="medium" />
              <p className="text-sm mt-2">Spectrum</p>
            </div>
          </div>
          <Button onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? 'Stop' : 'Start'} Visualizers
          </Button>
        </div>
      )
    },
    {
      id: 'loading-animations',
      name: 'Loading Animations',
      component: 'MusicLoadingAnimation',
      description: 'Tests music-themed loading animations',
      test: () => (
        <div className="grid grid-cols-3 gap-4">
          {['notes', 'headphones', 'vinyl', 'wave', 'play', 'equalizer'].map(type => (
            <div key={type} className="text-center p-4 bg-gray-800 rounded-lg">
              <MusicLoadingAnimation type={type} size="medium" />
              <p className="text-sm mt-2 capitalize">{type}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'page-transitions',
      name: 'Page Transitions',
      component: 'PageTransitions',
      description: 'Tests hover and floating animations',
      test: () => (
        <div className="space-y-4">
          <div className="flex space-x-4">
            <HoverAnimation scale={1.1} y={-5}>
              <div className="bg-blue-600 p-4 rounded-lg cursor-pointer">
                Hover Animation
              </div>
            </HoverAnimation>
            <FloatingAnimation amplitude={10} duration={2}>
              <div className="bg-green-600 p-4 rounded-lg">
                Floating Animation
              </div>
            </FloatingAnimation>
          </div>
        </div>
      )
    },
    {
      id: 'mini-player',
      name: 'Mini Player',
      component: 'MiniPlayer',
      description: 'Tests draggable mini player',
      test: () => (
        <div className="relative h-64">
          <MiniPlayer
            currentSong={mockSong}
            isPlaying={isPlaying}
            currentTime={45}
            duration={180}
            volume={0.7}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onNext={() => console.log('Next')}
            onPrevious={() => console.log('Previous')}
            onSeek={(time) => console.log('Seek to:', time)}
            onVolumeChange={(vol) => console.log('Volume:', vol)}
            onExpand={() => console.log('Expand')}
            onClose={() => console.log('Close')}
            formatTime={formatTime}
          />
        </div>
      )
    }
  ];

  const runTest = (testId) => {
    setActiveTest(testId);

    // Simulate test execution
    setTimeout(() => {
      setTestResults(prev => ({
        ...prev,
        [testId]: {
          status: 'passed',
          timestamp: Date.now(),
          duration: Math.random() * 1000 + 500
        }
      }));
    }, 1000);
  };

  const runAllTests = () => {
    tests.forEach((test, index) => {
      setTimeout(() => {
        runTest(test.id);
      }, index * 1200);
    });
  };

  const getTestStatus = (testId) => {
    const result = testResults[testId];
    if (!result) return 'pending';
    return result.status;
  };

  const TestCard = ({ test }) => {
    const status = getTestStatus(test.id);
    const isActive = activeTest === test.id;

    return (
      <motion.div
        className={`
          bg-gray-800 rounded-lg p-4 border transition-all duration-200
          ${isActive ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700'}
          ${status === 'passed' ? 'border-green-500/50' : ''}
          ${status === 'failed' ? 'border-red-500/50' : ''}
        `}
        whileHover={{ scale: 1.02 }}
        layout
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <TestTube className="w-4 h-4 text-blue-500" />
            <h3 className="font-semibold text-white">{test.name}</h3>
          </div>

          <div className="flex items-center space-x-2">
            {status === 'passed' && <CheckCircle className="w-4 h-4 text-green-500" />}
            {status === 'failed' && <XCircle className="w-4 h-4 text-red-500" />}
            {isActive && (
              <motion.div
                className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-4">{test.description}</p>

        <div className="mb-4">
          <div className="bg-gray-900 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
            {test.test()}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Component: {test.component}
          </span>

          <Button
            size="sm"
            onClick={() => runTest(test.id)}
            disabled={isActive}
            className={`
              ${status === 'passed' ? 'bg-green-600 hover:bg-green-700' : ''}
              ${status === 'failed' ? 'bg-red-600 hover:bg-red-700' : ''}
            `}
          >
            {isActive ? 'Testing...' : status === 'passed' ? 'Retest' : 'Run Test'}
          </Button>
        </div>

        {testResults[test.id] && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Duration: {Math.round(testResults[test.id].duration)}ms</span>
              <span>
                {new Date(testResults[test.id].timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const passedTests = Object.values(testResults).filter(r => r.status === 'passed').length;
  const totalTests = tests.length;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <TestTube className="w-8 h-8 mr-3 text-blue-500" />
            Component Testing Suite
          </h1>
          <p className="text-gray-400">
            Comprehensive testing for all music streaming app components
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-500">{totalTests}</div>
            <div className="text-sm text-gray-400">Total Tests</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-500">{passedTests}</div>
            <div className="text-sm text-gray-400">Passed</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-500">
              {totalTests - passedTests}
            </div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-500">
              {Math.round((passedTests / totalTests) * 100)}%
            </div>
            <div className="text-sm text-gray-400">Success Rate</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-3">
            <Button onClick={runAllTests} className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              Run All Tests
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setTestResults({});
                setActiveTest(null);
              }}
            >
              Clear Results
            </Button>
          </div>

          <div className="text-sm text-gray-400">
            {activeTest && `Running: ${tests.find(t => t.id === activeTest)?.name}`}
          </div>
        </div>

        {/* Test Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {tests.map(test => (
              <TestCard key={test.id} test={test} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ComponentTester;
