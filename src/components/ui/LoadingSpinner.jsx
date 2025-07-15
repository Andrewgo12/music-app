// import { motion } from 'framer-motion'; // Not used
import { Music, Disc, Headphones, Radio } from 'lucide-react';

const LoadingSpinner = ({
  size = 'medium',
  type = 'spinner',
  message = 'Loading...',
  color = 'text-green-500',
  className = ''
}) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const SpinnerVariant = () => (
    <motion.div
      className={`${sizes[size]} border-2 border-gray-600 border-t-green-500 rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );

  const DotsVariant = () => (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`w-2 h-2 bg-green-500 rounded-full`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  );

  const PulseVariant = () => (
    <motion.div
      className={`${sizes[size]} bg-green-500 rounded-full ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );

  const MusicVariant = () => (
    <div className={`relative ${sizes[size]} ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Disc className={`${sizes[size]} ${color}`} />
      </motion.div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Music className="w-4 h-4 text-white" />
      </motion.div>
    </div>
  );

  const WaveVariant = () => (
    <div className={`flex items-end space-x-1 ${className}`}>
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className="w-1 bg-green-500 rounded-full"
          animate={{
            height: ["8px", "24px", "8px"]
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

  const HeadphonesVariant = () => (
    <motion.div
      className={`${sizes[size]} ${color} ${className}`}
      animate={{
        rotateY: [0, 180, 360]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Headphones className={sizes[size]} />
    </motion.div>
  );

  const RadioVariant = () => (
    <div className={`relative ${sizes[size]} ${className}`}>
      <Radio className={`${sizes[size]} ${color}`} />
      <motion.div
        className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );

  const BarsVariant = () => (
    <div className={`flex items-end space-x-1 ${className}`}>
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className="w-2 bg-green-500 rounded-t"
          animate={{
            height: ["4px", "16px", "4px"]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  const renderSpinner = () => {
    switch (type) {
      case 'dots':
        return <DotsVariant />;
      case 'pulse':
        return <PulseVariant />;
      case 'music':
        return <MusicVariant />;
      case 'wave':
        return <WaveVariant />;
      case 'headphones':
        return <HeadphonesVariant />;
      case 'radio':
        return <RadioVariant />;
      case 'bars':
        return <BarsVariant />;
      case 'spinner':
      default:
        return <SpinnerVariant />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {renderSpinner()}
      {message && (
        <motion.p
          className="text-gray-400 text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

// Full screen loading component
export const FullScreenLoader = ({
  message = 'Loading your music...',
  type = 'music'
}) => (
  <motion.div
    className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="text-center">
      <LoadingSpinner size="xl" type={type} message={message} />
    </div>
  </motion.div>
);

// Skeleton loader for cards
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-gray-800 rounded-lg p-4 animate-pulse ${className}`}>
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-700 rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  </div>
);

// Skeleton loader for lists
export const SkeletonList = ({ count = 5, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

// Loading overlay for components
export const LoadingOverlay = ({
  isLoading,
  children,
  message = 'Loading...',
  type = 'spinner'
}) => (
  <div className="relative">
    {children}
    {isLoading && (
      <motion.div
        className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <LoadingSpinner type={type} message={message} />
      </motion.div>
    )}
  </div>
);

// Progress bar loader
export const ProgressLoader = ({
  progress = 0,
  message = 'Loading...',
  className = ''
}) => (
  <div className={`space-y-3 ${className}`}>
    <div className="flex justify-between text-sm text-gray-400">
      <span>{message}</span>
      <span>{Math.round(progress)}%</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2">
      <motion.div
        className="bg-green-500 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  </div>
);

export default LoadingSpinner;
