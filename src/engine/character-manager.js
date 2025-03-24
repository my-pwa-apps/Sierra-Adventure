/**
 * Character Manager for Sierra Adventure
 * Handles character creation and management
 */

import SpriteEngine from './sprite-engine.js';
import { COLORS } from '../common/color-palette.js';

class CharacterManager {
    constructor() {
        this.characters = {};
        this.player = null;
    }
    
    /**
     * Create the player character
     * @param {object} config - Player configuration
     * @returns {object} The player object
     */
    createPlayer(config = {}) {
        const player = {
            id: 'player',
            name: config.name || 'Player',
            x: config.x || 0,
            y: config.y || 0,
            width: config.width || 32,
            height: config.height || 64,
            spriteId: config.spriteId || 'playerCharacter',
            inventory: [],
            flags: {},
            stats: {
                health: 100,
                score: 0
            },
            activeAction: 'walk'
        };
        
        this.player = player;
        return player;
    }
    
    /**
     * Create an NPC character
     * @param {string} id - Character ID
     * @param {object} config - Character configuration
     * @returns {object} The character object
     */
    createCharacter(id, config = {}) {
        const character = {
            id,
            name: config.name || id,
            x: config.x || 0,
            y: config.y || 0,
            width: config.width || 32,
            height: config.height || 64,
            spriteId: config.spriteId || id,
            dialog: config.dialog || {},
            state: config.state || 'idle',
            actions: config.actions || {}
        };
        
        this.characters[id] = character;
        return character;
    }
    
    /**
     * Get a character by ID
     * @param {string} id - Character ID
     * @returns {object|null} The character or null if not found
     */
    getCharacter(id) {
        return this.characters[id] || null;
    }
    
    /**
     * Update the position of a character
     * @param {string} id - Character ID
     * @param {number} x - New X position
     * @param {number} y - New Y position
     */
    moveCharacter(id, x, y) {
        const character = this.getCharacter(id);
        if (character) {
            character.x = x;
            character.y = y;
        } else if (id === 'player' && this.player) {
            this.player.x = x;
            this.player.y = y;
        }
    }
    
    /**
     * Generate a sprite for a character
     * @param {object} options - Sprite options
     * @returns {PixelSprite} The generated sprite
     */
    generateCharacterSprite(options = {}) {
        const shirtColor = options.shirtColor || COLORS.SHIRT_BLUE;
        const pantsColor = options.pantsColor || COLORS.PANTS_NAVY;
        const hairColor = options.hairColor || COLORS.HAIR_BROWN;
        const skinColor = options.skinColor || COLORS.SKIN_TONE;
        
        const grid = [
            [COLORS.TRANSPARENT, hairColor, hairColor, COLORS.TRANSPARENT],
            [hairColor, skinColor, skinColor, hairColor],
            [COLORS.TRANSPARENT, skinColor, skinColor, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, shirtColor, shirtColor, COLORS.TRANSPARENT],
            [shirtColor, shirtColor, shirtColor, shirtColor],
            [shirtColor, shirtColor, shirtColor, shirtColor],
            [COLORS.TRANSPARENT, pantsColor, pantsColor, COLORS.TRANSPARENT],
            [COLORS.TRANSPARENT, pantsColor, pantsColor, COLORS.TRANSPARENT]
        ];
        
        return SpriteEngine.createPixelSprite(grid);
    }
}

// Create singleton instance
const characterManager = new CharacterManager();

// Export as default
export default characterManager;

// Also make available globally
window.characterManager = characterManager;
