import { COLORS } from '../common/color-palette.js';
import { PixelSprite } from '../graphics/PixelSprite.js';

const GameEngine = {
    init() {
        console.log('Initializing Sierra Adventure Game Engine');
        
        // Initialize global objects
        window.gameSprites = window.gameSprites || {};
        window.gameImages = window.gameImages || {};
        
        // Create the SierraAdventure object first
        window.SierraAdventure = {
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

            // Required methods
            init() {
                console.log('Initializing SierraAdventure');
                this.cacheDOMElements();
                this.setupEventListeners();
                this.generatePlayerSprite();
                this.updateRoom();
                this.timers = {
                    gameTime: setInterval(() => this.updateGameTime(), 1000)
                };
                this.showMessage(`Welcome to "Hotel of Desire: A Sierra-style Adventure"! You are ${this.gameState.playerName}, a lovable loser on a quest for love and excitement in the big city. Type 'help' for commands.`);
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
                    commandInput: document.getElementById('command-input'),
                    actionButtons: {
                        look: document.getElementById('look-btn'),
                        talk: document.getElementById('talk-btn'),
                        walk: document.getElementById('walk-btn'),
                        use: document.getElementById('use-btn'),
                        inventory: document.getElementById('inventory-btn')
                    }
                };
            },

            setupEventListeners() {
                this.domElements.messageOk.addEventListener('click', () => this.closeMessage());
                this.domElements.scene.addEventListener('click', (e) => this.handleSceneClick(e));
                document.addEventListener('keydown', (e) => this.handleKeyboardMovement(e));
                
                // Action buttons
                Object.entries(this.domElements.actionButtons).forEach(([action, button]) => {
                    button.addEventListener('click', () => this.setPlayerAction(action));
                });
            },

            generatePlayerSprite() {
                const canvas = document.createElement('canvas');
                canvas.width = 32;
                canvas.height = 64;
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                
                const ctx = canvas.getContext('2d');
                if (window.gameSprites.playerCharacter) {
                    window.gameSprites.playerCharacter.render(ctx, 0, 0, 8);
                }
                
                this.domElements.player.appendChild(canvas);
            },

            updateRoom() {
                const room = this.rooms[this.gameState.currentRoom];
                const ctx = this.domElements.roomCanvas.getContext('2d');
                ctx.clearRect(0, 0, 640, 400);
                
                const bgKey = `${this.gameState.currentRoom}-background.png`;
                if (window.gameImages[bgKey]) {
                    const img = new Image();
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0, 640, 400);
                        this.drawRoomElements(ctx, room);
                    };
                    img.src = window.gameImages[bgKey];
                }
            },

            showMessage(message) {
                this.domElements.messageText.textContent = message;
                this.domElements.messageBox.style.display = 'block';
            },

            closeMessage() {
                this.domElements.messageBox.style.display = 'none';
            },

            updateGameTime() {
                this.gameState.gameTime++;
                const hours = Math.floor(this.gameState.gameTime / 60) % 24;
                const minutes = this.gameState.gameTime % 60;
                this.domElements.timeElement.textContent = 
                    `Time: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            },

            setPlayerAction(action) {
                this.gameState.playerAction = action;
                Object.values(this.domElements.actionButtons).forEach(btn => {
                    btn.style.backgroundColor = '#555';
                });
                this.domElements.actionButtons[action].style.backgroundColor = '#a00';
            },

            handleSceneClick(e) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                if (this.gameState.playerAction === 'walk') {
                    this.movePlayer(x, y);
                }
            },

            movePlayer(x, y) {
                const player = this.domElements.player;
                x = Math.max(0, Math.min(608, x));
                player.style.left = `${x}px`;
            },

            rooms: {
                // ... room data from original SierraAdventure ...
            }
        };
        
        // Generate scenes and sprites
        this.generateScenes();
        this.generateSprites();
        
        // Initialize SierraAdventure
        window.SierraAdventure.init();
    },
    
    generateScenes() {
        // Bar scene
        this.generateScene('bar', {
            baseColor: '#442200',
            elements: [
                { type: 'rect', x: 0, y: 300, width: 640, height: 100, color: '#331100' }, // Floor
                { type: 'rect', x: 350, y: 100, width: 250, height: 200, color: '#553322' }, // Bar counter
                { type: 'rect', x: 350, y: 50, width: 250, height: 50, color: '#222222' }, // Shelves
                { type: 'rect', x: 20, y: 120, width: 100, height: 180, color: '#553322' }, // Door
                // Add more decorative elements
            ]
        });
        
        // Street scene
        this.generateScene('street', {
            baseColor: '#222222',
            elements: [
                { type: 'rect', x: 0, y: 300, width: 640, height: 100, color: '#111111' }, // Street
                { type: 'rect', x: 0, y: 0, width: 640, height: 200, color: '#000022' }, // Night sky
                // Add buildings and street elements
            ]
        });
        
        // Hotel lobby
        this.generateScene('hotel-lobby', {
            baseColor: '#332211',
            elements: [
                { type: 'rect', x: 0, y: 300, width: 640, height: 100, color: '#221100' }, // Floor
                { type: 'rect', x: 250, y: 50, width: 200, height: 250, color: '#443322' }, // Reception desk
                // Add more hotel elements
            ]
        });
    },

    generateScene(name, config) {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Draw base color
        ctx.fillStyle = config.baseColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add noise texture
        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const brightness = Math.random() > 0.5 ? 20 : -20;
            ctx.fillStyle = this.adjustColor(config.baseColor, brightness);
            ctx.fillRect(x, y, 1, 1);
        }
        
        // Draw scene elements
        config.elements.forEach(element => {
            if (element.type === 'rect') {
                ctx.fillStyle = element.color;
                ctx.fillRect(element.x, element.y, element.width, element.height);
                
                // Add texture to element
                for (let i = 0; i < element.width * element.height / 20; i++) {
                    const x = Math.random() * element.width + element.x;
                    const y = Math.random() * element.height + element.y;
                    ctx.fillStyle = this.adjustColor(element.color, Math.random() > 0.5 ? 15 : -15);
                    ctx.fillRect(x, y, 1, 1);
                }
            }
        });
        
        // Store the generated scene
        window.gameImages[`${name}-background.png`] = canvas.toDataURL();
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
