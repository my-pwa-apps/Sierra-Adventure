/**
 * Room Renderer for Sierra Adventure
 * Handles rendering scenes to the canvas with Sierra-style 3D perspective
 */

import SpriteEngine from './sprite-engine.js';
import sceneManager from './scene-manager.js';
import PerspectiveRenderer from './PerspectiveRenderer.js';
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
        
        // Initialize the 3D perspective renderer
        PerspectiveRenderer.init(this);
        
        // Handle window resize
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();
        
        console.log('Sierra 3D Room renderer initialized');
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
     * Render a scene object with Sierra-style 3D perspective
     * @param {object} scene - Scene object to render
     */
    renderScene(scene) {
        if (!this.ctx) return;
        
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Use perspective renderer for room background and 3D elements
        PerspectiveRenderer.drawRoom(scene);
        
        // Draw the elements (furniture, objects, etc.) with proper perspective
        this.drawElements(scene);
        
        // Draw NPCs with depth ordering
        this.drawNPCs(scene);
        
        // Draw player character
        this.drawPlayer();
        
        // Draw debug info if needed
        if (window.debugMode) {
            this.drawDebugInfo(scene);
        }
    },
    
    /**
     * Draw all elements in the scene with proper 3D perspective
     * @param {object} scene - Scene to draw elements for
     */
    drawElements(scene) {
        if (!scene.elements) return;
        
        // Sort elements by Y position for proper Sierra-style depth
        const sortedElements = [...scene.elements].sort((a, b) => a.y - b.y);
        
        // Draw each element with proper 3D perspective
        sortedElements.forEach(element => {
            // Use perspective renderer for 3D objects
            PerspectiveRenderer.drawElement(element);
        });
    },
    
    /**
     * Draw all NPCs in the scene with proper 3D perspective
     * @param {object} scene - Scene to draw NPCs for
     */
    drawNPCs(scene) {
        if (!scene || !scene.npcs) return;
        
        // Sort NPCs by Y position for proper Sierra-style depth
        const sortedNPCs = [...scene.npcs].sort((a, b) => a.y - b.y);
        
        // Draw each NPC with proper scaling based on distance from camera
        sortedNPCs.forEach(npc => {
            const sprite = SpriteEngine.getSprite(npc.type);
            if (!sprite) {
                // Fallback when sprite not found
                this.ctx.fillStyle = '#FF0000';
                this.ctx.fillRect(npc.x, npc.y, 20, 40);
                return;
            }
            
            // Calculate perspective scale based on Y position (distance from viewer)
            const baseScale = npc.scale || 4;
            const perspectiveScale = PerspectiveRenderer.getScaleFromY(npc.y, baseScale);
            
            // Draw the NPC with proper scaling
            sprite.render(this.ctx, npc.x, npc.y, perspectiveScale);
            
            // Draw name with better visibility
            if (npc.name || window.showNames) {
                this.ctx.fillStyle = '#000000'; // Text shadow
                this.ctx.font = 'bold 12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(npc.name || 'NPC', npc.x + 16, npc.y - 6);
                this.ctx.fillStyle = '#FFFFFF'; // Text
                this.ctx.fillText(npc.name || 'NPC', npc.x + 16, npc.y - 5);
            }
            
            // Draw shadow for NPCs (typical in Sierra games)
            if (npc.castShadow !== false) {
                this.ctx.globalAlpha = 0.3;
                sprite.render(this.ctx, npc.x + 5, npc.y + 2, perspectiveScale * 0.8, COLORS.BLACK);
                this.ctx.globalAlpha = 1.0;
            }
        });
    },
    
    /**
     * Draw the player character with proper 3D perspective
     */
    drawPlayer() {
        // Get player data
        const playerState = window.SierraAdventure?.player;
        if (!playerState) return;
        
        // Get player position
        const x = playerState.x;
        const y = this.canvas.height - 100;
        
        // Calculate perspective scale based on Y position
        const baseScale = 4; // Default size
        const perspectiveScale = PerspectiveRenderer.getScaleFromY(y, baseScale);
        
        // Select the appropriate sprite based on direction
        let playerSprite;
        if (playerState.isWalking) {
            // Use walking frame to animate
            const walkOffset = (playerState.walkFrame % 2) * 2; // Slight position offset for animation
            
            if (playerState.direction === 'left') {
                playerSprite = SpriteEngine.getSprite('playerLeft');
            } else if (playerState.direction === 'right') {
                playerSprite = SpriteEngine.getSprite('playerRight');
            } else if (playerState.direction === 'back') {
                playerSprite = SpriteEngine.getSprite('playerBack');
            } else {
                playerSprite = SpriteEngine.getSprite('playerCharacter');
            }
            
            // Draw at position with walk animation offset and proper perspective
            if (playerSprite) {
                playerSprite.render(this.ctx, x, y - walkOffset, perspectiveScale);
                
                // Draw shadow (typical in Sierra games)
                this.ctx.globalAlpha = 0.3;
                playerSprite.render(this.ctx, x + 4, y + 2, perspectiveScale * 0.8, COLORS.BLACK);
                this.ctx.globalAlpha = 1.0;
            }
        } else {
            // Standing still
            if (playerState.direction === 'left') {
                playerSprite = SpriteEngine.getSprite('playerLeft');
            } else if (playerState.direction === 'right') {
                playerSprite = SpriteEngine.getSprite('playerRight');
            } else if (playerState.direction === 'back') {
                playerSprite = SpriteEngine.getSprite('playerBack');
            } else {
                playerSprite = SpriteEngine.getSprite('playerCharacter');
            }
            
            // Draw at position with proper perspective
            if (playerSprite) {
                playerSprite.render(this.ctx, x, y, perspectiveScale);
                
                // Draw shadow (typical in Sierra games)
                this.ctx.globalAlpha = 0.3;
                playerSprite.render(this.ctx, x + 4, y + 2, perspectiveScale * 0.8, COLORS.BLACK);
                this.ctx.globalAlpha = 1.0;
            }
        }
        
        // Fallback if sprite not found
        if (!playerSprite) {
            this.ctx.fillStyle = '#FF0000';
            this.ctx.fillRect(x, y - 32, 32, 32);
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