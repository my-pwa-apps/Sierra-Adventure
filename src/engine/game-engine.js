/**
 * Main Game Engine for Sierra Adventure
 * Manages the overall game state and coordinates other modules
 */

import SpriteEngine from './sprite-engine.js';
import SceneManager from './scene-manager.js';
import CharacterManager from './character-manager.js';
import { COLORS } from '../common/color-palette.js';

class GameEngine {
    constructor() {
        this.gameState = {
            currentRoom: 'bar',
            score: 0,
            gameTime: 0,
            playerAction: 'walk',
            flags: {}
        };
        
        this.domElements = {};
        this.eventHandlers = {};
        this.timers = {};
        
        // Sub-systems
        this.sprites = SpriteEngine;
        this.scenes = SceneManager;
        this.characters = CharacterManager;
    }
    
    /**
     * Initialize the game engine
     */
    async init() {
        console.log('Initializing Sierra Adventure Game Engine...');
        
        // Initialize sub-systems
        await this.sprites.init();
        
        // Create player character
        this.characters.createPlayer({ name: 'Larry' });
        
        // Cache DOM elements
        this.cacheDomElements();
        
        // Set up event handlers
        this.setupEventHandlers();
        
        // Set up game timers
        this.setupTimers();
        
        console.log('Game engine initialized successfully');
        
        return this;
    }
    
    /**
     * Cache frequently used DOM elements for better performance
     */
    cacheDomElements() {
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
    }
    
    /**
     * Set up event handlers
     */
    setupEventHandlers() {
        // ...existing event handler setup code...
    }
    
    /**
     * Set up game timers
     */
    setupTimers() {
        this.timers.gameTime = setInterval(() => this.updateGameTime(), 1000);
    }
    
    /**
     * Update the game time
     */
    updateGameTime() {
        // ...existing updateGameTime code...
    }
    
    /**
     * Show a message to the player
     * @param {string} message - The message to show
     */
    showMessage(message) {
        if (this.domElements.messageText && this.domElements.messageBox) {
            this.domElements.messageText.textContent = message;
            this.domElements.messageBox.style.display = 'block';
        }
    }
    
    /**
     * Close the message box
     */
    closeMessage() {
        if (this.domElements.messageBox) {
            this.domElements.messageBox.style.display = 'none';
        }
    }
    
    // Add other game engine methods...
}

// Create singleton instance
const gameEngine = new GameEngine();

// Export as default
export default gameEngine;

// Also make available globally
window.gameEngine = gameEngine;
