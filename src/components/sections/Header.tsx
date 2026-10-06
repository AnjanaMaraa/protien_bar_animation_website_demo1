/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Dynamic Header Component
 * Sticky navigational engine implementing scroll direction tracking,
 * frosted-glass backdrop transitions, and mobile slide-out navigation.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Menu, X, ArrowRight, MapPin } from 'lucide-react';
import { useScrollDirection } from '@/hooks/useScrollDirection.ts';
import type { NavigationItem } from '@/types/index.ts';

interface HeaderProps {
  cartCount?: number;
  onOpenCart?: () => void;
  onOpenSearch?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

const DEFAULT_NAV_ITEMS: NavigationItem[] = [
  { id: 'all', label: 'Shop All', href: '#shop-all' },
  { id: 'bundle', label: 'Bundle & Save', href: '#bundle' },
  { id: 'science', label: 'The Science', href: '#science' },
];

export function Header({
  cartCount = 0,
  onOpenCart,
  onOpenSearch,
  onNavigateSection,
}: HeaderProps) {
  const direction = useScrollDirection({ topThreshold: 60, directionThreshold: 12 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // States derived from directional scroll
  const isHidden = direction === 'down';
  const isTop = direction === 'top';

  // FUTURE INTEGRATION POINT: Connect cartCount to Shopify Cart API or Zustand cart store.
  // When line items are added, trigger micro-bounce animation on the cart bag icon.

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        // PERFORMANCE OPTIMIZATION: Hardware-accelerate transform transitions using GPU layers (translateZ: 0).
        animate={{
          y: isHidden ? '-100%' : '0%',
          backgroundColor: isTop ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0.85)',
          backdropFilter: isTop ? 'blur(0px)' : 'blur(16px)',
          borderBottomColor: isTop ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 0.08)',
        }}
        // FLEXIBILITY TIP: Modify the transition ease curve (0.16, 1, 0.3, 1) to alter the snappiness
        // of header reveal when scrolling upwards.
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-40 h-20 w-full border-b transition-colors"
      >
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 md:px-10 lg:px-12">
          
          {/* DESKTOP LEFT: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {DEFAULT_NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.id)}
                className="group relative text-xs uppercase tracking-[0.18em] font-medium text-white/80 transition-colors hover:text-white"
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1.5 text-[9px] font-mono tracking-widest text-[#A5C9EB]">
                    [{item.badge}]
                  </span>
                )}
                {/* Subtle underline hover effect without layout shift */}
                <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* TABLET / MOBILE LEFT: Hamburger Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation menu"
              className="p-2 text-white/90 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* CENTER: Logo Branding */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex flex-col items-center select-none"
            >
              <span className="font-serif text-3xl md:text-4xl tracking-[-0.04em] font-semibold text-white transition-opacity duration-300 group-hover:opacity-90">
                DigiMaraa Nutrition
              </span>
              <span className="text-[8px] font-mono tracking-[0.35em] uppercase text-white/40 -mt-1 group-hover:text-[#D4AF37] transition-colors">
                28g Protein · 150 Cal
              </span>
            </a>
          </div>

          {/* RIGHT: Actions & Utility Items */}
          <div className="flex items-center gap-3 sm:gap-5 md:gap-6">
            {/* Store Locator Link (Desktop) */}
            <a
              href="#locator"
              onClick={(e) => handleNavClick(e, '#locator', 'locator')}
              className="hidden xl:flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-white/70 hover:text-white transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
              <span>Locate</span>
            </a>

            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              aria-label="Search catalog"
              className="p-2 text-white/80 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
            >
              <Search className="h-4 w-4 md:h-5 md:w-5" />
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              aria-label={`Shopping Cart with ${cartCount} items`}
              className="group relative flex items-center gap-2 rounded-full border border-white/15 bg-white/5 py-2 px-3.5 md:px-4 text-xs font-medium uppercase tracking-wider text-white transition-all duration-300 hover:border-[#D4AF37] hover:bg-white/10"
            >
              <ShoppingBag className="h-4 w-4 text-[#D4AF37] transition-transform duration-300 group-hover:scale-110" />
              <span className="hidden sm:inline text-[11px] tracking-[0.15em]">Cart</span>
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#D4AF37] px-1 text-[10px] font-bold text-black">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* MOBILE / TABLET SLIDE-OUT FLYOUT NAVIGATION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-8"
          >
            {/* Flyout Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <span className="font-serif text-3xl font-semibold text-white tracking-tight">
                DigiMaraa Nutrition
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 text-white/80 hover:text-white focus-visible:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Link Stack */}
            <nav className="flex flex-col gap-6 my-auto py-8">
              {DEFAULT_NAV_ITEMS.map((item, index) => (
                <motion.a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.4 }}
                  className="group flex items-center justify-between py-2 text-2xl md:text-3xl font-serif text-white hover:text-[#D4AF37] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-xs font-mono tracking-widest text-[#A5C9EB] uppercase">
                        [{item.badge}]
                      </span>
                    )}
                  </div>
                  <ArrowRight className="h-5 w-5 text-white/30 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all" />
                </motion.a>
              ))}
            </nav>

            {/* Flyout Footer Utility */}
            <div className="pt-6 border-t border-white/10 flex flex-col gap-4 text-xs font-mono uppercase tracking-widest text-white/60">
              <div className="flex items-center justify-between">
                <span>Free US Shipping on Cartons</span>
                <span className="text-[#D4AF37]">75% Protein Cal</span>
              </div>
              <p className="text-white/40 normal-case font-sans text-xs">
                Engineered for maximum bio-density. 28g protein per 150 calories.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
