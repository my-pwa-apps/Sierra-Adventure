export type ColorCode = string; // Hex color code like "#FF0000"
export type PixelGrid = ColorCode[][];

export class PixelSprite {
  private grid: PixelGrid;
  private width: number;
  private height: number;
  
  constructor(grid: PixelGrid) {
    this.grid = grid;
    this.height = grid.length;
    this.width = grid.length > 0 ? grid[0].length : 0;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public getPixel(x: number, y: number): ColorCode | null {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return null;
    }
    return this.grid[y][x];
  }

  public render(ctx: CanvasRenderingContext2D, x: number, y: number, pixelSize: number = 1): void {
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const color = this.grid[row][col];
        if (color && color !== 'transparent') {
          ctx.fillStyle = color;
          ctx.fillRect(
            x + col * pixelSize, 
            y + row * pixelSize, 
            pixelSize, 
            pixelSize
          );
        }
      }
    }
  }

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
}
