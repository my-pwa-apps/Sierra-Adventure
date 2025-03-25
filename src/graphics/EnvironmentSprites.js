import { PixelSprite } from './PixelSprite.js';
import { COLORS, ColorUtils } from '../common/color-palette.js';

// Function to create simple tile sprites
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

// Basic sprites for the environment
export const environmentSprites = {
  // Generate simple background
  createBackground(color = COLORS.DARK_BLUE) {
    const grid = [];
    for (let y = 0; y < 30; y++) {
      grid[y] = [];
      for (let x = 0; x < 40; x++) {
        // Add slight variations
        const variation = Math.floor(Math.random() * 20) - 10;
        grid[y][x] = ColorUtils.adjustBrightness(color, variation);
      }
    }
    return new PixelSprite(grid);
  },
  
  // Generate room-specific backgrounds
  generateRoomBackground(roomId) {
    switch (roomId) {
      case 'bar':
        return this.createBarBackground();
      case 'street':
        return this.createStreetBackground();
      case 'hotel-lobby':
        return this.createHotelLobbyBackground();
      case 'hotel-hallway':
        return this.createHotelHallwayBackground();
      case 'secret-room':
        return this.createSecretRoomBackground();
      default:
        return this.createBackground();
    }
  },
  
  // Generate character sprites
  generateCharacterSprite(type) {
    switch (type) {
      case 'bartender':
        return this.createBartenderSprite();
      case 'player':
      case 'playerCharacter':
        return this.createPlayerSprite();
      case 'mysterious-woman':
        return this.createWomanSprite();
      default:
        return this.createDefaultCharacterSprite();
    }
  },
  
  // Specific background creators
  createBarBackground() {
    // Bar background implementation
    const background = this.createBackground(COLORS.DARK_BROWN);
    return background;
  },
  
  createStreetBackground() {
    // Street background implementation
    const background = this.createBackground(COLORS.DARK_GREY);
    return background;
  },
  
  createHotelLobbyBackground() {
    // Hotel lobby background implementation
    const background = this.createBackground(COLORS.DARK_RED);
    return background;
  },
  
  createHotelHallwayBackground() {
    // Hotel hallway background implementation
    const background = this.createBackground(COLORS.DARK_PURPLE);
    return background;
  },
  
  createSecretRoomBackground() {
    // Secret room background implementation
    const background = this.createBackground(COLORS.DARK_GREEN);
    return background;
  },
  
  // Character sprite creators
  createPlayerSprite() {
    return new PixelSprite([
      [COLORS.TRANSPARENT, COLORS.BROWN, COLORS.BROWN, COLORS.TRANSPARENT],
      [COLORS.BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.BROWN],
      [COLORS.TRANSPARENT, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.TRANSPARENT],
      [COLORS.TRANSPARENT, COLORS.BLUE, COLORS.BLUE, COLORS.TRANSPARENT],
      [COLORS.BLUE, COLORS.BLUE, COLORS.BLUE, COLORS.BLUE],
      [COLORS.BLUE, COLORS.BLUE, COLORS.BLUE, COLORS.BLUE],
      [COLORS.TRANSPARENT, COLORS.DARK_GREY, COLORS.DARK_GREY, COLORS.TRANSPARENT],
      [COLORS.TRANSPARENT, COLORS.DARK_GREY, COLORS.DARK_GREY, COLORS.TRANSPARENT]
    ]);
  },
  
  createBartenderSprite() {
    // Bartender sprite implementation
    return new PixelSprite([
      [COLORS.TRANSPARENT, COLORS.BLACK, COLORS.BLACK, COLORS.TRANSPARENT],
      [COLORS.DARK_BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.DARK_BROWN],
      [COLORS.DARK_BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.DARK_BROWN],
      [COLORS.TRANSPARENT, COLORS.GREY, COLORS.GREY, COLORS.TRANSPARENT],
      [COLORS.GREY, COLORS.GREY, COLORS.GREY, COLORS.GREY],
      [COLORS.GREY, COLORS.GREY, COLORS.GREY, COLORS.GREY],
      [COLORS.TRANSPARENT, COLORS.BLACK, COLORS.BLACK, COLORS.TRANSPARENT],
      [COLORS.TRANSPARENT, COLORS.BLACK, COLORS.BLACK, COLORS.TRANSPARENT]
    ]);
  },
  
  createWomanSprite() {
    // Mysterious woman sprite implementation
    return new PixelSprite([
      [COLORS.TRANSPARENT, COLORS.YELLOW, COLORS.YELLOW, COLORS.TRANSPARENT],
      [COLORS.YELLOW, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.YELLOW],
      [COLORS.TRANSPARENT, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.TRANSPARENT],
      [COLORS.TRANSPARENT, COLORS.RED, COLORS.RED, COLORS.TRANSPARENT],
      [COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED],
      [COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED],
      [COLORS.TRANSPARENT, COLORS.RED, COLORS.RED, COLORS.TRANSPARENT],
      [COLORS.TRANSPARENT, COLORS.RED, COLORS.RED, COLORS.TRANSPARENT]
    ]);
  },
  
  createDefaultCharacterSprite() {
    // Generic character sprite
    return new PixelSprite([
      [COLORS.TRANSPARENT, COLORS.GREY, COLORS.GREY, COLORS.TRANSPARENT],
      [COLORS.GREY, COLORS.LIGHT_GREY, COLORS.LIGHT_GREY, COLORS.GREY],
      [COLORS.TRANSPARENT, COLORS.LIGHT_GREY, COLORS.LIGHT_GREY, COLORS.TRANSPARENT],
      [COLORS.TRANSPARENT, COLORS.GREY, COLORS.GREY, COLORS.TRANSPARENT],
      [COLORS.GREY, COLORS.GREY, COLORS.GREY, COLORS.GREY],
      [COLORS.GREY, COLORS.GREY, COLORS.GREY, COLORS.GREY],
      [COLORS.TRANSPARENT, COLORS.DARK_GREY, COLORS.DARK_GREY, COLORS.TRANSPARENT],
      [COLORS.TRANSPARENT, COLORS.DARK_GREY, COLORS.DARK_GREY, COLORS.TRANSPARENT]
    ]);
  }
};

// Add missing color definitions for backward compatibility
if (!COLORS.DARK_RED) COLORS.DARK_RED = '#8B0000';
if (!COLORS.DARK_PURPLE) COLORS.DARK_PURPLE = '#301934';

// Make available globally for backward compatibility
window.gameSprites = window.gameSprites || {};
window.environmentSprites = environmentSprites;
