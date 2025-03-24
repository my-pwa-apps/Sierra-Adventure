// This script generates all game graphics from code without loading external images
// Add this script to index.html before the main game script

// Define color palette for consistent visuals
const COLORS = {
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
  PLANT: '#006400'
};

// Basic PixelSprite class for creating pixel art
class PixelSprite {
  constructor(grid) {
    this.grid = grid;
    this.height = grid.length;
    this.width = grid.length > 0 ? grid[0].length : 0;
  }
  
  render(ctx, x, y, pixelSize = 1) {
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const color = this.grid[row][col];
        if (color && color !== 'transparent') {
          ctx.fillStyle = color;
          ctx.fillRect(
            x + col * pixelSize, 
            y + row * pixelSize, 
            pixelSize, 
            pixelSize
          );
        }
      }
    }
  }
  
  toDataURL(scale = 1) {
    const canvas = document.createElement('canvas');
    canvas.width = this.width * scale;
    canvas.height = this.height * scale;
    const ctx = canvas.getContext('2d');
    this.render(ctx, 0, 0, scale);
    return canvas.toDataURL();
  }
}

// Generate a pixelated character sprite
function createCharacterSprite(shirtColor, pantsColor) {
  return new PixelSprite([
    [COLORS.TRANSPARENT, COLORS.HAIR_BROWN, COLORS.HAIR_BROWN, COLORS.TRANSPARENT],
    [COLORS.HAIR_BROWN, COLORS.SKIN_TONE, COLORS.SKIN_TONE, COLORS.HAIR_BROWN],
    [COLORS.TRANSPARENT, COLORS.SKIN_TONE, COLORS.SKIN_TONE, COLORS.TRANSPARENT],
    [COLORS.TRANSPARENT, shirtColor, shirtColor, COLORS.TRANSPARENT],
    [shirtColor, shirtColor, shirtColor, shirtColor],
    [shirtColor, shirtColor, shirtColor, shirtColor],
    [COLORS.TRANSPARENT, pantsColor, pantsColor, COLORS.TRANSPARENT],
    [COLORS.TRANSPARENT, pantsColor, pantsColor, COLORS.TRANSPARENT]
  ]);
}

// Create a pixelated background scene
function createSceneBackground(width, height, baseColor, elements) {
  const scaleX = Math.ceil(width / 32);
  const scaleY = Math.ceil(height / 32);
  
  // Create the base grid filled with the background color
  const grid = Array(scaleY).fill(null).map(() => Array(scaleX).fill(baseColor));
  
  // Add floor/ground at the bottom
  const floorColor = adjustColor(baseColor, -20); // Darker color for floor
  const floorStartY = Math.floor(scaleY * 0.8);
  for (let y = floorStartY; y < scaleY; y++) {
    // Fill an entire row at once
    grid[y].fill(floorColor);
  }
  
  // Add elements to the scene (walls, furniture, etc.)
  if (elements && elements.length) {
    elements.forEach(element => {
      const { sprite, x, y } = element;
      if (sprite && x >= 0 && y >= 0 && y + sprite.height <= scaleY && x + sprite.width <= scaleX) {
        for (let sy = 0; sy < sprite.height; sy++) {
          for (let sx = 0; sx < sprite.width; sx++) {
            const color = sprite.grid[sy][sx];
            if (color !== COLORS.TRANSPARENT) {
              grid[y + sy][x + sx] = color;
            }
          }
        }
        
        // Add door highlights if this is a door
        if (sprite.name === 'door') {
          addDoorHighlight(grid, x, y, sprite.width, sprite.height, scaleY, scaleX);
        }
      }
    });
  }
  
  // Add some texture/noise to make the background less flat
  for (let y = 0; y < scaleY; y += 2) {
    for (let x = 0; x < scaleX; x += 2) {
      if (Math.random() > 0.9) {
        grid[y][x] = adjustColor(grid[y][x], Math.random() > 0.5 ? 10 : -10);
      }
    }
  }
  
  return new PixelSprite(grid);
}

// Extract door highlighting to its own function for cleaner code
function addDoorHighlight(grid, doorX, doorY, doorWidth, doorHeight, scaleY, scaleX) {
  // Add a glow effect around doors
  for (let y = Math.max(0, doorY - 1); y < Math.min(scaleY, doorY + doorHeight + 1); y++) {
    for (let x = Math.max(0, doorX - 1); x < Math.min(scaleX, doorX + doorWidth + 1); x++) {
      // Only modify if we're at the border of the door
      if (x === doorX - 1 || x === doorX + doorWidth || 
          y === doorY - 1 || y === doorY + doorHeight) {
        grid[y][x] = '#FFFF99'; // Yellow highlight
      }
    }
  }
}

// Helper function to adjust color brightness
function adjustColor(color, amount) {
  if (!color || color === COLORS.TRANSPARENT) return color;
  
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Create a simple furniture or object sprite
function createFurnitureSprite(type) {
  const sprite = (() => {
    switch(type) {
      case 'table':
        return new PixelSprite([
          [COLORS.WOOD, COLORS.WOOD, COLORS.WOOD, COLORS.WOOD],
          [COLORS.WOOD, COLORS.WOOD, COLORS.WOOD, COLORS.WOOD],
          [COLORS.WOOD, COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.WOOD],
          [COLORS.WOOD, COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.WOOD]
        ]);
      case 'chair':
        return new PixelSprite([
          [COLORS.WOOD, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
          [COLORS.WOOD, COLORS.WOOD, COLORS.WOOD],
          [COLORS.WOOD, COLORS.TRANSPARENT, COLORS.WOOD]
        ]);
      case 'bed':
        return new PixelSprite([
          [COLORS.WOOD, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE],
          [COLORS.WOOD, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE],
          [COLORS.WOOD, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE],
          [COLORS.WOOD, COLORS.WOOD, COLORS.WOOD, COLORS.WOOD]
        ]);
      case 'window':
        return new PixelSprite([
          [COLORS.WOOD, COLORS.WOOD, COLORS.WOOD, COLORS.WOOD],
          [COLORS.WOOD, COLORS.GLASS, COLORS.GLASS, COLORS.WOOD],
          [COLORS.WOOD, COLORS.GLASS, COLORS.GLASS, COLORS.WOOD],
          [COLORS.WOOD, COLORS.WOOD, COLORS.WOOD, COLORS.WOOD]
        ]);
      case 'door':
        return new PixelSprite([
          [COLORS.WOOD, COLORS.WOOD, COLORS.WOOD, COLORS.WOOD],
          [COLORS.WOOD, COLORS.WOOD, COLORS.WOOD, COLORS.WOOD],
          [COLORS.WOOD, COLORS.WOOD, COLORS.WOOD, COLORS.WOOD],
          [COLORS.WOOD, COLORS.METAL, COLORS.WOOD, COLORS.WOOD],
          [COLORS.WOOD, COLORS.WOOD, COLORS.WOOD, COLORS.WOOD],
          [COLORS.WOOD, COLORS.WOOD, COLORS.WOOD, COLORS.WOOD]
        ]);
      default:
        return new PixelSprite([
          [COLORS.METAL, COLORS.METAL],
          [COLORS.METAL, COLORS.METAL]
        ]);
    }
  })();
  
  // Add the type as a name property
  if (sprite) {
    sprite.name = type;
  }
  
  return sprite;
}

// Generate all game graphics with pixel art style
function generateGameGraphics() {
  // Create scene-specific furniture elements
  const barElements = [
    { sprite: createFurnitureSprite('table'), x: 5, y: 20 },
    { sprite: createFurnitureSprite('chair'), x: 4, y: 22 },
    { sprite: createFurnitureSprite('chair'), x: 8, y: 22 },
    { sprite: createFurnitureSprite('door'), x: 28, y: 20 }
  ];
  
  const streetElements = [
    { sprite: createFurnitureSprite('window'), x: 5, y: 10 },
    { sprite: createFurnitureSprite('window'), x: 15, y: 10 },
    { sprite: createFurnitureSprite('door'), x: 10, y: 20 }
  ];
  
  const lobbyElements = [
    { sprite: createFurnitureSprite('table'), x: 15, y: 18 },
    { sprite: createFurnitureSprite('chair'), x: 14, y: 20 },
    { sprite: createFurnitureSprite('door'), x: 5, y: 20 },
    { sprite: createFurnitureSprite('door'), x: 25, y: 20 }
  ];
  
  const hallwayElements = [
    { sprite: createFurnitureSprite('door'), x: 5, y: 20 },
    { sprite: createFurnitureSprite('door'), x: 12, y: 20 },
    { sprite: createFurnitureSprite('door'), x: 19, y: 20 },
    { sprite: createFurnitureSprite('door'), x: 26, y: 20 }
  ];
  
  const secretRoomElements = [
    { sprite: createFurnitureSprite('table'), x: 15, y: 20 },
    { sprite: createFurnitureSprite('chair'), x: 14, y: 22 },
    { sprite: createFurnitureSprite('door'), x: 5, y: 20 }
  ];
  
  // Create scene backgrounds
  const barBackground = createSceneBackground(640, 400, COLORS.DARK_BROWN, barElements);
  const streetBackground = createSceneBackground(640, 400, COLORS.DARK_BLUE, streetElements);
  const hotelLobbyBackground = createSceneBackground(640, 400, COLORS.DARK_TAN, lobbyElements);
  const hotelHallwayBackground = createSceneBackground(640, 400, COLORS.DARK_PURPLE, hallwayElements);
  const secretRoomBackground = createSceneBackground(640, 400, COLORS.DARK_WINE, secretRoomElements);

  // Create player character
  const playerSprite = createCharacterSprite(COLORS.SHIRT_BLUE, COLORS.PANTS_NAVY);

  // Create NPC character sprites
  const characters = createCharacterSprites();
  
  // Create object sprites
  const objects = createObjectSprites();
  
  // Store all game sprites in a global map (no PNG references!)
  window.gameSprites = {
    // Scenes
    'barScene': barBackground,
    'streetScene': streetBackground,
    'hotelLobbyScene': hotelLobbyBackground, 
    'hotelHallwayScene': hotelHallwayBackground,
    'secretRoomScene': secretRoomBackground,
    
    // Main character
    'playerCharacter': playerSprite,
    
    // NPCs
    'bartender': characters.bartender,
    'mysterious-woman': characters.mysteriousWoman,
    'mysterious-person': characters.mysteriousPerson,
    'receptionist': characters.receptionist,
    'dealer': characters.dealer,
    
    // Objects
    'table': createFurnitureSprite('table'),
    'chair': createFurnitureSprite('chair'),
    'bed': createFurnitureSprite('bed'),
    'window': createFurnitureSprite('window'),
    'door': createFurnitureSprite('door'),
    'hotel-key': objects['hotel-key'],
    'newspaper': objects['newspaper'],
    'mysterious-package': objects['mysterious-package']
  };
  
  // Convert sprites to data URLs for compatibility with existing code
  window.gameImages = {};
  for (const key in window.gameSprites) {
    window.gameImages[key] = window.gameSprites[key].toDataURL(4); // Scale by 4 for better visibility
  }
  
  // Also store images under the old PNG names to maintain compatibility
  // But we're not loading files, just using our generated sprites
  window.gameImages['bar-background.png'] = window.gameImages.barScene;
  window.gameImages['street-background.png'] = window.gameImages.streetScene;
  window.gameImages['hotel-lobby-background.png'] = window.gameImages.hotelLobbyScene;
  window.gameImages['hotel-hallway-background.png'] = window.gameImages.hotelHallwayScene;
  window.gameImages['secret-room-background.png'] = window.gameImages.secretRoomScene;
  window.gameImages['player.png'] = window.gameImages.playerCharacter;
  
  // IMPORTANT FIX: Add entries without the .png extension for direct lookup
  window.gameImages['bar-background'] = window.gameImages.barScene;
  window.gameImages['street-background'] = window.gameImages.streetScene;
  window.gameImages['hotel-lobby-background'] = window.gameImages.hotelLobbyScene;
  window.gameImages['hotel-hallway-background'] = window.gameImages.hotelHallwayScene;
  window.gameImages['secret-room-background'] = window.gameImages.secretRoomScene;
  window.gameImages['player'] = window.gameImages.playerCharacter;
  
  // Debug: log available image keys to help diagnose missing images
  console.log("Available image keys:", Object.keys(window.gameImages));
  
  // Also handle CSS background-image links to PNG files
  interceptCssBackgroundImages();
  
  console.log("All game graphics generated from code - no PNG files loaded");
}

// Override image loading to use our code-generated sprites
const originalImage = window.Image;
window.Image = function() {
  // Create a real image object using the original constructor
  const img = new originalImage();
  
  // Override the src setter
  const originalSetSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src').set;
  Object.defineProperty(img, 'src', {
    set: function(value) {
      // Ensure we have our sprites generated
      if (!window.gameImages) {
        generateGameGraphics();
      }
      
      // Look for the image in our sprite collection
      let imageSrc = value;
      
      // Check if this is a PNG reference we need to replace
      if (value.endsWith('.png')) {
        const keyWithoutExt = value.replace('.png', '');
        if (window.gameImages[value]) {
          imageSrc = window.gameImages[value];
        } else if (window.gameImages[keyWithoutExt]) {
          imageSrc = window.gameImages[keyWithoutExt];
          console.log(`Replaced PNG reference ${value} with code-generated sprite`);
        } else {
          console.warn(`PNG reference not found: ${value} - generating placeholder`);
          // Create an emergency placeholder sprite
          const placeholderSprite = new PixelSprite(Array(8).fill().map(() => 
            Array(8).fill().map(() => 
              `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
            )
          ));
          const dataURL = placeholderSprite.toDataURL(4);
          window.gameImages[value] = dataURL;
          imageSrc = dataURL;
        }
      }
      
      // Call the original setter with our processed source
      originalSetSrc.call(this, imageSrc);
    },
    get: function() {
      return img.getAttribute('src') || '';
    },
    configurable: true
  });
  
  return img;
};

// Make sure it behaves like the original Image
window.Image.prototype = originalImage.prototype;

// Replace the document.createElement for images as well
const originalCreateElement = document.createElement;
document.createElement = function(tagName) {
  const element = originalCreateElement.call(document, tagName);
  
  if (tagName.toLowerCase() === 'img') {
    const originalSetAttribute = element.setAttribute;
    element.setAttribute = function(name, value) {
      if (name === 'src') {
        // Use our src setter which handles the sprite replacement
        element.src = value;
        return;
      }
      return originalSetAttribute.apply(this, arguments);
    };
  }
  
  return element;
};

// Generate images when page loads
window.addEventListener('load', generateGameGraphics);

// Expose helper functions for creating new sprites during gameplay
window.pixelArt = {
  createSprite: (grid) => new PixelSprite(grid),
  createCharacter: createCharacterSprite,
  createObject: createFurnitureSprite,
  createScene: createSceneBackground,
  colors: COLORS
};

// Create sprites for all game NPCs
function createCharacterSprites() {
  // Bartender sprite
  const bartender = new PixelSprite([
    [COLORS.TRANSPARENT, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.TRANSPARENT],
    [COLORS.DARK_BROWN, COLORS.SKIN_TONE, COLORS.SKIN_TONE, COLORS.DARK_BROWN],
    [COLORS.DARK_BROWN, COLORS.SKIN_TONE, COLORS.SKIN_TONE, COLORS.DARK_BROWN], // With mustache
    [COLORS.TRANSPARENT, COLORS.METAL, COLORS.METAL, COLORS.TRANSPARENT], // Apron
    [COLORS.METAL, COLORS.METAL, COLORS.METAL, COLORS.METAL],
    [COLORS.METAL, COLORS.METAL, COLORS.METAL, COLORS.METAL],
    [COLORS.TRANSPARENT, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.TRANSPARENT],
    [COLORS.TRANSPARENT, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.TRANSPARENT],
  ]);
  
  // Mysterious woman sprite
  const mysteriousWoman = new PixelSprite([
    [COLORS.TRANSPARENT, COLORS.YELLOW, COLORS.YELLOW, COLORS.TRANSPARENT], // Blonde hair
    [COLORS.YELLOW, COLORS.SKIN_TONE, COLORS.SKIN_TONE, COLORS.YELLOW], 
    [COLORS.TRANSPARENT, COLORS.SKIN_TONE, COLORS.SKIN_TONE, COLORS.TRANSPARENT],
    [COLORS.TRANSPARENT, COLORS.RED, COLORS.RED, COLORS.TRANSPARENT], // Red dress
    [COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED],
    [COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED],
    [COLORS.TRANSPARENT, COLORS.SKIN_TONE, COLORS.TRANSPARENT, COLORS.SKIN_TONE], // Legs
    [COLORS.TRANSPARENT, COLORS.SKIN_TONE, COLORS.TRANSPARENT, COLORS.SKIN_TONE],
  ]);
  
  // Mysterious person sprite
  const mysteriousPerson = new PixelSprite([
    [COLORS.TRANSPARENT, COLORS.BLACK, COLORS.BLACK, COLORS.TRANSPARENT], // Dark hat
    [COLORS.BLACK, COLORS.SKIN_TONE, COLORS.SKIN_TONE, COLORS.BLACK],
    [COLORS.TRANSPARENT, COLORS.SKIN_TONE, COLORS.SKIN_TONE, COLORS.TRANSPARENT],
    [COLORS.TRANSPARENT, COLORS.DARK_GREY, COLORS.DARK_GREY, COLORS.TRANSPARENT], // Grey coat
    [COLORS.DARK_GREY, COLORS.DARK_GREY, COLORS.DARK_GREY, COLORS.DARK_GREY],
    [COLORS.DARK_GREY, COLORS.DARK_GREY, COLORS.DARK_GREY, COLORS.DARK_GREY],
    [COLORS.TRANSPARENT, COLORS.BLACK, COLORS.BLACK, COLORS.TRANSPARENT],
    [COLORS.TRANSPARENT, COLORS.BLACK, COLORS.BLACK, COLORS.TRANSPARENT],
  ]);
  
  // Receptionist sprite
  const receptionist = new PixelSprite([
    [COLORS.TRANSPARENT, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.TRANSPARENT], 
    [COLORS.DARK_BROWN, COLORS.SKIN_TONE, COLORS.SKIN_TONE, COLORS.DARK_BROWN],
    [COLORS.TRANSPARENT, COLORS.SKIN_TONE, COLORS.SKIN_TONE, COLORS.TRANSPARENT],
    [COLORS.TRANSPARENT, COLORS.WHITE, COLORS.WHITE, COLORS.TRANSPARENT], // White shirt
    [COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE],
    [COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE],
    [COLORS.TRANSPARENT, COLORS.BLACK, COLORS.BLACK, COLORS.TRANSPARENT],
    [COLORS.TRANSPARENT, COLORS.BLACK, COLORS.BLACK, COLORS.TRANSPARENT],
  ]);
  
  // Dealer sprite
  const dealer = new PixelSprite([
    [COLORS.TRANSPARENT, COLORS.BLACK, COLORS.BLACK, COLORS.TRANSPARENT],
    [COLORS.BLACK, COLORS.SKIN_TONE, COLORS.SKIN_TONE, COLORS.BLACK],
    [COLORS.TRANSPARENT, COLORS.SKIN_TONE, COLORS.SKIN_TONE, COLORS.TRANSPARENT],
    [COLORS.TRANSPARENT, COLORS.BLACK, COLORS.BLACK, COLORS.TRANSPARENT], // Black suit
    [COLORS.BLACK, COLORS.BLACK, COLORS.BLACK, COLORS.BLACK],
    [COLORS.BLACK, COLORS.WHITE, COLORS.WHITE, COLORS.BLACK], // White shirt under
    [COLORS.TRANSPARENT, COLORS.BLACK, COLORS.BLACK, COLORS.TRANSPARENT],
    [COLORS.TRANSPARENT, COLORS.BLACK, COLORS.BLACK, COLORS.TRANSPARENT],
  ]);
  
  return {
    bartender,
    mysteriousWoman,
    mysteriousPerson,
    receptionist,
    dealer
  };
}

// Enhanced function to generate object sprites for all items in game
function createObjectSprites() {
  return {
    'hotel-key': new PixelSprite([
      [COLORS.TRANSPARENT, COLORS.METAL, COLORS.METAL],
      [COLORS.METAL, COLORS.METAL, COLORS.TRANSPARENT],
    ]),
    'newspaper': new PixelSprite([
      [COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE],
      [COLORS.WHITE, COLORS.BLACK, COLORS.BLACK, COLORS.WHITE],
      [COLORS.WHITE, COLORS.BLACK, COLORS.BLACK, COLORS.WHITE],
      [COLORS.WHITE, COLORS.WHITE, COLORS.WHITE, COLORS.WHITE],
    ]),
    'mysterious-package': new PixelSprite([
      [COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN],
      [COLORS.LIGHT_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.LIGHT_BROWN],
      [COLORS.LIGHT_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.LIGHT_BROWN],
      [COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN],
    ])
  };
}

// New function to intercept CSS background-image properties
function interceptCssBackgroundImages() {
  // Store the original setProperty function
  const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
  
  // Override the setProperty function to intercept background-image settings
  CSSStyleDeclaration.prototype.setProperty = function(propertyName, value, priority) {
    if (propertyName === 'background-image' && typeof value === 'string') {
      // Check if it's a PNG url
      const pngMatch = value.match(/url\(['"]?([^'"]+\.png)['"]?\)/i);
      if (pngMatch) {
        const pngFile = pngMatch[1];
        console.warn(`Intercepted CSS background-image PNG request: ${pngFile}`);
        
        // Check if we have a generated image for this PNG
        if (window.gameImages && window.gameImages[pngFile]) {
          // Replace with the data URL
          value = `url(${window.gameImages[pngFile]})`;
        } else {
          // Use a placeholder data URL
          const placeholderSprite = new PixelSprite(Array(4).fill().map(() => 
            Array(4).fill().map(() => 
              `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
            )
          ));
          const dataURL = placeholderSprite.toDataURL(8);
          value = `url(${dataURL})`;
        }
      }
    }
    
    // Call the original setProperty function with our modified value
    return originalSetProperty.call(this, propertyName, value, priority);
  };
  
  // Also intercept style.backgroundImage direct assignments
  const originalDescriptor = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, 'backgroundImage');
  if (originalDescriptor && originalDescriptor.set) {
    Object.defineProperty(CSSStyleDeclaration.prototype, 'backgroundImage', {
      set: function(value) {
        if (typeof value === 'string') {
          const pngMatch = value.match(/url\(['"]?([^'"]+\.png)['"]?\)/i);
          if (pngMatch) {
            const pngFile = pngMatch[1];
            console.warn(`Intercepted direct backgroundImage PNG request: ${pngFile}`);
            
            // Check if we have a generated image for this PNG
            if (window.gameImages && window.gameImages[pngFile]) {
              // Replace with the data URL
              value = `url(${window.gameImages[pngFile]})`;
            } else {
              // Use a placeholder data URL
              const placeholderSprite = new PixelSprite(Array(4).fill().map(() => 
                Array(4).fill().map(() => 
                  `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
                )
              ));
              const dataURL = placeholderSprite.toDataURL(8);
              value = `url(${dataURL})`;
            }
          }
        }
        originalDescriptor.set.call(this, value);
      },
      get: originalDescriptor.get,
      configurable: true
    });
  }
}

// Initialize debug mode
window.debugMode = false;

// More helpful logging
console.log("%cSierra Adventure Graphics System", "font-size: 16px; color: #00ff00; font-weight: bold;");
console.log("%cAll visuals are procedurally generated. No PNG files are loaded.", "font-size: 12px; color: #00ff00;");

// Enhanced image fallback handling for more robust behavior
function getImageFallback(key) {
  // Try multiple variants of the key
  const variants = [
    key,                    // Original key
    key.replace('.png', ''), // Without extension
    key + '.png',           // With extension added
    key.toLowerCase(),      // Lowercase
    key.toLowerCase().replace('.png', ''), // Lowercase without extension
    key.toLowerCase() + '.png' // Lowercase with extension
  ];
  
  // Check all variants
  for (const variant of variants) {
    if (window.gameImages && window.gameImages[variant]) {
      console.log(`Image found using variant: ${variant} (original key: ${key})`);
      return window.gameImages[variant];
    }
  }
  
  // If we still can't find it, generate a placeholder with text
  console.warn(`No image found for ${key} - Generating placeholder with label`);
  const placeholderSprite = new PixelSprite(Array(16).fill().map(() => 
    Array(16).fill(getRandomColor())
  ));
  
  // Draw text on the placeholder showing the missing key
  const dataURL = createLabeledPlaceholder(key, 64, 64);
  window.gameImages[key] = dataURL;
  return dataURL;
}

// Helper function to create a labeled placeholder
function createLabeledPlaceholder(label, width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Checkerboard background
  const tileSize = 8;
  for (let y = 0; y < height; y += tileSize) {
    for (let x = 0; x < width; x += tileSize) {
      ctx.fillStyle = (x + y) % (tileSize * 2) === 0 ? '#333' : '#666';
      ctx.fillRect(x, y, tileSize, tileSize);
    }
  }
  
  // Draw a border
  ctx.strokeStyle = '#f00';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, width-4, height-4);
  
  // Add the label
  ctx.fillStyle = '#fff';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Break long labels into multiple lines
  const words = label.split(/[/\\.-]/);
  const maxChars = 10;
  const lines = [];
  let currentLine = '';
  
  words.forEach(word => {
    if ((currentLine + word).length <= maxChars) {
      currentLine += (currentLine ? '-' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  });
  if (currentLine) lines.push(currentLine);
  
  // Draw each line
  lines.forEach((line, i) => {
    ctx.fillText(
      line, 
      width/2, 
      height/2 + (i - lines.length/2 + 0.5) * 12
    );
  });
  
  return canvas.toDataURL();
}

function getRandomColor() {
  return `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
}

// Replace the original image setter with our enhanced version
const originalSetSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src').set;
Object.defineProperty(HTMLImageElement.prototype, 'src', {
  set: function(value) {
    // Ensure we have our sprites generated
    if (!window.gameImages) {
      generateGameGraphics();
    }
    
    // Look for the image in our sprite collection
    let imageSrc = value;
    
    // Check if this is a PNG reference or any image we should intercept
    if (typeof value === 'string' && (value.endsWith('.png') || value.endsWith('.jpg') || value.endsWith('.gif'))) {
      if (window.gameImages[value]) {
        imageSrc = window.gameImages[value];
      } else {
        // Use our enhanced fallback system
        imageSrc = getImageFallback(value);
      }
    }
    
    // Call the original setter with our processed source
    originalSetSrc.call(this, imageSrc);
  },
  get: function() {
    return this.getAttribute('src') || '';
  },
  configurable: true
});

// Add global debug toggle
window.toggleDebug = function() {
  window.debugMode = !window.debugMode;
  console.log(`Debug mode ${window.debugMode ? 'enabled' : 'disabled'}`);
  // Force redraw of the current room
  if (typeof updateRoom === 'function') {
    updateRoom();
  }
};

// Initialize with pre-generated sprites to ensure they're ready before needed
generateGameGraphics();

// Create animated arrow sprite for hint system
function createArrowSprite(direction = 'down') {
  const colors = [COLORS.YELLOW, COLORS.WHITE];
  
  let grid;
  
  switch(direction) {
    case 'down':
      grid = [
        [COLORS.TRANSPARENT, COLORS.YELLOW, COLORS.TRANSPARENT],
        [COLORS.YELLOW, COLORS.YELLOW, COLORS.YELLOW],
        [COLORS.YELLOW, COLORS.TRANSPARENT, COLORS.YELLOW]
      ];
      break;
    case 'up':
      grid = [
        [COLORS.YELLOW, COLORS.TRANSPARENT, COLORS.YELLOW],
        [COLORS.YELLOW, COLORS.YELLOW, COLORS.YELLOW],
        [COLORS.TRANSPARENT, COLORS.YELLOW, COLORS.TRANSPARENT]
      ];
      break;
    case 'left':
      grid = [
        [COLORS.TRANSPARENT, COLORS.YELLOW, COLORS.TRANSPARENT],
        [COLORS.YELLOW, COLORS.YELLOW, COLORS.TRANSPARENT],
        [COLORS.TRANSPARENT, COLORS.YELLOW, COLORS.TRANSPARENT]
      ];
      break;
    case 'right':
      grid = [
        [COLORS.TRANSPARENT, COLORS.YELLOW, COLORS.TRANSPARENT],
        [COLORS.TRANSPARENT, COLORS.YELLOW, COLORS.YELLOW],
        [COLORS.TRANSPARENT, COLORS.YELLOW, COLORS.TRANSPARENT]
      ];
      break;
    default:
      grid = [
        [COLORS.TRANSPARENT, COLORS.YELLOW, COLORS.TRANSPARENT],
        [COLORS.YELLOW, COLORS.YELLOW, COLORS.YELLOW],
        [COLORS.YELLOW, COLORS.TRANSPARENT, COLORS.YELLOW]
      ];
  }
  
  return new PixelSprite(grid);
}

// Create text balloon for hints
function createTextBalloon(text, width = 100, height = 40) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Draw balloon background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 2;
  
  // Rounded rectangle
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, 5);
  ctx.fill();
  ctx.stroke();
  
  // Draw text
  ctx.fillStyle = 'white';
  ctx.font = '12px Courier New';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Word wrap the text
  const words = text.split(' ');
  let line = '';
  let y = 15;
  const lineHeight = 14;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > width - 10 && i > 0) {
      ctx.fillText(line, width/2, y);
      line = words[i] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, width/2, y);
  
  return canvas;
}

// Add intro sequence graphics to the sprites
window.pixelArt.introSequence = {
  createLogo: function(width = 300, height = 100) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Retro Sierra logo style
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    
    // Draw "Sierra" in big red letters
    ctx.font = 'bold 48px serif';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('SIERRA', width/2, height/2);
    
    // Draw "ADVENTURE" below
    ctx.font = '24px serif';
    ctx.fillStyle = 'white';
    ctx.fillText('ADVENTURE', width/2, height/2 + 30);
    
    return canvas;
  },
  
  createCharacterPortrait: function() {
    // Use the existing player character sprite but bigger
    const sprite = window.gameSprites.playerCharacter;
    const scale = 8;
    
    const canvas = document.createElement('canvas');
    canvas.width = sprite.width * scale;
    canvas.height = sprite.height * scale;
    const ctx = canvas.getContext('2d');
    
    sprite.render(ctx, 0, 0, scale);
    return canvas;
  }
};

// Initialize hint system visuals
window.pixelArt.hints = {
  arrows: {
    up: createArrowSprite('up'),
    down: createArrowSprite('down'),
    left: createArrowSprite('left'),
    right: createArrowSprite('right')
  },
  createBalloon: createTextBalloon
};

// Update getContextualHint to be more helpful with navigation
function getContextualHint() {
  // Basic implementation - return a hint based on current room
  const room = gameState.currentRoom;
  
  switch (room) {
    case 'bar':
      if (!gameState.flags.talkedToBartender) {
        return { 
          text: "Click on the bartender (on the right side) and select 'Talk' to get information.",
          targetHotspot: 'bartender' 
        };
      } else if (!hasItem('hotel-key')) {
        return { 
          text: "Talk to the woman in the red dress and pick up the hotel key she offers.",
          targetHotspot: 'mysterious-woman' 
        };
      } else {
        return { 
          text: "Use the door on the left side to exit to the street.",
          targetHotspot: 'door' 
        };
      }
    // ...existing code...
  }
}