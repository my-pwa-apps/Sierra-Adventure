/**
 * JavaScript implementation of the PixelSprite class
 */
export class PixelSprite {
  constructor(grid) {
    this.grid = this.normalizeGrid(grid);
    this.height = this.grid.length;
    this.width = this.height > 0 ? this.grid[0].length : 0;
  }

  normalizeGrid(grid) {
    if (grid.length === 0) return [[]];
    
    const maxWidth = Math.max(...grid.map(row => row.length));
    return grid.map(row => {
      if (row.length === maxWidth) return [...row];
      // Pad shorter rows with transparent pixels
      return [...row, ...Array(maxWidth - row.length).fill('transparent')];
    });
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getPixel(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return null;
    }
    return this.grid[y][x];
  }

  render(ctx, x, y, pixelSize = 1) {
    // Performance optimization: batch pixels by color
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

  // Convert sprite to a data URL for image sources
  toDataURL(scale = 1) {
    const canvas = document.createElement('canvas');
    canvas.width = this.width * scale;
    canvas.height = this.height * scale;
    const ctx = canvas.getContext('2d');
    this.render(ctx, 0, 0, scale);
    return canvas.toDataURL();
  }
}

// Make available globally for compatibility with non-module code
window.PixelSprite = PixelSprite;
