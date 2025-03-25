/**
 * Scene Manager for Sierra Adventure
 * Handles rendering and management of game scenes
 */

import SpriteEngine from './sprite-engine.js';
import { COLORS, ColorUtils } from '../common/color-palette.js';

class SceneManager {
    constructor() {
        this.scenes = {};
        this.currentScene = null;
    }
    
    /**
     * Register a new scene
     * @param {string} id - Scene identifier
     * @param {object} config - Scene configuration
     * @returns {object} The registered scene
     */
    registerScene(id, config) {
        this.scenes[id] = {
            id,
            background: config.background || null,
            description: config.description || '',
            hotspots: config.hotspots || [],
            exits: config.exits || {},
            elements: config.elements || [],
            baseColor: config.baseColor || COLORS.DARK_BLUE
        };
        
        return this.scenes[id];
    }
    
    /**
     * Get a scene by ID
     * @param {string} id - Scene ID
     * @returns {object|null} The scene or null if not found
     */
    getScene(id) {
        return this.scenes[id] || null;
    }
    
    /**
     * Create a background for a scene
     * @param {string} sceneId - Scene ID
     * @param {number} width - Scene width
     * @param {number} height - Scene height
     * @returns {HTMLCanvasElement} The scene canvas
     */
    createSceneBackground(sceneId, width, height) {
        const scene = this.getScene(sceneId);
        if (!scene) {
            console.error(`Scene not found: ${sceneId}`);
            return null;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Fill with base color
        ctx.fillStyle = scene.baseColor;
        ctx.fillRect(0, 0, width, height);
        
        // Draw floor
        const floorHeight = height * 0.2;
        ctx.fillStyle = ColorUtils.adjustBrightness(scene.baseColor, -20);
        ctx.fillRect(0, height - floorHeight, width, floorHeight);
        
        // Draw elements
        this.drawSceneElements(ctx, scene, width, height);
        
        return canvas;
    }
    
    /**
     * Draw elements on a scene
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {object} scene - Scene object
     * @param {number} width - Scene width
     * @param {number} height - Scene height
     */
    drawSceneElements(ctx, scene, width, height) {
        // Draw each element
        scene.elements.forEach(element => {
            // Get sprite for this element
            const sprite = SpriteEngine.getSprite(element.type) || 
                           SpriteEngine.getSprite(element.spriteId);
            
            if (sprite) {
                // Draw the sprite at the element position
                sprite.render(ctx, element.x, element.y, element.scale || 4);
            } else {
                // Draw a placeholder
                ctx.fillStyle = '#FF00FF'; // Magenta for missing sprites
                ctx.fillRect(element.x, element.y, 20, 20);
                
                // Label it
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '10px monospace';
                ctx.fillText(element.type || 'unknown', element.x, element.y - 2);
            }
        });
        
        // Draw hotspots for debugging
        if (window.debugMode) {
            scene.hotspots.forEach(hotspot => {
                ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
                ctx.lineWidth = 2;
                ctx.strokeRect(hotspot.x, hotspot.y, hotspot.width, hotspot.height);
                
                ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
                ctx.font = '10px monospace';
                ctx.fillText(hotspot.name, hotspot.x, hotspot.y - 2);
            });
        }
        
        // Draw exit indicators
        Object.entries(scene.exits).forEach(([exitName, exitPos]) => {
            ctx.fillStyle = 'rgba(100, 255, 100, 0.2)';
            ctx.beginPath();
            ctx.arc(exitPos.x, exitPos.y, 15, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`To: ${exitName}`, exitPos.x, exitPos.y + 30);
        });
    }
}

// Create singleton instance
const sceneManager = new SceneManager();

// Add dynamic scene registration for new objects and backgrounds
sceneManager.registerDynamicScenes = function() {
    console.log('Registering dynamic scenes');

    // Example: Register a forest scene
    this.registerScene('forest', {
        background: 'forestScene',
        description: 'A dense forest with towering trees.',
        elements: [
            { type: 'treasureChest', x: 100, y: 200, scale: 4 }
        ]
    });

    console.log('Dynamic scenes registered');
};

// Call the dynamic scene registration during initialization
sceneManager.init = function() {
    console.log('Initializing Scene Manager');
    this.registerDynamicScenes();
    // ...existing code...
};

// Export as default
export default sceneManager;

// Also make available globally
window.sceneManager = sceneManager;
