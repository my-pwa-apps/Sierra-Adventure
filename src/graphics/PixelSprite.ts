export type ColorCode = string; // Hex color code like "#FF0000"
export type PixelGrid = ColorCode[][];

export class PixelSprite {
  private readonly grid: PixelGrid;
  private readonly width: number;
  private readonly height: number;
  
  /**
   * Creates a new pixel sprite from a grid of color codes
   * @param grid 2D array of color codes
   */
  constructor(grid: PixelGrid) {
    this.grid = this.normalizeGrid(grid);
    this.height = this.grid.length;
    this.width = this.height > 0 ? this.grid[0].length : 0;
  }

  /**
   * Ensures all rows in the grid have the same length
   */
  private normalizeGrid(grid: PixelGrid): PixelGrid {
    if (grid.length === 0) return [[]];
    
    const maxWidth = Math.max(...grid.map(row => row.length));
    return grid.map(row => {
      if (row.length === maxWidth) return [...row];
      // Pad shorter rows with transparent pixels
      return [...row, ...Array(maxWidth - row.length).fill('transparent')];
    });
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  /**
   * Gets the color at a specific pixel
   * @param x X coordinate
   * @param y Y coordinate
   * @returns Color code or null if out of bounds
   */
  public getPixel(x: number, y: number): ColorCode | null {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return null;
    }
    return this.grid[y][x];
  }

  /**
   * Renders the sprite to a canvas context
   * @param ctx The canvas rendering context
   * @param x X position to render at
   * @param y Y position to render at
   * @param pixelSize Size of each pixel (for scaling)
   */
  public render(ctx: CanvasRenderingContext2D, x: number, y: number, pixelSize: number = 1): void {
    // Performance optimization: batch pixels by color to reduce context state changes
    const colorMap: { [color: string]: { x: number, y: number }[] } = {};
    
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
   * Render the sprite with a shadow for better visual distinction
   * @param ctx The canvas rendering context
   * @param x X position to render at
   * @param y Y position to render at
   * @param pixelSize Size of each pixel (for scaling)
   */
  public renderWithShadow(ctx: CanvasRenderingContext2D, x: number, y: number, pixelSize: number = 1): void {
    // Render shadow
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000000';
    this.render(ctx, x + pixelSize, y + pixelSize, pixelSize);
    ctx.restore();

    // Render the sprite
    this.render(ctx, x, y, pixelSize);
  }

  /**
   * Creates a horizontally flipped copy of this sprite
   * @returns A new PixelSprite that's flipped horizontally
   */
  public flipHorizontal(): PixelSprite {
    const newGrid: PixelGrid = [];
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
   * @returns A new PixelSprite that's flipped vertically
   */
  public flipVertical(): PixelSprite {
    const newGrid: PixelGrid = [];
    for (let y = 0; y < this.height; y++) {
      newGrid[y] = [...this.grid[this.height - 1 - y]];
    }
    return new PixelSprite(newGrid);
  }
  
  /**
   * Create a rotated copy of this sprite
   * @param degrees Degrees to rotate (must be multiple of 90)
   * @returns A new PixelSprite that's rotated
   */
  public rotate(degrees: 90|180|270): PixelSprite {
    if (degrees === 180) {
      return this.flipHorizontal().flipVertical();
    }
    
    const newGrid: PixelGrid = [];
    
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
}
