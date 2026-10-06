/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Best Sellers & Catalog Section
 * Apple-style vertical-scroll-controlled horizontal card showcase.
 * Driven by GSAP ScrollTrigger pinning and hardware-accelerated scrubbed translation.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProductCard } from '@/components/ui/ProductCard.tsx';
import type { Product, ProductCollectionType } from '@/types/index.ts';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface BestSellersProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

interface DisplayCard extends Product {
  uniqueKey: string;
}

export function BestSellers({ products, onAddToCart, onQuickView }: BestSellersProps) {
  const [activeFilter, setActiveFilter] = useState<ProductCollectionType | 'all'>('all');

  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // Filter products based on active collection
  const filteredBaseProducts = useMemo(() => {
    const list = activeFilter === 'all'
      ? products
      : products.filter((p) => p.collection === activeFilter);
    return list.length > 0 ? list : products;
  }, [products, activeFilter]);

  // Duplicate cards to produce approximately 14–16 cards (16 cards total)
  // Ensures reliable fallback for any broken external image URLs
  const duplicatedCards: DisplayCard[] = useMemo(() => {
    const targetCount = 16;
    const cards: DisplayCard[] = [];

    for (let i = 0; i < targetCount; i++) {
      const baseProduct = filteredBaseProducts[i % filteredBaseProducts.length];
      
      // Fallback for broken Unsplash image if applicable
      const sanitizedImageSrc =
        baseProduct.id === 'digimaraa-gold-cookie-dough'
          ? (baseProduct.secondaryImageSrc || 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?q=80&w=800&auto=format&fit=crop')
          : baseProduct.imageSrc;

      cards.push({
        ...baseProduct,
        imageSrc: sanitizedImageSrc,
        uniqueKey: `${baseProduct.id}-scroll-${i}`,
      });
    }

    return cards;
  }, [filteredBaseProducts]);

  // Setup GSAP ScrollTrigger for vertical scroll pinned horizontal card track
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const viewport = viewportRef.current;

    if (!section || !track || !viewport) return;

    // Calculate dynamic travel distance: Track Width minus Viewport Width
    const getTravelDistance = () => {
      if (!track) return 0;
      const trackWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      // Account for end padding so the last card has breathing room
      const endPadding = window.innerWidth >= 768 ? 80 : 32;
      return Math.max(0, trackWidth - viewportWidth + endPadding);
    };

    // Kill any existing ScrollTriggers on this section to prevent duplicate pins
    const existingTriggers = ScrollTrigger.getAll().filter(
      (st) => st.trigger === section
    );
    existingTriggers.forEach((st) => st.kill());

    // Reset track position before re-attaching
    gsap.set(track, { x: 0 });

    const ctx = gsap.context(() => {
      // Horizontal slide tween scrubbed by vertical scroll
      gsap.to(track, {
        x: () => -getTravelDistance(),
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: section,
          pin: true,
          start: 'top top',
          end: () => `+=${Math.max(window.innerHeight * 1.5, getTravelDistance())}`,
          scrub: 1, // Smooth inertial scrub
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, section);

    // Refresh after DOM and images settle
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [duplicatedCards]);

  return (
    <section
      ref={sectionRef}
      id="shop-all"
      className="relative w-full bg-black border-b border-white/10 overflow-hidden"
    >
      <div className="relative w-full h-screen flex flex-col justify-between py-6 sm:py-8 md:py-10 overflow-hidden">
        {/* 1. SECTION HEADER & FILTER CONTROLS */}
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12 flex-none">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 pb-4 sm:pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-1 sm:mb-2">
                Signature Formulations · Section 04
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white">
                The Catalog
              </h2>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/60 max-w-lg font-sans">
                Choose between the flagship 28g Gold formulation, the 20g Bronze daily line, 
                or our high-protein churned frozen pints.
              </p>
            </div>

            {/* ZERO-PILL SEGMENTED FILTER BUTTONS */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Products' },
                { id: 'bars-gold', label: 'Gold (28g)' },
                { id: 'bars-bronze', label: 'Bronze (20g)' },
                { id: 'pints', label: 'Pints (36g)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as ProductCollectionType | 'all')}
                  className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-colors rounded ${
                    activeFilter === tab.id
                      ? 'bg-white/20 text-white font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. STICKY CONTAINER & HORIZONTAL CARD TRACK */}
        <div
          ref={viewportRef}
          className="relative w-full flex-1 flex items-center overflow-hidden my-auto py-2 sm:py-4 select-none"
        >
          <div
            ref={trackRef}
            className="flex items-center gap-5 sm:gap-6 px-6 md:px-12 w-max will-change-transform"
            style={{ transform: 'translate3d(0, 0, 0)' }}
          >
            {duplicatedCards.map((product) => (
              <div
                key={product.uniqueKey}
                className="flex-none shrink-0"
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onQuickView={onQuickView}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 3. SECTION FOOTER WITH SCROLL HINT */}
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-12 flex-none flex items-center justify-between text-[11px] sm:text-xs font-mono uppercase tracking-widest text-white/40 pt-2 sm:pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span>Scroll down to advance formulations</span>
          </div>
          <span className="hidden sm:inline">100% Satisfaction Guarantee · 16 Products</span>
        </div>
      </div>
    </section>
  );
}

export default BestSellers;
