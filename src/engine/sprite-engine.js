/**
 * Sprite Engine - Core graphics engine for Sierra Adventure
 * Generates all game graphics procedurally without loading external images
 */

import { COLORS } from '../common/color-palette.js';
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
     * Monitor network requests to prevent external image loading
     */
    monitorNetworkRequests() {
        // Same implementation as monitorNetworkForPngRequests, but renamed
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
        
        // Also handle Image constructor
        this.monitorImageElement();
        
        console.log('Network request monitoring active');
    },
    
    /**
     * Monitor Image element creation to intercept src assignments
     */
    monitorImageElement() {
        // ... existing code from placeholder-images.js ...
    },
    
    /**
     * Generate all game sprites
     */
    generateSprites() {
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
    
    // ... existing sprite generation methods ...

    /**
     * Helper function to adjust color brightness
     */
    adjustColor(color, amount) {
        // ... existing adjustColor implementation ...
    }
};

// Make available globally but also as a module export
window.SpriteEngine = SpriteEngine;
export default SpriteEngine;

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => SpriteEngine.init());
