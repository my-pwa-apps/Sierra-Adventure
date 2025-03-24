import { PixelRenderer } from './Renderer';
import { playerFront, playerSide, getWalkAnimation, npcSprite } from './CharacterSprites';
import { tree, rock, house, grass, water } from './EnvironmentSprites';

// Example of how to use the pixel graphics system
export function initializePixelGraphics(canvasElement: HTMLCanvasElement): void {
  const renderer = new PixelRenderer(canvasElement, 4);
  
  // Create a simple tile map (0 = grass, 1 = water)
  const tileMap: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  
  const tileSet = [grass, water];
  
  // Animation frames
  const playerWalk = getWalkAnimation(playerSide);
  let frame = 0;
  
  // Main render loop
  function render() {
    renderer.clear('#87CEEB'); // Sky blue background
    
    // Draw the tile map
    renderer.drawTileMap(tileMap, tileSet);
    
    // Draw environment objects
    renderer.drawSprite(tree, 10, 5);
    renderer.drawSprite(rock, 20, 15);
    renderer.drawSprite(house, 35, 10);
    
    // Draw animated character
    const currentFrame = playerWalk[Math.floor(frame / 15) % playerWalk.length];
    renderer.drawSprite(currentFrame, 15, 20);
    
    // Draw NPC
    renderer.drawSprite(npcSprite, 25, 20);
    
    // Advance animation frame
    frame++;
    
    // Continue animation loop
    requestAnimationFrame(render);
  }
  
  // Start the render loop
  render();
}
