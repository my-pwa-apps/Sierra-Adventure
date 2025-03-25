/**
 * Sprite Engine - Core graphics engine for Sierra Adventure
 * Generates all game graphics procedurally without loading external images
 */

import { COLORS, ColorUtils } from '../common/color-palette.js';
import { PixelSprite } from '../graphics/PixelSprite.js';
import * as EnvironmentSprites from '../graphics/EnvironmentSprites.js';

// Core sprite engine namespace
const SpriteEngine = {
    sprites: {},
    scenes: {},
    
    /**
     * Initialize the sprite engine
     */
    init() {
        console.log('Initializing Sierra Adventure Sprite Engine...');
        this.monitorNetworkRequests();
        this.generateSprites();
        return this;
    },
    
    /**
     * Register a sprite in the engine
     * @param {string} id - Sprite identifier
     * @param {PixelSprite} sprite - Sprite object
     * @returns {PixelSprite} The registered sprite
     */
    registerSprite(id, sprite) {
        this.sprites[id] = sprite;
        return sprite;
    },
    
    /**
     * Get a sprite by ID
     * @param {string} id - Sprite identifier
     * @returns {PixelSprite|null} The sprite or null if not found
     */
    getSprite(id) {
        return this.sprites[id] || null;
    },
    
    /**
     * Create a PixelSprite from a grid
     * @param {string[][]} grid Color grid
     * @returns {PixelSprite} New sprite
     */
    createPixelSprite(grid) {
        return new PixelSprite(grid);
    },
    
    /**
     * Monitor network requests to prevent external image loading
     */
    monitorNetworkRequests() {
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            if (typeof url === 'string' && (url.endsWith('.png') || url.endsWith('.jpg'))) {
                console.warn(`Image fetch attempt intercepted: ${url}`);
                return Promise.resolve(new Response('', {
                    status: 200,
                    statusText: 'OK'
                }));
            }
            return originalFetch.apply(this, arguments);
        };
        
        // Monitor XMLHttpRequest as well
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (typeof url === 'string' && (url.endsWith('.png') || url.endsWith('.jpg'))) {
                console.warn(`Image XHR attempt intercepted: ${url}`);
                if (window.gameImages && window.gameImages[url]) {
                    arguments[1] = window.gameImages[url];
                } else {
                    arguments[1] = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                }
            }
            return originalOpen.apply(this, arguments);
        };
        
        console.log('Network request monitoring active');
    },
    
    /**
     * Generate all game sprites
     */
    generateSprites() {
        // Create global container for all sprites
        window.gameSprites = window.gameSprites || {};
        window.gameImages = window.gameImages || {};
        
        // Import environment sprites
        Object.entries(EnvironmentSprites).forEach(([name, sprite]) => {
            if (sprite instanceof PixelSprite) {
                this.registerSprite(name, sprite);
                window.gameSprites[name] = sprite;
            }
        });
        
        // Generate character sprites
        this.generateCharacterSprites();
        
        // Generate object sprites
        this.generateObjectSprites();
        
        // Generate scene backgrounds
        this.generateSceneBackgrounds();
        
        // Convert sprites to data URLs
        this.convertSpritesToDataURLs();
        
        console.log('All sprites generated successfully');
    },
    
    /**
     * Generate character sprites
     */
    generateCharacterSprites() {
        // Player character
        const playerCharacter = new PixelSprite([
            [COLORS.TRANSPARENT, COLORS.HAIR_BROWN, COLORS.HAIR_BROWN, COLORS.TRANSPARENT],
            [COLORS.HAIR_BROWN, COLORS.SKIN_TONE, COLORS.SKIN_TONE, COLORS.HAIR_BROWN],
            [COLORS.TRANSPARENT, COLORS.SKIN_TONE, COLORS.SKIN_TONE, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.SHIRT_BLUE, COLORS.SHIRT_BLUE, COLORS.TRANSPARENT],
            [COLORS.SHIRT_BLUE, COLORS.SHIRT_BLUE, COLORS.SHIRT_BLUE, COLORS.SHIRT_BLUE],
            [COLORS.SHIRT_BLUE, COLORS.SHIRT_BLUE, COLORS.SHIRT_BLUE, COLORS.SHIRT_BLUE],
            [COLORS.TRANSPARENT, COLORS.PANTS_NAVY, COLORS.PANTS_NAVY, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.PANTS_NAVY, COLORS.PANTS_NAVY, COLORS.TRANSPARENT]
        ]);
        
        this.registerSprite('playerCharacter', playerCharacter);
        window.gameSprites.playerCharacter = playerCharacter;
        
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
        
        this.registerSprite('bartender', bartender);
        window.gameSprites.bartender = bartender;
        
        // More character sprites here...
    },
    
    /**
     * Generate object sprites
     */
    generateObjectSprites() {
        // Add more object sprites here...
    },
    
    /**
     * Generate scene backgrounds
     */
    generateSceneBackgrounds() {
        // Add scene background generation here...
    },
    
    /**
     * Convert all sprites to data URLs for use as images
     */
    convertSpritesToDataURLs() {
        // Convert sprites to data URLs for use as images
        for (const key in this.sprites) {
            if (this.sprites[key] instanceof PixelSprite) {
                window.gameImages[key] = this.sprites[key].toDataURL(4);
            }
        }
        
        // Add backwards compatibility for older code that uses PNG names
        window.gameImages['player.png'] = window.gameImages.playerCharacter || '';
        window.gameImages['bar-background.png'] = window.gameImages.barBackground || '';
        window.gameImages['street-background.png'] = window.gameImages.streetBackground || '';
        window.gameImages['hotel-lobby-background.png'] = window.gameImages.hotelLobbyBackground || '';
        window.gameImages['hotel-hallway-background.png'] = window.gameImages.hotelHallwayBackground || '';
        window.gameImages['secret-room-background.png'] = window.gameImages.secretRoomBackground || '';
    },
    
    /**
     * Helper function to adjust color brightness
     */
    adjustColor(color, amount) {
        return ColorUtils.adjustBrightness(color, amount);
    }
};

// Make available globally for non-module code
window.SpriteEngine = SpriteEngine;

// Export as module
export default SpriteEngine;
