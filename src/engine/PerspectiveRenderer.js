/**
 * PerspectiveRenderer.js - Handles Sierra-style 3D isometric perspective drawing
 * 
 * Sierra games used a distinct 3D perspective, typically with:
 * - Isometric/3/4 view for rooms and environments
 * - Objects drawn at an angle to give 3D impression
 * - Depth effects with objects appearing smaller in the distance
 * - Characters that scale based on Y position (further away = smaller)
 */

import { COLORS } from '../common/color-palette.js';

const PerspectiveRenderer = {
    /**
     * Initialize the perspective renderer
     */
    init(roomRenderer) {
        this.roomRenderer = roomRenderer;
        this.ctx = roomRenderer?.ctx;
        this.canvas = roomRenderer?.canvas;
        console.log('Sierra 3D Perspective Renderer initialized');
        return this;
    },
    
    /**
     * Convert a 2D position to isometric position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} z - Z/height coordinate
     * @returns {Object} Object with isometric x,y coords
     */
    toIsometric(x, y, z = 0) {
        // Sierra's typical isometric projection is approximately 2:1 ratio
        const isoX = x - y * 0.5;
        const isoY = y * 0.25 - z;
        return { x: isoX, y: isoY };
    },
    
    /**
     * Calculate scale factor based on y-position (distance from camera)
     * @param {number} y - Y position in scene
     * @param {number} baseScale - Default scale
     * @returns {number} Adjusted scale
     */
    getScaleFromY(y, baseScale = 1) {
        // In Sierra games, objects further away (higher y) were smaller
        const maxY = this.canvas?.height || 400;
        const minScale = baseScale * 0.6; // Minimum scale (distant)
        const maxScale = baseScale * 1.2; // Maximum scale (close)
        
        // Linear interpolation based on position
        // Objects at the bottom (closest to viewer) are larger
        const distanceFactor = 1 - (y / maxY);
        return minScale + (maxScale - minScale) * distanceFactor;
    },
    
    /**
     * Draw an element with proper Sierra-style 3D perspective
     * @param {Object} element - Element to draw
     */
    drawElement(element) {
        if (!this.ctx) return;
        
        const sprite = window.SpriteEngine.getSprite(element.type);
        if (!sprite) return;
        
        // Get scale based on y-position (distance from camera)
        const y = element.y || 0;
        const baseScale = element.scale || 4;
        const perspectiveScale = this.getScaleFromY(y, baseScale);
        
        // Apply slight offset for isometric look if element has z-height
        let drawX = element.x;
        let drawY = element.y;
        
        if (element.height) {
            // Apply isometric offset for height
            const iso = this.toIsometric(0, 0, element.height);
            drawX += iso.x;
            drawY += iso.y;
        }
        
        // Draw with calculated perspective scale
        sprite.render(this.ctx, drawX, drawY, perspectiveScale);
        
        // Draw shadow if element has height
        if (element.height && element.castShadow !== false) {
            this.drawShadow(element);
        }
    },
    
    /**
     * Draw a shadow for an element
     * @param {Object} element - Element to draw shadow for
     */
    drawShadow(element) {
        if (!this.ctx) return;
        
        const sprite = window.SpriteEngine.getSprite(element.type);
        if (!sprite) return;
        
        const scale = (element.scale || 4) * 0.8;  // Shadow slightly smaller than object
        const shadowOffsetX = element.height * 0.2; // X-offset for shadow based on height
        const shadowOffsetY = element.height * 0.1; // Y-offset for shadow
        
        // Draw shadow (slightly transparent dark shape)
        this.ctx.globalAlpha = 0.3;
        sprite.render(this.ctx, 
                    element.x + shadowOffsetX, 
                    element.y + shadowOffsetY, 
                    scale, 
                    COLORS.BLACK);
        this.ctx.globalAlpha = 1.0;
    },
    
    /**
     * Draw a 3D box to represent a Sierra-style object
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width of box
     * @param {number} height - Height of box
     * @param {number} depth - Depth of box
     * @param {string} color - Main color of box
     */
    drawBox3D(x, y, width, height, depth, color) {
        if (!this.ctx) return;
        
        // Top face (slightly lighter)
        const topColor = this.lightenColor(color, 30);
        this.ctx.fillStyle = topColor;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + width, y);
        this.ctx.lineTo(x + width - depth * 0.5, y - depth * 0.25);
        this.ctx.lineTo(x - depth * 0.5, y - depth * 0.25);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Front face (main color)
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
        
        // Side face (darker)
        const sideColor = this.darkenColor(color, 30);
        this.ctx.fillStyle = sideColor;
        this.ctx.beginPath();
        this.ctx.moveTo(x + width, y);
        this.ctx.lineTo(x + width, y + height);
        this.ctx.lineTo(x + width - depth * 0.5, y + height - depth * 0.25);
        this.ctx.lineTo(x + width - depth * 0.5, y - depth * 0.25);
        this.ctx.closePath();
        this.ctx.fill();
    },
    
    /**
     * Draw a Sierra-style room with perspective
     * @param {Object} scene - Scene data
     */
    drawRoom(scene) {
        if (!this.ctx || !this.canvas) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw room background
        this.drawRoomBackground(scene);
        
        // Draw walls with Sierra 3D perspective
        this.drawWalls(scene);
        
        // Draw floor with grid (typical in Sierra games)
        this.drawFloor(scene);
        
        // Draw elements with depth sorting
        if (scene.elements) {
            // Sort elements by Y position for proper overlapping
            const sortedElements = [...scene.elements].sort((a, b) => a.y - b.y);
            sortedElements.forEach(element => this.drawElement(element));
        }
    },
    
    /**
     * Draw room background
     * @param {Object} scene - Scene data
     */
    drawRoomBackground(scene) {
        if (!this.ctx || !this.canvas) return;
        
        // Use scene background if available
        if (scene.background && window.gameImages[scene.background]) {
            const img = new Image();
            img.src = window.gameImages[scene.background];
            
            if (img.complete) {
                this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            } else {
                img.onload = () => {
                    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
                };
            }
        } else {
            // Default room color
            this.ctx.fillStyle = scene.wallColor || '#CCCCFF';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    },
    
    /**
     * Draw walls with Sierra 3D perspective
     * @param {Object} scene - Scene data
     */
    drawWalls(scene) {
        if (!this.ctx || !this.canvas) return;
        
        // Skip if using background image
        if (scene.background && window.gameImages[scene.background]) return;
        
        const w = this.canvas.width;
        const h = this.canvas.height;
        const wallColor = scene.wallColor || '#CCCCFF';
        const floorY = h * 0.75; // Floor starts 3/4 down the screen
        
        // Left wall - Sierra style used darker colors for side walls
        this.ctx.fillStyle = this.darkenColor(wallColor, 15);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(w * 0.3, h * 0.2); // Vanishing point effect
        this.ctx.lineTo(w * 0.3, floorY);
        this.ctx.lineTo(0, floorY);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Right wall - Sierra style
        this.ctx.fillStyle = this.darkenColor(wallColor, 30);
        this.ctx.beginPath();
        this.ctx.moveTo(w, 0);
        this.ctx.lineTo(w * 0.7, h * 0.2); // Vanishing point
        this.ctx.lineTo(w * 0.7, floorY);
        this.ctx.lineTo(w, floorY);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Back wall - Sierra style (lighter)
        this.ctx.fillStyle = wallColor;
        this.ctx.beginPath();
        this.ctx.moveTo(w * 0.3, h * 0.2);
        this.ctx.lineTo(w * 0.7, h * 0.2);
        this.ctx.lineTo(w * 0.7, floorY);
        this.ctx.lineTo(w * 0.3, floorY);
        this.ctx.closePath();
        this.ctx.fill();
    },
    
    /**
     * Draw floor with Sierra-style grid
     * @param {Object} scene - Scene data
     */
    drawFloor(scene) {
        if (!this.ctx || !this.canvas) return;
        
        // Skip if using background image
        if (scene.background && window.gameImages[scene.background]) return;
        
        const w = this.canvas.width;
        const h = this.canvas.height;
        const floorY = h * 0.75;
        const floorColor = scene.floorColor || '#885500';
        
        // Main floor
        this.ctx.fillStyle = floorColor;
        this.ctx.fillRect(0, floorY, w, h - floorY);
        
        // Add floor grid (common in Sierra games)
        this.ctx.strokeStyle = this.darkenColor(floorColor, 15);
        this.ctx.lineWidth = 1;
        
        // Horizontal grid lines (perspective)
        for (let i = 0; i <= 5; i++) {
            const yPos = floorY + (h - floorY) * (i / 5);
            const xStart = (i / 5) * w * 0.2;
            
            this.ctx.beginPath();
            this.ctx.moveTo(xStart, yPos);
            this.ctx.lineTo(w - xStart, yPos);
            this.ctx.stroke();
        }
        
        // Vertical grid lines (perspective)
        for (let i = 0; i <= 10; i++) {
            const xPos = w * (i / 10);
            const yEndOffset = (Math.abs(i - 5) / 5) * (h - floorY) * 0.5;
            
            this.ctx.beginPath();
            this.ctx.moveTo(xPos, floorY);
            this.ctx.lineTo(xPos, h - yEndOffset);
            this.ctx.stroke();
        }
    },
    
    /**
     * Helper function to lighten a color
     * @param {string} color - Color to lighten
     * @param {number} percent - Percent to lighten
     * @returns {string} Lightened color
     */
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        ).toString(16).slice(1);
    },
    
    /**
     * Helper function to darken a color
     * @param {string} color - Color to darken
     * @param {number} percent - Percent to darken
     * @returns {string} Darkened color
     */
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (
            0x1000000 +
            (R > 0 ? R : 0) * 0x10000 +
            (G > 0 ? G : 0) * 0x100 +
            (B > 0 ? B : 0)
        ).toString(16).slice(1);
    }
};

// Make available globally
window.PerspectiveRenderer = PerspectiveRenderer;

// Export as module
export default PerspectiveRenderer;