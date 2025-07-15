// Advanced theme system with dynamic colors and customization
import React from 'react';

export const themes = {
  dark: {
    name: 'Dark',
    colors: {
      primary: '#10b981',
      primaryHover: '#059669',
      secondary: '#6b7280',
      background: '#111827',
      surface: '#1f2937',
      surfaceHover: '#374151',
      text: '#ffffff',
      textSecondary: '#9ca3af',
      textMuted: '#6b7280',
      border: '#374151',
      accent: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      success: '#10b981',
      info: '#3b82f6'
    },
    shadows: {
      small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      large: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    }
  },

  light: {
    name: 'Light',
    colors: {
      primary: '#059669',
      primaryHover: '#047857',
      secondary: '#6b7280',
      background: '#ffffff',
      surface: '#f9fafb',
      surfaceHover: '#f3f4f6',
      text: '#111827',
      textSecondary: '#4b5563',
      textMuted: '#6b7280',
      border: '#e5e7eb',
      accent: '#059669',
      error: '#dc2626',
      warning: '#d97706',
      success: '#059669',
      info: '#2563eb'
    },
    shadows: {
      small: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      large: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    }
  },

  midnight: {
    name: 'Midnight',
    colors: {
      primary: '#8b5cf6',
      primaryHover: '#7c3aed',
      secondary: '#6b7280',
      background: '#0f0f23',
      surface: '#1a1a2e',
      surfaceHover: '#16213e',
      text: '#ffffff',
      textSecondary: '#a5b4fc',
      textMuted: '#6b7280',
      border: '#16213e',
      accent: '#8b5cf6',
      error: '#ef4444',
      warning: '#f59e0b',
      success: '#10b981',
      info: '#3b82f6'
    },
    shadows: {
      small: '0 1px 2px 0 rgba(139, 92, 246, 0.1)',
      medium: '0 4px 6px -1px rgba(139, 92, 246, 0.2)',
      large: '0 10px 15px -3px rgba(139, 92, 246, 0.3)',
      xl: '0 20px 25px -5px rgba(139, 92, 246, 0.4)'
    }
  },

  ocean: {
    name: 'Ocean',
    colors: {
      primary: '#0ea5e9',
      primaryHover: '#0284c7',
      secondary: '#64748b',
      background: '#0c1821',
      surface: '#1e293b',
      surfaceHover: '#334155',
      text: '#ffffff',
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
      border: '#334155',
      accent: '#0ea5e9',
      error: '#ef4444',
      warning: '#f59e0b',
      success: '#10b981',
      info: '#0ea5e9'
    },
    shadows: {
      small: '0 1px 2px 0 rgba(14, 165, 233, 0.1)',
      medium: '0 4px 6px -1px rgba(14, 165, 233, 0.2)',
      large: '0 10px 15px -3px rgba(14, 165, 233, 0.3)',
      xl: '0 20px 25px -5px rgba(14, 165, 233, 0.4)'
    }
  },

  sunset: {
    name: 'Sunset',
    colors: {
      primary: '#f97316',
      primaryHover: '#ea580c',
      secondary: '#78716c',
      background: '#1c1917',
      surface: '#292524',
      surfaceHover: '#44403c',
      text: '#ffffff',
      textSecondary: '#d6d3d1',
      textMuted: '#a8a29e',
      border: '#44403c',
      accent: '#f97316',
      error: '#ef4444',
      warning: '#f59e0b',
      success: '#10b981',
      info: '#3b82f6'
    },
    shadows: {
      small: '0 1px 2px 0 rgba(249, 115, 22, 0.1)',
      medium: '0 4px 6px -1px rgba(249, 115, 22, 0.2)',
      large: '0 10px 15px -3px rgba(249, 115, 22, 0.3)',
      xl: '0 20px 25px -5px rgba(249, 115, 22, 0.4)'
    }
  }
};

export class ThemeSystem {
  constructor() {
    this.currentTheme = 'dark';
    this.customThemes = this.loadCustomThemes();
    this.accentColor = '#10b981';
    this.listeners = [];
  }

  // Load custom themes from localStorage
  loadCustomThemes() {
    const stored = localStorage.getItem('music_custom_themes');
    return stored ? JSON.parse(stored) : {};
  }

  // Save custom themes to localStorage
  saveCustomThemes() {
    localStorage.setItem('music_custom_themes', JSON.stringify(this.customThemes));
  }

  // Get current theme
  getCurrentTheme() {
    return themes[this.currentTheme] || this.customThemes[this.currentTheme] || themes.dark;
  }

  // Set theme
  setTheme(themeName) {
    if (themes[themeName] || this.customThemes[themeName]) {
      this.currentTheme = themeName;
      this.applyTheme();
      this.notifyListeners();
      localStorage.setItem('music_current_theme', themeName);
    }
  }

  // Apply theme to CSS variables
  applyTheme() {
    const theme = this.getCurrentTheme();
    const root = document.documentElement;

    // Apply color variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply shadow variables
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // Apply accent color if set
    if (this.accentColor) {
      root.style.setProperty('--color-accent', this.accentColor);
      root.style.setProperty('--color-primary', this.accentColor);
    }
  }

  // Set accent color
  setAccentColor(color) {
    this.accentColor = color;
    this.applyTheme();
    this.notifyListeners();
    localStorage.setItem('music_accent_color', color);
  }

  // Create custom theme
  createCustomTheme(name, baseTheme, customizations = {}) {
    const base = themes[baseTheme] || themes.dark;
    const customTheme = {
      name,
      colors: { ...base.colors, ...customizations.colors },
      shadows: { ...base.shadows, ...customizations.shadows }
    };

    this.customThemes[name] = customTheme;
    this.saveCustomThemes();
    return customTheme;
  }

  // Delete custom theme
  deleteCustomTheme(name) {
    if (this.customThemes[name]) {
      delete this.customThemes[name];
      this.saveCustomThemes();

      // Switch to default theme if current theme was deleted
      if (this.currentTheme === name) {
        this.setTheme('dark');
      }
    }
  }

  // Get all available themes
  getAllThemes() {
    return { ...themes, ...this.customThemes };
  }

  // Generate theme from image
  async generateThemeFromImage(imageUrl) {
    try {
      const colors = await this.extractColorsFromImage(imageUrl);
      const themeName = `Generated_${Date.now()}`;

      const customTheme = this.createCustomTheme(themeName, 'dark', {
        colors: {
          primary: colors.primary,
          primaryHover: this.darkenColor(colors.primary, 0.1),
          accent: colors.accent,
          surface: colors.surface,
          surfaceHover: this.lightenColor(colors.surface, 0.1)
        }
      });

      return { name: themeName, theme: customTheme };
    } catch (error) {
      console.error('Failed to generate theme from image:', error);
      throw error;
    }
  }

  // Extract colors from image using canvas
  async extractColorsFromImage(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const colors = this.analyzeImageColors(imageData);

        resolve(colors);
      };

      img.onerror = reject;
      img.src = imageUrl;
    });
  }

  // Analyze image colors to extract palette
  analyzeImageColors(imageData) {
    const data = imageData.data;
    const colorCounts = {};

    // Sample every 10th pixel for performance
    for (let i = 0; i < data.length; i += 40) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];

      if (alpha > 128) { // Skip transparent pixels
        const color = `rgb(${r},${g},${b})`;
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      }
    }

    // Get most common colors
    const sortedColors = Object.entries(colorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([color]) => color);

    // Extract meaningful colors
    const primary = this.findBestColor(sortedColors, 'vibrant');
    const accent = this.findBestColor(sortedColors, 'bright');
    const surface = this.findBestColor(sortedColors, 'dark');

    return {
      primary: primary || '#10b981',
      accent: accent || '#3b82f6',
      surface: surface || '#1f2937'
    };
  }

  // Find best color for specific purpose
  findBestColor(colors, type) {
    // This is a simplified implementation
    // In a real app, you'd use more sophisticated color analysis
    switch (type) {
      case 'vibrant':
        return colors.find(color => {
          const [r, g, b] = this.parseRgb(color);
          const saturation = this.getSaturation(r, g, b);
          return saturation > 0.5;
        }) || colors[0];

      case 'bright':
        return colors.find(color => {
          const [r, g, b] = this.parseRgb(color);
          const brightness = (r + g + b) / 3;
          return brightness > 128;
        }) || colors[1];

      case 'dark':
        return colors.find(color => {
          const [r, g, b] = this.parseRgb(color);
          const brightness = (r + g + b) / 3;
          return brightness < 64;
        }) || colors[colors.length - 1];

      default:
        return colors[0];
    }
  }

  // Parse RGB string to values
  parseRgb(rgbString) {
    const match = rgbString.match(/rgb\((\d+),(\d+),(\d+)\)/);
    return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [0, 0, 0];
  }

  // Calculate color saturation
  getSaturation(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return max === 0 ? 0 : (max - min) / max;
  }

  // Darken color by percentage
  darkenColor(color, amount) {
    const [r, g, b] = this.parseRgb(color);
    return `rgb(${Math.round(r * (1 - amount))},${Math.round(g * (1 - amount))},${Math.round(b * (1 - amount))})`;
  }

  // Lighten color by percentage
  lightenColor(color, amount) {
    const [r, g, b] = this.parseRgb(color);
    return `rgb(${Math.round(r + (255 - r) * amount)},${Math.round(g + (255 - g) * amount)},${Math.round(b + (255 - b) * amount)})`;
  }

  // Add theme change listener
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Remove theme change listener
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify all listeners of theme change
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.getCurrentTheme()));
  }

  // Initialize theme system
  initialize() {
    // Load saved theme
    const savedTheme = localStorage.getItem('music_current_theme');
    if (savedTheme) {
      this.currentTheme = savedTheme;
    }

    // Load saved accent color
    const savedAccent = localStorage.getItem('music_accent_color');
    if (savedAccent) {
      this.accentColor = savedAccent;
    }

    // Apply theme
    this.applyTheme();

    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addListener((e) => {
        if (this.currentTheme === 'auto') {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  // Export theme
  exportTheme(themeName) {
    const theme = this.customThemes[themeName];
    if (theme) {
      const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${themeName}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  // Import theme
  async importTheme(file) {
    try {
      const text = await file.text();
      const theme = JSON.parse(text);
      const name = theme.name || file.name.replace('.json', '');

      this.customThemes[name] = theme;
      this.saveCustomThemes();

      return name;
    } catch (error) {
      console.error('Failed to import theme:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const themeSystem = new ThemeSystem();

// React hook for using theme system
export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = React.useState(themeSystem.getCurrentTheme());

  React.useEffect(() => {
    const unsubscribe = themeSystem.addListener((theme) => {
      setCurrentTheme(theme);
    });

    return unsubscribe;
  }, []);

  return {
    currentTheme,
    theme: themeSystem.getTheme(),
    setTheme: themeSystem.setTheme.bind(themeSystem),
    availableThemes: themeSystem.getAvailableThemes(),
    isDark: themeSystem.isDark(),
    isLight: themeSystem.isLight()
  };
};
