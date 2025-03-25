import { COLORS } from '../common/color-palette.js';
import { PixelSprite } from '../graphics/PixelSprite.js';

const GameEngine = {
    init() {
        console.log('Initializing Sierra Adventure Game Engine');
        
        // Create required global objects
        window.gameSprites = window.gameSprites || {};
        window.gameImages = window.gameImages || {};
        
        // Generate Sierra-style graphics
        this.generateSierraGraphics();
        
        // Set up enhanced SierraAdventure object
        this.enhanceSierraAdventure();
        
        // Initialize game
        if (window.SierraAdventure) {
            window.SierraAdventure.init();
        }
    },

    generateSierraGraphics() {
        // Bar scene background with wooden textures
        this.createRoomBackground('bar', '#442211', [
            { type: 'rect', x: 0, y: 300, width: 640, height: 100, color: '#332211' }, // Floor
            { type: 'rect', x: 350, y: 100, width: 250, height: 200, color: '#553322' }, // Bar counter
            { type: 'rect', x: 350, y: 50, width: 250, height: 50, color: '#222222' },   // Shelves
            { type: 'rect', x: 20, y: 120, width: 100, height: 180, color: '#553322' },  // Door
        ]);

        // NPCs and objects
        this.createSierraSprite('bartender', [
            [COLORS.TRANSPARENT, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.TRANSPARENT],
            [COLORS.DARK_BROWN, '#FFC8A2', '#FFC8A2', COLORS.DARK_BROWN], // Face
            [COLORS.DARK_BROWN, '#FFC8A2', '#FFC8A2', COLORS.DARK_BROWN], // With mustache
            [COLORS.TRANSPARENT, '#FFFFFF', '#FFFFFF', COLORS.TRANSPARENT], // White shirt
            ['#FFFFFF', '#DDDDDD', '#DDDDDD', '#FFFFFF'],                 // With apron
            ['#FFFFFF', '#777777', '#777777', '#FFFFFF'],
            [COLORS.TRANSPARENT, '#303030', '#303030', COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, '#303030', '#303030', COLORS.TRANSPARENT]
        ]);

        // Add other room backgrounds and sprites
        // ...room generation code continues...
    },

    enhanceSierraAdventure() {
        if (!window.SierraAdventure) return;

        // Add proper movement handling
        window.SierraAdventure.handleKeyboardMovement = function(e) {
            if (this.domElements.messageBox.style.display === 'block') return;
            
            if (this.gameState.playerAction === 'walk') {
                const player = this.domElements.player;
                const currentX = parseInt(player.style.left) || 320;
                const moveStep = 10;
                
                let newX = currentX;
                
                switch (e.key) {
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
                    this.movePlayer(newX, 400 - 30);
                }
            }
        };

        // Add mouse movement
        window.SierraAdventure.handleSceneClick = function(e) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const clickedHotspot = this.findHotspotAt(x, y);
            
            if (clickedHotspot) {
                this.handleHotspotInteraction(clickedHotspot);
            } else if (this.gameState.playerAction === 'walk') {
                this.movePlayer(x, y);
            }
        };

        // Override drawRoomElements for Sierra-style graphics
        window.SierraAdventure.drawRoomElements = function(ctx, room) {
            room.hotspots.forEach(hotspot => {
                const sprite = window.gameSprites[hotspot.name];
                if (sprite) {
                    sprite.render(ctx, hotspot.x, hotspot.y, 8);
                }
            });
            
            // Draw exits
            if (room.exits) {
                Object.entries(room.exits).forEach(([name, pos]) => {
                    ctx.fillStyle = 'rgba(100, 255, 100, 0.2)';
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '12px monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText(`To: ${name}`, pos.x, pos.y + 30);
                });
            }
        };
    },

    // Helper methods for background and sprite generation
    createRoomBackground(roomId, baseColor, elements) {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Base color
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add Sierra-style dithering
        for (let i = 0; i < 5000; i++) {
            const x = Math.floor(Math.random() * canvas.width);
            const y = Math.floor(Math.random() * canvas.height);
            const brightness = Math.random() > 0.5 ? 10 : -10;
            
            ctx.fillStyle = this.adjustColor(baseColor, brightness);
            ctx.fillRect(x, y, 1, 1);
        }
        
        // Draw elements
        elements.forEach(el => {
            if (el.type === 'rect') {
                ctx.fillStyle = el.color;
                ctx.fillRect(el.x, el.y, el.width, el.height);
                
                // Add texture
                for (let i = 0; i < el.width * el.height / 20; i++) {
                    const x = Math.floor(Math.random() * el.width) + el.x;
                    const y = Math.floor(Math.random() * el.height) + el.y;
                    ctx.fillStyle = this.adjustColor(el.color, Math.random() > 0.5 ? 15 : -15);
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        });
        
        window.gameImages[`${roomId}-background.png`] = canvas.toDataURL();
    },

    createSierraSprite(name, pixels) {
        window.gameSprites[name] = new PixelSprite(pixels);
        window.gameImages[name] = window.gameSprites[name].toDataURL(8);
    },

    adjustColor(color, amount) {
        if (!color) return color;
        let hex = color.replace('#', '');
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        
        r = Math.max(0, Math.min(255, r + amount));
        g = Math.max(0, Math.min(255, g + amount));
        b = Math.max(0, Math.min(255, b + amount));
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
};

export default GameEngine;
window.GameEngine = GameEngine;
