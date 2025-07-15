import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion'; // Not used
import {
  X,
  Settings,
  Volume2,
  Palette,
  Download,
  Shield,
  Bell,
  Monitor,
  Headphones,
  Wifi,
  Database,
  Zap,
  Moon,
  Sun,
  Globe
} from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Slider from '../ui/Slider';

const AdvancedSettings = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('audio');
  const [settings, setSettings] = useState({
    // Audio Settings
    masterVolume: 0.8,
    bassBoost: 0.5,
    trebleBoost: 0.5,
    spatialAudio: true,
    audioQuality: 'high',
    crossfade: 3,

    // Visual Settings
    theme: 'dark',
    accentColor: 'blue',
    animations: true,
    visualizer: true,
    albumArtBlur: true,

    // Download Settings
    downloadQuality: 'high',
    downloadLocation: 'default',
    autoDownload: false,

    // Privacy Settings
    analytics: true,
    crashReports: true,
    personalizedAds: false,

    // Notifications
    playbackNotifications: true,
    downloadNotifications: true,
    newMusicNotifications: false,

    // Performance
    hardwareAcceleration: true,
    preloadNext: true,
    cacheSize: 500,
    backgroundSync: true
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'audio', label: 'Audio', icon: Headphones },
    { id: 'visual', label: 'Visual', icon: Palette },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'performance', label: 'Performance', icon: Zap }
  ];

  const SettingItem = ({ label, description, children }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-b-0">
      <div className="flex-1">
        <h4 className="text-white font-medium">{label}</h4>
        {description && (
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <div className="ml-4">
        {children}
      </div>
    </div>
  );

  const Toggle = ({ checked, onChange }) => (
    <motion.button
      className={`
        relative w-12 h-6 rounded-full transition-colors duration-200
        ${checked ? 'bg-blue-500' : 'bg-gray-600'}
      `}
      onClick={() => onChange(!checked)}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
        animate={{ x: checked ? 24 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );

  const Select = ({ value, options, onChange }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'audio':
        return (
          <div className="space-y-4">
            <SettingItem
              label="Master Volume"
              description="Overall volume level"
            >
              <div className="w-32">
                <Slider
                  value={settings.masterVolume}
                  max={1}
                  step={0.01}
                  onChange={(value) => updateSetting('masterVolume', value)}
                />
              </div>
            </SettingItem>

            <SettingItem
              label="Bass Boost"
              description="Enhance low frequencies"
            >
              <div className="w-32">
                <Slider
                  value={settings.bassBoost}
                  max={1}
                  step={0.01}
                  onChange={(value) => updateSetting('bassBoost', value)}
                />
              </div>
            </SettingItem>

            <SettingItem
              label="Treble Boost"
              description="Enhance high frequencies"
            >
              <div className="w-32">
                <Slider
                  value={settings.trebleBoost}
                  max={1}
                  step={0.01}
                  onChange={(value) => updateSetting('trebleBoost', value)}
                />
              </div>
            </SettingItem>

            <SettingItem
              label="Spatial Audio"
              description="3D audio experience"
            >
              <Toggle
                checked={settings.spatialAudio}
                onChange={(value) => updateSetting('spatialAudio', value)}
              />
            </SettingItem>

            <SettingItem
              label="Audio Quality"
              description="Streaming and playback quality"
            >
              <Select
                value={settings.audioQuality}
                options={[
                  { value: 'low', label: 'Low (96kbps)' },
                  { value: 'medium', label: 'Medium (160kbps)' },
                  { value: 'high', label: 'High (320kbps)' },
                  { value: 'lossless', label: 'Lossless' }
                ]}
                onChange={(value) => updateSetting('audioQuality', value)}
              />
            </SettingItem>

            <SettingItem
              label="Crossfade"
              description="Smooth transitions between songs"
            >
              <div className="w-32">
                <Slider
                  value={settings.crossfade}
                  max={10}
                  step={0.5}
                  onChange={(value) => updateSetting('crossfade', value)}
                />
                <div className="text-xs text-gray-400 mt-1 text-center">
                  {settings.crossfade}s
                </div>
              </div>
            </SettingItem>
          </div>
        );

      case 'visual':
        return (
          <div className="space-y-4">
            <SettingItem
              label="Theme"
              description="Choose your preferred theme"
            >
              <Select
                value={settings.theme}
                options={[
                  { value: 'dark', label: 'Dark' },
                  { value: 'light', label: 'Light' },
                  { value: 'auto', label: 'Auto' }
                ]}
                onChange={(value) => updateSetting('theme', value)}
              />
            </SettingItem>

            <SettingItem
              label="Accent Color"
              description="Primary color for UI elements"
            >
              <div className="flex space-x-2">
                {['blue', 'green', 'purple', 'red', 'yellow'].map(color => (
                  <button
                    key={color}
                    className={`
                      w-6 h-6 rounded-full border-2 transition-all
                      ${settings.accentColor === color ? 'border-white scale-110' : 'border-gray-600'}
                      bg-${color}-500
                    `}
                    onClick={() => updateSetting('accentColor', color)}
                  />
                ))}
              </div>
            </SettingItem>

            <SettingItem
              label="Animations"
              description="Enable smooth animations"
            >
              <Toggle
                checked={settings.animations}
                onChange={(value) => updateSetting('animations', value)}
              />
            </SettingItem>

            <SettingItem
              label="Music Visualizer"
              description="Show audio visualizations"
            >
              <Toggle
                checked={settings.visualizer}
                onChange={(value) => updateSetting('visualizer', value)}
              />
            </SettingItem>

            <SettingItem
              label="Album Art Blur"
              description="Blur background album art"
            >
              <Toggle
                checked={settings.albumArtBlur}
                onChange={(value) => updateSetting('albumArtBlur', value)}
              />
            </SettingItem>
          </div>
        );

      case 'downloads':
        return (
          <div className="space-y-4">
            <SettingItem
              label="Download Quality"
              description="Quality for downloaded music"
            >
              <Select
                value={settings.downloadQuality}
                options={[
                  { value: 'medium', label: 'Medium (160kbps)' },
                  { value: 'high', label: 'High (320kbps)' },
                  { value: 'lossless', label: 'Lossless' }
                ]}
                onChange={(value) => updateSetting('downloadQuality', value)}
              />
            </SettingItem>

            <SettingItem
              label="Auto Download"
              description="Automatically download liked songs"
            >
              <Toggle
                checked={settings.autoDownload}
                onChange={(value) => updateSetting('autoDownload', value)}
              />
            </SettingItem>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-4">
            <SettingItem
              label="Analytics"
              description="Help improve the app with usage data"
            >
              <Toggle
                checked={settings.analytics}
                onChange={(value) => updateSetting('analytics', value)}
              />
            </SettingItem>

            <SettingItem
              label="Crash Reports"
              description="Send crash reports to developers"
            >
              <Toggle
                checked={settings.crashReports}
                onChange={(value) => updateSetting('crashReports', value)}
              />
            </SettingItem>

            <SettingItem
              label="Personalized Ads"
              description="Show ads based on your preferences"
            >
              <Toggle
                checked={settings.personalizedAds}
                onChange={(value) => updateSetting('personalizedAds', value)}
              />
            </SettingItem>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <SettingItem
              label="Playback Notifications"
              description="Show now playing notifications"
            >
              <Toggle
                checked={settings.playbackNotifications}
                onChange={(value) => updateSetting('playbackNotifications', value)}
              />
            </SettingItem>

            <SettingItem
              label="Download Notifications"
              description="Notify when downloads complete"
            >
              <Toggle
                checked={settings.downloadNotifications}
                onChange={(value) => updateSetting('downloadNotifications', value)}
              />
            </SettingItem>

            <SettingItem
              label="New Music Notifications"
              description="Notify about new releases"
            >
              <Toggle
                checked={settings.newMusicNotifications}
                onChange={(value) => updateSetting('newMusicNotifications', value)}
              />
            </SettingItem>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-4">
            <SettingItem
              label="Hardware Acceleration"
              description="Use GPU for better performance"
            >
              <Toggle
                checked={settings.hardwareAcceleration}
                onChange={(value) => updateSetting('hardwareAcceleration', value)}
              />
            </SettingItem>

            <SettingItem
              label="Preload Next Song"
              description="Buffer next song for seamless playback"
            >
              <Toggle
                checked={settings.preloadNext}
                onChange={(value) => updateSetting('preloadNext', value)}
              />
            </SettingItem>

            <SettingItem
              label="Cache Size"
              description="Storage space for cached music"
            >
              <div className="w-32">
                <Slider
                  value={settings.cacheSize}
                  max={2000}
                  step={100}
                  onChange={(value) => updateSetting('cacheSize', value)}
                />
                <div className="text-xs text-gray-400 mt-1 text-center">
                  {settings.cacheSize}MB
                </div>
              </div>
            </SettingItem>

            <SettingItem
              label="Background Sync"
              description="Sync data when app is in background"
            >
              <Toggle
                checked={settings.backgroundSync}
                onChange={(value) => updateSetting('backgroundSync', value)}
              />
            </SettingItem>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="bg-gray-900 rounded-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-500" />
            Advanced Settings
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r border-gray-700 bg-gray-800/30">
            <div className="p-4 space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                      ${activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50 flex justify-end space-x-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary">
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AdvancedSettings;
