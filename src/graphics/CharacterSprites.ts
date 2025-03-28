import { PixelSprite } from './PixelSprite';

// Color palette
const COLORS = {
  TRANSPARENT: 'transparent',
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  SKIN: '#FFC8A2',
  BLUE: '#3050FF',
  RED: '#FF3030',
  BROWN: '#8B4513',
  DARK_BROWN: '#5C3317',
  GREEN: '#30C030',
};

// Player character - front facing
export const playerFront = new PixelSprite([
  [COLORS.TRANSPARENT, COLORS.BROWN, COLORS.BROWN, COLORS.BROWN, COLORS.TRANSPARENT],
  [COLORS.BROWN, COLORS.SKIN, COLORS.SKIN, COLORS.SKIN, COLORS.BROWN],
  [COLORS.TRANSPARENT, COLORS.SKIN, COLORS.SKIN, COLORS.SKIN, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.BLUE, COLORS.BLUE, COLORS.BLUE, COLORS.TRANSPARENT],
  [COLORS.BLUE, COLORS.BLUE, COLORS.BLUE, COLORS.BLUE, COLORS.BLUE],
  [COLORS.BLUE, COLORS.BLUE, COLORS.BLUE, COLORS.BLUE, COLORS.BLUE],
  [COLORS.TRANSPARENT, COLORS.BLUE, COLORS.TRANSPARENT, COLORS.BLUE, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.BROWN, COLORS.TRANSPARENT, COLORS.BROWN, COLORS.TRANSPARENT],
]);

// Player character - side view
export const playerSide = new PixelSprite([
  [COLORS.TRANSPARENT, COLORS.BROWN, COLORS.BROWN, COLORS.TRANSPARENT, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.SKIN, COLORS.SKIN, COLORS.BROWN, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.SKIN, COLORS.SKIN, COLORS.SKIN, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.BLUE, COLORS.BLUE, COLORS.BLUE, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.BLUE, COLORS.BLUE, COLORS.BLUE, COLORS.BLUE],
  [COLORS.BLUE, COLORS.BLUE, COLORS.BLUE, COLORS.BLUE, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.BLUE, COLORS.TRANSPARENT, COLORS.BLUE, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.BROWN, COLORS.TRANSPARENT, COLORS.BROWN, COLORS.TRANSPARENT],
]);

// NPC character
export const npcSprite = new PixelSprite([
  [COLORS.TRANSPARENT, COLORS.DARK_BROWN, COLORS.DARK_BROWN, COLORS.TRANSPARENT],
  [COLORS.DARK_BROWN, COLORS.SKIN, COLORS.SKIN, COLORS.DARK_BROWN],
  [COLORS.TRANSPARENT, COLORS.SKIN, COLORS.SKIN, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.RED, COLORS.RED, COLORS.TRANSPARENT],
  [COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED],
  [COLORS.RED, COLORS.RED, COLORS.RED, COLORS.RED],
  [COLORS.TRANSPARENT, COLORS.RED, COLORS.RED, COLORS.TRANSPARENT],
  [COLORS.TRANSPARENT, COLORS.BLACK, COLORS.BLACK, COLORS.TRANSPARENT],
]);

// Generate a simple animated walk cycle
export function getWalkAnimation(baseSprite: PixelSprite): PixelSprite[] {
  const flipped = baseSprite.flipHorizontal();
  return [baseSprite, flipped];
}
