import SpriteEngine from './sprite-engine.js';
import { COLORS } from '../common/color-palette.js';
import { PixelSprite } from '../graphics/PixelSprite.js';
import { barCounter, neonSign, liquorBottle } from '../graphics/EnvironmentSprites.js';

const GameEngine = {
    generateDynamicContent() {
        console.log('Generating dynamic content for objects and backgrounds');

        // Example: Generate a forest scene
        const forestScene = SpriteEngine.createPixelSprite([
            [COLORS.DARK_GREEN, COLORS.DARK_GREEN, COLORS.DARK_GREEN],
            [COLORS.DARK_GREEN, COLORS.BROWN, COLORS.DARK_GREEN],
            [COLORS.DARK_GREEN, COLORS.DARK_GREEN, COLORS.DARK_GREEN]
        ]);
        SpriteEngine.registerSprite('forestScene', forestScene);

        // Example: Generate a treasure chest object
        const treasureChest = SpriteEngine.createPixelSprite([
            [COLORS.BROWN, COLORS.BROWN, COLORS.BROWN],
            [COLORS.BROWN, COLORS.YELLOW, COLORS.BROWN],
            [COLORS.BROWN, COLORS.BROWN, COLORS.BROWN]
        ]);
        SpriteEngine.registerSprite('treasureChest', treasureChest);

        // Add these to the gameImages for compatibility
        window.gameImages['forestScene'] = forestScene.toDataURL(4);
        window.gameImages['treasureChest'] = treasureChest.toDataURL(4);

        console.log('Dynamic content generation complete');
    },

    init() {
        console.log('Initializing Enhanced Sierra Adventure Game Engine');
        this.generateDynamicContent();
        
        // Initialize global objects
        window.gameSprites = window.gameSprites || {};
        window.gameImages = window.gameImages || {};
        
        // Generate detailed scenes
        this.generateDetailedScenes();
        
        // Initialize SierraAdventure
        if (typeof window.SierraAdventure.init === 'function') {
            console.log('Starting game initialization');
            window.SierraAdventure.init();
        } else {
            console.error('SierraAdventure.init not available!');
        }
    },

    /**
     * Generate detailed scenes with visually distinct environments
     */
    generateDetailedScenes() {
        console.log('Generating detailed scenes');

        // Bar scene
        this.generateBarScene();

        // Add more scenes as needed...
    },

    /**
     * Generate the bar scene with detailed visuals
     */
    generateBarScene() {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#442211';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Floor
        ctx.fillStyle = '#221100';
        ctx.fillRect(0, 300, canvas.width, 100);

        // Bar counter
        barCounter.renderWithShadow(ctx, 350, 200, 8);

        // Neon sign
        neonSign.renderWithShadow(ctx, 150, 50, 8);

        // Liquor bottles on shelves
        for (let i = 0; i < 5; i++) {
            liquorBottle.renderWithShadow(ctx, 360 + i * 40, 100, 8);
        }

        // Store the scene
        window.gameImages['bar-background.png'] = canvas.toDataURL();
    }
};

export default GameEngine;
