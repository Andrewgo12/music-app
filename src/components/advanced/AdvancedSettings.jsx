import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
import {
  Settings,
  Volume2,
  Headphones,
  Zap,
  Eye,
  Download,
  Wifi,
  HardDrive,
  Palette,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import Button from '../ui/Button';
import Slider from '../ui/Slider';
import Modal from '../ui/Modal';
import Equalizer from './Equalizer';
import { getUserPreferences, updateUserPreferences } from '../../utils/dataManager';

const AdvancedSettings = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('audio');
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [preferences, setPreferences] = useState({
    // Audio Settings
    volume: 0.7,
    crossfade: false,
    crossfadeDuration: 3,
    gaplessPlayback: true,
    replayGain: false,
    audioQuality: 'high',

    // Visual Settings
    showVisualizer: false,
    visualizerType: 'bars',
    albumArtAnimation: true,
    showLyrics: true,

    // Playback Settings
    autoplay: true,
    shuffle: false,
    repeat: 'none',
    skipSilence: false,

    // Interface Settings
    theme: 'dark',
    accentColor: 'green',
    compactMode: false,
    showSidebar: true,

    // Performance Settings
    hardwareAcceleration: true,
    preloadNext: true,
    cacheSize: 500,

    // Privacy Settings
    scrobbling: false,
    analytics: true,
    crashReports: true
  });

  useEffect(() => {
    if (isOpen) {
      const userPrefs = getUserPreferences();
      setPreferences(prev => ({ ...prev, ...userPrefs }));
    }
  }, [isOpen]);

  const handlePreferenceChange = (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    updateUserPreferences({ [key]: value });
  };

  const handleEqualizerSave = (equalizerSettings) => {
    handlePreferenceChange('equalizerSettings', equalizerSettings);
  };

  const resetToDefaults = () => {
    const defaults = {
      volume: 0.7,
      crossfade: false,
      crossfadeDuration: 3,
      gaplessPlayback: true,
      replayGain: false,
      audioQuality: 'high',
      showVisualizer: false,
      visualizerType: 'bars',
      albumArtAnimation: true,
      showLyrics: true,
      autoplay: true,
      shuffle: false,
      repeat: 'none',
      skipSilence: false,
      theme: 'dark',
      accentColor: 'green',
      compactMode: false,
      showSidebar: true,
      hardwareAcceleration: true,
      preloadNext: true,
      cacheSize: 500,
      scrobbling: false,
      analytics: true,
      crashReports: true
    };

    setPreferences(defaults);
    updateUserPreferences(defaults);
  };

  const tabs = [
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'visual', label: 'Visual', icon: Eye },
    { id: 'playback', label: 'Playback', icon: Zap },
    { id: 'interface', label: 'Interface', icon: Palette },
    { id: 'performance', label: 'Performance', icon: HardDrive },
    { id: 'privacy', label: 'Privacy', icon: Wifi }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'audio':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Master Volume
              </label>
              <Slider
                value={preferences.volume}
                max={1}
                step={0.01}
                onChange={(value) => handlePreferenceChange('volume', value)}
                className="mb-2"
              />
              <p className="text-xs text-gray-400">{Math.round(preferences.volume * 100)}%</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Audio Quality
              </label>
              <select
                value={preferences.audioQuality}
                onChange={(e) => handlePreferenceChange('audioQuality', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="low">Low (96 kbps)</option>
                <option value="normal">Normal (160 kbps)</option>
                <option value="high">High (320 kbps)</option>
                <option value="lossless">Lossless (FLAC)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Crossfade</p>
                <p className="text-xs text-gray-400">Smooth transitions between songs</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.crossfade}
                onChange={(e) => handlePreferenceChange('crossfade', e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
              />
            </div>

            {preferences.crossfade && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Crossfade Duration
                </label>
                <Slider
                  value={preferences.crossfadeDuration}
                  min={1}
                  max={10}
                  step={1}
                  onChange={(value) => handlePreferenceChange('crossfadeDuration', value)}
                  className="mb-2"
                />
                <p className="text-xs text-gray-400">{preferences.crossfadeDuration} seconds</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Gapless Playback</p>
                <p className="text-xs text-gray-400">No silence between tracks</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.gaplessPlayback}
                onChange={(e) => handlePreferenceChange('gaplessPlayback', e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
              />
            </div>

            <Button
              onClick={() => setShowEqualizer(true)}
              className="w-full bg-gray-700 hover:bg-gray-600"
            >
              <Headphones className="w-4 h-4 mr-2" />
              Open Equalizer
            </Button>
          </div>
        );

      case 'visual':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Show Visualizer</p>
                <p className="text-xs text-gray-400">Audio visualization effects</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.showVisualizer}
                onChange={(e) => handlePreferenceChange('showVisualizer', e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
              />
            </div>

            {preferences.showVisualizer && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Visualizer Type
                </label>
                <select
                  value={preferences.visualizerType}
                  onChange={(e) => handlePreferenceChange('visualizerType', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="bars">Frequency Bars</option>
                  <option value="wave">Waveform</option>
                  <option value="circular">Circular</option>
                  <option value="particles">Particles</option>
                </select>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Album Art Animation</p>
                <p className="text-xs text-gray-400">Animated album covers</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.albumArtAnimation}
                onChange={(e) => handlePreferenceChange('albumArtAnimation', e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Show Lyrics</p>
                <p className="text-xs text-gray-400">Display song lyrics when available</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.showLyrics}
                onChange={(e) => handlePreferenceChange('showLyrics', e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
              />
            </div>
          </div>
        );

      case 'interface':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', label: 'Light', icon: Sun },
                  { value: 'dark', label: 'Dark', icon: Moon },
                  { value: 'auto', label: 'Auto', icon: Monitor }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => handlePreferenceChange('theme', value)}
                    className={`p-3 rounded-lg border-2 transition-colors ${preferences.theme === value
                        ? 'border-green-500 bg-green-500/20'
                        : 'border-gray-600 hover:border-gray-500'
                      }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <p className="text-xs">{label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Accent Color
              </label>
              <div className="grid grid-cols-6 gap-2">
                {[
                  { value: 'green', color: 'bg-green-500' },
                  { value: 'blue', color: 'bg-blue-500' },
                  { value: 'purple', color: 'bg-purple-500' },
                  { value: 'pink', color: 'bg-pink-500' },
                  { value: 'red', color: 'bg-red-500' },
                  { value: 'orange', color: 'bg-orange-500' }
                ].map(({ value, color }) => (
                  <button
                    key={value}
                    onClick={() => handlePreferenceChange('accentColor', value)}
                    className={`w-8 h-8 rounded-full ${color} ${preferences.accentColor === value ? 'ring-2 ring-white' : ''
                      }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Compact Mode</p>
                <p className="text-xs text-gray-400">Smaller interface elements</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.compactMode}
                onChange={(e) => handlePreferenceChange('compactMode', e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
              />
            </div>
          </div>
        );

      default:
        return <div className="text-center text-gray-400">Settings for {activeTab}</div>;
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Advanced Settings"
        size="large"
      >
        <div className="flex h-96">
          {/* Sidebar */}
          <div className="w-48 border-r border-gray-700 pr-4">
            <div className="space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === id
                      ? 'bg-green-500/20 text-green-400'
                      : 'text-gray-300 hover:bg-gray-800'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 pl-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>

        <Modal.Footer>
          <Button variant="ghost" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Button onClick={onClose} className="bg-green-500 hover:bg-green-600">
            Done
          </Button>
        </Modal.Footer>
      </Modal>

      <Equalizer
        isOpen={showEqualizer}
        onClose={() => setShowEqualizer(false)}
        onSave={handleEqualizerSave}
      />
    </>
  );
};

export default AdvancedSettings;
