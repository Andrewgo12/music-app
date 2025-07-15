// Animation configurations and utilities for consistent animations across the app

export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8
};

export const EASING = {
  easeOut: [0.0, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  easeInOut: [0.4, 0.0, 0.2, 1],
  spring: { type: "spring", stiffness: 300, damping: 30 },
  bouncy: { type: "spring", stiffness: 400, damping: 10 }
};

// Page transition animations
export const pageTransitions = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: ANIMATION_DURATION.normal, ease: EASING.easeOut }
};

// Card animations
export const cardAnimations = {
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
    transition: { duration: ANIMATION_DURATION.fast, ease: EASING.easeOut }
  },
  tap: {
    scale: 0.98,
    transition: { duration: ANIMATION_DURATION.fast }
  },
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Button animations
export const buttonAnimations = {
  hover: {
    scale: 1.05,
    transition: { duration: ANIMATION_DURATION.fast, ease: EASING.easeOut }
  },
  tap: {
    scale: 0.95,
    transition: { duration: ANIMATION_DURATION.fast }
  },
  loading: {
    rotate: 360,
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  }
};

// Modal animations
export const modalAnimations = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: ANIMATION_DURATION.normal }
  },
  content: {
    initial: { opacity: 0, scale: 0.8, y: 50 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 50 },
    transition: EASING.spring
  }
};

// List item animations
export const listItemAnimations = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  hover: {
    backgroundColor: "rgba(55, 65, 81, 0.5)",
    transition: { duration: ANIMATION_DURATION.fast }
  }
};

// Stagger animations for lists
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Player bar animations
export const playerBarAnimations = {
  initial: { y: 100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 100, opacity: 0 },
  transition: { duration: ANIMATION_DURATION.normal, ease: EASING.easeOut }
};

// Sidebar animations
export const sidebarAnimations = {
  initial: { x: -300, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
  transition: { duration: ANIMATION_DURATION.normal, ease: EASING.easeOut }
};

// Notification animations
export const notificationAnimations = {
  initial: { opacity: 0, x: 300, scale: 0.8 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 300, scale: 0.8 },
  transition: EASING.spring
};

// Loading animations
export const loadingAnimations = {
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  },
  bounce: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Progress bar animations
export const progressAnimations = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  transition: { duration: ANIMATION_DURATION.normal, ease: EASING.easeOut }
};

// Floating action button animations
export const fabAnimations = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  exit: { scale: 0, rotate: 180 },
  hover: {
    scale: 1.1,
    boxShadow: "0 8px 25px rgba(16, 185, 129, 0.3)"
  },
  tap: { scale: 0.9 }
};

// Search result animations
export const searchResultAnimations = {
  container: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: ANIMATION_DURATION.normal }
  },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    hover: {
      backgroundColor: "rgba(55, 65, 81, 0.5)",
      scale: 1.01,
      transition: { duration: ANIMATION_DURATION.fast }
    }
  }
};

// Visualizer animations
export const visualizerAnimations = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: ANIMATION_DURATION.normal, ease: EASING.easeOut }
};

// Utility functions
export const createStaggeredAnimation = (children, staggerDelay = 0.1) => ({
  animate: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1
    }
  }
});

export const createSlideAnimation = (direction = 'right') => {
  const directions = {
    right: { x: 20 },
    left: { x: -20 },
    up: { y: -20 },
    down: { y: 20 }
  };

  return {
    initial: { opacity: 0, ...directions[direction] },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, ...directions[direction] },
    transition: { duration: ANIMATION_DURATION.normal, ease: EASING.easeOut }
  };
};

export const createScaleAnimation = (scale = 0.8) => ({
  initial: { opacity: 0, scale },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale },
  transition: EASING.spring
});

export const createFadeAnimation = (duration = ANIMATION_DURATION.normal) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration, ease: EASING.easeOut }
});

// Gesture animations
export const gestureAnimations = {
  swipeLeft: {
    x: -100,
    opacity: 0,
    transition: { duration: ANIMATION_DURATION.fast }
  },
  swipeRight: {
    x: 100,
    opacity: 0,
    transition: { duration: ANIMATION_DURATION.fast }
  },
  swipeUp: {
    y: -100,
    opacity: 0,
    transition: { duration: ANIMATION_DURATION.fast }
  },
  swipeDown: {
    y: 100,
    opacity: 0,
    transition: { duration: ANIMATION_DURATION.fast }
  }
};

// Theme transition animations
export const themeTransitions = {
  duration: ANIMATION_DURATION.slow,
  ease: EASING.easeInOut
};
