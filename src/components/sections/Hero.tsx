/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Cinematic Hero Section
 * Scroll-driven image sequence animation stage for 240 frames.
 * Uses decoupled ImageSequenceLoader, CanvasRenderer, ScrollController, and ResizeHandler.
 */

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_PROTEIN_BAR_SEQUENCE_CONFIG,
  type ImageSequenceConfig,
  type SequenceLoadingState,
  ImageSequenceLoader,
  CanvasRenderer,
  ScrollController,
  ResizeHandler,
} from './sequence/index.ts';

export interface HeroProps {
  /** Optional custom CSS classes for the root hero container */
  className?: string;
  /** Optional external ref to pass directly to the animation canvas */
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  /** Optional children to render within the ContentLayer */
  children?: React.ReactNode;
  /** Optional custom sequence configuration */
  sequenceConfig?: Partial<ImageSequenceConfig>;
  /** Backward-compatible props from parent App layout */
  onShopClick?: () => void;
  onExploreScience?: () => void;
}

/**
 * 1. HeroWrapper
 * Sticky scroll runway container. Total height provides scroll runway for all 240 frames.
 */
export const HeroWrapper = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ children, className = '', style, ...props }, ref) => {
    return (
      <section
        ref={ref}
        id="hero-wrapper"
        className={`relative w-full bg-black ${className}`}
        style={{ height: '400vh', ...style }}
        {...props}
      >
        {children}
      </section>
    );
  }
);
HeroWrapper.displayName = 'HeroWrapper';

/**
 * 2. AnimationContainer
 * Sticky container that occupies 100vh, anchoring the canvas during scroll playback.
 */
export const AnimationContainer = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AnimationContainer.displayName = 'AnimationContainer';

/**
 * 3. CanvasContainer
 * Full-screen viewport container hosting the hardware-accelerated <canvas>.
 */
export interface CanvasContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

export const CanvasContainer = forwardRef<HTMLDivElement, CanvasContainerProps>(
  ({ children, canvasRef, className = '', ...props }, ref) => {
    const internalCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const resolvedCanvasRef = canvasRef || internalCanvasRef;

    return (
      <div
        ref={ref}
        className={`absolute inset-0 z-0 w-full h-full flex items-center justify-center pointer-events-none ${className}`}
        {...props}
      >
        <canvas
          ref={resolvedCanvasRef}
          className="w-full h-full block object-cover"
        />
        {children}
      </div>
    );
  }
);
CanvasContainer.displayName = 'CanvasContainer';

/**
 * 4. OverlayLayer (Empty)
 * Reserved for future gradient fades or lighting vignettes.
 */
export const OverlayLayer = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`absolute inset-0 z-10 pointer-events-none ${className}`}
        aria-hidden="true"
        {...props}
      >
        {children}
      </div>
    );
  }
);
OverlayLayer.displayName = 'OverlayLayer';

/**
 * 5. ContentLayer (Empty)
 * Reserved for future text or CTA layers.
 */
export const ContentLayer = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative z-20 w-full h-full pointer-events-none flex flex-col justify-center ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ContentLayer.displayName = 'ContentLayer';

/**
 * 6. LoadingLayer
 * Minimal buffer & loading progress indicator shown while sequence initializes.
 */
export interface LoadingLayerProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading?: boolean;
  progress?: number;
}

export const LoadingLayer = forwardRef<HTMLDivElement, LoadingLayerProps>(
  ({ isLoading = false, progress = 0, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`absolute inset-0 z-30 pointer-events-none flex flex-col items-center justify-center bg-black transition-opacity duration-700 ${
          isLoading ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        aria-hidden={!isLoading}
        {...props}
      >
        {/* Subtle, minimalist loading bar */}
        <div className="w-48 h-[2px] bg-neutral-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 transition-all duration-150 ease-out"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    );
  }
);
LoadingLayer.displayName = 'LoadingLayer';

/**
 * Main Hero Component
 * Orchestrates the scroll-controlled cinematic image sequence animation.
 */
export function Hero({
  className = '',
  canvasRef: externalCanvasRef,
  children,
  sequenceConfig,
}: HeroProps) {
  const localCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = externalCanvasRef || localCanvasRef;
  const wrapperRef = useRef<HTMLElement | null>(null);

  const [loadingState, setLoadingState] = useState<SequenceLoadingState>({
    isLoading: true,
    progress: 0,
    loadedCount: 0,
    totalCount: DEFAULT_PROTEIN_BAR_SEQUENCE_CONFIG.frameCount,
    isFirstFrameReady: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const mergedConfig: ImageSequenceConfig = {
      ...DEFAULT_PROTEIN_BAR_SEQUENCE_CONFIG,
      ...sequenceConfig,
    };

    // 1. Initialize Canvas Renderer
    const renderer = new CanvasRenderer(canvas);

    // 2. Initialize Image Sequence Loader
    const loader = new ImageSequenceLoader(mergedConfig);

    // Render frame 0 immediately when loaded
    loader.onFirstFrame((_index, img) => {
      renderer.draw(img, 0);
      setLoadingState((prev) => ({
        ...prev,
        isFirstFrameReady: true,
      }));
    });

    // Track loading progress
    loader.onProgress((progress, loadedCount, totalCount) => {
      setLoadingState((prev) => ({
        ...prev,
        progress,
        loadedCount,
        totalCount,
      }));
    });

    // Mark loading complete when all frames cached
    loader.onComplete(() => {
      setLoadingState((prev) => ({
        ...prev,
        isLoading: false,
        progress: 1,
      }));
    });

    // 3. Initialize Scroll Controller
    const scrollController = new ScrollController(wrapper, {
      totalFrames: mergedConfig.frameCount,
      lerpFactor: 0.35,
      onFrameUpdate: (frameIndex) => {
        const img = loader.getClosestLoadedImage(frameIndex);
        if (img) {
          renderer.draw(img, frameIndex);
        }
      },
    });

    // 4. Initialize Resize Handler
    const resizeHandler = new ResizeHandler(canvas, () => {
      const resized = renderer.updateDimensions();
      if (resized) {
        renderer.forceRedraw();
        scrollController.handleScroll();
      }
    });

    // 5. Begin concurrent frame preloading
    loader.preloadAll(12).catch(() => {
      // Gracefully continue even on partial network failures
    });

    // Initial size & frame setup
    renderer.updateDimensions();
    scrollController.handleScroll();

    // 6. Cleanup on unmount
    return () => {
      scrollController.destroy();
      resizeHandler.destroy();
      renderer.destroy();
      loader.abort();
    };
  }, [canvasRef, sequenceConfig]);

  return (
    <HeroWrapper ref={wrapperRef} className={className}>
      <AnimationContainer>
        {/* Hardware-accelerated canvas stage for image sequence */}
        <CanvasContainer canvasRef={canvasRef} />

        {/* Empty overlay layer for future vignettes */}
        <OverlayLayer />

        {/* Empty content layer for future typography */}
        <ContentLayer>{children}</ContentLayer>

        {/* Minimal loading state during preloading */}
        <LoadingLayer
          isLoading={loadingState.isLoading}
          progress={loadingState.progress}
        />
      </AnimationContainer>
    </HeroWrapper>
  );
}

export default Hero;
