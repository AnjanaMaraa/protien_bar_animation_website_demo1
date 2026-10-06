/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Universal Draggable Carousel Component
 * Modular horizontal carousel supporting touch swipe, Framer Motion drag physics,
 * horizontal trackpad wheel interception, and snap alignment.
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalCarouselProps {
  children: React.ReactNode;
  className?: string;
  trackClassName?: string;
  showArrows?: boolean;
  /**
   * Title or header rendered above the carousel track
   */
  title?: string;
  subtitle?: string;
  badge?: string;
}

export function HorizontalCarousel({
  children,
  className = '',
  trackClassName = '',
  showArrows = true,
  title,
  subtitle,
  badge,
}: HorizontalCarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  // Motion physics springs
  const x = useMotionValue(0);
  // FLEXIBILITY TIP: Adjust stiffness (e.g. 250-400) and damping (25-45) to tune the kinetic glide feel
  const springX = useSpring(x, { stiffness: 320, damping: 32 });

  // PERFORMANCE OPTIMIZATION: Measure drag constraints on window resize and child change
  const updateConstraints = useCallback(() => {
    if (!containerRef.current || !trackRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const trackWidth = trackRef.current.scrollWidth;
    const maxScroll = Math.min(0, containerWidth - trackWidth);

    setDragConstraints({ left: maxScroll, right: 0 });

    const currentX = x.get();
    setCanScrollLeft(currentX < -10);
    setCanScrollRight(currentX > maxScroll + 10);
  }, [x]);

  useEffect(() => {
    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, [updateConstraints]);

  // Horizontal wheel interception for precision desktop trackpads and shift-wheel mice
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Intercept horizontal delta, or vertical delta when Shift key is pressed
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
      
      if (delta !== 0) {
        e.preventDefault();
        const currentX = x.get();
        const containerWidth = containerRef.current?.offsetWidth || 0;
        const trackWidth = trackRef.current?.scrollWidth || 0;
        const minLimit = Math.min(0, -(trackWidth - containerWidth));

        // Clamped target offset
        const targetX = Math.min(0, Math.max(minLimit, currentX - delta * 1.2));
        x.set(targetX);

        setCanScrollLeft(targetX < -10);
        setCanScrollRight(targetX > minLimit + 10);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [x]);

  // Step button navigation handlers (e.g. for mouse-oriented users)
  const handleStepScroll = (direction: 'left' | 'right') => {
    if (!containerRef.current || !trackRef.current) return;
    const stepSize = Math.min(containerRef.current.offsetWidth * 0.75, 450);
    const containerWidth = containerRef.current.offsetWidth;
    const trackWidth = trackRef.current.scrollWidth;
    const minLimit = Math.min(0, -(trackWidth - containerWidth));

    const currentX = x.get();
    const targetX = direction === 'left' 
      ? Math.min(0, currentX + stepSize) 
      : Math.max(minLimit, currentX - stepSize);

    x.set(targetX);
    setCanScrollLeft(targetX < -10);
    setCanScrollRight(targetX > minLimit + 10);
  };

  // FUTURE INTEGRATION POINT: Connect item clicks inside track to Shopify analytics tracking
  // or Facebook Pixel "ViewContent" events.

  return (
    <div className={`relative w-full ${className}`}>
      {/* Optional Top Header Row with Title & Arrow Controls */}
      {(title || showArrows) && (
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-12 mb-6 flex items-end justify-between">
          <div>
            {badge && (
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-1">
                {badge}
              </span>
            )}
            {title && (
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-white/60 font-sans max-w-xl">
                {subtitle}
              </p>
            )}
          </div>

          {showArrows && (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => handleStepScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 ${
                  canScrollLeft
                    ? 'border-white/20 bg-white/5 text-white hover:border-[#D4AF37] hover:bg-white/10 active:scale-95'
                    : 'border-white/5 text-white/20 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleStepScroll('right')}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 ${
                  canScrollRight
                    ? 'border-white/20 bg-white/5 text-white hover:border-[#D4AF37] hover:bg-white/10 active:scale-95'
                    : 'border-white/5 text-white/20 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* DRAG & SNAP CONTAINER VIEWPORT */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
      >
        <motion.div
          ref={trackRef}
          style={{ x: springX }}
          drag="x"
          dragConstraints={dragConstraints}
          dragElastic={0.08}
          onDragEnd={() => {
            const currentX = x.get();
            setCanScrollLeft(currentX < -10);
            setCanScrollRight(currentX > dragConstraints.left + 10);
          }}
          className={`flex gap-6 px-6 md:px-10 lg:px-12 py-4 ${trackClassName}`}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
