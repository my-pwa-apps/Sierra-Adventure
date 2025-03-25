/**
 * Color palette for Sierra Adventure
 */

// Define color constants
export const COLORS = {
  // Base colors
  TRANSPARENT: 'transparent',
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  
  // Earth tones
  BROWN: '#8B4513',
  DARK_BROWN: '#5C3317',
  LIGHT_BROWN: '#D2B48C',
  
  // Greens
  DARK_GREEN: '#006400',
  GREEN: '#008000',
  LIGHT_GREEN: '#90EE90',
  
  // Greys
  DARK_GREY: '#404040',
  GREY: '#808080',
  LIGHT_GREY: '#C0C0C0',
  
  // Blues
  DARK_BLUE: '#00008B',
  BLUE: '#0000FF',
  LIGHT_BLUE: '#ADD8E6',
  
  // Other
  RED: '#FF0000',
  YELLOW: '#FFFF00',
  ORANGE: '#FFA500'
};

// Color utility functions
export const ColorUtils = {
  adjustBrightness(color, amount) {
    if (!color || color === COLORS.TRANSPARENT) return color;
    
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
};

// Make available globally for compatibility
window.COLORS = COLORS;
window.ColorUtils = ColorUtils;
