import React from 'react';
// import { motion } from 'framer-motion'; // Not used

const VinylRecord = ({
  isPlaying = false,
  albumArt,
  size = 'medium',
  showNeedle = true,
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-32 h-32',
    xlarge: 'w-48 h-48'
  };

  const needleSizes = {
    small: 'w-8 h-1',
    medium: 'w-12 h-1.5',
    large: 'w-20 h-2',
    xlarge: 'w-28 h-3'
  };

  return (
    <div className={`relative ${className}`}>
      {/* Vinyl Record */}
      <motion.div
        className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-br from-gray-900 via-black to-gray-800 shadow-2xl`}
        animate={{
          rotate: isPlaying ? 360 : 0
        }}
        transition={{
          duration: 3,
          repeat: isPlaying ? Infinity : 0,
          ease: "linear"
        }}
      >
        {/* Outer ring */}
        <div className="absolute inset-1 rounded-full border-2 border-gray-700 opacity-60" />

        {/* Middle ring */}
        <div className="absolute inset-3 rounded-full border border-gray-600 opacity-40" />

        {/* Inner ring */}
        <div className="absolute inset-5 rounded-full border border-gray-500 opacity-30" />

        {/* Center hole */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full border border-gray-600" />

        {/* Album art in center */}
        {albumArt && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full overflow-hidden border-2 border-gray-600"
            animate={{
              rotate: isPlaying ? 360 : 0
            }}
            transition={{
              duration: 3,
              repeat: isPlaying ? Infinity : 0,
              ease: "linear"
            }}
          >
            <img
              src={albumArt}
              alt="Album art"
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Vinyl grooves */}
        <div className="absolute inset-2 rounded-full">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full border border-gray-700 opacity-20`}
              style={{
                top: `${10 + i * 8}%`,
                left: `${10 + i * 8}%`,
                right: `${10 + i * 8}%`,
                bottom: `${10 + i * 8}%`,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Turntable Needle */}
      {showNeedle && (
        <motion.div
          className="absolute top-0 right-0 origin-bottom-left"
          initial={{ rotate: -25 }}
          animate={{
            rotate: isPlaying ? -15 : -25,
            x: isPlaying ? -5 : 0
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut"
          }}
        >
          <div className={`${needleSizes[size]} bg-gradient-to-r from-gray-400 to-gray-600 rounded-full shadow-lg`}>
            {/* Needle tip */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Needle arm */}
          <div className="absolute -top-1 right-2 w-0.5 h-6 bg-gray-500 rounded-full" />

          {/* Needle base */}
          <div className="absolute -top-2 right-1 w-2 h-2 bg-gray-600 rounded-full" />
        </motion.div>
      )}

      {/* Glow effect when playing */}
      {isPlaying && (
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full`}
          animate={{
            boxShadow: [
              '0 0 20px rgba(59, 130, 246, 0.3)',
              '0 0 40px rgba(59, 130, 246, 0.5)',
              '0 0 20px rgba(59, 130, 246, 0.3)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
};

// Vinyl Stack Component for multiple records
export const VinylStack = ({
  records = [],
  currentIndex = 0,
  isPlaying = false,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      {records.map((record, index) => (
        <motion.div
          key={record.id || index}
          className="absolute"
          style={{
            zIndex: records.length - index,
            top: index * 2,
            left: index * 2
          }}
          animate={{
            scale: index === currentIndex ? 1 : 0.95,
            opacity: index === currentIndex ? 1 : 0.7,
            y: index === currentIndex ? 0 : index * 4
          }}
          transition={{ duration: 0.3 }}
        >
          <VinylRecord
            isPlaying={isPlaying && index === currentIndex}
            albumArt={record.albumArt}
            size="large"
            showNeedle={index === currentIndex}
          />
        </motion.div>
      ))}
    </div>
  );
};

// Mini Vinyl for smaller spaces
export const MiniVinyl = ({ isPlaying, albumArt, className = '' }) => (
  <VinylRecord
    isPlaying={isPlaying}
    albumArt={albumArt}
    size="small"
    showNeedle={false}
    className={className}
  />
);

export default VinylRecord;
