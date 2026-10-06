/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ScrollController
 * Computes normalized scroll progress [0.0 - 1.0] for the pinned hero container
 * and provides fluid frame interpolation via RAF lerping.
 */

export interface ScrollControllerOptions {
  totalFrames: number;
  lerpFactor?: number;
  onFrameUpdate: (frameIndex: number, progress: number) => void;
}

export class ScrollController {
  private targetElement: HTMLElement;
  private totalFrames: number;
  private lerpFactor: number;
  private onFrameUpdate: (frameIndex: number, progress: number) => void;

  private targetFrame = 0;
  private currentFrame = 0;
  private currentProgress = 0;
  private rafId: number | null = null;
  private isDestroyed = false;

  constructor(targetElement: HTMLElement, options: ScrollControllerOptions) {
    this.targetElement = targetElement;
    this.totalFrames = options.totalFrames;
    this.lerpFactor = options.lerpFactor ?? 0.35;
    this.onFrameUpdate = options.onFrameUpdate;

    this.handleScroll = this.handleScroll.bind(this);
    this.tick = this.tick.bind(this);

    window.addEventListener('scroll', this.handleScroll, { passive: true });
    this.handleScroll();
  }

  /**
   * Recalculates scroll progress from container rect
   */
  public handleScroll(): void {
    if (this.isDestroyed) return;

    const rect = this.targetElement.getBoundingClientRect();
    const scrollDistance = rect.height - window.innerHeight;

    if (scrollDistance <= 0) {
      this.targetFrame = 0;
      this.currentProgress = 0;
    } else {
      // Scrolled past the top of the container
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollDistance));
      this.currentProgress = progress;
      this.targetFrame = Math.min(
        this.totalFrames - 1,
        Math.max(0, Math.floor(progress * (this.totalFrames - 1)))
      );
    }

    // Start RAF loop if not already running
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  /**
   * RAF loop for silky-smooth cinematic frame interpolation
   */
  private tick(): void {
    if (this.isDestroyed) return;

    const diff = this.targetFrame - this.currentFrame;

    if (Math.abs(diff) < 0.05) {
      // Snapped to exact target frame
      this.currentFrame = this.targetFrame;
      this.rafId = null;
      this.onFrameUpdate(Math.round(this.currentFrame), this.currentProgress);
      return;
    }

    // Lerp smoothly toward target frame
    this.currentFrame += diff * this.lerpFactor;
    this.onFrameUpdate(Math.round(this.currentFrame), this.currentProgress);

    this.rafId = requestAnimationFrame(this.tick);
  }

  /**
   * Force an immediate frame jump without interpolation (e.g. initial load)
   */
  public setImmediateFrame(index: number): void {
    this.targetFrame = Math.max(0, Math.min(this.totalFrames - 1, index));
    this.currentFrame = this.targetFrame;
    this.onFrameUpdate(this.targetFrame, this.currentProgress);
  }

  /**
   * Clean up event listeners and animation frames
   */
  public destroy(): void {
    this.isDestroyed = true;
    window.removeEventListener('scroll', this.handleScroll);
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
