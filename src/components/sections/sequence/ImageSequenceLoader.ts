/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ImageSequenceLoader
 * Preloads, caches, and programmatically manages image sequence frames
 * with priority loading, batching, and flicker-free frame fallbacks.
 */

import type { ImageSequenceConfig } from './AnimationState.ts';

export type ProgressCallback = (progress: number, loadedCount: number, totalCount: number) => void;
export type FrameCallback = (frameIndex: number, img: HTMLImageElement) => void;

export class ImageSequenceLoader {
  private config: ImageSequenceConfig;
  private cache: (HTMLImageElement | null)[] = [];
  private loadedCount = 0;
  private isAborted = false;

  private onProgressListeners: ProgressCallback[] = [];
  private onFirstFrameListeners: FrameCallback[] = [];
  private onCompleteListeners: (() => void)[] = [];

  constructor(config: ImageSequenceConfig) {
    this.config = config;
    this.cache = new Array(config.frameCount).fill(null);
  }

  /**
   * Generates URL for a frame index (0-based)
   */
  public getFrameUrl(index: number, useFallback = false): string {
    const frameNum = this.config.startIndex + index;
    const padded = String(frameNum).padStart(this.config.padLength, '0');
    const folder = useFallback && this.config.fallbackFolderPath
      ? this.config.fallbackFolderPath
      : this.config.folderPath;
    
    // Normalize path slashes
    const cleanFolder = folder.replace(/\/+$/, '');
    return `${cleanFolder}/${this.config.fileNamePrefix}${padded}.${this.config.extension}`;
  }

  /**
   * Register progress listener
   */
  public onProgress(cb: ProgressCallback): () => void {
    this.onProgressListeners.push(cb);
    return () => {
      this.onProgressListeners = this.onProgressListeners.filter(fn => fn !== cb);
    };
  }

  /**
   * Register first frame listener
   */
  public onFirstFrame(cb: FrameCallback): () => void {
    this.onFirstFrameListeners.push(cb);
    return () => {
      this.onFirstFrameListeners = this.onFirstFrameListeners.filter(fn => fn !== cb);
    };
  }

  /**
   * Register completion listener
   */
  public onComplete(cb: () => void): () => void {
    this.onCompleteListeners.push(cb);
    return () => {
      this.onCompleteListeners = this.onCompleteListeners.filter(fn => fn !== cb);
    };
  }

  /**
   * Retrieves loaded image at index or null
   */
  public getImage(index: number): HTMLImageElement | null {
    if (index < 0 || index >= this.cache.length) return null;
    return this.cache[index];
  }

  /**
   * Retrieves closest loaded image to avoid any frame flicker
   */
  public getClosestLoadedImage(index: number): HTMLImageElement | null {
    if (this.cache[index]) return this.cache[index];

    // Search outwards from target index
    for (let offset = 1; offset < this.cache.length; offset++) {
      const prev = index - offset;
      if (prev >= 0 && this.cache[prev]) return this.cache[prev];
      const next = index + offset;
      if (next < this.cache.length && this.cache[next]) return this.cache[next];
    }
    return null;
  }

  /**
   * Loads a single image by index with fallback mechanism
   */
  private loadImage(index: number): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (this.cache[index]) {
        resolve(this.cache[index]!);
        return;
      }

      const img = new Image();
      const primaryUrl = this.getFrameUrl(index, false);

      img.onload = () => {
        if (this.isAborted) return;
        this.cache[index] = img;
        this.loadedCount++;
        this.notifyProgress();
        resolve(img);
      };

      img.onerror = () => {
        if (this.isAborted) return;
        // Attempt fallback if available
        if (this.config.fallbackFolderPath) {
          const fallbackUrl = this.getFrameUrl(index, true);
          const fallbackImg = new Image();
          fallbackImg.onload = () => {
            if (this.isAborted) return;
            this.cache[index] = fallbackImg;
            this.loadedCount++;
            this.notifyProgress();
            resolve(fallbackImg);
          };
          fallbackImg.onerror = () => {
            if (this.isAborted) return;
            // Mark loaded count anyway to allow sequence to advance
            this.loadedCount++;
            this.notifyProgress();
            reject(new Error(`Failed to load frame ${index}`));
          };
          fallbackImg.src = fallbackUrl;
        } else {
          this.loadedCount++;
          this.notifyProgress();
          reject(new Error(`Failed to load frame ${index}`));
        }
      };

      img.src = primaryUrl;
    });
  }

  private notifyProgress() {
    const progress = Math.min(1, this.loadedCount / this.config.frameCount);
    for (const listener of this.onProgressListeners) {
      listener(progress, this.loadedCount, this.config.frameCount);
    }
  }

  /**
   * Preloads all frames using a prioritized batch pool.
   * Priority: Frame 0 loads first immediately for fast first paint,
   * then batches load concurrently up to concurrencyLimit.
   */
  public async preloadAll(concurrencyLimit = 12): Promise<void> {
    this.isAborted = false;

    // 1. Immediately load frame 0
    try {
      const firstImg = await this.loadImage(0);
      if (this.isAborted) return;
      for (const listener of this.onFirstFrameListeners) {
        listener(0, firstImg);
      }
    } catch {
      // Continue even if first frame had an error
    }

    // 2. Queue remaining frames in concurrent batches
    const indices: number[] = [];
    for (let i = 1; i < this.config.frameCount; i++) {
      indices.push(i);
    }

    let currentIndex = 0;
    const worker = async () => {
      while (currentIndex < indices.length && !this.isAborted) {
        const frameIndex = indices[currentIndex++];
        try {
          await this.loadImage(frameIndex);
        } catch {
          // Ignore individual frame errors to keep batch moving
        }
      }
    };

    const workers: Promise<void>[] = [];
    const activeWorkers = Math.min(concurrencyLimit, indices.length);
    for (let w = 0; w < activeWorkers; w++) {
      workers.push(worker());
    }

    await Promise.all(workers);

    if (!this.isAborted) {
      for (const listener of this.onCompleteListeners) {
        listener();
      }
    }
  }

  /**
   * Aborts loading and releases references
   */
  public abort(): void {
    this.isAborted = true;
    this.onProgressListeners = [];
    this.onFirstFrameListeners = [];
    this.onCompleteListeners = [];
  }

  /**
   * Total frame count
   */
  public get totalFrames(): number {
    return this.config.frameCount;
  }

  /**
   * Number of frames currently loaded
   */
  public get loadedFrames(): number {
    return this.loadedCount;
  }
}
