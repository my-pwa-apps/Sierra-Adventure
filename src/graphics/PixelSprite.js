/**
 * JavaScript version of PixelSprite class
 */
export class PixelSprite {
  /**
   * Creates a new pixel sprite from a grid of color codes
   * @param {string[][]} grid 2D array of color codes
   */
  constructor(grid) {
    this.grid = this.normalizeGrid(grid);
    this.height = this.grid.length;
    this.width = this.height > 0 ? this.grid[0].length : 0;
  }

  /**
   * Ensures all rows in the grid have the same length
   * @private
   */
  normalizeGrid(grid) {
    if (grid.length === 0) return [[]];
    
    const maxWidth = Math.max(...grid.map(row => row.length));
    return grid.map(row => {
      if (row.length === maxWidth) return [...row];
      // Pad shorter rows with transparent pixels
      return [...row, ...Array(maxWidth - row.length).fill('transparent')];
    });
  }

  /**
   * Gets the width of the sprite
   * @returns {number} Width in pixels
   */
  getWidth() {
    return this.width;
  }

  /**
   * Gets the height of the sprite
   * @returns {number} Height in pixels
   */
  getHeight() {
    return this.height;
  }

  /**
   * Gets the color at a specific pixel
   * @param {number} x X coordinate
   * @param {number} y Y coordinate
   * @returns {string|null} Color code or null if out of bounds
   */
  getPixel(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return null;
    }
    return this.grid[y][x];
  }

  /**
   * Renders the sprite to a canvas context
   * @param {CanvasRenderingContext2D} ctx The canvas rendering context
   * @param {number} x X position to render at
   * @param {number} y Y position to render at
   * @param {number} pixelSize Size of each pixel (for scaling)
   */
  render(ctx, x, y, pixelSize = 1) {
    // Performance optimization: batch pixels by color to reduce context state changes
    const colorMap = {};
    
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const color = this.grid[row][col];
        if (color && color !== 'transparent') {
          if (!colorMap[color]) {
            colorMap[color] = [];
          }
          colorMap[color].push({
            x: x + col * pixelSize,
            y: y + row * pixelSize
          });
        }
      }
    }
    
    // Draw all pixels of the same color at once
    Object.entries(colorMap).forEach(([color, pixels]) => {
      ctx.fillStyle = color;
      pixels.forEach(pos => {
        ctx.fillRect(pos.x, pos.y, pixelSize, pixelSize);
      });
    });
  }

  /**
   * Creates a horizontally flipped copy of this sprite
   * @returns {PixelSprite} A new PixelSprite that's flipped horizontally
   */
  flipHorizontal() {
    const newGrid = [];
    for (let y = 0; y < this.height; y++) {
      newGrid[y] = [];
      for (let x = 0; x < this.width; x++) {
        newGrid[y][x] = this.grid[y][this.width - 1 - x];
      }
    }
    return new PixelSprite(newGrid);
  }
  
  /**
   * Creates a vertically flipped copy of this sprite
   * @returns {PixelSprite} A new PixelSprite that's flipped vertically
   */
  flipVertical() {
    const newGrid = [];
    for (let y = 0; y < this.height; y++) {
      newGrid[y] = [...this.grid[this.height - 1 - y]];
    }
    return new PixelSprite(newGrid);
  }
  
  /**
   * Create a rotated copy of this sprite
   * @param {number} degrees Degrees to rotate (must be 90, 180 or 270)
   * @returns {PixelSprite} A new PixelSprite that's rotated
   */
  rotate(degrees) {
    if (degrees === 180) {
      return this.flipHorizontal().flipVertical();
    }
    
    const newGrid = [];
    
    if (degrees === 90) {
      for (let x = 0; x < this.width; x++) {
        newGrid[x] = [];
        for (let y = 0; y < this.height; y++) {
          newGrid[x][y] = this.grid[this.height - 1 - y][x];
        }
      }
    } else if (degrees === 270) {
      for (let x = 0; x < this.width; x++) {
        newGrid[x] = [];
        for (let y = 0; y < this.height; y++) {
          newGrid[x][y] = this.grid[y][this.width - 1 - x];
        }
      }
    }
    
    return new PixelSprite(newGrid);
  }

  /**
   * Converts the sprite to a data URL
   * @param {number} scale Scale factor
   * @returns {string} Data URL
   */
  toDataURL(scale = 1) {
    const canvas = document.createElement('canvas');
    canvas.width = this.width * scale;
    canvas.height = this.height * scale;
    const ctx = canvas.getContext('2d');
    this.render(ctx, 0, 0, scale);
    return canvas.toDataURL();
  }
}

// Make available globally for non-module code
window.PixelSprite = PixelSprite;
