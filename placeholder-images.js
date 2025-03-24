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
  const grid = Array(scaleY).fill().map(() => Array(scaleX).fill(baseColor));
  
  // Add floor/ground at the bottom
  const floorColor = adjustColor(baseColor, -20); // Darker color for floor
  for (let y = Math.floor(scaleY * 0.8); y < scaleY; y++) {
    for (let x = 0; x < scaleX; x++) {
      grid[y][x] = floorColor;
    }
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
      }
    });
  }
  
  // Add some texture/noise to make the background less flat
  for (let y = 0; y < scaleY; y++) {
    for (let x = 0; x < scaleX; x++) {
      if (Math.random() > 0.9) {
        grid[y][x] = adjustColor(grid[y][x], Math.random() > 0.5 ? 10 : -10);
      }
    }
  }
  
  return new PixelSprite(grid);
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