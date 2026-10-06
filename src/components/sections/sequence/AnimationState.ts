/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Animation State & Configuration Contracts
 * Reusable specifications for scroll-driven image sequence playback.
 */

export interface ImageSequenceConfig {
  /** Root or relative directory containing the frame files */
  folderPath: string;
  /** Prefix for each frame file (e.g., 'ezgif-frame-') */
  fileNamePrefix: string;
  /** File format extension without dot (e.g., 'jpg') */
  extension: string;
  /** Total count of frames in the sequence (e.g., 240) */
  frameCount: number;
  /** 1-based start index (e.g., 1 for ezgif-frame-001.jpg) */
  startIndex: number;
  /** Zero-padding length for sequential numbers (e.g., 3 for 001..240) */
  padLength: number;
  /** Total scroll distance in viewport height units (e.g., 400vh) */
  scrollHeightVh: number;
  /** Optional fallback folder path */
  fallbackFolderPath?: string;
}

export interface SequenceLoadingState {
  /** True while initial critical frames are preloading */
  isLoading: boolean;
  /** Decimal progress from 0.0 to 1.0 */
  progress: number;
  /** Number of frames loaded so far */
  loadedCount: number;
  /** Total frames to load */
  totalCount: number;
  /** Whether the very first frame is ready for immediate display */
  isFirstFrameReady: boolean;
}

export const DEFAULT_PROTEIN_BAR_SEQUENCE_CONFIG: ImageSequenceConfig = {
  folderPath: '/assets/protein-bar',
  fallbackFolderPath: '/src/proteinbar_images',
  fileNamePrefix: 'ezgif-frame-',
  extension: 'jpg',
  frameCount: 240,
  startIndex: 1,
  padLength: 3,
  scrollHeightVh: 400,
};
