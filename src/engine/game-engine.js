/**
 * Game Engine - Main engine for Sierra Adventure Game
 * Bridges old code with new modular architecture
 */
import { PixelSprite } from '../graphics/PixelSprite.js';
import { COLORS } from '../common/color-palette.js';

// Create base game engine
const GameEngine = {
  init() {
    console.log('Initializing game engine and compatibility layer...');
    
    // Initialize global objects
    this.initGlobalObjects();
    
    // Generate sprites and backgrounds
    this.generateSprites();
    
    // Create compatibility with original code
    this.createBackwardCompatibility();
    
    // Initialize the original SierraAdventure if available
    if (window.SierraAdventure && typeof window.SierraAdventure.init === 'function') {
      console.log('Original SierraAdventure found, initializing...');
      window.SierraAdventure.init();
    } else {
      console.log('Creating new SierraAdventure instance...');
      // Create SierraAdventure if it doesn't exist
      this.createSierraAdventure();
    }
    
    return this;
  },
  
  initGlobalObjects() {
    // Ensure these objects exist
    window.gameSprites = window.gameSprites || {};
    window.gameImages = window.gameImages || {};
    
    // Create COLORS global if not available
    if (!window.COLORS) {
      window.COLORS = COLORS;
    }
  },
  
  generateSprites() {
    // Generate player character sprite
    const playerSprite = new PixelSprite([
      [COLORS.TRANSPARENT, COLORS.BROWN, COLORS.BROWN, COLORS.TRANSPARENT],
      [COLORS.BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.BROWN], 
      [COLORS.TRANSPARENT, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.TRANSPARENT],
      [COLORS.TRANSPARENT, COLORS.BLUE, COLORS.BLUE, COLORS.TRANSPARENT],
      [COLORS.BLUE, COLORS.BLUE, COLORS.BLUE, COLORS.BLUE],
      [COLORS.BLUE, COLORS.BLUE, COLORS.BLUE, COLORS.BLUE],
      [COLORS.TRANSPARENT, COLORS.DARK_GREY, COLORS.DARK_GREY, COLORS.TRANSPARENT],
      [COLORS.TRANSPARENT, COLORS.DARK_GREY, COLORS.DARK_GREY, COLORS.TRANSPARENT]
    ]);
    
    // Register basic sprites
    window.gameSprites.playerCharacter = playerSprite;
    
    // Generate room backgrounds
    this.generateRoomBackgrounds();
    
    // Generate other required sprites
    this.generateEnvironmentSprites();
  },
  
  generateRoomBackgrounds() {
    const rooms = ['bar', 'street', 'hotel-lobby', 'hotel-hallway', 'secret-room'];
    const colors = [
      COLORS.DARK_BROWN, 
      COLORS.DARK_GREY, 
      COLORS.DARK_BLUE,
      COLORS.DARK_GREEN,
      COLORS.DARK_BLUE
    ];
    
    rooms.forEach((room, index) => {
      // Create a simple background with the appropriate color
      const bgCanvas = document.createElement('canvas');
      bgCanvas.width = 640;
      bgCanvas.height = 400;
      const ctx = bgCanvas.getContext('2d');
      
      // Fill with base color
      ctx.fillStyle = colors[index] || COLORS.BLACK;
      ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
      
      // Add some texture
      for (let i = 0; i < 500; i++) {
        const x = Math.floor(Math.random() * bgCanvas.width);
        const y = Math.floor(Math.random() * bgCanvas.height);
        const size = Math.floor(Math.random() * 3) + 1;
        const brightness = Math.random() > 0.5 ? 20 : -20;
        
        // Adjust color randomly
        ctx.fillStyle = this.adjustColor(colors[index] || COLORS.BLACK, brightness);
        ctx.fillRect(x, y, size, size);
      }
      
      // Add floor
      ctx.fillStyle = this.adjustColor(colors[index] || COLORS.BLACK, -30);
      ctx.fillRect(0, bgCanvas.height - 50, bgCanvas.width, 50);
      
      // Create data URL and store in gameImages
      const dataUrl = bgCanvas.toDataURL();
      window.gameImages[`${room}-background.png`] = dataUrl;
    });
  },
  
  generateEnvironmentSprites() {
    // Generate basic hotspot sprites
    const hotspotNames = ['bartender', 'door', 'barstool', 'mysterious-woman', 'hotel-key'];
    const colors = [COLORS.BLUE, COLORS.BROWN, COLORS.LIGHT_BROWN, COLORS.RED, COLORS.YELLOW];
    
    hotspotNames.forEach((name, index) => {
      const sprite = new PixelSprite([
        [COLORS.TRANSPARENT, colors[index], colors[index], COLORS.TRANSPARENT],
        [colors[index], colors[index], colors[index], colors[index]],
        [colors[index], colors[index], colors[index], colors[index]],
        [COLORS.TRANSPARENT, colors[index], colors[index], COLORS.TRANSPARENT]
      ]);
      
      window.gameSprites[name] = sprite;
    });
  },
  
  createBackwardCompatibility() {
    // Create required global functions
    window.SimpleSprite = function(grid) {
      return new PixelSprite(grid);
    };
    
    // Convert sprites to data URLs
    Object.entries(window.gameSprites).forEach(([name, sprite]) => {
      if (sprite instanceof PixelSprite) {
        // Generate a data URL for the sprite
        const canvas = document.createElement('canvas');
        canvas.width = sprite.getWidth() * 4; // Scale up for better visibility
        canvas.height = sprite.getHeight() * 4;
        const ctx = canvas.getContext('2d');
        sprite.render(ctx, 0, 0, 4);
        
        window.gameImages[name] = canvas.toDataURL();
        // Also add .png version for backward compatibility
        window.gameImages[`${name}.png`] = canvas.toDataURL();
      }
    });
  },
  
  createSierraAdventure() {
    // Create base SierraAdventure object with the original structure
    window.SierraAdventure = {
      // Copy properties from the original code structure
      gameState: {
        currentRoom: 'bar',
        inventory: [],
        score: 0,
        gameTime: 0,
        playerAction: 'walk',
        selectedItem: null,
        playerName: 'Larry',
        flags: {
          talkedToBartender: false,
          gotHotelKey: false,
          solvedPuzzle: false
        }
      },
      
      // Rooms data from original structure
      rooms: {
        bar: {
          background: 'bar-background.png',
          description: "You're in a dimly lit bar called 'The Thirsty Snake'. The air is thick with smoke and the sounds of jazz music.",
          hotspots: [
            // ...All the original hotspots...
          ],
          exits: {
            'street': { x: 50, y: 200 }
          }
        },
        // ...Other rooms...
      },
      
      // Initialize with basic functionality
      init: function() {
        console.log('Initializing SierraAdventure from compatibility layer...');
        
        // Cache DOM elements
        this.cacheDOMElements();
        
        // Set up event handlers
        this.setupEventListeners();
        
        // Generate player sprite
        this.generatePlayerSprite();
        
        // Update the current room
        this.updateRoom();
        
        // Start game timer
        setInterval(() => this.updateGameTime(), 1000);
        
        // Show welcome message
        this.showMessage(`Welcome to "Hotel of Desire: A Sierra-style Adventure"! You are ${this.gameState.playerName}, a lovable loser on a quest for love and excitement in the big city. Type 'help' for commands.`);
      },
      
      // Placeholder methods to be filled in as needed
      cacheDOMElements: function() {
        // Cache DOM elements here
      },
      
      setupEventListeners: function() {
        // Set up event listeners here
      },
      
      generatePlayerSprite: function() {
        // Generate player sprite here
      },
      
      updateRoom: function() {
        // Update room display here
      },
      
      updateGameTime: function() {
        // Update game time display here
      },
      
      showMessage: function(message) {
        // Show message to the player
        alert(message); // Fallback
      }
    };
    
    // Initialize the newly created SierraAdventure
    window.SierraAdventure.init();
  },
  
  // Utility: adjust color brightness
  adjustColor(color, amount) {
    // Basic color adjustment
    if (color === 'transparent') return color;
    
    // Parse hex color
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
    
    // Return hex color
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
};

// Make available globally
window.gameEngine = GameEngine;

// Export as module
export default GameEngine;
