/**
 * Room Renderer for Sierra Adventure
 * Handles rendering scenes to the canvas with Sierra-style aesthetics
 */

import SpriteEngine from './sprite-engine.js';
import sceneManager from './scene-manager.js';
import { COLORS } from '../common/color-palette.js';

const RoomRenderer = {
    canvas: null,
    ctx: null,
    currentRoom: null,
    
    /**
     * Initialize the renderer with a canvas element
     * @param {HTMLCanvasElement} canvas - Canvas element to render to
     */
    init(canvas) {
        this.canvas = canvas || document.getElementById('room-canvas');
        
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        // Handle window resize
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();
        
        console.log('Room renderer initialized');
        return this;
    },
    
    /**
     * Resize the canvas to fit its container
     */
    resizeCanvas() {
        if (!this.canvas) return;
        
        const container = this.canvas.parentElement;
        if (!container) return;
        
        // Set canvas size to match container
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        // Re-render the current room after resize
        if (this.currentRoom) {
            this.renderRoom(this.currentRoom);
        }
    },
    
    /**
     * Render a room by ID
     * @param {string} roomId - ID of the room to render
     */
    renderRoom(roomId) {
        if (!sceneManager) {
            console.error('Scene manager not available');
            return;
        }
        
        const scene = sceneManager.getScene(roomId);
        if (!scene) {
            console.error(`Scene not found: ${roomId}`);
            return;
        }
        
        this.currentRoom = roomId;
        this.renderScene(scene);
        
        // Make this the active scene
        if (window.SierraAdventure) {
            window.SierraAdventure.currentScene = roomId;
        }
        
        console.log(`Room rendered: ${roomId}`);
    },
    
    /**
     * Render a scene object
     * @param {object} scene - Scene object to render
     */
    renderScene(scene) {
        if (!this.ctx) return;
        
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw the background
        this.drawBackground(scene);
        
        // Draw the elements (furniture, objects, etc.)
        this.drawElements(scene);
        
        // Draw NPCs
        this.drawNPCs(scene);
        
        // Draw player character
        this.drawPlayer();
        
        // Draw debug info if needed
        if (window.debugMode) {
            this.drawDebugInfo(scene);
        }
    },
    
    /**
     * Draw the scene background
     * @param {object} scene - Scene to draw background for
     */
    drawBackground(scene) {
        // Use the background image if available
        if (scene.background && window.gameImages[scene.background]) {
            const img = new Image();
            img.src = window.gameImages[scene.background];
            
            // Draw the image when loaded
            if (img.complete) {
                this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            } else {
                img.onload = () => {
                    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
                };
            }
        } else {
            // Fall back to a simple colored background
            this.ctx.fillStyle = scene.baseColor || COLORS.DARK_BLUE;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Add a floor
            const floorHeight = this.canvas.height * 0.2;
            this.ctx.fillStyle = COLORS.DARK_BROWN;
            this.ctx.fillRect(0, this.canvas.height - floorHeight, this.canvas.width, floorHeight);
        }
    },
    
    /**
     * Draw all elements in the scene
     * @param {object} scene - Scene to draw elements for
     */
    drawElements(scene) {
        if (!scene.elements) return;
        
        // Draw each element
        scene.elements.forEach(element => {
            this.drawElement(element);
        });
    },
    
    /**
     * Draw a single scene element
     * @param {object} element - Element to draw
     */
    drawElement(element) {
        const sprite = SpriteEngine.getSprite(element.type);
        if (!sprite) {
            console.warn(`Sprite not found for element type: ${element.type}`);
            return;
        }
        
        // Draw the sprite at the element position with Sierra-style pixel scaling
        const scale = element.scale || 4; // Sierra games used chunky pixels
        sprite.render(this.ctx, element.x, element.y, scale);
    },
    
    /**
     * Draw all NPCs in the scene
     * @param {object} scene - Scene to draw NPCs for
     */
    drawNPCs(scene) {
        if (!scene || !scene.npcs) return;
        
        // Draw each NPC
        scene.npcs.forEach(npc => {
            const sprite = SpriteEngine.getSprite(npc.type);
            if (!sprite) {
                // Fallback when sprite not found
                this.ctx.fillStyle = '#FF0000';
                this.ctx.fillRect(npc.x, npc.y, 20, 40);
                return;
            }
            
            // Draw the NPC with proper scaling
            const scale = npc.scale || 4;
            sprite.render(this.ctx, npc.x, npc.y, scale);
            
            // Draw name with better visibility
            if (npc.name || window.showNames) {
                this.ctx.fillStyle = '#000000'; // Text shadow
                this.ctx.font = 'bold 12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(npc.name || 'NPC', npc.x + 16, npc.y - 6);
                this.ctx.fillStyle = '#FFFFFF'; // Text
                this.ctx.fillText(npc.name || 'NPC', npc.x + 16, npc.y - 5);
            }
        });
    },
    
    /**
     * Draw the player character
     */
    drawPlayer() {
        // Get player element
        const player = window.SierraAdventure?.domElements?.player;
        if (!player) return;
        
        // Get player position
        const left = parseInt(player.style.left) || 300;
        const playerY = this.canvas.height - 120;
        
        // Draw player with highlight
        const playerSprite = SpriteEngine.getSprite('playerCharacter');
        if (playerSprite) {
            playerSprite.render(this.ctx, left, playerY, 4);
            
            // Highlight player
            this.ctx.strokeStyle = '#FFFF00';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(left - 2, playerY - 2, 36, 36);
        } else {
            // Fallback
            this.ctx.fillStyle = '#FF0000';
            this.ctx.fillRect(left, playerY, 32, 32);
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('You', left + 16, playerY - 5);
        }
    },
    
    /**
     * Draw debug information for the scene
     * @param {object} scene - Scene to draw debug info for
     */
    drawDebugInfo(scene) {
        if (!scene.hotspots) return;
        
        // Draw hotspots
        this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
        this.ctx.lineWidth = 2;
        
        scene.hotspots.forEach(hotspot => {
            this.ctx.strokeRect(hotspot.x, hotspot.y, hotspot.width, hotspot.height);
            
            this.ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
            this.ctx.font = '10px monospace';
            this.ctx.fillText(hotspot.name, hotspot.x, hotspot.y - 2);
        });
    }
};

// Make available globally
window.RoomRenderer = RoomRenderer;

// Export as module
export default RoomRenderer;