/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CanvasRenderer
 * High-performance 2D canvas drawing engine with DPR scaling,
 * aspect-ratio cover centering, and redraw optimization.
 */

export interface CanvasDimensions {
  cssWidth: number;
  cssHeight: number;
  dpr: number;
}

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private lastRenderedImage: HTMLImageElement | null = null;
  private lastRenderedFrameIndex = -1;
  private currentDimensions: CanvasDimensions = { cssWidth: 0, cssHeight: 0, dpr: 1 };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    this.updateDimensions();
  }

  /**
   * Recalculates canvas pixel buffer according to devicePixelRatio
   * (capped at 2 for mobile memory and high-DPI GPU efficiency).
   */
  public updateDimensions(): boolean {
    const rect = this.canvas.getBoundingClientRect();
    const cssWidth = Math.max(rect.width || window.innerWidth, 1);
    const cssHeight = Math.max(rect.height || window.innerHeight, 1);
    const isMobile = window.innerWidth < 768;
    // Cap DPR at 1.5 on mobile and 2 on desktop for buttery 60fps performance
    const maxDpr = isMobile ? 1.5 : 2;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

    const targetPhysicalWidth = Math.floor(cssWidth * dpr);
    const targetPhysicalHeight = Math.floor(cssHeight * dpr);

    const sizeChanged =
      this.canvas.width !== targetPhysicalWidth ||
      this.canvas.height !== targetPhysicalHeight ||
      this.currentDimensions.dpr !== dpr;

    if (sizeChanged) {
      this.canvas.width = targetPhysicalWidth;
      this.canvas.height = targetPhysicalHeight;
      this.currentDimensions = { cssWidth, cssHeight, dpr };
      
      // Reset last rendered index so next frame redraws with new dimensions
      this.lastRenderedFrameIndex = -1;
    }

    return sizeChanged;
  }

  /**
   * Draws the image scaled with "object-fit: cover" centered in the canvas.
   * Only redraws if the image or frame index or size has changed.
   */
  public draw(image: HTMLImageElement | null, frameIndex: number): void {
    if (!this.ctx || !image) return;

    // Check if redrawing the exact same frame at same dimensions
    if (this.lastRenderedFrameIndex === frameIndex && this.lastRenderedImage === image) {
      return;
    }

    // Ensure image has valid dimensions
    const imgWidth = image.naturalWidth || image.width;
    const imgHeight = image.naturalHeight || image.height;
    if (imgWidth === 0 || imgHeight === 0) return;

    const { cssWidth, cssHeight, dpr } = this.currentDimensions;
    if (cssWidth === 0 || cssHeight === 0) return;

    // Calculate aspect ratio cover
    const scale = Math.max(cssWidth / imgWidth, cssHeight / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;
    const drawX = (cssWidth - drawWidth) / 2;
    const drawY = (cssHeight - drawHeight) / 2;

    // Fast clear / overwrite
    this.ctx.save();
    this.ctx.scale(dpr, dpr);
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    // Direct draw
    this.ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    this.ctx.restore();

    this.lastRenderedFrameIndex = frameIndex;
    this.lastRenderedImage = image;
  }

  /**
   * Forces a redraw of the last valid image (useful after resize)
   */
  public forceRedraw(): void {
    if (this.lastRenderedImage) {
      const img = this.lastRenderedImage;
      const index = this.lastRenderedFrameIndex;
      this.lastRenderedFrameIndex = -1;
      this.draw(img, index);
    }
  }

  /**
   * Cleans up canvas context
   */
  public destroy(): void {
    this.lastRenderedImage = null;
    this.lastRenderedFrameIndex = -1;
    this.ctx = null;
  }
}
