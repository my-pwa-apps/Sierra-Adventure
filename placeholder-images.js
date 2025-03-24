// This script generates placeholder images for the Sierra-style adventure game
// Add this script to index.html before the main game script

// Function to generate a colored rectangle with optional text
function createPlaceholderImage(width, height, color, text) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Fill with background color
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    
    // Add some pattern to make it look more interesting
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    
    // Grid pattern
    const gridSize = 30;
    for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Add text if provided
    if (text) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, width / 2, height / 2);
    }
    
    return canvas.toDataURL();
}

// Generate background images
function generateBackgrounds() {
    // Bar background
    const barBackground = createPlaceholderImage(640, 400, '#331100', 'Bar Scene');
    const barBackgroundImg = new Image();
    barBackgroundImg.src = barBackground;
    
    // Street background
    const streetBackground = createPlaceholderImage(640, 400, '#112233', 'Street Scene');
    const streetBackgroundImg = new Image();
    streetBackgroundImg.src = streetBackground;
    
    // Hotel lobby background
    const hotelLobbyBackground = createPlaceholderImage(640, 400, '#332211', 'Hotel Lobby');
    const hotelLobbyBackgroundImg = new Image();
    hotelLobbyBackgroundImg.src = hotelLobbyBackground;
    
    // Hotel hallway background
    const hotelHallwayBackground = createPlaceholderImage(640, 400, '#221122', 'Hotel Hallway');
    const hotelHallwayBackgroundImg = new Image();
    hotelHallwayBackgroundImg.src = hotelHallwayBackground;
    
    // Secret room background
    const secretRoomBackground = createPlaceholderImage(640, 400, '#330022', 'Secret Room');
    const secretRoomBackgroundImg = new Image();
    secretRoomBackgroundImg.src = secretRoomBackground;
    
    // Player character (simple rectangle for now)
    const playerSprite = createPlaceholderImage(32, 64, '#ff9900', '');
    const playerImg = new Image();
    playerImg.src = playerSprite;
    
    // Store images in global variables
    window.gameImages = {
        'bar-background.png': barBackground,
        'street-background.png': streetBackground,
        'hotel-lobby-background.png': hotelLobbyBackground,
        'hotel-hallway-background.png': hotelHallwayBackground,
        'secret-room-background.png': secretRoomBackground,
        'player.png': playerSprite
    };
}

// Override the standard image loading for our placeholder images
const originalCreateElement = document.createElement;
document.createElement = function(tagName) {
    const element = originalCreateElement.call(document, tagName);
    
    if (tagName.toLowerCase() === 'img') {
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name, value) {
            if (name === 'src' && window.gameImages && window.gameImages[value]) {
                arguments[1] = window.gameImages[value];
            }
            return originalSetAttribute.apply(this, arguments);
        };
    }
    
    return element;
};

// Generate images when page loads
window.addEventListener('load', generateBackgrounds);