import React from 'react';
// import { motion, AnimatePresence } from 'framer-motion'; // Not used

// Slide transition variants
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

// Fade transition variants
const fadeVariants = {
  enter: {
    opacity: 0,
    scale: 0.95
  },
  center: {
    opacity: 1,
    scale: 1
  },
  exit: {
    opacity: 0,
    scale: 1.05
  }
};

// Scale transition variants
const scaleVariants = {
  enter: {
    scale: 0.8,
    opacity: 0,
    rotateY: -90
  },
  center: {
    scale: 1,
    opacity: 1,
    rotateY: 0
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    rotateY: 90
  }
};

// Flip transition variants
const flipVariants = {
  enter: {
    rotateY: 180,
    opacity: 0
  },
  center: {
    rotateY: 0,
    opacity: 1
  },
  exit: {
    rotateY: -180,
    opacity: 0
  }
};

// Curtain transition variants
const curtainVariants = {
  enter: {
    clipPath: 'inset(0 100% 0 0)',
    opacity: 1
  },
  center: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1
  },
  exit: {
    clipPath: 'inset(0 0 0 100%)',
    opacity: 1
  }
};

// Zoom transition variants
const zoomVariants = {
  enter: {
    scale: 0,
    opacity: 0,
    rotate: 180
  },
  center: {
    scale: 1,
    opacity: 1,
    rotate: 0
  },
  exit: {
    scale: 0,
    opacity: 0,
    rotate: -180
  }
};

// Music-themed wave transition
const waveVariants = {
  enter: {
    y: 100,
    opacity: 0,
    scaleY: 0
  },
  center: {
    y: 0,
    opacity: 1,
    scaleY: 1
  },
  exit: {
    y: -100,
    opacity: 0,
    scaleY: 0
  }
};

// Vinyl record transition
const vinylVariants = {
  enter: {
    rotate: -180,
    scale: 0,
    opacity: 0
  },
  center: {
    rotate: 0,
    scale: 1,
    opacity: 1
  },
  exit: {
    rotate: 180,
    scale: 0,
    opacity: 0
  }
};

// Page Transition Wrapper Component
export const PageTransition = ({
  children,
  type = 'fade',
  direction = 1,
  duration = 0.3,
  className = '',
  ...props
}) => {
  const variants = {
    slide: slideVariants,
    fade: fadeVariants,
    scale: scaleVariants,
    flip: flipVariants,
    curtain: curtainVariants,
    zoom: zoomVariants,
    wave: waveVariants,
    vinyl: vinylVariants
  };

  const selectedVariants = variants[type] || fadeVariants;

  const transition = {
    type: "tween",
    ease: "easeInOut",
    duration: duration
  };

  return (
    <motion.div
      custom={direction}
      variants={selectedVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={transition}
      className={`w-full h-full ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animated Page Container
export const AnimatedPageContainer = ({
  children,
  pageKey,
  transitionType = 'fade',
  className = ''
}) => {
  return (
    <AnimatePresence mode="wait">
      <PageTransition
        key={pageKey}
        type={transitionType}
        className={className}
      >
        {children}
      </PageTransition>
    </AnimatePresence>
  );
};

// Staggered Children Animation
export const StaggeredContainer = ({
  children,
  staggerDelay = 0.1,
  className = ''
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered Item
export const StaggeredItem = ({
  children,
  className = '',
  delay = 0
}) => {
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: delay
      }
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Parallax Scroll Container
export const ParallaxContainer = ({
  children,
  speed = 0.5,
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      style={{
        y: `${speed * -100}%`
      }}
      transition={{ type: "spring", stiffness: 400, damping: 90 }}
    >
      {children}
    </motion.div>
  );
};

// Hover Animation Wrapper
export const HoverAnimation = ({
  children,
  scale = 1.05,
  rotate = 0,
  y = -5,
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      whileHover={{
        scale: scale,
        rotate: rotate,
        y: y,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
};

// Floating Animation
export const FloatingAnimation = ({
  children,
  amplitude = 10,
  duration = 3,
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -amplitude, 0]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Pulse Animation
export const PulseAnimation = ({
  children,
  scale = 1.1,
  duration = 2,
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, scale, 1]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Reveal Animation (for text or content)
export const RevealAnimation = ({
  children,
  direction = 'up',
  delay = 0,
  className = ''
}) => {
  const directions = {
    up: { y: 50 },
    down: { y: -50 },
    left: { x: 50 },
    right: { x: -50 }
  };

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        ...directions[direction]
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0
      }}
      transition={{
        duration: 0.6,
        delay: delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
