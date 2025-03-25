import { COLORS } from '../common/color-palette.js';
import { PixelSprite } from '../graphics/PixelSprite.js';

const GameEngine = {
    init() {
        console.log('Initializing Sierra Adventure Game Engine');
        
        // Initialize global objects
        window.gameSprites = window.gameSprites || {};
        window.gameImages = window.gameImages || {};
        
        // Generate required sprites and scenes
        this.generateSprites();
        this.generateScenes();
        
        // Create the complete SierraAdventure object
        window.SierraAdventure = {
            // Game state
            gameState: {
                currentRoom: 'bar',
                inventory: [],
                score: 0,
                gameTime: 0,
                playerAction: 'walk',
                selectedItem: null,
                playerName: 'Larry',
                flags: {
                    talkedToBartender: false,
                    gotHotelKey: false,
                    solvedPuzzle: false
                }
            },

            // Rooms data structure
            rooms: {
                bar: {
                    background: 'bar-background.png',
                    description: "You're in a dimly lit bar called 'The Thirsty Snake'.",
                    hotspots: [
                        {
                            name: 'bartender',
                            x: 400, y: 150,
                            width: 60, height: 100,
                            description: "A gruff looking bartender wiping glasses clean.",
                            actions: {
                                look: "The bartender looks like he's seen it all.",
                                talk: function() {
                                    if (!window.SierraAdventure.gameState.flags.talkedToBartender) {
                                        window.SierraAdventure.gameState.flags.talkedToBartender = true;
                                        window.SierraAdventure.addScore(5);
                                        return "\"What'll it be, stranger?\"";
                                    }
                                    return "\"Already told you what I know, pal.\"";
                                },
                                use: "I don't think you should try to use the bartender."
                            }
                        }
                        // ...other hotspots...
                    ],
                    exits: { 'street': { x: 50, y: 200 } }
                }
                // ...other rooms...
            },

            // Required methods
            init() {
                this.cacheDOMElements();
                this.setupEventListeners();
                this.generatePlayerSprite();
                this.updateRoom();
                this.timers = {
                    gameTime: setInterval(() => this.updateGameTime(), 1000)
                };
                this.showMessage(`Welcome to "Hotel of Desire"!`);
            },

            cacheDOMElements() {
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
                    commandInput: document.getElementById('command-input')
                };
            },

            setupEventListeners() {
                this.domElements.messageOk.addEventListener('click', () => this.closeMessage());
                this.domElements.scene.addEventListener('click', (e) => this.handleSceneClick(e));
                document.addEventListener('keydown', (e) => this.handleKeyboardMovement(e));
            },

            // Core game functions
            showMessage(message) {
                if (this.domElements.messageBox && this.domElements.messageText) {
                    this.domElements.messageText.textContent = message;
                    this.domElements.messageBox.style.display = 'block';
                }
            },

            closeMessage() {
                if (this.domElements.messageBox) {
                    this.domElements.messageBox.style.display = 'none';
                }
            },

            updateRoom() {
                const room = this.rooms[this.gameState.currentRoom];
                if (!room) return;
                
                const canvas = this.domElements.roomCanvas;
                const ctx = canvas.getContext('2d');
                const bgKey = `${this.gameState.currentRoom}-background.png`;
                
                if (window.gameImages[bgKey]) {
                    const img = new Image();
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        this.drawRoomElements(ctx, room);
                    };
                    img.src = window.gameImages[bgKey];
                }
            }
            // ...other required methods...
        };

        // Initialize SierraAdventure
        window.SierraAdventure.init();
    }
    // ...existing GameEngine methods...
};

export default GameEngine;
