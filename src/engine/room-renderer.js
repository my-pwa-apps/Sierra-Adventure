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
        
        // Draw the elements
        this.drawElements(scene);
        
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