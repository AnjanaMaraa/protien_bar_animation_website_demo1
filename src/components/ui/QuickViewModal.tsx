/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Nutrition & Quick View Modal
 * Displays comprehensive third-party lab assay, ingredients, and full macro profile.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShieldCheck, Plus, Sparkles } from 'lucide-react';
import type { Product } from '@/types/index.ts';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function QuickViewModal({ product, onClose, onAddToCart }: QuickViewModalProps) {
  if (!product) return null;

  const accentColor =
    product.colorTheme === 'gold'
      ? '#D4AF37'
      : product.colorTheme === 'bronze'
      ? '#CD7F32'
      : product.colorTheme === 'ice'
      ? '#A5C9EB'
      : '#FFFFFF';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[85] flex items-center justify-center p-4 sm:p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-xl border border-white/20 bg-[#0e0e0e] shadow-2xl p-6 sm:p-8"
        >
          {/* CLOSE TRIGGER */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 p-2 text-white/60 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* MEDIA PREVIEW */}
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black border border-white/10">
              <img
                src={product.imageSrc}
                alt={product.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-white border border-white/10">
                <span style={{ color: accentColor }}>{product.efficiencyPercentage}%</span> Cal From Protein
              </div>
            </div>

            {/* NUTRITIONAL BREAKDOWN */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-1">
                Lab Assayed Formulation
              </span>
              <h3 className="font-serif text-2xl font-normal text-white mb-2">
                {product.title}
              </h3>
              <p className="text-xs font-sans text-white/70 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* NUTRITION FACTS CARD */}
              <div className="p-3.5 rounded bg-black/60 border border-white/10 mb-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-white/50 border-b border-white/10 pb-1 mb-2">
                  Nutrition Facts · Per 1 Bar (50g)
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="font-serif text-lg font-bold text-white">{product.rawProteinAmount}g</div>
                    <div className="text-[9px] font-mono uppercase text-white/40">Protein</div>
                  </div>
                  <div>
                    <div className="font-serif text-lg font-bold text-[#D4AF37]">{product.calories}</div>
                    <div className="text-[9px] font-mono uppercase text-white/40">Calories</div>
                  </div>
                  <div>
                    <div className="font-serif text-lg font-bold text-white">{product.sugarAmount}g</div>
                    <div className="text-[9px] font-mono uppercase text-white/40">Sugar</div>
                  </div>
                  <div>
                    <div className="font-serif text-lg font-bold text-white">{product.fatAmount || 2.5}g</div>
                    <div className="text-[9px] font-mono uppercase text-white/40">Fat</div>
                  </div>
                </div>
              </div>

              {/* INGREDIENTS LIST */}
              {product.ingredientsList && (
                <div className="mb-5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">
                    Ingredients:
                  </span>
                  <p className="text-[11px] text-white/60 font-sans leading-relaxed">
                    {product.ingredientsList.join(', ')}.
                  </p>
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div className="font-serif text-xl font-medium text-white">
                  ${product.price.toFixed(2)}
                  <span className="text-[10px] font-mono uppercase text-white/40 ml-1">/ 12-pack</span>
                </div>

                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] hover:bg-[#e0bc42] text-black font-mono text-xs uppercase tracking-wider font-semibold rounded transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
