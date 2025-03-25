/**
 * Game Engine - Main engine for Sierra Adventure Game
 */
import { PixelSprite } from '../graphics/PixelSprite.js';
import { environmentSprites } from '../graphics/EnvironmentSprites.js';
import { COLORS } from '../common/color-palette.js';

// Create gameplay-specific engine
const GameEngine = {
  // Initialize with key components
  init() {
    console.log('Initializing game engine...');
    
    // Initialize global objects for compatibility
    this.initGlobalCompat();
    
    // Generate basic sprites
    this.generateDefaultSprites();
    
    // Bridge to original SierraAdventure functionality
    if (window.SierraAdventure && typeof window.SierraAdventure.init === 'function') {
      console.log('Initializing original SierraAdventure code...');
      window.SierraAdventure.init();
    } else {
      console.error('SierraAdventure object not available or missing init function');
    }
    
    return this;
  },
  
  // Setup global compatibility objects
  initGlobalCompat() {
    // Ensure these objects exist for backward compatibility
    window.gameSprites = window.gameSprites || {};
    window.gameImages = window.gameImages || {};
    
    // Generate player character sprite
    const playerCharacter = environmentSprites.createPlayerSprite();
    window.gameSprites.playerCharacter = playerCharacter;
    window.gameImages['player.png'] = playerCharacter.toDataURL(4);
    
    // Generate room backgrounds
    const rooms = ['bar', 'street', 'hotel-lobby', 'hotel-hallway', 'secret-room'];
    rooms.forEach(roomId => {
      const bgSprite = environmentSprites.generateRoomBackground(roomId);
      const basename = roomId + '-background';
      window.gameSprites[basename] = bgSprite;
      window.gameImages[basename + '.png'] = bgSprite.toDataURL(4);
    });
    
    // Generate character sprites
    const characters = ['bartender', 'mysterious-woman'];
    characters.forEach(charId => {
      const charSprite = environmentSprites.generateCharacterSprite(charId);
      window.gameSprites[charId] = charSprite;
    });
  },
  
  // Generate default sprites
  generateDefaultSprites() {
    // Room backgrounds
    const bgNames = ['barScene', 'streetScene', 'hotelLobbyScene', 'hotelHallwayScene', 'secretRoomScene'];
    
    bgNames.forEach(name => {
      const roomId = name.replace('Scene', '');
      const sprite = environmentSprites.generateRoomBackground(roomId);
      window.gameSprites[name] = sprite;
      window.gameImages[name] = sprite.toDataURL(4);
    });
  }
};

// Ensure compatibility with the existing code structure
window.gameEngine = GameEngine;
export default GameEngine;
