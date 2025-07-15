import React from 'react';
// import { motion } from 'framer-motion'; // Not used
import { Music, Headphones, Volume2, Play, Disc3 } from 'lucide-react';

// Musical Notes Loading Animation
export const MusicalNotesLoader = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const notes = ['♪', '♫', '♬', '♩', '♭'];

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {notes.map((note, index) => (
        <motion.div
          key={index}
          className={`${sizeClasses[size]} flex items-center justify-center text-blue-500 font-bold text-2xl`}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
        >
          {note}
        </motion.div>
      ))}
    </div>
  );
};

// Headphones Loading Animation
export const HeadphonesLoader = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Headphones className={`${sizeClasses[size]} text-blue-500`} />
      </motion.div>

      {/* Sound waves */}
      <div className="absolute">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border-2 border-blue-400 rounded-full"
            style={{
              width: 40 + i * 20,
              height: 40 + i * 20,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 0, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Vinyl Spinning Loader
export const VinylSpinLoader = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Disc3 className="w-full h-full text-gray-800" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-600 rounded-full" />
      </motion.div>
    </div>
  );
};

// Audio Wave Loader
export const AudioWaveLoader = ({ size = 'medium', className = '' }) => {
  const barCount = size === 'small' ? 5 : size === 'large' ? 12 : 8;
  const barHeight = size === 'small' ? 20 : size === 'large' ? 40 : 30;

  return (
    <div className={`flex items-end justify-center space-x-1 ${className}`}>
      {[...Array(barCount)].map((_, index) => (
        <motion.div
          key={index}
          className="w-1 bg-blue-500 rounded-t-sm"
          animate={{
            height: [4, barHeight, 4]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Pulsing Play Button Loader
export const PlayButtonLoader = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} rounded-full bg-blue-500 flex items-center justify-center`}
        animate={{
          scale: [1, 1.2, 1],
          boxShadow: [
            '0 0 0 0 rgba(59, 130, 246, 0.7)',
            '0 0 0 10px rgba(59, 130, 246, 0)',
            '0 0 0 0 rgba(59, 130, 246, 0)'
          ]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Play className="w-1/2 h-1/2 text-white ml-0.5" />
      </motion.div>
    </div>
  );
};

// Volume Wave Loader
export const VolumeWaveLoader = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Volume2 className={`${sizeClasses[size]} text-blue-500`} />

      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-blue-500 rounded-full"
          animate={{
            height: [8, 20, 8]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Equalizer Loader
export const EqualizerLoader = ({ size = 'medium', className = '' }) => {
  const barCount = size === 'small' ? 4 : size === 'large' ? 8 : 6;
  const maxHeight = size === 'small' ? 16 : size === 'large' ? 32 : 24;

  return (
    <div className={`flex items-end justify-center space-x-1 ${className}`}>
      {[...Array(barCount)].map((_, index) => (
        <motion.div
          key={index}
          className="w-2 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm"
          animate={{
            height: [4, maxHeight * (0.3 + Math.random() * 0.7), 4]
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Circular Progress with Music Icon
export const CircularMusicLoader = ({
  size = 'medium',
  progress = null,
  className = ''
}) => {
  const sizeClasses = {
    small: { container: 'w-12 h-12', icon: 'w-4 h-4' },
    medium: { container: 'w-16 h-16', icon: 'w-6 h-6' },
    large: { container: 'w-20 h-20', icon: 'w-8 h-8' }
  };

  const radius = size === 'small' ? 20 : size === 'large' ? 36 : 28;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className={`relative ${sizeClasses[size].container} ${className}`}>
      <svg className="w-full h-full transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-gray-700"
        />

        {/* Progress circle */}
        <motion.circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          className="text-blue-500"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: progress !== null
              ? circumference - (progress / 100) * circumference
              : circumference * 0.75
          }}
          animate={progress === null ? {
            strokeDashoffset: [circumference, 0, circumference]
          } : {}}
          transition={progress === null ? {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
        />
      </svg>

      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Music className={`${sizeClasses[size].icon} text-blue-500`} />
      </div>

      {/* Progress text */}
      {progress !== null && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-blue-500">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
};

// Main Loading Component
const MusicLoadingAnimation = ({
  type = 'notes',
  size = 'medium',
  progress = null,
  className = ''
}) => {
  const loaders = {
    notes: MusicalNotesLoader,
    headphones: HeadphonesLoader,
    vinyl: VinylSpinLoader,
    wave: AudioWaveLoader,
    play: PlayButtonLoader,
    volume: VolumeWaveLoader,
    equalizer: EqualizerLoader,
    circular: CircularMusicLoader
  };

  const LoaderComponent = loaders[type] || MusicalNotesLoader;

  return (
    <LoaderComponent
      size={size}
      progress={progress}
      className={className}
    />
  );
};

export default MusicLoadingAnimation;
