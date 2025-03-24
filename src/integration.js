/**
 * Integration layer to bridge between TypeScript components and JavaScript game code
 */
(function() {
    'use strict';
    
    // Create a global sprite registry
    window.SpriteRegistry = {
        sprites: {},
        
        /**
         * Register a sprite in the registry
         * @param {string} id Unique identifier for the sprite
         * @param {object} sprite Sprite object
         */
        register: function(id, sprite) {
            this.sprites[id] = sprite;
            return sprite;
        },
        
        /**
         * Get a sprite from the registry
         * @param {string} id Sprite identifier
         * @returns {object|null} The sprite or null if not found
         */
        get: function(id) {
            return this.sprites[id] || null;
        },
        
        /**
         * Check if a sprite exists in the registry
         * @param {string} id Sprite identifier
         * @returns {boolean} True if sprite exists
         */
        has: function(id) {
            return !!this.sprites[id];
        }
    };
    
    // Helper to create PixelSprite compatible objects when using plain JS
    window.createPixelSprite = function(grid) {
        // Check if we have access to the TypeScript PixelSprite class
        if (typeof PixelSprite === 'function') {
            return new PixelSprite(grid);
        }
        
        // Otherwise create a JS compatible version
        return {
            grid: grid,
            width: grid[0]?.length || 0,
            height: grid.length,
            
            getWidth: function() {
                return this.width;
            },
            
            getHeight: function() {
                return this.height;
            },
            
            getPixel: function(x, y) {
                if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
                    return null;
                }
                return this.grid[y][x];
            },
            
            render: function(ctx, x, y, pixelSize = 1) {
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
            },
            
            flipHorizontal: function() {
                const newGrid = [];
                for (let y = 0; y < this.height; y++) {
                    newGrid[y] = [];
                    for (let x = 0; x < this.width; x++) {
                        newGrid[y][x] = this.grid[y][this.width - 1 - x];
                    }
                }
                return window.createPixelSprite(newGrid);
            }
        };
    };
    
    // Initialize the integration layer
    window.initializeIntegration = function() {
        // Force the creation of gameSprites object if it doesn't exist
        window.gameSprites = window.gameSprites || {};
        window.gameImages = window.gameImages || {};
        
        // Log integration status
        console.log('Integration layer initialized');
        
        // Try to detect TypeScript components
        if (typeof PixelSprite === 'function') {
            console.log('TypeScript PixelSprite detected');
        } else {
            console.log('Using JavaScript fallback for sprites');
        }
    };
    
    // Auto-initialize when loaded
    window.addEventListener('DOMContentLoaded', window.initializeIntegration);
})();
