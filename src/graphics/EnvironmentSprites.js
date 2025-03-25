import { PixelSprite } from './PixelSprite.js';
import { COLORS, ColorUtils } from '../common/color-palette.js';

/**
 * Helper functions for sprite generation
 */
function createSimpleTile(mainColor, accentColor, size = 4) {
  const tile = [];
  
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
  [COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.WOOD, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.WOOD, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.WOOD, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
]);

// Pine tree sprite
export const pineTree = new PixelSprite([
  [COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.DARK_GREEN, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.DARK_GREEN, COLORS.DARK_GREEN, COLORS.DARK_GREEN, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.GREEN, COLORS.DARK_GREEN, COLORS.GREEN, COLORS.TRANSPARENT],
  [COLORS.DARK_GREEN, COLORS.GREEN, COLORS.DARK_GREEN, COLORS.GREEN, COLORS.DARK_GREEN],
  [COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.WOOD, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.WOOD, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
]);

// Bush sprite
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
export const grass = new PixelSprite(createSimpleTile(COLORS.GREEN, COLORS.DARK_GREEN));

// Water tile sprite - using helper function
export const water = new PixelSprite(createSimpleTile(COLORS.BLUE, COLORS.LIGHT_BLUE));

// Sand tile
export const sand = new PixelSprite(createSimpleTile(COLORS.YELLOW, COLORS.LIGHT_BROWN));

/**
 * STRUCTURE SPRITES
 */
// House sprite
export const house = new PixelSprite([
  [COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.RED, COLORS.RED, COLORS.RED, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED, COLORS.TRANSPARENT],
  [COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED],
  [COLORS.WOOD, COLORS.WOOD, COLORS.WOOD, COLORS.WOOD, COLORS.WOOD, COLORS.WOOD, COLORS.WOOD],
  [COLORS.WOOD, COLORS.WOOD, COLORS.YELLOW, COLORS.WOOD, COLORS.YELLOW, COLORS.WOOD, COLORS.WOOD],
  [COLORS.WOOD, COLORS.WOOD, COLORS.YELLOW, COLORS.WOOD, COLORS.YELLOW, COLORS.WOOD, COLORS.WOOD],
  [COLORS.WOOD, COLORS.WOOD, COLORS.WOOD, COLORS.WOOD, COLORS.WOOD, COLORS.WOOD, COLORS.WOOD],
]);

// Small cabin
export const cabin = new PixelSprite([
  [COLORS.TRANSPARENT, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.TRANSPARENT],
  [COLORS.DARK_BROWN, COLORS.WOOD, COLORS.WOOD, COLORS.DARK_BROWN],
  [COLORS.DARK_BROWN, COLORS.YELLOW, COLORS.WOOD, COLORS.DARK_BROWN],
  [COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN],
]);

/**
 * Helper function to adjust a hex color's brightness
 */
function adjustColor(color, amount) {
  if (color === COLORS.TRANSPARENT) return color;
  return ColorUtils.adjustBrightness(color, amount);
}

/**
 * Get a random tile with slight variations for natural environment areas
 */
export function getRandomTile(baseSprite, variationPercent = 10) {
  // Clone the sprite's internal grid and add small variations
  const grid = baseSprite.grid;
  const width = grid[0]?.length || 0;
  const height = grid.length;
  
  const newGrid = [];
  
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

// Export all sprites as a collection
export const environmentSprites = {
  tree,
  pineTree,
  bush,
  rock,
  grass,
  water,
  sand,
  house,
  cabin,
  getRandomTile
};

// Make available globally for non-module code
window.environmentSprites = environmentSprites;
