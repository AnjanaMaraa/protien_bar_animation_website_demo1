/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Luxury Product Showcase Card
 * Interactive card displaying product imagery, nutrition macro breakdown,
 * and quick-add actions with theme-based metallic borders.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Eye } from 'lucide-react';
import type { Product } from '@/types/index.ts';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Theme-specific styles
  const isGold = product.colorTheme === 'gold';
  const isBronze = product.colorTheme === 'bronze';
  const isIce = product.colorTheme === 'ice';

  const accentColor = isGold ? '#D4AF37' : isBronze ? '#CD7F32' : isIce ? '#A5C9EB' : '#FFFFFF';
  const borderHoverClass = isGold
    ? 'hover:border-[#D4AF37]/60 hover:shadow-[0_0_25px_-5px_rgba(212,175,55,0.25)]'
    : isBronze
    ? 'hover:border-[#CD7F32]/60 hover:shadow-[0_0_25px_-5px_rgba(205,127,50,0.25)]'
    : isIce
    ? 'hover:border-[#A5C9EB]/60 hover:shadow-[0_0_25px_-5px_rgba(165,201,235,0.25)]'
    : 'hover:border-white/40';

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1400);
    }
  };

  // FUTURE INTEGRATION POINT: Link directly to Shopify Product Detail Page (PDP) via Next.js <Link> or router.push
  // with URL parameter `/products/${product.id}`.

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex-none w-[300px] sm:w-[320px] rounded-lg border border-white/10 bg-[#0d0d0d] p-5 transition-all duration-300 flex flex-col justify-between ${borderHoverClass}`}
    >
      <div>
        {/* TOP STATUS LINE (Zero-Pill Restraint: unboxed typography) */}
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] mb-4">
          <span style={{ color: accentColor }}>
            {product.rawProteinAmount}g Protein
          </span>
          <span className="text-white/40">
            {product.calories} Cal · {product.sugarAmount}g Sugar
          </span>
        </div>

        {/* IMAGE MEDIA CONTAINER */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-black/60 mb-5">
          <img
            src={isHovered && product.secondaryImageSrc ? product.secondaryImageSrc : product.imageSrc}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Quick View Trigger on Hover */}
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/75 text-white/80 backdrop-blur-md opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:text-white hover:bg-black"
              aria-label="Quick view nutrition details"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}

          {/* Caloric Efficiency Badge Overlay */}
          {product.efficiencyPercentage && (
            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md border border-white/10 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-white">
              <span style={{ color: accentColor }}>{product.efficiencyPercentage}%</span> Cal From Protein
            </div>
          )}
        </div>

        {/* PRODUCT TITLES & ATTRIBUTES */}
        <div className="mb-2">
          {product.flavorSubtitle && (
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block mb-1">
              {product.flavorSubtitle}
            </span>
          )}
          <h3 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-white group-hover:text-white/95">
            {product.title}
          </h3>
        </div>

        <p className="line-clamp-2 text-xs text-white/60 font-sans leading-relaxed mb-4">
          {product.description}
        </p>
      </div>

      {/* FOOTER ACTIONS: Price & Direct Cart Injection */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <div>
          <span className="text-base font-serif font-medium text-white">
            ${product.price.toFixed(2)}
          </span>
          <span className="ml-1 text-[10px] font-mono uppercase tracking-wider text-white/40">
            / 12-pack
          </span>
        </div>

        <button
          onClick={handleAdd}
          disabled={justAdded}
          className={`flex items-center gap-1.5 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.16em] font-semibold transition-all duration-200 rounded ${
            justAdded
              ? 'bg-emerald-500 text-black'
              : isGold
              ? 'bg-[#D4AF37] hover:bg-[#e0bc42] text-black active:scale-95'
              : isBronze
              ? 'bg-[#CD7F32] hover:bg-[#d88d44] text-black active:scale-95'
              : 'bg-white hover:bg-white/90 text-black active:scale-95'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
