// Define and export barCounter, neonSign, and liquorBottle as pixel art sprites
import { PixelSprite } from './PixelSprite.js';
import { COLORS } from '../common/color-palette.js';

// Bar counter sprite
export const barCounter = new PixelSprite([
    [COLORS.BROWN, COLORS.BROWN, COLORS.BROWN],
    [COLORS.BROWN, COLORS.DARK_BROWN, COLORS.BROWN],
    [COLORS.BROWN, COLORS.BROWN, COLORS.BROWN]
]);

// Neon sign sprite
export const neonSign = new PixelSprite([
    [COLORS.PINK, COLORS.PINK, COLORS.PINK],
    [COLORS.PINK, COLORS.DARK_PINK, COLORS.PINK],
    [COLORS.PINK, COLORS.PINK, COLORS.PINK]
]);

// Liquor bottle sprite
export const liquorBottle = new PixelSprite([
    [COLORS.GREEN, COLORS.GREEN, COLORS.GREEN],
    [COLORS.GREEN, COLORS.DARK_GREEN, COLORS.GREEN],
    [COLORS.GREEN, COLORS.GREEN, COLORS.GREEN]
]);

// Add a renderWithShadow method to each sprite
barCounter.renderWithShadow = function(ctx, x, y, scale) {
    this.render(ctx, x + 2, y + 2, scale, COLORS.DARK_GRAY); // Shadow
    this.render(ctx, x, y, scale); // Original sprite
};

neonSign.renderWithShadow = function(ctx, x, y, scale) {
    this.render(ctx, x + 2, y + 2, scale, COLORS.DARK_GRAY); // Shadow
    this.render(ctx, x, y, scale); // Original sprite
};

liquorBottle.renderWithShadow = function(ctx, x, y, scale) {
    this.render(ctx, x + 2, y + 2, scale, COLORS.DARK_GRAY); // Shadow
    this.render(ctx, x, y, scale); // Original sprite
};
