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
        
        // Generate classic Sierra-style objects
        this.generateSierraObjectSprites();
        
        // Generate Sierra-style scene backgrounds
        this.generateSierraSceneBackgrounds();
        
        // Convert sprites to data URLs
        this.convertSpritesToDataURLs();
        
        console.log('All Sierra-style sprites generated successfully');
    },
    
    /**
     * Generate character sprites
     */
    generateCharacterSprites() {
        // Import player sprite functions
        import('../graphics/PlayerSprite.js').then(module => {
            const { playerFront, playerLeft, playerRight, playerBack } = module.createPlayerSprites();
            
            // Register all player sprites
            this.registerSprite('playerCharacter', playerFront);
            this.registerSprite('playerLeft', playerLeft);
            this.registerSprite('playerRight', playerRight);
            this.registerSprite('playerBack', playerBack);
            
            window.gameSprites.playerCharacter = playerFront;
            window.gameSprites.playerLeft = playerLeft;
            window.gameSprites.playerRight = playerRight;
            window.gameSprites.playerBack = playerBack;
            
            // Trigger render update if needed
            if (window.RoomRenderer && window.SierraAdventure?.currentScene) {
                window.RoomRenderer.renderScene(window.sceneManager.getScene(window.SierraAdventure.currentScene));
            }
        }).catch(err => {
            console.error('Failed to load player sprites:', err);
            
            // Fallback simple player character
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
        });
        
        // Bartender sprite
        const bartender = new PixelSprite([
            [COLORS.TRANSPARENT, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.TRANSPARENT],
            [COLORS.DARK_BROWN, COLORS.SKIN_TONE, COLORS.SKIN_TONE, COLORS.DARK_BROWN],
            [COLORS.DARK_BROWN, COLORS.SKIN_TONE, COLORS.SKIN_TONE, COLORS.DARK_BROWN], // With mustache
            [COLORS.TRANSPARENT, COLORS.WHITE, COLORS.WHITE, COLORS.TRANSPARENT], // White shirt
            [COLORS.BLACK, COLORS.WHITE, COLORS.WHITE, COLORS.BLACK], // With black vest
            [COLORS.BLACK, COLORS.BLACK, COLORS.BLACK, COLORS.BLACK],
            [COLORS.TRANSPARENT, COLORS.BLACK, COLORS.BLACK, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.BLACK, COLORS.BLACK, COLORS.TRANSPARENT],
        ]);
        
        this.registerSprite('bartender', bartender);
        window.gameSprites.bartender = bartender;
        
        // Bar patron sprite
        const barPatron = new PixelSprite([
            [COLORS.TRANSPARENT, COLORS.YELLOW, COLORS.YELLOW, COLORS.TRANSPARENT],
            [COLORS.YELLOW, COLORS.SKIN_TONE, COLORS.SKIN_TONE, COLORS.YELLOW],
            [COLORS.TRANSPARENT, COLORS.SKIN_TONE, COLORS.SKIN_TONE, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.RED, COLORS.RED, COLORS.TRANSPARENT],
            [COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED],
            [COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED],
            [COLORS.TRANSPARENT, COLORS.DARK_BLUE, COLORS.DARK_BLUE, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.DARK_BLUE, COLORS.DARK_BLUE, COLORS.TRANSPARENT],
        ]);
        
        this.registerSprite('barPatron', barPatron);
        window.gameSprites.barPatron = barPatron;
    },
    
    /**
     * Generate Sierra-style object sprites with proper 3D perspective
     */
    generateSierraObjectSprites() {
        console.log('Generating Sierra-style object sprites with 3D perspective');
        
        // Sierra-style desk with 3D perspective
        const desk = new PixelSprite([
            [COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN],
            [COLORS.TRANSPARENT, COLORS.BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.BROWN],
            [COLORS.BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.BROWN],
            [COLORS.BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.LIGHT_BROWN, COLORS.BROWN],
            [COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN],
            [COLORS.BROWN, COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.BROWN, COLORS.TRANSPARENT],
            [COLORS.BROWN, COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.BROWN, COLORS.TRANSPARENT]
        ]);
        this.registerSprite('desk', desk);
        
        // Sierra-style chair with 3D perspective
        const chair = new PixelSprite([
            [COLORS.TRANSPARENT, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.TRANSPARENT],
            [COLORS.DARK_BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.DARK_BROWN],
            [COLORS.DARK_BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.DARK_BROWN],
            [COLORS.DARK_BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.DARK_BROWN],
            [COLORS.DARK_BROWN, COLORS.TRANSPARENT, COLORS.DARK_BROWN, COLORS.TRANSPARENT],
            [COLORS.DARK_BROWN, COLORS.TRANSPARENT, COLORS.DARK_BROWN, COLORS.TRANSPARENT]
        ]);
        this.registerSprite('chair', chair);
        
        // Sierra-style barstool with 3D perspective
        const barstool = new PixelSprite([
            [COLORS.TRANSPARENT, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.BROWN, COLORS.BROWN, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.BROWN, COLORS.BROWN, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.TRANSPARENT],
            [COLORS.DARK_BROWN, COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.DARK_BROWN],
            [COLORS.DARK_BROWN, COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.DARK_BROWN]
        ]);
        this.registerSprite('barstool', barstool);
        
        // Sierra-style door with 3D perspective
        const door = new PixelSprite([
            [COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN],
            [COLORS.DARK_BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.DARK_BROWN],
            [COLORS.DARK_BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.DARK_BROWN],
            [COLORS.DARK_BROWN, COLORS.BROWN, COLORS.YELLOW, COLORS.BROWN, COLORS.DARK_BROWN], // Door knob
            [COLORS.DARK_BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.DARK_BROWN],
            [COLORS.DARK_BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.DARK_BROWN],
            [COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN]
        ]);
        this.registerSprite('door', door);
        
        // Sierra-style window with 3D perspective
        const window = new PixelSprite([
            [COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN],
            [COLORS.DARK_BROWN, COLORS.LIGHT_BLUE, COLORS.DARK_BROWN, COLORS.LIGHT_BLUE, COLORS.DARK_BROWN],
            [COLORS.DARK_BROWN, COLORS.LIGHT_BLUE, COLORS.DARK_BROWN, COLORS.LIGHT_BLUE, COLORS.DARK_BROWN],
            [COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.DARK_BROWN]
        ]);
        this.registerSprite('window', window);
        
        // Sierra-style table with 3D perspective
        const table = new PixelSprite([
            [COLORS.TRANSPARENT, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.TRANSPARENT],
            [COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN],
            [COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN],
            [COLORS.BROWN, COLORS.DARK_BROWN, COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.DARK_BROWN, COLORS.BROWN],
            [COLORS.TRANSPARENT, COLORS.DARK_BROWN, COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.DARK_BROWN, COLORS.TRANSPARENT]
        ]);
        this.registerSprite('table', table);
        
        // Sierra-style key with 3D perspective
        const key = new PixelSprite([
            [COLORS.TRANSPARENT, COLORS.YELLOW, COLORS.YELLOW, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.YELLOW, COLORS.GOLD, COLORS.TRANSPARENT],
            [COLORS.YELLOW, COLORS.GOLD, COLORS.YELLOW, COLORS.YELLOW],
            [COLORS.YELLOW, COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.YELLOW],
            [COLORS.GOLD, COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.GOLD]
        ]);
        this.registerSprite('key', key);
        
        // Sierra-style bottle with 3D perspective
        const bottle = new PixelSprite([
            [COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.GREEN, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.GREEN, COLORS.GREEN, COLORS.GREEN, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.GREEN, COLORS.LIGHT_GREEN, COLORS.GREEN, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.GREEN, COLORS.LIGHT_GREEN, COLORS.GREEN, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.GREEN, COLORS.GREEN, COLORS.GREEN, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.GREEN, COLORS.GREEN, COLORS.GREEN, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.GREEN, COLORS.GREEN, COLORS.GREEN, COLORS.TRANSPARENT]
        ]);
        this.registerSprite('bottle', bottle);
        
        // Sierra-style glass with 3D perspective
        const glass = new PixelSprite([
            [COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.LIGHT_BLUE, COLORS.LIGHT_BLUE, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.LIGHT_BLUE, COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.LIGHT_BLUE, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.LIGHT_BLUE, COLORS.TRANSPARENT, COLORS.TRANSPARENT, COLORS.LIGHT_BLUE, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, COLORS.LIGHT_BLUE, COLORS.LIGHT_BLUE, COLORS.LIGHT_BLUE, COLORS.LIGHT_BLUE, COLORS.TRANSPARENT]
        ]);
        this.registerSprite('glass', glass);
        
        // Sierra-style jukebox with 3D perspective
        const jukebox = new PixelSprite([
            [COLORS.TRANSPARENT, COLORS.DARK_RED, COLORS.DARK_RED, COLORS.DARK_RED, COLORS.DARK_RED, COLORS.TRANSPARENT],
            [COLORS.DARK_RED, COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED, COLORS.DARK_RED],
            [COLORS.DARK_RED, COLORS.RED, COLORS.BLUE, COLORS.BLUE, COLORS.RED, COLORS.DARK_RED],
            [COLORS.DARK_RED, COLORS.RED, COLORS.YELLOW, COLORS.YELLOW, COLORS.RED, COLORS.DARK_RED],
            [COLORS.DARK_RED, COLORS.RED, COLORS.GREEN, COLORS.GREEN, COLORS.RED, COLORS.DARK_RED],
            [COLORS.DARK_RED, COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED, COLORS.DARK_RED],
            [COLORS.DARK_RED, COLORS.DARK_RED, COLORS.DARK_RED, COLORS.DARK_RED, COLORS.DARK_RED, COLORS.DARK_RED]
        ]);
        this.registerSprite('jukebox', jukebox);
    },
    
    /**
     * Generate Sierra-style scene backgrounds
     */
    generateSierraSceneBackgrounds() {
        console.log('Generating Sierra-style scene backgrounds');
        
        this.generateBarScene();
        this.generateStreetScene();
        this.generateForestScene();
        this.generateOfficeScene();
        this.generateHotelLobbyScene();
    },
    
    /**
     * Generate a bar scene background in Sierra style
     */
    generateBarScene() {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Background wall (Classic Sierra bar with wood paneling)
        ctx.fillStyle = '#442211';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Wood panel texture for walls (typical of Sierra games)
        for (let y = 0; y < canvas.height; y += 40) {
            ctx.fillStyle = '#3A1D0A'; // Darker line for wood grain
            ctx.fillRect(0, y, canvas.width, 2);
        }
        
        // Floor (darker wood color)
        ctx.fillStyle = '#221100';
        ctx.fillRect(0, 300, canvas.width, 100);
        
        // Floor pattern (Sierra-style wood grain)
        for (let x = 0; x < canvas.width; x += 20) {
            ctx.fillStyle = '#331100';
            ctx.fillRect(x, 300, 10, 100);
        }
        
        // Bar counter on right side (larger and more prominent)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(400, 240, 200, 60);
        ctx.fillStyle = '#A05000';
        ctx.fillRect(400, 240, 200, 10); // Counter edge highlight
        
        // Bar rail (common in Sierra bar scenes)
        ctx.fillStyle = '#C0A080';
        ctx.fillRect(400, 260, 200, 5);
        
        // Shelves with bottles behind bar (3D effect)
        ctx.fillStyle = '#3A1D0A'; // Dark wood color
        ctx.fillRect(400, 100, 200, 120); // Back wall of shelves
        
        // Shelf dividers
        for (let y = 130; y < 220; y += 30) {
            ctx.fillStyle = '#5C3317';
            ctx.fillRect(400, y, 200, 5);
        }
        
        // Bottles (various colors in classic Sierra style)
        for (let i = 0; i < 12; i++) {
            const bottleX = 415 + (i % 6) * 33;
            const bottleY = 105 + Math.floor(i / 6) * 40;
            
            // Randomize bottle colors like in Sierra games
            const bottleColors = ['#00FF00', '#0000FF', '#FF0000', '#FFFF00', '#FF00FF', '#00FFFF'];
            ctx.fillStyle = bottleColors[i % bottleColors.length];
            
            // Taller, narrower bottles (Sierra style)
            ctx.fillRect(bottleX, bottleY, 15, 30);
            
            // Bottle highlights (Sierra often used simple highlights)
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(bottleX + 5, bottleY + 5, 5, 10);
        }
        
        // Add a mirror behind the bar (common in Sierra bars)
        ctx.fillStyle = '#708090'; // Slate gray
        ctx.fillRect(440, 150, 120, 70);
        ctx.strokeStyle = '#C0A080'; // Gold frame
        ctx.lineWidth = 3;
        ctx.strokeRect(440, 150, 120, 70);
        
        // Tables with chairs (scattered around the scene)
        for (let i = 0; i < 3; i++) {
            const tableX = 80 + i * 100;
            
            // Table
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(tableX, 260, 60, 40);
            ctx.fillStyle = '#A05000'; // Table edge
            ctx.fillRect(tableX, 260, 60, 5);
            
            // Chairs
            ctx.fillStyle = '#A05000';
            ctx.fillRect(tableX - 20, 270, 20, 30);
            ctx.fillRect(tableX + 60, 270, 20, 30);
        }
        
        // Add a Sierra-style jukebox (distinctive landmark)
        ctx.fillStyle = '#8B0000'; // Dark red
        ctx.fillRect(30, 230, 40, 70);
        // Jukebox lights
        for (let y = 240; y < 290; y += 10) {
            ctx.fillStyle = ['#FF00FF', '#00FFFF', '#FFFF00'][Math.floor(y/10) % 3];
            ctx.fillRect(40, y, 20, 5);
        }
        
        // Add a typical Sierra neon sign (more prominent)
        ctx.fillStyle = '#000000';
        ctx.fillRect(50, 50, 80, 40);
        // Text "BAR" with Sierra-style glow effect
        ctx.fillStyle = '#FF00FF'; // Magenta base
        ctx.font = 'bold 24px Arial';
        ctx.fillText('BAR', 65, 78);
        // Glow effect
        ctx.shadowColor = '#FF00FF';
        ctx.shadowBlur = 10;
        ctx.fillText('BAR', 65, 78);
        ctx.shadowBlur = 0;
        
        // Add some Sierra-style wall decorations
        ctx.fillStyle = '#A05000'; // Frame color
        ctx.fillRect(150, 100, 60, 40);
        ctx.fillStyle = '#87CEEB'; // Picture
        ctx.fillRect(155, 105, 50, 30);
        
        ctx.fillStyle = '#A05000';
        ctx.fillRect(250, 110, 40, 60);
        ctx.fillStyle = '#006400';
        ctx.fillRect(255, 115, 30, 50);
        
        // Store the scene
        window.gameImages['bar-background'] = canvas.toDataURL();
        window.gameImages['bar-background.png'] = canvas.toDataURL();
    },
    
    /**
     * Generate a street scene background in Sierra style
     */
    generateStreetScene() {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Sky (Sierra games typically had simple gradient skies)
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, 200);
        
        // Add simple clouds
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(100, 50, 60, 20);
        ctx.fillRect(120, 40, 30, 30);
        ctx.fillRect(400, 70, 80, 30);
        ctx.fillRect(420, 60, 40, 40);
        
        // Street/ground
        ctx.fillStyle = '#555555';
        ctx.fillRect(0, 200, canvas.width, 200);
        
        // Building on left (Sierra games used basic colored rectangles for buildings)
        ctx.fillStyle = '#AA0000'; // Red building
        ctx.fillRect(0, 50, 200, 150);
        
        // Windows (typically blue rectangles)
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 5; x++) {
                ctx.fillStyle = '#87CEFA';
                ctx.fillRect(20 + x * 35, 70 + y * 40, 20, 30);
                ctx.strokeStyle = '#000000';
                ctx.strokeRect(20 + x * 35, 70 + y * 40, 20, 30);
            }
        }
        
        // Building on right
        ctx.fillStyle = '#007700'; // Green building
        ctx.fillRect(440, 80, 200, 120);
        
        // Store sign (typical text-based sign)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(480, 100, 120, 40);
        ctx.font = '18px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText('STORE', 510, 125);
        
        // Door
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(520, 150, 40, 50);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(530, 175, 5, 5); // Doorknob
        
        // Store the scene
        window.gameImages['street-background'] = canvas.toDataURL();
        window.gameImages['street-background.png'] = canvas.toDataURL();
    },
    
    /**
     * Generate a forest scene background in Sierra style
     */
    generateForestScene() {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Sky
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, 200);
        
        // Ground
        ctx.fillStyle = '#355E3B'; // Forest green
        ctx.fillRect(0, 200, canvas.width, 200);
        
        // Path through forest (Sierra games often had clear paths)
        ctx.fillStyle = '#8B4513'; // Brown dirt path
        ctx.beginPath();
        ctx.moveTo(0, 350);
        ctx.bezierCurveTo(200, 300, 400, 380, 640, 320);
        ctx.lineTo(640, 400);
        ctx.lineTo(0, 400);
        ctx.closePath();
        ctx.fill();
        
        // Draw multiple trees (Sierra forests had many simple tree sprites)
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * canvas.width;
            const y = 180 + Math.random() * 70;
            
            // Tree trunk
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x - 5, y, 10, 50);
            
            // Tree foliage (triangular, like Sierra games often used)
            ctx.fillStyle = '#006400';
            ctx.beginPath();
            ctx.moveTo(x - 20, y);
            ctx.lineTo(x + 20, y);
            ctx.lineTo(x, y - 40);
            ctx.closePath();
            ctx.fill();
        }
        
        // Add some rocks (Sierra games often had simple gray rocks)
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * canvas.width;
            const y = 300 + Math.random() * 70;
            ctx.fillStyle = '#808080';
            ctx.beginPath();
            ctx.arc(x, y, 5 + Math.random() * 10, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Store the scene
        window.gameImages['forest-background'] = canvas.toDataURL();
        window.gameImages['forest-background.png'] = canvas.toDataURL();
    },
    
    /**
     * Generate an office scene background in Sierra style
     */
    generateOfficeScene() {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Wall
        ctx.fillStyle = '#FFFFCC'; // Typical light wall color
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Floor
        ctx.fillStyle = '#8B4513'; // Brown wooden floor
        ctx.fillRect(0, 300, canvas.width, 100);
        
        // Floor pattern (Sierra-style wood grain)
        for (let x = 0; x < canvas.width; x += 40) {
            ctx.fillStyle = '#A05000';
            ctx.fillRect(x, 300, 20, 100);
        }
        
        // Office desk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(200, 260, 240, 40);
        ctx.fillStyle = '#A05000';
        ctx.fillRect(200, 260, 240, 5); // Desk edge highlight
        
        // Computer
        ctx.fillStyle = '#333333';
        ctx.fillRect(280, 230, 80, 30);
        ctx.fillStyle = '#87CEFA';
        ctx.fillRect(290, 235, 60, 20); // Screen
        ctx.fillStyle = '#CCCCCC';
        ctx.fillRect(300, 270, 40, 15); // Keyboard
        
        // Office chair
        ctx.fillStyle = '#000000';
        ctx.fillRect(310, 300, 40, 50);
        
        // Filing cabinet
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = '#C0C0C0';
            ctx.fillRect(50, 220 + i * 40, 70, 40);
            ctx.fillStyle = '#A0A0A0';
            ctx.fillRect(60, 230 + i * 40, 50, 5); // Drawer handle
        }
        
        // Window
        ctx.fillStyle = '#87CEFA';
        ctx.fillRect(450, 50, 150, 100);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 5;
        ctx.strokeRect(450, 50, 150, 100);
        
        // Window dividers
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(450, 100);
        ctx.lineTo(600, 100);
        ctx.moveTo(525, 50);
        ctx.lineTo(525, 150);
        ctx.stroke();
        
        // Store the scene
        window.gameImages['office-background'] = canvas.toDataURL();
        window.gameImages['office-background.png'] = canvas.toDataURL();
    },
    
    /**
     * Generate a hotel lobby scene background in Sierra style
     */
    generateHotelLobbyScene() {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Wall
        ctx.fillStyle = '#E6D2B5'; // Beige wall
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Floor
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(0, 300, canvas.width, 100);
        
        // Carpet
        ctx.fillStyle = '#9B2D30'; // Red carpet
        ctx.fillRect(100, 300, 440, 100);
        
        // Carpet pattern
        ctx.fillStyle = '#7B0D10';
        for (let x = 120; x < 520; x += 40) {
            for (let y = 320; y < 380; y += 40) {
                ctx.fillRect(x, y, 20, 20);
            }
        }
        
        // Reception desk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(400, 240, 200, 60);
        ctx.fillStyle = '#A05000';
        ctx.fillRect(400, 240, 200, 10); // Desk edge
        
        // Bell
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(500, 230, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Room doors
        for (let i = 0; i < 3; i++) {
            const doorX = 100 + i * 100;
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(doorX, 150, 60, 150);
            
            // Door numbers
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(doorX + 25, 170, 10, 15);
            ctx.font = '10px Arial';
            ctx.fillStyle = '#000000';
            ctx.fillText((i + 1).toString(), doorX + 27, 182);
        }
        
        // Store the scene
        window.gameImages['hotel-lobby-background'] = canvas.toDataURL();
        window.gameImages['hotel-lobby-background.png'] = canvas.toDataURL();
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
        
        // Sierra-style game often had both versions accessible
        const sceneTypes = [
            'bar-background', 
            'street-background', 
            'forest-background',
            'office-background',
            'hotel-lobby-background'
        ];
        
        // Ensure our Sierra-style backgrounds are registered in both formats
        sceneTypes.forEach(scene => {
            if (window.gameImages[scene + '.png']) {
                window.gameImages[scene] = window.gameImages[scene + '.png'];
            }
            if (window.gameImages[scene]) {
                window.gameImages[scene + '.png'] = window.gameImages[scene];
            }
        });
        
        console.log('Sierra-style sprites and scenes converted successfully');
    }
};

// Make available globally for non-module code
window.SpriteEngine = SpriteEngine;

// Export as module
export default SpriteEngine;
