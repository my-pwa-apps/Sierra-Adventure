import { PixelSprite } from './PixelSprite';

export class PixelRenderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private pixelSize: number;
  private width: number;
  private height: number;

  constructor(canvas: HTMLCanvasElement, pixelSize: number = 4) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
    this.pixelSize = pixelSize;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  public clear(color: string = '#000000'): void {
    this.context.fillStyle = color;
    this.context.fillRect(0, 0, this.width, this.height);
  }

  public drawSprite(sprite: PixelSprite, x: number, y: number): void {
    sprite.render(this.context, x * this.pixelSize, y * this.pixelSize, this.pixelSize);
  }

  public drawText(text: string, x: number, y: number, color: string = '#FFFFFF', pixelSize: number = 1): void {
    this.context.fillStyle = color;
    this.context.font = `${8 * pixelSize}px monospace`;
    this.context.fillText(text, x * this.pixelSize, y * this.pixelSize);
  }

  public drawTileMap(map: number[][], tileSet: PixelSprite[], offsetX: number = 0, offsetY: number = 0): void {
    const tileSize = tileSet[0]?.getWidth() || 4;
    
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const tileIndex = map[y][x];
        if (tileIndex >= 0 && tileIndex < tileSet.length) {
          this.drawSprite(
            tileSet[tileIndex], 
            x * tileSize + offsetX,
            y * tileSize + offsetY
          );
        }
      }
    }
  }
}
