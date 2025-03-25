import { COLORS } from '../common/color-palette.js';
import { PixelSprite } from '../graphics/PixelSprite.js';

const GameEngine = {
    init() {
        console.log('Initializing Sierra Adventure Game Engine');
        
        // Initialize global objects
        window.gameSprites = window.gameSprites || {};
        window.gameImages = window.gameImages || {};
        
        // Generate required sprites and scenes
        this.generateSprites();
        this.generateScenes();
        
        // Load the original SierraAdventure object from placeholder-images.js
        console.log('Looking for SierraAdventure object...');
        
        // Create new SierraAdventure or use existing one
        if (!window.SierraAdventure) {
            console.log('SierraAdventure not found, creating new instance');
            window.SierraAdventure = this.createSierraAdventure();
        } else {
            console.log('Found existing SierraAdventure, enhancing it');
            this.enhanceSierraAdventure(window.SierraAdventure);
        }
        
        // Initialize SierraAdventure
        console.log('Initializing SierraAdventure');
        window.SierraAdventure.init();
    },
    
    /**
     * Generate all sprites needed for the game
     */
    generateSprites() {
        console.log('Generating sprites');
        
        // Player character sprite
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
        
        // Bartender sprite
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
        
        // Woman sprite
        const woman = new PixelSprite([
            [COLORS.TRANSPARENT, COLORS.YELLOW, COLORS.YELLOW, COLORS.TRANSPARENT],
            [COLORS.YELLOW, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.YELLOW],
            [COLORS.TRANSPARENT, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.RED, COLORS.RED, COLORS.TRANSPARENT],
            [COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED],
            [COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED],
            [COLORS.TRANSPARENT, COLORS.RED, COLORS.RED, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.RED, COLORS.RED, COLORS.TRANSPARENT]
        ]);
        window.gameSprites['mysterious-woman'] = woman;
        
        // Door sprite
        const door = new PixelSprite([
            [COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN],
            [COLORS.BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.BROWN],
            [COLORS.BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.BROWN],
            [COLORS.BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.BROWN],
            [COLORS.BROWN, COLORS.DARK_BROWN, COLORS.YELLOW, COLORS.BROWN],
            [COLORS.BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.BROWN]
        ]);
        window.gameSprites.door = door;
        
        // Other needed sprites
        const barstool = new PixelSprite([
            [COLORS.TRANSPARENT, COLORS.BROWN, COLORS.TRANSPARENT],
            [COLORS.BROWN, COLORS.LIGHT_BROWN, COLORS.BROWN],
            [COLORS.BROWN, COLORS.BROWN, COLORS.BROWN],
            [COLORS.BROWN, COLORS.TRANSPARENT, COLORS.BROWN]
        ]);
        window.gameSprites.barstool = barstool;
        
        const hotelKey = new PixelSprite([
            [COLORS.YELLOW, COLORS.YELLOW],
            [COLORS.YELLOW, COLORS.TRANSPARENT]
        ]);
        window.gameSprites['hotel-key'] = hotelKey;
        
        console.log('Sprites generated successfully');
    },
    
    /**
     * Generate all scene backgrounds
     */
    generateScenes() {
        console.log('Generating scene backgrounds');
        
        // Bar background
        this.generateBarScene();
        
        // Street background
        this.generateStreetScene();
        
        // Hotel lobby background
        this.generateHotelLobbyScene();
        
        // Hotel hallway background
        this.generateHotelHallwayScene();
        
        // Secret room background
        this.generateSecretRoomScene();
        
        console.log('Scene backgrounds generated successfully');
    },
    
    /**
     * Generate bar scene background
     */
    generateBarScene() {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Dark wooden background
        ctx.fillStyle = '#442200';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add noise texture
        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const brightness = Math.random() > 0.5 ? 20 : -20;
            ctx.fillStyle = this.adjustColor('#442200', brightness);
            ctx.fillRect(x, y, 1, 1);
        }
        
        // Draw floor
        ctx.fillStyle = '#221100';
        ctx.fillRect(0, 300, canvas.width, 100);
        
        // Draw bar counter
        ctx.fillStyle = '#553322';
        ctx.fillRect(350, 150, 250, 100);
        
        // Draw shelves behind bar
        ctx.fillStyle = '#332211';
        ctx.fillRect(350, 50, 250, 100);
        
        // Draw bottles on shelves
        for (let i = 0; i < 10; i++) {
            const x = 360 + i * 25;
            ctx.fillStyle = ['#884422', '#22AA22', '#AA2222', '#2222AA'][i % 4];
            ctx.fillRect(x, 70, 15, 30);
        }
        
        // Draw door
        ctx.fillStyle = '#553322';
        ctx.fillRect(50, 150, 80, 150);
        ctx.fillStyle = '#332211';
        ctx.fillRect(55, 155, 70, 140);
        ctx.fillStyle = '#CCCC00';
        ctx.beginPath();
        ctx.arc(120, 225, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw tables
        for (let i = 0; i < 2; i++) {
            const x = 150 + i * 100;
            ctx.fillStyle = '#332211';
            ctx.fillRect(x, 250, 70, 30);
        }
        
        // Store in gameImages
        window.gameImages['bar-background.png'] = canvas.toDataURL();
    },
    
    /**
     * Generate street scene background
     */
    generateStreetScene() {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Night sky
        ctx.fillStyle = '#000022';
        ctx.fillRect(0, 0, canvas.width, 200);
        
        // Stars
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * 150;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x, y, 1, 1);
        }
        
        // Street
        ctx.fillStyle = '#222222';
        ctx.fillRect(0, 200, canvas.width, 200);
        
        // Buildings
        for (let i = 0; i < 3; i++) {
            const x = i * 200;
            const height = 150 + Math.random() * 50;
            ctx.fillStyle = '#334455';
            ctx.fillRect(x, 200 - height, 180, height);
            
            // Windows
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    const wx = x + 20 + col * 40;
                    const wy = 200 - height + 20 + row * 30;
                    ctx.fillStyle = Math.random() > 0.3 ? '#FFFF77' : '#222222';
                    ctx.fillRect(wx, wy, 20, 15);
                }
            }
        }
        
        // Store in gameImages
        window.gameImages['street-background.png'] = canvas.toDataURL();
    },
    
    /**
     * Generate hotel lobby scene background
     */
    generateHotelLobbyScene() {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Background
        ctx.fillStyle = '#332211';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Floor
        ctx.fillStyle = '#221100';
        ctx.fillRect(0, 300, canvas.width, 100);
        
        // Reception desk
        ctx.fillStyle = '#443322';
        ctx.fillRect(250, 150, 200, 150);
        ctx.fillStyle = '#554433';
        ctx.fillRect(250, 150, 200, 20);
        
        // Plant
        ctx.fillStyle = '#006600';
        ctx.beginPath();
        ctx.arc(100, 200, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#664422';
        ctx.fillRect(90, 230, 20, 70);
        
        // Exit door
        ctx.fillStyle = '#554433';
        ctx.fillRect(500, 150, 80, 150);
        ctx.fillStyle = '#332211';
        ctx.fillRect(505, 155, 70, 140);
        
        // Store in gameImages
        window.gameImages['hotel-lobby-background.png'] = canvas.toDataURL();
    },
    
    /**
     * Generate hotel hallway scene
     */
    generateHotelHallwayScene() {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Hallway wall
        ctx.fillStyle = '#554433';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Floor
        ctx.fillStyle = '#332211';
        ctx.fillRect(0, 300, canvas.width, 100);
        
        // Ceiling
        ctx.fillStyle = '#443322';
        ctx.fillRect(0, 0, canvas.width, 50);
        
        // Wall trim
        ctx.fillStyle = '#665544';
        ctx.fillRect(0, 290, canvas.width, 10);
        ctx.fillRect(0, 50, canvas.width, 10);
        
        // Doors on left
        for (let i = 0; i < 3; i++) {
            const x = 50 + i * 100;
            ctx.fillStyle = '#332211';
            ctx.fillRect(x, 150, 70, 140);
            
            // Door frame
            ctx.strokeStyle = '#221100';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, 150, 70, 140);
            
            // Door number
            ctx.fillStyle = '#CCCC00';
            ctx.beginPath();
            ctx.arc(x + 35, 170, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000000';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`20${i+1}`, x + 35, 173);
            
            // Door handle
            ctx.fillStyle = '#CCCC00';
            ctx.beginPath();
            ctx.arc(x + 60, 220, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Store in gameImages
        window.gameImages['hotel-hallway-background.png'] = canvas.toDataURL();
    },
    
    /**
     * Generate secret room scene
     */
    generateSecretRoomScene() {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Room background
        ctx.fillStyle = '#220022';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Floor
        ctx.fillStyle = '#331133';
        ctx.fillRect(0, 300, canvas.width, 100);
        
        // Card table
        ctx.fillStyle = '#006600';
        ctx.fillRect(200, 250, 200, 50);
        ctx.fillStyle = '#004400';
        ctx.fillRect(210, 260, 180, 30);
        
        // Poker chips
        for (let i = 0; i < 3; i++) {
            const x = 250 + i * 40;
            ctx.fillStyle = ['#FF0000', '#FFFFFF', '#0000FF'][i];
            ctx.beginPath();
            ctx.arc(x, 270, 10, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Exit door
        ctx.fillStyle = '#331133';
        ctx.fillRect(100, 150, 70, 150);
        ctx.fillStyle = '#220022';
        ctx.fillRect(105, 155, 60, 140);
        
        // Store in gameImages
        window.gameImages['secret-room-background.png'] = canvas.toDataURL();
    },
    
    /**
     * Adjust color brightness
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
     * Enhance the existing SierraAdventure object with new functionality
     */
    enhanceSierraAdventure(sierraAdv) {
        // Add any enhancements needed
    },
    
    /**
     * Create a new SierraAdventure object if none exists
     */
    createSierraAdventure() {
        // Just the basic structure, will be populated elsewhere
        return {
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
            
            rooms: {
                bar: {
                    background: 'bar-background.png',
                    description: "You're in a dimly lit bar called 'The Thirsty Snake'.",
                    hotspots: [
                        {
                            name: 'bartender',
                            x: 400, y: 150,
                            width: 60, height: 100,
                            description: "A gruff looking bartender.",
                            actions: {
                                look: "The bartender looks like he's seen it all.",
                                talk: "Hello there, stranger.",
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
                        }
                    ],
                    exits: { 'street': { x: 50, y: 200 } }
                }
                // Other rooms would be defined here
            },
            
            init() {
                console.log("Basic SierraAdventure init called");
            }
        };
    }
};

export default GameEngine;
