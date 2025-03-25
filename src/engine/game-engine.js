import SpriteEngine from './sprite-engine.js';
import sceneManager from './scene-manager.js';
import { COLORS } from '../common/color-palette.js';
import { PixelSprite } from '../graphics/PixelSprite.js';
import { barCounter, neonSign, liquorBottle } from '../graphics/EnvironmentSprites.js';

const GameEngine = {
    /**
     * Generate dynamic game content
     */
    generateDynamicContent() {
        console.log('Generating dynamic content for objects and backgrounds');

        // Generate the forest scene sprite
        const forestScene = SpriteEngine.createPixelSprite([
            [COLORS.DARK_GREEN, COLORS.DARK_GREEN, COLORS.DARK_GREEN],
            [COLORS.DARK_GREEN, COLORS.BROWN, COLORS.DARK_GREEN],
            [COLORS.DARK_GREEN, COLORS.DARK_GREEN, COLORS.DARK_GREEN]
        ]);
        SpriteEngine.registerSprite('forestScene', forestScene);

        // Generate a treasure chest object
        const treasureChest = SpriteEngine.createPixelSprite([
            [COLORS.BROWN, COLORS.BROWN, COLORS.BROWN],
            [COLORS.BROWN, COLORS.YELLOW, COLORS.BROWN],
            [COLORS.BROWN, COLORS.BROWN, COLORS.BROWN]
        ]);
        SpriteEngine.registerSprite('treasureChest', treasureChest);

        // Generate any additional custom objects needed
        this.generateCustomObjects();
        
        console.log('Dynamic content generation complete');
    },
    
    /**
     * Generate any custom objects needed for specific scenes
     */
    generateCustomObjects() {
        // Create unique objects for specific rooms
        
        // Mystery object - pixelated question mark
        const mysteryObject = SpriteEngine.createPixelSprite([
            [COLORS.TRANSPARENT, COLORS.YELLOW, COLORS.YELLOW, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.YELLOW, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.YELLOW, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.YELLOW, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.YELLOW, COLORS.TRANSPARENT, COLORS.TRANSPARENT]
        ]);
        SpriteEngine.registerSprite('mysteryObject', mysteryObject);
        
        // Add these to the gameImages for compatibility
        window.gameImages['mysteryObject'] = mysteryObject.toDataURL(4);
    },

    /**
     * Initialize the game engine
     */
    init() {
        console.log('Initializing Enhanced Sierra Adventure Game Engine');
        
        // Initialize global objects
        window.gameSprites = window.gameSprites || {};
        window.gameImages = window.gameImages || {};
        
        // Initialize the sprite engine for Sierra-style graphics
        SpriteEngine.init();
        
        // Initialize scene manager
        if (sceneManager && typeof sceneManager.init === 'function') {
            sceneManager.init();
        }
        
        // Generate additional content
        this.generateDynamicContent();
        
        // Register all scenes with the scene manager
        this.registerScenes();
        
        // Ensure SierraAdventure is defined and initialize it if missing
        if (!window.SierraAdventure) {
            window.SierraAdventure = {
                init: function() {
                    console.log('SierraAdventure initialized successfully.');
                    // Setup UI handlers, hotspots, etc.
                    this.setupUI();
                },
                
                setupUI: function() {
                    // Basic UI setup for testing
                    const walkBtn = document.getElementById('walk-btn');
                    if (walkBtn) {
                        walkBtn.addEventListener('click', () => {
                            console.log('Walk mode activated');
                            // Set the active action
                            this.activeAction = 'walk';
                        });
                    }
                    
                    // Add scene click handler
                    const scene = document.querySelector('.scene');
                    if (scene) {
                        scene.addEventListener('click', (e) => {
                            // Calculate click position
                            const rect = scene.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            
                            // Move player to clicked position
                            if (this.movePlayer) {
                                this.movePlayer(x, 0);
                            }
                        });
                    }
                },
                
                domElements: {
                    player: document.getElementById('player'),
                    scene: document.querySelector('.scene')
                },
                
                checkPositionForHotspots: function(x, y) {
                    // Will be implemented for hotspot detection
                    console.log(`Checking position: ${x},${y} for hotspots`);
                }
            };
        }

        // Ensure SierraAdventure and its init method are defined before calling
        if (window.SierraAdventure && typeof window.SierraAdventure.init === 'function') {
            console.log('Starting Sierra Adventure initialization');
            window.SierraAdventure.init();
        } else {
            console.error('SierraAdventure.init is not available or not a function!');
        }
    },
    
    /**
     * Register all scenes with the scene manager
     */
    registerScenes() {
        // Use the imported sceneManager instead of window.sceneManager
        if (!sceneManager) {
            console.error('Scene manager not available');
            return;
        }
        
        // Register the bar scene
        sceneManager.registerScene('bar', {
            background: 'bar-background',
            description: 'A dimly lit bar with several tables and a long counter.',
            elements: [
                { type: 'chair', x: 100, y: 300, scale: 4 },
                { type: 'table', x: 150, y: 300, scale: 4 },
                { type: 'chair', x: 220, y: 300, scale: 4 }
            ],
            hotspots: [
                { 
                    name: 'bar-counter', 
                    x: 400, y: 240, 
                    width: 200, height: 60,
                    description: 'A well-polished wooden bar counter.'
                },
                { 
                    name: 'door', 
                    x: 50, y: 220, 
                    width: 60, height: 80,
                    description: 'A door leading to the street.'
                }
            ]
        });
        
        // Register the street scene
        sceneManager.registerScene('street', {
            background: 'street-background',
            description: 'A city street with buildings on either side.',
            elements: [
                { type: 'door', x: 520, y: 150, scale: 4 }
            ],
            hotspots: [
                { 
                    name: 'store-door', 
                    x: 520, y: 150, 
                    width: 40, height: 50,
                    description: 'The door to the general store.'
                }
            ]
        });
        
        // Register the forest scene
        sceneManager.registerScene('forest', {
            background: 'forest-background',
            description: 'A dense forest with a path winding through it.',
            elements: [
                { type: 'tree', x: 400, y: 180, scale: 6 },
                { type: 'treasureChest', x: 300, y: 320, scale: 4 }
            ],
            hotspots: [
                { 
                    name: 'hidden-chest', 
                    x: 300, y: 320, 
                    width: 40, height: 30,
                    description: 'A mysterious chest partially hidden among the leaves.'
                }
            ]
        });
        
        // Register the office scene
        sceneManager.registerScene('office', {
            background: 'office-background',
            description: 'A small office with a desk and filing cabinets.',
            elements: [
                { type: 'desk', x: 200, y: 260, scale: 4 },
                { type: 'chair', x: 310, y: 300, scale: 4 }
            ],
            hotspots: [
                { 
                    name: 'office-desk', 
                    x: 200, y: 260, 
                    width: 240, height: 40,
                    description: 'A wooden desk with some papers on it.'
                },
                { 
                    name: 'filing-cabinet', 
                    x: 50, y: 220, 
                    width: 70, height: 120,
                    description: 'A set of metal filing cabinets.'
                }
            ]
        });
        
        // Register the hotel lobby scene
        sceneManager.registerScene('hotel-lobby', {
            background: 'hotel-lobby-background',
            description: 'The lobby of a small hotel with a reception desk.',
            elements: [
                { type: 'key', x: 500, y: 240, scale: 2 }
            ],
            hotspots: [
                { 
                    name: 'reception-desk', 
                    x: 400, y: 240, 
                    width: 200, height: 60,
                    description: 'The hotel reception desk with a small bell.'
                },
                { 
                    name: 'room-door-1', 
                    x: 100, y: 150, 
                    width: 60, height: 150,
                    description: 'Door to room 1.'
                },
                { 
                    name: 'room-door-2', 
                    x: 200, y: 150, 
                    width: 60, height: 150,
                    description: 'Door to room 2.'
                },
                { 
                    name: 'room-door-3', 
                    x: 300, y: 150, 
                    width: 60, height: 150,
                    description: 'Door to room 3.'
                }
            ]
        });
        
        console.log('All scenes registered successfully');
    }
};

export default GameEngine;
