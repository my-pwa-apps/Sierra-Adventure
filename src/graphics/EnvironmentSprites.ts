import { PixelSprite } from './PixelSprite';

/**
 * Enhanced color palette with semantic groupings
 */
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
  ORANGE: '#FFA500',
};

/**
 * Helper functions for sprite generation
 */
function createSimpleTile(mainColor: string, accentColor: string, size: number = 4): string[][] {
  const tile: string[][] = [];
  
  for (let y = 0; y < size; y++) {
    tile[y] = [];
    for (let x = 0; x < size; x++) {
      // Add some variations with accent color
      const isAccent = Math.random() > 0.8;
      tile[y][x] = isAccent ? accentColor : mainColor;
    }
  }
  
  return tile;
}

/**
 * VEGETATION SPRITES
 */
// Tree sprite
export const tree = new PixelSprite([
  [COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.DARK_GREEN, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.DARK_GREEN, COLORS.DARK_GREEN, COLORS.DARK_GREEN, COLORS.TRANSPARENT],
  [COLORS.DARK_GREEN, COLORS.DARK_GREEN, COLORS.DARK_GREEN, COLORS.DARK_GREEN, COLORS.DARK_GREEN],
  [COLORS.TRANSPARENT, COLORS.DARK_GREEN, COLORS.DARK_GREEN, COLORS.DARK_GREEN, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.BROWN, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.BROWN, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.BROWN, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
]);

// Pine tree sprite (new)
export const pineTree = new PixelSprite([
  [COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.DARK_GREEN, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.DARK_GREEN, COLORS.DARK_GREEN, COLORS.DARK_GREEN, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.GREEN, COLORS.DARK_GREEN, COLORS.GREEN, COLORS.TRANSPARENT],
  [COLORS.DARK_GREEN, COLORS.GREEN, COLORS.DARK_GREEN, COLORS.GREEN, COLORS.DARK_GREEN],
  [COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.BROWN, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.BROWN, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
]);

// Bush sprite (new)
export const bush = new PixelSprite([
  [COLORS.TRANSPARENT, COLORS.GREEN, COLORS.GREEN, COLORS.TRANSPARENT],
  [COLORS.GREEN, COLORS.DARK_GREEN, COLORS.DARK_GREEN, COLORS.GREEN],
  [COLORS.GREEN, COLORS.GREEN, COLORS.GREEN, COLORS.GREEN],
  [COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
]);

/**
 * TERRAIN SPRITES
 */
// Rock sprite
export const rock = new PixelSprite([
  [COLORS.TRANSPARENT, COLORS.GREY, COLORS.GREY, COLORS.TRANSPARENT],
  [COLORS.GREY, COLORS.GREY, COLORS.GREY, COLORS.GREY],
  [COLORS.GREY, COLORS.DARK_GREY, COLORS.GREY, COLORS.GREY],
  [COLORS.TRANSPARENT, COLORS.GREY, COLORS.GREY, COLORS.TRANSPARENT],
]);

// Grass tile sprite - using helper function for more natural variation
export const grass = new PixelSprite(createSimpleTile(COLORS.LIGHT_GREEN, COLORS.DARK_GREEN));

// Water tile sprite - using helper function
export const water = new PixelSprite(createSimpleTile(COLORS.BLUE, COLORS.LIGHT_BLUE));

// Sand tile (new)
export const sand = new PixelSprite(createSimpleTile(COLORS.YELLOW, COLORS.LIGHT_BROWN));

/**
 * STRUCTURE SPRITES
 */
// House sprite
export const house = new PixelSprite([
  [COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.RED, COLORS.RED, COLORS.RED, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED, COLORS.TRANSPARENT],
  [COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED],
  [COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN],
  [COLORS.BROWN, COLORS.BROWN, COLORS.YELLOW, COLORS.BROWN, COLORS.YELLOW, COLORS.BROWN, COLORS.BROWN],
  [COLORS.BROWN, COLORS.BROWN, COLORS.YELLOW, COLORS.BROWN, COLORS.YELLOW, COLORS.BROWN, COLORS.BROWN],
  [COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN],
]);

// Small cabin (new)
export const cabin = new PixelSprite([
  [COLORS.TRANSPARENT, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.TRANSPARENT],
  [COLORS.DARK_BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.DARK_BROWN],
  [COLORS.DARK_BROWN, COLORS.YELLOW, COLORS.BROWN, COLORS.DARK_BROWN],
  [COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN],
]);

// Add detailed sprites for objects
export const barCounter = new PixelSprite([
  [COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN],
  [COLORS.BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.BROWN],
  [COLORS.BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.BROWN],
  [COLORS.BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.BROWN],
  [COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN]
]);

export const neonSign = new PixelSprite([
  [COLORS.TRANSPARENT, COLORS.PINK, COLORS.PINK, COLORS.TRANSPARENT],
  [COLORS.PINK, COLORS.YELLOW, COLORS.YELLOW, COLORS.PINK],
  [COLORS.PINK, COLORS.YELLOW, COLORS.YELLOW, COLORS.PINK],
  [COLORS.TRANSPARENT, COLORS.PINK, COLORS.PINK, COLORS.TRANSPARENT]
]);

export const liquorBottle = new PixelSprite([
  [COLORS.TRANSPARENT, COLORS.GREEN, COLORS.GREEN, COLORS.TRANSPARENT],
  [COLORS.GREEN, COLORS.LIGHT_GREEN, COLORS.LIGHT_GREEN, COLORS.GREEN],
  [COLORS.GREEN, COLORS.LIGHT_GREEN, COLORS.LIGHT_GREEN, COLORS.GREEN],
  [COLORS.TRANSPARENT, COLORS.GREEN, COLORS.GREEN, COLORS.TRANSPARENT]
]);

// Add more detailed sprites as needed...

/**
 * Get a random tile with slight variations for natural environment areas
 */
export function getRandomTile(baseSprite: PixelSprite, variationPercent: number = 10): PixelSprite {
  // Clone the sprite's internal grid and add small variations
  const grid = baseSprite['grid']; // Assuming 'grid' is accessible or provide a getter
  const width = grid[0]?.length || 0;
  const height = grid.length;
  
  const newGrid: string[][] = [];
  
  for (let y = 0; y < height; y++) {
    newGrid[y] = [...grid[y]];
    for (let x = 0; x < width; x++) {
      // Apply random variations
      if (Math.random() * 100 < variationPercent) {
        // Skip transparent pixels
        if (grid[y][x] !== COLORS.TRANSPARENT) {
          // Slightly darken or lighten
          const darken = Math.random() > 0.5;
          if (darken) {
            // Darken by adding more black
            newGrid[y][x] = adjustColor(grid[y][x], -15);
          } else {
            // Lighten by adding more white
            newGrid[y][x] = adjustColor(grid[y][x], 15);
          }
        }
      }
    }
  }
  
  return new PixelSprite(newGrid);
}

/**
 * Helper function to adjust a hex color's brightness
 */
function adjustColor(color: string, amount: number): string {
  if (color === COLORS.TRANSPARENT) return color;
  
  let hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
