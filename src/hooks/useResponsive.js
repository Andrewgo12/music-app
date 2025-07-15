import { useState, useEffect } from 'react';

// Breakpoints following Tailwind CSS conventions
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  });

  const [deviceType, setDeviceType] = useState('desktop');
  const [orientation, setOrientation] = useState('landscape');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setWindowSize({ width, height });

      // Determine device type
      if (width < breakpoints.md) {
        setDeviceType('mobile');
      } else if (width < breakpoints.lg) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }

      // Determine orientation
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    // Set initial values
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Utility functions
  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isDesktop = deviceType === 'desktop';
  const isPortrait = orientation === 'portrait';
  const isLandscape = orientation === 'landscape';

  // Breakpoint checks
  const isAbove = (breakpoint) => windowSize.width >= breakpoints[breakpoint];
  const isBelow = (breakpoint) => windowSize.width < breakpoints[breakpoint];
  const isBetween = (min, max) =>
    windowSize.width >= breakpoints[min] && windowSize.width < breakpoints[max];

  // Grid columns based on screen size
  const getGridColumns = (config = {}) => {
    const {
      mobile = 1,
      tablet = 2,
      desktop = 3,
      xl = 4,
      '2xl': xxl = 5
    } = config;

    if (windowSize.width >= breakpoints['2xl']) return xxl;
    if (windowSize.width >= breakpoints.xl) return xl;
    if (windowSize.width >= breakpoints.lg) return desktop;
    if (windowSize.width >= breakpoints.md) return tablet;
    return mobile;
  };

  // Container padding based on screen size
  const getContainerPadding = () => {
    if (isMobile) return 'px-4';
    if (isTablet) return 'px-6';
    return 'px-8';
  };

  // Text size based on screen size
  const getTextSize = (config = {}) => {
    const {
      mobile = 'text-sm',
      tablet = 'text-base',
      desktop = 'text-lg'
    } = config;

    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  // Spacing based on screen size
  const getSpacing = (config = {}) => {
    const {
      mobile = 'space-y-2',
      tablet = 'space-y-4',
      desktop = 'space-y-6'
    } = config;

    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  return {
    windowSize,
    deviceType,
    orientation,
    isMobile,
    isTablet,
    isDesktop,
    isPortrait,
    isLandscape,
    isAbove,
    isBelow,
    isBetween,
    getGridColumns,
    getContainerPadding,
    getTextSize,
    getSpacing,
    breakpoints
  };
};

// Hook for media queries
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// Hook for touch device detection
export const useTouch = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkTouch();
    window.addEventListener('touchstart', checkTouch, { once: true });

    return () => window.removeEventListener('touchstart', checkTouch);
  }, []);

  return isTouch;
};

// Hook for keyboard navigation
export const useKeyboard = () => {
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return isKeyboardUser;
};

// Hook for reduced motion preference
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Hook for dark mode preference
export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDarkMode;
};

// Utility functions for responsive design
export const getResponsiveValue = (values, deviceType) => {
  if (deviceType === 'mobile' && values.mobile) return values.mobile;
  if (deviceType === 'tablet' && values.tablet) return values.tablet;
  if (deviceType === 'desktop' && values.desktop) return values.desktop;
  return values.default || values.desktop || values.tablet || values.mobile;
};

export const getResponsiveClass = (classes, deviceType) => {
  return getResponsiveValue(classes, deviceType);
};
