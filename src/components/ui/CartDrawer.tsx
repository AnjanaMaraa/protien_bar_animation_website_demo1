/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Dynamic Sliding Cart Drawer
 * High-performance sliding cart drawer with physics-based spring transitions,
 * free shipping progress bar, and volume tier savings integration.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import type { CartItem } from '@/types/index.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout?: () => void;
}

const FREE_SHIPPING_THRESHOLD = 75.00;

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // FUTURE INTEGRATION POINT: Link directly to Shopify Storefront cart create/checkout URL
  // e.g. window.location.href = data.cartCreate.cart.checkoutUrl

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm"
          />

          {/* SLIDING DRAWER NODE */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            // Specifications: Motion spring stiffness: 380, damping: 38
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            className="fixed top-0 right-0 bottom-0 z-[80] w-full max-w-md bg-[#0a0a0a] border-l border-white/15 flex flex-col justify-between shadow-2xl"
          >
            {/* DRAWER HEADER */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-2xl font-medium text-white">
                    Your Protocol
                  </span>
                  <span className="text-xs font-mono text-[#D4AF37]">
                    ({items.reduce((sum, i) => sum + i.quantity, 0)} Items)
                  </span>
                </div>

                <button
                  onClick={onClose}
                  aria-label="Close cart drawer"
                  className="p-2 text-white/60 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* FREE SHIPPING PROGRESS BAR */}
              <div className="rounded bg-black/60 border border-white/10 p-3">
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5 text-white/80">
                    <Truck className="h-3.5 w-3.5 text-[#D4AF37]" />
                    {remainingForFreeShipping === 0
                      ? 'Complimentary US Shipping Unlocked'
                      : `Add $${remainingForFreeShipping.toFixed(2)} for Free Shipping`}
                  </span>
                  <span className="text-[#D4AF37] font-bold">
                    {Math.round(freeShippingProgress)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#CD7F32] to-[#D4AF37] transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* CART ITEMS SCROLL VIEWPORT */}
            <div className="flex-1 overflow-y-auto p-6 divide-y divide-white/10 scrollbar-none">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mb-4 font-serif text-2xl">
                    0
                  </div>
                  <h4 className="font-serif text-xl text-white mb-2">Your Cart is Empty</h4>
                  <p className="text-xs font-sans text-white/50 max-w-xs mb-6">
                    Add our 28g Gold formulation or high-protein pints to begin your nutrition protocol.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-[#D4AF37] text-black font-mono text-xs uppercase tracking-widest font-semibold rounded hover:bg-[#e0bc42] transition-colors"
                  >
                    Explore Products
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="py-4 flex gap-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded bg-black/60 border border-white/10">
                      <img
                        src={item.product.imageSrc}
                        alt={item.product.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-serif text-sm font-medium text-white leading-tight">
                            {item.product.title}
                          </h5>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            aria-label="Remove item"
                            className="text-white/40 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] block mt-0.5">
                          {item.product.rawProteinAmount}g Protein · 150 Cal
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-white/15 rounded bg-black/40">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 text-white/60 hover:text-white"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 text-xs font-mono font-medium text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 text-white/60 hover:text-white"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <span className="font-serif text-sm font-medium text-white">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* DRAWER FOOTER */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/80 backdrop-blur-md">
                <div className="flex items-center justify-between text-xs font-mono text-white/60 mb-2">
                  <span>Subtotal</span>
                  <span className="font-serif text-lg font-medium text-white">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-white/40 mb-4">
                  <span>Shipping & Taxes</span>
                  <span>{remainingForFreeShipping === 0 ? 'FREE' : 'Calculated at checkout'}</span>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#D4AF37] hover:bg-[#e0bc42] text-black font-mono text-xs uppercase tracking-[0.2em] font-bold rounded shadow-[0_0_25px_-5px_rgba(212,175,55,0.4)] transition-all duration-300"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Encrypted 256-Bit SSL Checkout</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
