/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Social Proof Grid & UGC Video Feedback Loops
 * Section 6: High-engagement video cards with inline playback mechanics,
 * verified buyer metrics, and continuous community testimonials.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Heart, ShieldCheck, Star } from 'lucide-react';
import { SOCIAL_REVIEWS } from '@/data/products.ts';
import type { SocialProofVideo } from '@/types/index.ts';

export function ReviewsMatrix() {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const togglePlay = (id: string) => {
    setPlayingVideoId((prev) => (prev === id ? null : id));
  };

  // FUTURE INTEGRATION POINT: Connect UGC video nodes to Okendo, Loox, or TikTok Pixel feeds

  return (
    <section className="relative w-full bg-[#080808] py-24 md:py-32 border-b border-white/10">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-12">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-2">
              Community Protocols · Section 06
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white">
              Field Validated
            </h2>
            <p className="mt-2 text-sm text-white/60 max-w-xl font-sans">
              From elite Olympic lifters to continuous glucose monitor wearers, 
              hear unfiltered feedback from athletes operating at their biological limits.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-white/60">
            <div className="flex text-[#D4AF37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#D4AF37]" />
              ))}
            </div>
            <span>4.9 / 5.0 (2,400+ Verified Reviews)</span>
          </div>
        </div>

        {/* 3-COLUMN UGC VIDEO & REVIEW GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {SOCIAL_REVIEWS.map((review) => {
            const isPlaying = playingVideoId === review.id;

            return (
              <div
                key={review.id}
                className="group relative rounded-xl border border-white/10 bg-[#0d0d0d] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-white/30"
              >
                {/* VIDEO THUMBNAIL CONTAINER */}
                <div
                  onClick={() => togglePlay(review.id)}
                  className="relative aspect-[9/12] w-full cursor-pointer overflow-hidden bg-black"
                >
                  <img
                    src={review.thumbnailUrl}
                    alt={review.authorName}
                    loading="lazy"
                    className="h-full w-full object-cover object-center filter brightness-90 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {/* Play / Pause Interactive Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 border border-white/30 backdrop-blur-md text-white transition-transform duration-300 group-hover:scale-110 group-hover:border-[#D4AF37]">
                      {isPlaying ? (
                        <Pause className="h-6 w-6 text-[#D4AF37]" />
                      ) : (
                        <Play className="h-6 w-6 fill-white ml-1 text-white" />
                      )}
                    </div>
                  </div>

                  {/* TOP OVERLAYS: METRIC CALLOUT */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="bg-black/75 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-[#D4AF37]">
                      {review.metricHighlight}
                    </span>
                    <span className="text-[10px] font-mono text-white/60 bg-black/60 px-2 py-0.5 rounded">
                      {review.videoDuration}
                    </span>
                  </div>

                  {/* BOTTOM OVERLAYS: AUTHOR & FAVORITE FLAVOR */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-white mb-1">
                      <span className="font-semibold">{review.authorName}</span>
                      <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF37]" />
                    </div>
                    <div className="text-[10px] font-sans text-white/60">
                      Fav: {review.favoriteFlavor}
                    </div>
                  </div>
                </div>

                {/* REVIEW QUOTE & SOCIAL ENGAGEMENT */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <p className="font-serif text-base text-white/90 leading-snug mb-4 italic">
                    "{review.quote}"
                  </p>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
                    <span className="text-white/40">{review.authorHandle}</span>
                    <div className="flex items-center gap-1 text-white/60">
                      <Heart className="h-3.5 w-3.5 fill-red-500/20 text-red-400" />
                      <span>{review.likesCount}</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
