/**
 * Game Engine for Sierra Adventure
 * Handles scene generation and initialization
 */
import { COLORS } from '../common/color-palette.js';
import { PixelSprite } from '../graphics/PixelSprite.js';

// Main Game Engine object
const GameEngine = {
    // Initialize game engine
    init() {
        console.log('Initializing Sierra Adventure Game Engine');
        
        // Initialize global objects
        window.gameSprites = window.gameSprites || {};
        window.gameImages = window.gameImages || {};
        
        // Set window.SierraAdventure to global scope
        if (typeof window.SierraAdventure === 'undefined') {
            console.log('Creating new SierraAdventure object');
            window.SierraAdventure = this.createSierraAdventure();
        } else {
            console.log('Found existing SierraAdventure object');
        }
        
        // Generate sprite resources
        this.generateSprites();
        
        // Create simple scene backgrounds
        this.generateScenes();
        
        // Initialize the game
        if (typeof window.SierraAdventure.init === 'function') {
            console.log('Initializing SierraAdventure');
            window.SierraAdventure.init();
        } else {
            console.error('SierraAdventure.init not found!');
        }
    },
    
    // Generate sprite resources
    generateSprites() {
        const playerCharacter = new PixelSprite([
            [COLORS.TRANSPARENT, COLORS.BROWN, COLORS.BROWN, COLORS.TRANSPARENT],
            [COLORS.BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.BROWN],
            [COLORS.TRANSPARENT, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.BLUE, COLORS.BLUE, COLORS.TRANSPARENT],
            [COLORS.BLUE, COLORS.BLUE, COLORS.BLUE, COLORS.BLUE],
            [COLORS.BLUE, COLORS.BLUE, COLORS.BLUE, COLORS.BLUE],
            [COLORS.TRANSPARENT, COLORS.DARK_GREY, COLORS.DARK_GREY, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.DARK_GREY, COLORS.DARK_GREY, COLORS.TRANSPARENT]
        ]);
        window.gameSprites.playerCharacter = playerCharacter;
        
        const bartender = new PixelSprite([
            [COLORS.TRANSPARENT, COLORS.BROWN, COLORS.BROWN, COLORS.TRANSPARENT],
            [COLORS.BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.BROWN],
            [COLORS.BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.BROWN],
            [COLORS.TRANSPARENT, COLORS.WHITE, COLORS.WHITE, COLORS.TRANSPARENT],
            [COLORS.WHITE, COLORS.GREY, COLORS.GREY, COLORS.WHITE],
            [COLORS.WHITE, COLORS.GREY, COLORS.GREY, COLORS.WHITE],
            [COLORS.TRANSPARENT, COLORS.DARK_GREY, COLORS.DARK_GREY, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.DARK_GREY, COLORS.DARK_GREY, COLORS.TRANSPARENT]
        ]);
        window.gameSprites.bartender = bartender;
        
        // Generate other character and item sprites
        const characters = [
            { name: 'mysterious-woman', color: COLORS.RED },
            { name: 'door', color: COLORS.BROWN },
            { name: 'barstool', color: COLORS.LIGHT_BROWN },
            { name: 'hotel-key', color: COLORS.YELLOW }
        ];
        
        characters.forEach(char => {
            window.gameSprites[char.name] = new PixelSprite([
                [COLORS.TRANSPARENT, char.color, char.color, COLORS.TRANSPARENT],
                [char.color, char.color, char.color, char.color],
                [char.color, char.color, char.color, char.color],
                [COLORS.TRANSPARENT, char.color, char.color, COLORS.TRANSPARENT]
            ]);
        });
    },
    
    // Generate scene backgrounds
    generateScenes() {
        console.log('Generating scene backgrounds');
        
        // Generate backgrounds for all rooms
        const roomNames = ['bar', 'street', 'hotel-lobby', 'hotel-hallway', 'secret-room'];
        const baseColors = ['#442200', '#333333', '#554433', '#445566', '#332233'];
        
        roomNames.forEach((name, index) => {
            this.generateRoomBackground(name, baseColors[index]);
        });
    },
    
    // Generate a single room background
    generateRoomBackground(roomId, baseColor) {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Fill with base color
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add noise texture
        for (let i = 0; i < 5000; i++) {
            const x = Math.floor(Math.random() * canvas.width);
            const y = Math.floor(Math.random() * canvas.height);
            const brightness = Math.random() > 0.5 ? 20 : -20;
            ctx.fillStyle = this.adjustColor(baseColor, brightness);
            ctx.fillRect(x, y, 1, 1);
        }
        
        // Add floor
        ctx.fillStyle = this.adjustColor(baseColor, -30);
        ctx.fillRect(0, 300, canvas.width, 100);
        
        // Store the background
        const dataUrl = canvas.toDataURL();
        window.gameImages[`${roomId}-background.png`] = dataUrl;
        console.log(`Generated background for ${roomId}`);
    },
    
    // Helper function to adjust color brightness
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
    
    // Create a minimal SierraAdventure object
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
            
            // Room data
            rooms: {
                bar: {
                    background: 'bar-background.png',
                    description: "You're in a dimly lit bar called 'The Thirsty Snake'.",
                    hotspots: [
                        {
                            name: 'bartender',
                            x: 400, y: 150,
                            width: 60, height: 100,
                            description: "A gruff looking bartender wiping glasses clean.",
                            actions: {
                                look: "The bartender looks like he's seen it all.",
                                talk: "\"What'll it be, stranger?\"",
                                use: "I don't think you should try to use the bartender."
                            }
                        },
                        {
                            name: 'door',
                            x: 50, y: 150,
                            width: 80, height: 150,
                            description: "A door leading outside.",
                            actions: {
                                look: "It's an old wooden door with peeling paint.",
                                use: "exit-to-street"
                            }
                        },
                        {
                            name: 'mysterious-woman',
                            x: 200, y: 200,
                            width: 50, height: 100,
                            description: "A beautiful woman in a red dress sitting alone at a table.",
                            actions: {
                                look: "She's gorgeous with long blonde hair and a red dress.",
                                talk: "You approach with your best smile. \"Hello there, handsome,\" she says with a wink.",
                                use: "You should probably talk to her first."
                            }
                        }
                    ],
                    exits: {
                        'street': { x: 50, y: 200 }
                    }
                },
                street: {
                    background: 'street-background.png',
                    description: "You're on a busy street with neon signs illuminating the night.",
                    hotspots: [],
                    exits: {
                        'bar': { x: 400, y: 200 },
                        'hotel-lobby': { x: 50, y: 200 }
                    }
                },
                'hotel-lobby': {
                    background: 'hotel-lobby-background.png',
                    description: "You're in the lobby of the Starlight Hotel.",
                    hotspots: [],
                    exits: {
                        'street': { x: 450, y: 200 },
                        'hotel-hallway': { x: 200, y: 200 }
                    }
                },
                'hotel-hallway': {
                    background: 'hotel-hallway-background.png',
                    description: "You're in a long, dimly lit hallway on the second floor of the hotel.",
                    hotspots: [],
                    exits: {
                        'hotel-lobby': { x: 100, y: 200 }
                    }
                },
                'secret-room': {
                    background: 'secret-room-background.png',
                    description: "You've entered Room 204. To your surprise, it's actually a secret casino operation!",
                    hotspots: [],
                    exits: {
                        'hotel-hallway': { x: 100, y: 200 }
                    }
                }
            },
            
            // DOM elements cache
            domElements: {},
            
            // Initialize the game
            init() {
                this.cacheDOMElements();
                this.setupEventListeners();
                this.generatePlayerSprite();
                this.updateRoom();
                this.timers = {
                    gameTime: setInterval(() => this.updateGameTime(), 1000)
                };
                
                // Show welcome message
                this.showMessage(`Welcome to "Hotel of Desire: A Sierra-style Adventure"! You are ${this.gameState.playerName}, a lovable loser on a quest for love and excitement in the big city.`);
            },
            
            // Cache DOM elements
            cacheDOMElements() {
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
            
            // Set up event listeners
            setupEventListeners() {
                this.domElements.messageOk.addEventListener('click', () => this.closeMessage());
                this.domElements.scene.addEventListener('click', (e) => this.handleSceneClick(e));
                document.addEventListener('keydown', (e) => this.handleKeyboardMovement(e));
                
                // Action buttons
                if (this.domElements.actionButtons) {
                    Object.entries(this.domElements.actionButtons).forEach(([action, button]) => {
                        if (button) {
                            button.addEventListener('click', () => this.setPlayerAction(action));
                        }
                    });
                }
            },
            
            // Generate player sprite
            generatePlayerSprite() {
                const player = this.domElements.player;
                if (!player) return;
                
                const canvas = document.createElement('canvas');
                canvas.width = 32;
                canvas.height = 64;
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                
                const ctx = canvas.getContext('2d');
                
                if (window.gameSprites && window.gameSprites.playerCharacter) {
                    window.gameSprites.playerCharacter.render(ctx, 0, 0, 8);
                } else {
                    // Fallback - simple player representation
                    ctx.fillStyle = '#3050FF'; // Blue
                    ctx.fillRect(8, 16, 16, 32); // Body
                    ctx.fillStyle = '#FFC8A2'; // Skin tone
                    ctx.fillRect(8, 0, 16, 16); // Head
                }
                
                player.appendChild(canvas);
            },
            
            // Update room
            updateRoom() {
                const room = this.rooms[this.gameState.currentRoom];
                if (!room) {
                    console.error('Room not found:', this.gameState.currentRoom);
                    return;
                }
                
                const canvas = this.domElements.roomCanvas;
                if (!canvas) {
                    console.error('Canvas not found');
                    return;
                }
                
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw room background
                const bgKey = `${this.gameState.currentRoom}-background.png`;
                if (window.gameImages && window.gameImages[bgKey]) {
                    console.log(`Loading background: ${bgKey}`);
                    const img = new Image();
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        this.drawRoomElements(ctx, room);
                    };
                    img.onerror = (err) => {
                        console.error('Error loading background image:', err);
                        // Fallback
                        ctx.fillStyle = '#222222';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        this.drawRoomElements(ctx, room);
                    };
                    img.src = window.gameImages[bgKey];
                } else {
                    console.error(`Background image not found: ${bgKey}`);
                    // Fallback
                    ctx.fillStyle = '#222222';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    this.drawRoomElements(ctx, room);
                }
            },
            
            // Draw room elements (hotspots, exits)
            drawRoomElements(ctx, room) {
                // Draw hotspots
                room.hotspots.forEach(hotspot => {
                    const sprite = window.gameSprites[hotspot.name];
                    if (sprite) {
                        sprite.render(ctx, hotspot.x, hotspot.y, 8);
                    } else if (window.debugMode) {
                        // Debug visualization of hotspots
                        ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(hotspot.x, hotspot.y, hotspot.width, hotspot.height);
                        
                        ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
                        ctx.font = '10px monospace';
                        ctx.fillText(hotspot.name, hotspot.x, hotspot.y - 2);
                    }
                });
                
                // Draw exits
                if (room.exits) {
                    ctx.fillStyle = 'rgba(100, 255, 100, 0.2)';
                    Object.entries(room.exits).forEach(([exitName, exitPos]) => {
                        ctx.beginPath();
                        ctx.arc(exitPos.x, exitPos.y, 15, 0, Math.PI * 2);
                        ctx.fill();
                        
                        ctx.fillStyle = '#FFFFFF';
                        ctx.font = '12px monospace';
                        ctx.textAlign = 'center';
                        ctx.fillText(`To: ${exitName}`, exitPos.x, exitPos.y + 30);
                    });
                }
            },
            
            // Show message in message box
            showMessage(message) {
                console.log('Show message:', message);
                if (this.domElements.messageText && this.domElements.messageBox) {
                    this.domElements.messageText.textContent = message;
                    this.domElements.messageBox.style.display = 'block';
                } else {
                    console.error('Message elements not found');
                    alert(message); // Fallback
                }
            },
            
            // Close message box
            closeMessage() {
                if (this.domElements.messageBox) {
                    this.domElements.messageBox.style.display = 'none';
                }
            },
            
            // Update game time display
            updateGameTime() {
                this.gameState.gameTime++;
                
                const hours = Math.floor(this.gameState.gameTime / 60) % 24;
                const minutes = this.gameState.gameTime % 60;
                
                if (this.domElements.timeElement) {
                    this.domElements.timeElement.textContent = 
                        `Time: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                }
            },
            
            // Handle scene clicks
            handleSceneClick(e) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const clickedHotspot = this.findHotspotAt(x, y);
                
                if (clickedHotspot) {
                    this.handleHotspotInteraction(clickedHotspot);
                } else if (this.gameState.playerAction === 'walk') {
                    this.movePlayer(x, y);
                }
            },
            
            // Find hotspot at coordinates
            findHotspotAt(x, y) {
                const room = this.rooms[this.gameState.currentRoom];
                for (const hotspot of room.hotspots) {
                    if (x >= hotspot.x && x <= hotspot.x + hotspot.width &&
                        y >= hotspot.y && y <= hotspot.y + hotspot.height) {
                        return hotspot;
                    }
                }
                return null;
            },
            
            // Handle hotspot interaction
            handleHotspotInteraction(hotspot) {
                const action = this.gameState.playerAction;
                let actionResult = hotspot.actions[action];
                
                if (actionResult) {
                    if (typeof actionResult === 'function') {
                        actionResult = actionResult();
                    }
                    
                    if (actionResult.startsWith('exit-to-')) {
                        // Handle room transition
                        const newRoom = actionResult.replace('exit-to-', '');
                        this.showMessage(`Going to ${newRoom}...`);
                        
                        setTimeout(() => {
                            this.gameState.currentRoom = newRoom;
                            this.updateRoom();
                        }, 1500);
                    } else {
                        this.showMessage(actionResult);
                    }
                } else {
                    this.showMessage(`You can't ${action} that.`);
                }
            },
            
            // Move player
            movePlayer(x, y) {
                const player = this.domElements.player;
                if (!player) return;
                
                x = Math.max(0, Math.min(608, x)); // 640 - 32 player width
                player.style.left = `${x}px`;
            },
            
            // Set player action
            setPlayerAction(action) {
                this.gameState.playerAction = action;
                
                if (!this.domElements.actionButtons) return;
                
                Object.values(this.domElements.actionButtons).forEach(btn => {
                    if (btn) btn.style.backgroundColor = '#555';
                });
                
                const button = this.domElements.actionButtons[action];
                if (button) button.style.backgroundColor = '#a00';
            },
            
            // Handle keyboard movement
            handleKeyboardMovement(e) {
                if (!this.domElements.messageBox) return;
                if (this.domElements.messageBox.style.display === 'block') return;
                
                if (this.gameState.playerAction !== 'walk') return;
                
                const player = this.domElements.player;
                if (!player) return;
                
                const currentX = parseInt(player.style.left) || 320;
                const moveStep = 10;
                
                let newX = currentX;
                
                switch(e.key) {
                    case 'ArrowLeft':
                    case 'a':
                        newX = Math.max(0, currentX - moveStep);
                        e.preventDefault();
                        break;
                    case 'ArrowRight':
                    case 'd':
                        newX = Math.min(608, currentX + moveStep);
                        e.preventDefault();
                        break;
                }
                
                if (newX !== currentX) {
                    this.movePlayer(newX, 0);
                }
            }
        };
    }
};

export default GameEngine;
