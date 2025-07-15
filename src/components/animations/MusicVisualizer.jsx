import React, { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion'; // Not used

// Audio Bars Visualizer
export const AudioBars = ({
  isPlaying = false,
  barCount = 20,
  height = 60,
  color = 'bg-blue-500',
  className = ''
}) => {
  const [bars, setBars] = useState(Array(barCount).fill(0));

  useEffect(() => {
    if (!isPlaying) {
      setBars(Array(barCount).fill(0));
      return;
    }

    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random()));
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, barCount]);

  return (
    <div className={`flex items-end justify-center space-x-1 ${className}`} style={{ height }}>
      {bars.map((bar, index) => (
        <motion.div
          key={index}
          className={`w-1 ${color} rounded-t-sm`}
          animate={{
            height: isPlaying ? `${Math.max(bar * height, 4)}px` : '4px'
          }}
          transition={{
            duration: 0.1,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

// Wave Visualizer
export const WaveVisualizer = ({
  isPlaying = false,
  waveCount = 5,
  color = 'border-blue-500',
  className = ''
}) => {
  return (
    <div className={`relative w-full h-16 ${className}`}>
      {[...Array(waveCount)].map((_, index) => (
        <motion.div
          key={index}
          className={`absolute inset-0 border-2 ${color} rounded-full opacity-30`}
          animate={isPlaying ? {
            scale: [1, 1.5, 1],
            opacity: [0.3, 0, 0.3]
          } : {
            scale: 1,
            opacity: 0.1
          }}
          transition={{
            duration: 2,
            repeat: isPlaying ? Infinity : 0,
            delay: index * 0.4,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Center dot */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 ${color.replace('border-', 'bg-')} rounded-full`} />
    </div>
  );
};

// Particle Visualizer
export const ParticleVisualizer = ({
  isPlaying = false,
  particleCount = 15,
  className = ''
}) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    }));
    setParticles(newParticles);
  }, [particleCount]);

  return (
    <div className={`relative w-full h-32 overflow-hidden ${className}`}>
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`
            }}
            animate={isPlaying ? {
              y: [0, -20, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            } : {
              y: 0,
              x: 0,
              scale: 1,
              opacity: 0.3
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: isPlaying ? Infinity : 0,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Circular Visualizer
export const CircularVisualizer = ({
  isPlaying = false,
  size = 120,
  color = 'stroke-blue-500',
  className = ''
}) => {
  const [segments, setSegments] = useState(Array(24).fill(0));

  useEffect(() => {
    if (!isPlaying) {
      setSegments(Array(24).fill(0));
      return;
    }

    const interval = setInterval(() => {
      setSegments(prev => prev.map(() => Math.random()));
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const radius = size / 2 - 10;
  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <div className={className}>
      <svg width={size} height={size} className="transform -rotate-90">
        {segments.map((segment, index) => {
          const angle = (index * 360) / segments.length;
          const radian = (angle * Math.PI) / 180;
          const innerRadius = radius * 0.6;
          const outerRadius = innerRadius + (segment * radius * 0.4);

          const x1 = centerX + Math.cos(radian) * innerRadius;
          const y1 = centerY + Math.sin(radian) * innerRadius;
          const x2 = centerX + Math.cos(radian) * outerRadius;
          const y2 = centerY + Math.sin(radian) * outerRadius;

          return (
            <motion.line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              className={`${color} stroke-2`}
              animate={{
                opacity: isPlaying ? [0.3, 1, 0.3] : 0.2
              }}
              transition={{
                duration: 0.5,
                repeat: isPlaying ? Infinity : 0,
                delay: index * 0.05
              }}
            />
          );
        })}

        {/* Center circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.1}
          className={color.replace('stroke-', 'fill-')}
        />
      </svg>
    </div>
  );
};

// Spectrum Analyzer
export const SpectrumAnalyzer = ({
  isPlaying = false,
  barCount = 32,
  height = 80,
  className = ''
}) => {
  const [spectrum, setSpectrum] = useState(Array(barCount).fill(0));

  useEffect(() => {
    if (!isPlaying) {
      setSpectrum(Array(barCount).fill(0));
      return;
    }

    const interval = setInterval(() => {
      setSpectrum(prev => prev.map((_, index) => {
        // Simulate frequency spectrum with lower frequencies having higher values
        const frequency = index / barCount;
        const baseValue = Math.max(0, 1 - frequency * 2);
        return baseValue * Math.random();
      }));
    }, 80);

    return () => clearInterval(interval);
  }, [isPlaying, barCount]);

  return (
    <div className={`flex items-end justify-center space-x-0.5 ${className}`} style={{ height }}>
      {spectrum.map((value, index) => {
        const hue = (index / barCount) * 240; // Blue to red spectrum
        return (
          <motion.div
            key={index}
            className="w-1 rounded-t-sm"
            style={{
              backgroundColor: `hsl(${hue}, 70%, 60%)`
            }}
            animate={{
              height: isPlaying ? `${Math.max(value * height, 2)}px` : '2px'
            }}
            transition={{
              duration: 0.08,
              ease: "easeOut"
            }}
          />
        );
      })}
    </div>
  );
};

// Main Visualizer Component
const MusicVisualizer = ({
  type = 'bars',
  isPlaying = false,
  size = 'medium',
  color = 'blue',
  className = ''
}) => {
  const colorClasses = {
    blue: 'bg-blue-500 border-blue-500 stroke-blue-500',
    green: 'bg-green-500 border-green-500 stroke-green-500',
    purple: 'bg-purple-500 border-purple-500 stroke-purple-500',
    red: 'bg-red-500 border-red-500 stroke-red-500',
    yellow: 'bg-yellow-500 border-yellow-500 stroke-yellow-500'
  };

  const sizeProps = {
    small: { barCount: 12, height: 40, particleCount: 8 },
    medium: { barCount: 20, height: 60, particleCount: 15 },
    large: { barCount: 32, height: 80, particleCount: 25 }
  };

  const props = {
    isPlaying,
    className,
    ...sizeProps[size]
  };

  switch (type) {
    case 'bars':
      return <AudioBars {...props} color={colorClasses[color].split(' ')[0]} />;
    case 'wave':
      return <WaveVisualizer {...props} color={colorClasses[color].split(' ')[1]} />;
    case 'particles':
      return <ParticleVisualizer {...props} />;
    case 'circular':
      return <CircularVisualizer {...props} color={colorClasses[color].split(' ')[2]} size={sizeProps[size].height + 40} />;
    case 'spectrum':
      return <SpectrumAnalyzer {...props} />;
    default:
      return <AudioBars {...props} color={colorClasses[color].split(' ')[0]} />;
  }
};

export default MusicVisualizer;
