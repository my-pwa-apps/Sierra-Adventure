/**
 * Color palette for Sierra Adventure
 * Consistent colors for all game graphics
 */

export const COLORS = {
  // Base colors
  TRANSPARENT: 'transparent',
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  
  // Dark tones for backgrounds
  DARK_BROWN: '#331100',
  DARK_BLUE: '#112233',
  DARK_TAN: '#332211',
  DARK_PURPLE: '#221122',
  DARK_WINE: '#330022',
  
  // Character colors
  PLAYER_COLOR: '#ff9900',
  SKIN_TONE: '#FFC8A2',
  HAIR_BROWN: '#8B4513',
  SHIRT_BLUE: '#3050FF',
  PANTS_NAVY: '#152266',
  
  // Environment colors
  WOOD: '#8B4513',
  BRICK: '#AA3333',
  METAL: '#AAAAAA',
  GLASS: '#CCDDFF',
  PLANT: '#006400',
  
  // Additional colors
  RED: '#FF0000',
  GREEN: '#00FF00',
  BLUE: '#0000FF',
  YELLOW: '#FFFF00',
  CYAN: '#00FFFF',
  MAGENTA: '#FF00FF',
  
  // UI colors
  UI_BG: '#222222',
  UI_TEXT: '#FFFFFF',
  UI_ACCENT: '#00AA00',
  UI_HIGHLIGHT: '#FFFF00'
};

// Helper functions for color manipulation
export const ColorUtils = {
  /**
   * Adjust a color's brightness
   * @param {string} color - Hex color code
   * @param {number} amount - Amount to adjust (-255 to 255)
   * @returns {string} Modified color
   */
  adjustBrightness(color, amount) {
    if (!color || color === COLORS.TRANSPARENT) return color;
    
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },
  
  /**
   * Create a random color
   * @returns {string} Random hex color
   */
  randomColor() {
    return `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
  }
};

// Make available globally for non-module code
window.COLORS = COLORS;
window.ColorUtils = ColorUtils;
