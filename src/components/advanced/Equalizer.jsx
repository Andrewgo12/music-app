import { useState, useEffect, useRef } from 'react';
// import { motion } from 'framer-motion'; // Not used
import Slider from '../ui/Slider';
import Button from '../ui/Button';
import { RotateCcw, Save, Settings } from 'lucide-react';

const Equalizer = ({ isOpen, onClose, onSave }) => {
  const [bands, setBands] = useState([
    { frequency: '60Hz', gain: 0, id: 'band-60' },
    { frequency: '170Hz', gain: 0, id: 'band-170' },
    { frequency: '310Hz', gain: 0, id: 'band-310' },
    { frequency: '600Hz', gain: 0, id: 'band-600' },
    { frequency: '1kHz', gain: 0, id: 'band-1k' },
    { frequency: '3kHz', gain: 0, id: 'band-3k' },
    { frequency: '6kHz', gain: 0, id: 'band-6k' },
    { frequency: '12kHz', gain: 0, id: 'band-12k' },
    { frequency: '14kHz', gain: 0, id: 'band-14k' },
    { frequency: '16kHz', gain: 0, id: 'band-16k' }
  ]);

  const [selectedPreset, setSelectedPreset] = useState('flat');
  const [customPresets, setCustomPresets] = useState([]);
  const canvasRef = useRef(null);

  const presets = {
    flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    rock: [5, 4, -1, -2, -1, 1, 3, 4, 4, 4],
    pop: [-1, 2, 4, 4, 1, -1, -1, -1, 1, 1],
    jazz: [4, 3, 1, 2, -1, -1, 0, 1, 2, 3],
    classical: [5, 4, 3, 2, -1, -1, 0, 2, 3, 4],
    electronic: [4, 3, 1, 0, -1, 1, 0, 1, 3, 4],
    hiphop: [5, 4, 1, 3, -1, -1, 1, -1, 2, 3],
    vocal: [-2, -1, -1, 1, 3, 3, 2, 1, 0, -1],
    bass: [6, 5, 4, 2, 1, -1, -2, -2, -1, 0],
    treble: [-2, -1, 0, 1, 2, 3, 4, 5, 6, 6]
  };

  useEffect(() => {
    drawFrequencyResponse();
  }, [bands, drawFrequencyResponse]); // Added missing dependency

  const drawFrequencyResponse = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;

    // Horizontal lines (dB levels)
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vertical lines (frequency bands)
    for (let i = 0; i <= bands.length; i++) {
      const x = (width / bands.length) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw frequency response curve
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();

    bands.forEach((band, index) => {
      const x = (width / bands.length) * index + (width / bands.length) / 2;
      const y = height / 2 - (band.gain * height / 24); // Scale gain to canvas height

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw gain points
    ctx.fillStyle = '#10b981';
    bands.forEach((band, index) => {
      const x = (width / bands.length) * index + (width / bands.length) / 2;
      const y = height / 2 - (band.gain * height / 24);

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const handleBandChange = (index, value) => {
    const newBands = [...bands];
    newBands[index].gain = value;
    setBands(newBands);
  };

  const applyPreset = (presetName) => {
    const presetValues = presets[presetName];
    if (presetValues) {
      const newBands = bands.map((band, index) => ({
        ...band,
        gain: presetValues[index]
      }));
      setBands(newBands);
      setSelectedPreset(presetName);
    }
  };

  const resetEqualizer = () => {
    applyPreset('flat');
  };

  const saveCustomPreset = () => {
    const presetName = prompt('Enter preset name:');
    if (presetName && presetName.trim()) {
      const newPreset = {
        name: presetName.trim(),
        values: bands.map(band => band.gain)
      };
      setCustomPresets(prev => [...prev, newPreset]);
    }
  };

  const handleSave = () => {
    const equalizerSettings = {
      bands: bands.map(band => ({ frequency: band.frequency, gain: band.gain })),
      preset: selectedPreset
    };
    onSave(equalizerSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold text-white">Equalizer</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Frequency Response Visualization */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Frequency Response</h3>
          <div className="bg-gray-800 rounded-lg p-4">
            <canvas
              ref={canvasRef}
              width={800}
              height={200}
              className="w-full h-32 rounded"
            />
          </div>
        </div>

        {/* Presets */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Presets</h3>
          <div className="grid grid-cols-5 gap-2">
            {Object.keys(presets).map((preset) => (
              <Button
                key={preset}
                variant={selectedPreset === preset ? 'primary' : 'secondary'}
                size="small"
                onClick={() => applyPreset(preset)}
                className="capitalize"
              >
                {preset}
              </Button>
            ))}
          </div>

          {customPresets.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Custom Presets</h4>
              <div className="flex flex-wrap gap-2">
                {customPresets.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="small"
                    onClick={() => {
                      const newBands = bands.map((band, i) => ({
                        ...band,
                        gain: preset.values[i]
                      }));
                      setBands(newBands);
                      setSelectedPreset('custom');
                    }}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Equalizer Bands */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Frequency Bands</h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
            {bands.map((band, index) => (
              <div key={band.id} className="flex flex-col items-center space-y-2">
                <div className="text-xs text-gray-400 font-medium">
                  {band.frequency}
                </div>
                <div className="h-32 flex items-center">
                  <Slider
                    value={band.gain}
                    min={-12}
                    max={12}
                    step={0.5}
                    onChange={(value) => handleBandChange(index, value)}
                    className="h-32 w-4"
                    style={{ writingMode: 'bt-lr', transform: 'rotate(270deg)' }}
                  />
                </div>
                <div className="text-xs text-white font-mono">
                  {band.gain > 0 ? '+' : ''}{band.gain.toFixed(1)}dB
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={resetEqualizer}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </Button>
            <Button
              variant="outline"
              onClick={saveCustomPreset}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Preset</span>
            </Button>
          </div>

          <div className="flex space-x-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
              Apply
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Equalizer;
