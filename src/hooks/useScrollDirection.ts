/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Dynamic Scroll Hook
 * Directional tracking hook designed to trigger header hide/reveal interactions
 * with jitter-suppression delta thresholds.
 */

import { useState, useEffect, useRef } from 'react';
import type { ScrollDirection } from '@/types/index.ts';

interface UseScrollDirectionOptions {
  /**
   * Distance in pixels from the top of the document where header remains pinned/transparent
   * @default 50
   */
  topThreshold?: number;

  /**
   * Minimum scroll distance (delta) required before flipping between 'up' and 'down'.
   * Prevents micro-jitter caused by subtle touch drags or rapid inertia scrolling.
   * @default 10
   */
  directionThreshold?: number;
}

// FUTURE INTEGRATION POINT: Connect this hook to Lenis smooth scroll or a headless CMS
// global page announcement bar toggle to adjust topThreshold dynamically.

/**
 * useScrollDirection
 * Returns 'top' when near page top, 'down' when descending, and 'up' when ascending.
 */
export function useScrollDirection(options: UseScrollDirectionOptions = {}): ScrollDirection {
  const { topThreshold = 50, directionThreshold = 10 } = options;

  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('top');
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    // PERFORMANCE OPTIMIZATION: Use requestAnimationFrame throttling alongside
    // passive event listeners to avoid scroll-jank on high refresh-rate 120Hz displays.
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      // Handle the page top boundary
      if (scrollY <= topThreshold) {
        setScrollDirection('top');
        lastScrollY.current = scrollY <= 0 ? 0 : scrollY;
        ticking.current = false;
        return;
      }

      // Check directional delta
      const deltaY = scrollY - lastScrollY.current;

      // FLEXIBILITY TIP: Increase directionThreshold (e.g. 15-20px) if users report header
      // flicker on trackpad reverse swipes; decrease (e.g. 5px) for hyper-responsive triggers.
      if (Math.abs(deltaY) > directionThreshold) {
        const newDirection: ScrollDirection = deltaY > 0 ? 'down' : 'up';
        setScrollDirection(newDirection);
        lastScrollY.current = scrollY;
      }

      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [topThreshold, directionThreshold]);

  return scrollDirection;
}
