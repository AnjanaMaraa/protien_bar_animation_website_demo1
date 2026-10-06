/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ResizeHandler
 * Responds to viewport adjustments, orientation changes, and container size modifications.
 */

export class ResizeHandler {
  private onResizeCallback: () => void;
  private resizeObserver: ResizeObserver | null = null;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private isDestroyed = false;

  constructor(targetElement: HTMLElement, onResize: () => void) {
    this.onResizeCallback = onResize;

    this.handleWindowResize = this.handleWindowResize.bind(this);
    window.addEventListener('resize', this.handleWindowResize, { passive: true });
    window.addEventListener('orientationchange', this.handleWindowResize, { passive: true });

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.debouncedResize();
      });
      this.resizeObserver.observe(targetElement);
    }
  }

  private handleWindowResize(): void {
    this.debouncedResize();
  }

  private debouncedResize(): void {
    if (this.isDestroyed) return;

    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      if (this.isDestroyed) return;
      this.onResizeCallback();
    }, 60);
  }

  public destroy(): void {
    this.isDestroyed = true;
    window.removeEventListener('resize', this.handleWindowResize);
    window.removeEventListener('orientationchange', this.handleWindowResize);

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
