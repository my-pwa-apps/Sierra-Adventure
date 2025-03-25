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
                    
                    // Create player character
                    this.createPlayerCharacter();
                    
                    // Setup UI handlers, hotspots, etc.
                    this.setupUI();
                    
                    // Enable debug mode for development
                    window.debugMode = true;
                    
                    // Enable showing NPC names
                    window.showNames = true;
                    
                    // Set initial scene
                    this.currentScene = 'bar';
                    
                    // Preload all scenes to avoid brown screen
                    setTimeout(() => {
                        if (window.RoomRenderer) {
                            window.RoomRenderer.renderRoom('bar');
                        }
                    }, 200);
                },
                
                createPlayerCharacter: function() {
                    // Create player DOM element if it doesn't exist
                    if (!document.getElementById('player')) {
                        const playerElement = document.createElement('div');
                        playerElement.id = 'player';
                        playerElement.className = 'player';
                        
                        const scene = document.querySelector('.scene');
                        if (scene) {
                            scene.appendChild(playerElement);
                            console.log('Player character added to scene');
                        }
                    }
                    
                    // Store reference to the player element
                    this.domElements = this.domElements || {};
                    this.domElements.player = document.getElementById('player');
                    this.domElements.scene = document.querySelector('.scene');
                    
                    // Player state
                    this.player = {
                        x: 300,
                        y: 60,
                        direction: 'right', // right, left, front, back
                        isWalking: false,
                        walkFrame: 0,
                        walkSpeed: 3,
                        updateInterval: null
                    };
                    
                    // Position player at starting position
                    if (this.domElements.player) {
                        this.domElements.player.style.left = `${this.player.x}px`;
                        this.domElements.player.style.bottom = `${this.player.y}px`;
                    }
                    
                    // Start animation loop
                    this.startAnimationLoop();
                },
                
                // Start animation loop for the player character
                startAnimationLoop: function() {
                    if (this.player.updateInterval) {
                        clearInterval(this.player.updateInterval);
                    }
                    
                    this.player.updateInterval = setInterval(() => {
                        if (this.player.isWalking) {
                            // Update walk animation frame
                            this.player.walkFrame = (this.player.walkFrame + 1) % 4;
                            
                            // Redraw scene to show animation
                            if (window.RoomRenderer && this.currentScene) {
                                window.RoomRenderer.renderScene(window.sceneManager.getScene(this.currentScene));
                            }
                        }
                    }, 200); // Sierra games had slower frame rates
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
                
                movePlayer: function(x, y) {
                    const player = this.player;
                    if (!player) return;
                    
                    // Set walking state
                    player.isWalking = true;
                    
                    // Determine direction based on target position
                    if (x < player.x) {
                        player.direction = 'left';
                    } else if (x > player.x) {
                        player.direction = 'right';
                    }
                    
                    // Calculate path to destination
                    const startX = player.x;
                    const distance = Math.abs(x - startX);
                    const direction = x > startX ? 1 : -1;
                    let step = 0;
                    
                    // Clear any existing movement
                    if (this.moveInterval) clearInterval(this.moveInterval);
                    
                    // Smooth walking animation
                    this.moveInterval = setInterval(() => {
                        step++;
                        if (step >= distance) {
                            clearInterval(this.moveInterval);
                            player.isWalking = false;
                            
                            // Final position
                            player.x = x;
                        } else {
                            // Increment position
                            player.x += direction * player.walkSpeed;
                        }
                        
                        // Update DOM element
                        const domPlayer = this.domElements.player;
                        if (domPlayer) {
                            domPlayer.style.left = `${player.x}px`;
                            domPlayer.style.bottom = `${player.y}px`;
                        }
                        
                        // Redraw scene with updated position
                        if (window.RoomRenderer && this.currentScene) {
                            window.RoomRenderer.renderScene(window.sceneManager.getScene(this.currentScene));
                        }
                        
                        // Check for hotspot interactions
                        this.checkPositionForHotspots(player.x, player.y);
                        
                    }, 50); // 20 fps movement
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
                { type: 'chair', x: 220, y: 300, scale: 4 },
                { type: 'chair', x: 280, y: 300, scale: 4 },
                { type: 'table', x: 330, y: 300, scale: 4 },
                { type: 'chair', x: 400, y: 300, scale: 4 },
                { type: 'key', x: 330, y: 280, scale: 2 }, // Key on table
                { type: 'paper', x: 150, y: 280, scale: 2 }, // Paper on table
            ],
            npcs: [
                { 
                    type: 'bartender', 
                    x: 500, 
                    y: 200, 
                    scale: 5,
                    name: 'Bartender' 
                },
                {
                    type: 'playerCharacter',  // Using player character sprite as a patron
                    x: 330, 
                    y: 265, 
                    scale: 4,
                    name: 'Bar Patron'
                }
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
                },
                { 
                    name: 'neon-sign',
                    x: 50, y: 50,
                    width: 80, height: 40,
                    description: 'A flickering neon sign that says "BAR".'
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
