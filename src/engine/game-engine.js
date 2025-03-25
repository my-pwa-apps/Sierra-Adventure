/**
 * Game Engine for Sierra Adventure
 * Provides compatibility with the original code structure
 */
import { COLORS } from '../common/color-palette.js';
import { PixelSprite } from '../graphics/PixelSprite.js';

// Main Game Engine object
const GameEngine = {
    /**
     * Initialize the game engine
     */
    init() {
        console.log('Initializing Sierra Adventure Game Engine');
        
        // Ensure global objects exist
        this.ensureGlobalObjects();
        
        // Generate required sprites and backgrounds
        this.generateSprites();
        
        // Create SierraAdventure instance with original methods if needed
        if (!window.SierraAdventure) {
            console.log('Creating new SierraAdventure instance');
            window.SierraAdventure = this.createSierraAdventure();
        }
        
        // Initialize SierraAdventure with our DOM-based message system
        if (!window.SierraAdventure.initialized) {
            console.log('Initializing SierraAdventure');
            // Override showMessage to use DOM instead of alert
            const originalShowMessage = window.SierraAdventure.showMessage;
            window.SierraAdventure.showMessage = function(message) {
                console.log('Showing message:', message);
                const messageBox = document.getElementById('message-box');
                const messageText = document.getElementById('message-text');
                
                if (messageBox && messageText) {
                    messageText.textContent = message;
                    messageBox.style.display = 'block';
                } else {
                    console.error('Message elements not found!');
                    if (originalShowMessage) {
                        originalShowMessage.call(this, message);
                    } else {
                        alert(message); // Fallback
                    }
                }
            };
            
            // Now initialize with our enhanced showMessage
            window.SierraAdventure.init();
            window.SierraAdventure.initialized = true;
        }
    },
    
    /**
     * Ensure all required global objects exist
     */
    ensureGlobalObjects() {
        window.gameSprites = window.gameSprites || {};
        window.gameImages = window.gameImages || {};
        window.COLORS = window.COLORS || COLORS;
    },
    
    /**
     * Generate sprites and backgrounds
     */
    generateSprites() {
        // Generate player sprite
        if (!window.gameSprites.playerCharacter) {
            window.gameSprites.playerCharacter = new PixelSprite([
                [COLORS.TRANSPARENT, COLORS.BROWN, COLORS.BROWN, COLORS.TRANSPARENT],
                [COLORS.BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.BROWN],
                [COLORS.TRANSPARENT, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.TRANSPARENT],
                [COLORS.TRANSPARENT, COLORS.BLUE, COLORS.BLUE, COLORS.TRANSPARENT],
                [COLORS.BLUE, COLORS.BLUE, COLORS.BLUE, COLORS.BLUE],
                [COLORS.BLUE, COLORS.BLUE, COLORS.BLUE, COLORS.BLUE],
                [COLORS.TRANSPARENT, COLORS.DARK_GREY, COLORS.DARK_GREY, COLORS.TRANSPARENT],
                [COLORS.TRANSPARENT, COLORS.DARK_GREY, COLORS.DARK_GREY, COLORS.TRANSPARENT]
            ]);
        }
        
        // Generate character sprites
        const characterNames = ['bartender', 'mysterious-woman', 'door', 'barstool', 'hotel-key'];
        const characterColors = [
            COLORS.GREY,
            COLORS.RED,
            COLORS.BROWN,
            COLORS.LIGHT_BROWN,
            COLORS.YELLOW
        ];
        
        characterNames.forEach((name, index) => {
            if (!window.gameSprites[name]) {
                window.gameSprites[name] = new PixelSprite([
                    [COLORS.TRANSPARENT, characterColors[index], characterColors[index], COLORS.TRANSPARENT],
                    [characterColors[index], characterColors[index], characterColors[index], characterColors[index]],
                    [characterColors[index], characterColors[index], characterColors[index], characterColors[index]],
                    [COLORS.TRANSPARENT, characterColors[index], characterColors[index], COLORS.TRANSPARENT]
                ]);
            }
        });
        
        // Generate room backgrounds
        this.generateRoomBackgrounds();
    },
    
    /**
     * Generate room backgrounds
     */
    generateRoomBackgrounds() {
        const rooms = [
            { id: 'bar', color: '#442200' },
            { id: 'street', color: '#222222' },
            { id: 'hotel-lobby', color: '#113355' },
            { id: 'hotel-hallway', color: '#223322' },
            { id: 'secret-room', color: '#331122' }
        ];
        
        rooms.forEach(room => {
            const bgKey = `${room.id}-background.png`;
            
            if (!window.gameImages[bgKey]) {
                // Create canvas for background
                const canvas = document.createElement('canvas');
                canvas.width = 640;
                canvas.height = 400;
                const ctx = canvas.getContext('2d');
                
                // Fill with base color
                ctx.fillStyle = room.color;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Add texture
                for (let i = 0; i < 1000; i++) {
                    const x = Math.floor(Math.random() * canvas.width);
                    const y = Math.floor(Math.random() * canvas.height);
                    const size = Math.floor(Math.random() * 3) + 1;
                    const brightness = Math.random() > 0.5 ? 20 : -20;
                    
                    ctx.fillStyle = this.adjustColor(room.color, brightness);
                    ctx.fillRect(x, y, size, size);
                }
                
                // Add floor
                ctx.fillStyle = this.adjustColor(room.color, -30);
                ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
                
                // Store as data URL
                window.gameImages[bgKey] = canvas.toDataURL();
                console.log(`Generated background for ${room.id}`);
            }
        });
    },
    
    /**
     * Helper to adjust a color's brightness
     */
    adjustColor(color, amount) {
        if (!color || color === 'transparent') return color;
        
        // Parse hex color
        let hex = color.replace('#', '');
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        
        // Adjust values
        r = Math.max(0, Math.min(255, r + amount));
        g = Math.max(0, Math.min(255, g + amount));
        b = Math.max(0, Math.min(255, b + amount));
        
        // Convert back to hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    },
    
    /**
     * Create a SierraAdventure object with all needed methods
     * This is a fallback if the original object is not available
     */
    createSierraAdventure() {
        return {
            // Game state
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
            
            // Add all needed methods
            init: function() {
                console.log('Initializing SierraAdventure');
                
                // Cache DOM elements
                this.cacheDOMElements();
                
                // Generate player sprite
                this.generatePlayerSprite();
                
                // Set up event listeners
                this.setupEventListeners();
                
                // Update the room
                this.updateRoom();
                
                // Start game timer
                this.timers = {
                    gameTime: setInterval(() => this.updateGameTime(), 1000)
                };
                
                // Show welcome message
                this.showMessage(`Welcome to "Hotel of Desire: A Sierra-style Adventure"! You are ${this.gameState.playerName}, a lovable loser on a quest for love and excitement in the big city. Type 'help' for commands.`);
                
                this.initialized = true;
            },
            
            // Cache DOM elements
            cacheDOMElements: function() {
                this.domElements = {
                    scene: document.querySelector('.scene'),
                    player: document.getElementById('player'),
                    roomCanvas: document.getElementById('room-canvas'),
                    inventory: document.getElementById('inventory'),
                    messageBox: document.getElementById('message-box'),
                    messageText: document.getElementById('message-text'),
                    messageOk: document.getElementById('message-ok'),
                    scoreElement: document.querySelector('.score'),
                    timeElement: document.getElementById('game-time'),
                    commandInput: document.getElementById('command-input'),
                    actionButtons: {
                        look: document.getElementById('look-btn'),
                        talk: document.getElementById('talk-btn'),
                        walk: document.getElementById('walk-btn'),
                        use: document.getElementById('use-btn'),
                        inventory: document.getElementById('inventory-btn')
                    }
                };
            },
            
            // Generate player sprite
            generatePlayerSprite: function() {
                const playerDiv = document.getElementById('player');
                if (!playerDiv) return;
                
                const canvas = document.createElement('canvas');
                canvas.width = 32;
                canvas.height = 64;
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                
                const ctx = canvas.getContext('2d');
                
                // Draw player sprite
                if (window.gameSprites && window.gameSprites.playerCharacter) {
                    window.gameSprites.playerCharacter.render(ctx, 0, 0, 8);
                } else {
                    // Fallback sprite
                    ctx.fillStyle = '#3050FF'; // Blue
                    ctx.fillRect(8, 16, 16, 32); // Body
                    ctx.fillStyle = '#FFC8A2'; // Skin tone
                    ctx.fillRect(8, 0, 16, 16); // Head
                }
                
                playerDiv.appendChild(canvas);
            },
            
            // Set up event listeners
            setupEventListeners: function() {
                const messageOk = document.getElementById('message-ok');
                if (messageOk) {
                    messageOk.addEventListener('click', () => this.closeMessage());
                }
                
                // Other event listeners...
            },
            
            // Show message
            showMessage: function(message) {
                const messageBox = document.getElementById('message-box');
                const messageText = document.getElementById('message-text');
                
                if (messageBox && messageText) {
                    messageText.textContent = message;
                    messageBox.style.display = 'block';
                } else {
                    console.error('Message box not found!');
                    alert(message); // Fallback
                }
            },
            
            // Close message
            closeMessage: function() {
                const messageBox = document.getElementById('message-box');
                if (messageBox) {
                    messageBox.style.display = 'none';
                }
            },
            
            // Update game time
            updateGameTime: function() {
                this.gameState.gameTime++;
                
                // Format time
                const hours = Math.floor(this.gameState.gameTime / 60) % 24;
                const minutes = this.gameState.gameTime % 60;
                
                const timeElement = document.getElementById('game-time');
                if (timeElement) {
                    timeElement.textContent = `Time: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                }
            },
            
            // Update room
            updateRoom: function() {
                const roomId = this.gameState.currentRoom;
                console.log(`Updating room: ${roomId}`);
                
                const canvas = document.getElementById('room-canvas');
                if (!canvas) return;
                
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw background
                const backgroundKey = `${roomId}-background.png`;
                if (window.gameImages && window.gameImages[backgroundKey]) {
                    const img = new Image();
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        
                        // Draw hotspots
                        this.drawHotspots(ctx);
                    };
                    img.src = window.gameImages[backgroundKey];
                } else {
                    console.error(`Background not found: ${backgroundKey}`);
                    ctx.fillStyle = '#222222';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    ctx.fillStyle = '#FF0000';
                    ctx.font = '20px monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText(`Missing background: ${backgroundKey}`, canvas.width/2, canvas.height/2);
                    
                    // Draw hotspots even without background
                    this.drawHotspots(ctx);
                }
                
                // Show room description
                this.showMessage(`You are in ${roomId.replace('-', ' ')}.`);
            },
            
            // Draw hotspots
            drawHotspots: function(ctx) {
                ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
                ctx.fillRect(200, 200, 50, 50);
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '12px monospace';
                ctx.fillText('Example Hotspot', 225, 225);
            }
        };
    }
};

// Export as module
export default GameEngine;

// Make available globally
window.GameEngine = GameEngine;
