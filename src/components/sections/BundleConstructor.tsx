/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Bundle Constructor Section
 * Interactive multi-pack configuration engine designed to increase Average Order Value (AOV).
 * Features live pricing recalculations, free shipping indicators, and gift unlocks.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, Gift, Truck, ArrowRight } from 'lucide-react';
import { BUNDLE_TIERS } from '@/data/products.ts';
import type { BundleTier, Product } from '@/types/index.ts';

interface BundleConstructorProps {
  onAddBundleToCart?: (tier: BundleTier, selectedFlavors: string[]) => void;
}

const AVAILABLE_FLAVORS = [
  'Chocolate Chip Cookie Dough (28g)',
  'Salted Caramel Crunch (28g)',
  'Midnight Dark Chocolate (28g)',
  'Roasted Peanut Butter Swirl (20g)',
];

export function BundleConstructor({ onAddBundleToCart }: BundleConstructorProps) {
  const [selectedTier, setSelectedTier] = useState<BundleTier>(BUNDLE_TIERS[1]); // Default to 3-pack
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([
    'Chocolate Chip Cookie Dough (28g)',
    'Salted Caramel Crunch (28g)',
    'Midnight Dark Chocolate (28g)',
  ]);
  const [frequency, setFrequency] = useState<'one-time' | 'subscribe'>('subscribe');
  const [justAdded, setJustAdded] = useState(false);

  // FUTURE INTEGRATION POINT: Connect tier pricing directly to Shopify Subscription API
  // (e.g. Recharge or Shopify Subscriptions app) for automated recurring orders.

  const subscriptionDiscount = frequency === 'subscribe' ? 0.10 : 0;
  const finalPrice = selectedTier.priceTotal * (1 - subscriptionDiscount);
  const finalPricePerBar = finalPrice / selectedTier.barsTotal;

  const handleAdd = () => {
    if (onAddBundleToCart) {
      onAddBundleToCart(selectedTier, selectedFlavors);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1600);
    }
  };

  return (
    <section id="bundle" className="relative w-full bg-[#0a0a0a] py-24 md:py-32 border-b border-white/10">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: HIGH-INTENSITY LIFESTYLE & PACKAGING MEDIA */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full overflow-hidden rounded-lg border border-white/15 bg-black">
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop"
                alt="DigiMaraa Nutrition Athlete Bundle"
                loading="lazy"
                className="h-full w-full object-cover object-center filter brightness-90 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

              {/* Floating Value Proposition Card */}
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-md bg-black/85 backdrop-blur-md border border-white/15">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#D4AF37] mb-2">
                  <Shield className="h-4 w-4" />
                  <span>The Bio-Hacker Bundle</span>
                </div>
                <h4 className="font-serif text-2xl text-white font-medium mb-1">
                  Peak Protein Protocol
                </h4>
                <p className="text-xs text-white/70 font-sans leading-relaxed">
                  Engineered for athletes consuming 1g of protein per pound of body weight. 
                  Zero fillers. 75% pure caloric efficiency.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE CARTON CONSTRUCTOR & PRICING ENGINE */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            <div className="mb-8">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-2">
                Custom Volume Configuration · Section 03
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white">
                Build Your Protocol
              </h2>
              <p className="mt-2 text-sm text-white/60 font-sans leading-relaxed">
                Mix and match flavors across 12-bar cartons. Unlock up to 25% volume savings 
                plus complimentary performance gifts.
              </p>
            </div>

            {/* ONE-TIME VS SUBSCRIBE TOGGLE */}
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-black border border-white/15 rounded-md mb-6">
              <button
                onClick={() => setFrequency('subscribe')}
                className={`flex flex-col items-center py-2.5 px-3 text-xs font-mono uppercase tracking-wider rounded transition-all ${
                  frequency === 'subscribe'
                    ? 'bg-white/15 text-white font-semibold shadow-inner'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <span>Subscribe & Save (Extra 10%)</span>
                <span className="text-[10px] text-[#D4AF37] mt-0.5 normal-case font-sans">
                  Flexible · Cancel anytime
                </span>
              </button>

              <button
                onClick={() => setFrequency('one-time')}
                className={`flex flex-col items-center py-2.5 px-3 text-xs font-mono uppercase tracking-wider rounded transition-all ${
                  frequency === 'one-time'
                    ? 'bg-white/15 text-white font-semibold shadow-inner'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <span>One-Time Purchase</span>
                <span className="text-[10px] text-white/40 mt-0.5 normal-case font-sans">
                  Standard volume rates
                </span>
              </button>
            </div>

            {/* TIER SELECTOR CARDS */}
            <div className="flex flex-col gap-3 mb-6">
              {BUNDLE_TIERS.map((tier) => {
                const isSelected = selectedTier.id === tier.id;
                const tierPrice = tier.priceTotal * (1 - subscriptionDiscount);

                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTier(tier)}
                    className={`relative cursor-pointer rounded-lg border p-4 transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? 'border-[#D4AF37] bg-white/[0.04] shadow-[0_0_20px_-5px_rgba(212,175,55,0.2)]'
                        : 'border-white/10 bg-black/40 hover:border-white/25 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 rounded-full border items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                            : 'border-white/30 bg-transparent'
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-lg font-medium text-white">
                            {tier.title}
                          </span>
                          {tier.discountPercentage > 0 && (
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/30 px-1.5 py-0.5 rounded">
                              Save {tier.discountPercentage + (frequency === 'subscribe' ? 10 : 0)}%
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-white/50 font-sans mt-0.5">
                          {tier.barsTotal} bars total · ${ (tierPrice / tier.barsTotal).toFixed(2) } per bar
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-serif text-xl font-medium text-white">
                        ${tierPrice.toFixed(2)}
                      </div>
                      {tier.freeShipping && (
                        <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                          Free Shipping
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BONUS UNLOCK BANNER */}
            {selectedTier.bonusGift && (
              <div className="flex items-center gap-3 p-3.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs text-[#F3E5AB] mb-6">
                <Gift className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>
                  <strong>Unlocked Gift:</strong> {selectedTier.bonusGift}
                </span>
              </div>
            )}

            {/* DIRECT CTA BUTTON */}
            <button
              onClick={handleAdd}
              disabled={justAdded}
              className={`w-full flex items-center justify-center gap-3 py-4 px-8 text-xs font-mono uppercase tracking-[0.2em] font-bold rounded transition-all duration-300 ${
                justAdded
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[#D4AF37] hover:bg-[#e0bc42] text-black shadow-[0_0_30px_-5px_rgba(212,175,55,0.4)] hover:scale-[1.01]'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Bundle Added to Cart</span>
                </>
              ) : (
                <>
                  <span>Add {selectedTier.cartonsCount} Carton Bundle — ${finalPrice.toFixed(2)}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* REASSURANCE LINE */}
            <div className="mt-4 flex items-center justify-center gap-6 text-[11px] font-mono uppercase tracking-widest text-white/40">
              <span className="flex items-center gap-1.5">
                <Truck className="h-3 w-3 text-white/60" /> Free US Shipping
              </span>
              <span>·</span>
              <span>100% Assayed Whey Isolate</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
