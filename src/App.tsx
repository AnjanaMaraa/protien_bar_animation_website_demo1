/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DigiMaraa Nutrition Flagship Web Application
 * Master layout combining the Cinematic Hero, Dynamic Scroll Header,
 * Draggable Universal Carousel, Bundle Constructor, Scientific Validation,
 * and Protein Efficiency Comparators.
 */

import React, { useState } from 'react';
import { PromoTicker } from './components/sections/PromoTicker.tsx';
import { Header } from './components/sections/Header.tsx';
import { Hero } from './components/sections/Hero.tsx';
import { Gateways } from './components/sections/Gateways.tsx';
import { BestSellers } from './components/sections/BestSellers.tsx';
import { BundleConstructor } from './components/sections/BundleConstructor.tsx';
import { ScientificValidation } from './components/sections/ScientificValidation.tsx';
import { ReviewsMatrix } from './components/sections/ReviewsMatrix.tsx';
import { Comparators } from './components/sections/Comparators.tsx';
import { Footer } from './components/sections/Footer.tsx';
import { CartDrawer } from './components/ui/CartDrawer.tsx';
import { QuickViewModal } from './components/ui/QuickViewModal.tsx';
import { PRODUCTS_CATALOG } from './data/products.ts';
import type { Product, CartItem, BundleTier } from './types/index.ts';
import { Search, X, Check } from 'lucide-react';

export default function App() {
  // Global Shopping Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'default-gold',
      product: PRODUCTS_CATALOG[0],
      quantity: 1,
      packSize: 12,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkoutNotification, setCheckoutNotification] = useState(false);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `item-${Date.now()}-${product.id}`,
          product,
          quantity: 1,
          packSize: 12,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleAddBundleToCart = (tier: BundleTier, selectedFlavors: string[]) => {
    // Generate bundle item
    const bundleProduct: Product = {
      id: `bundle-${tier.id}-${Date.now()}`,
      title: `${tier.title} (${tier.cartonsCount} Cartons)`,
      collection: 'bundles',
      price: tier.priceTotal,
      rawProteinAmount: 28,
      calories: 150,
      sugarAmount: 0,
      imageSrc: PRODUCTS_CATALOG[0].imageSrc,
      description: `Custom bundle: ${tier.barsTotal} bars total. ${tier.bonusGift ? `Includes ${tier.bonusGift}.` : ''}`,
      isBestSeller: true,
      colorTheme: 'gold',
      efficiencyPercentage: 75,
    };

    setCartItems((prev) => [
      ...prev,
      {
        id: `bundle-${Date.now()}`,
        product: bundleProduct,
        quantity: 1,
        packSize: tier.barsTotal,
        customFlavorMix: selectedFlavors,
      },
    ]);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    setCheckoutNotification(true);
    setTimeout(() => {
      setCheckoutNotification(false);
      setIsCartOpen(false);
    }, 2500);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Filtered products for search modal
  const searchResults = searchQuery.trim()
    ? PRODUCTS_CATALOG.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.collection.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : PRODUCTS_CATALOG;

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white antialiased">
      {/* 1 & 2. FIXED TOP BAR: PROMO TICKER + DYNAMIC SCROLL HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full">
        <PromoTicker />
        <Header
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onNavigateSection={scrollToSection}
        />
      </div>

      {/* 3. CINEMATIC HERO COMPONENT (CANVAS + FALLBACK) */}
      <Hero
        onShopClick={() => scrollToSection('shop-all')}
        onExploreScience={() => scrollToSection('science')}
      />

      {/* 4. INTERACTIVE CATALOG GATEWAYS (4-COLUMN GRID) */}
      <Gateways
        onSelectCategory={(id) => {
          if (id === 'bundle-gateway') scrollToSection('bundle');
          else if (id === 'science-gateway') scrollToSection('science');
          else scrollToSection('shop-all');
        }}
      />

      {/* 5. BEST SELLERS & UNIVERSAL DRAGGABLE CAROUSEL */}
      <BestSellers
        products={PRODUCTS_CATALOG}
        onAddToCart={handleAddToCart}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* 6. BUNDLE CONSTRUCTOR (MULTI-PACK TIERS) */}
      <BundleConstructor onAddBundleToCart={handleAddBundleToCart} />

      {/* 7. SCIENTIFIC VALIDATION SECTION (DR. ANDREW HUBERMAN) */}
      <ScientificValidation />

      {/* 8. PROTEIN EFFICIENCY COMPARATORS (BAR CHART + MACRO MATRIX) */}
      <Comparators />

      {/* 9. SOCIAL PROOF GRID (UGC VIDEO TESTIMONIALS) */}
      <ReviewsMatrix />

      {/* 10. GLOBAL FOOTER HUB */}
      <Footer />

      {/* 11. DYNAMIC SLIDING CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* 12. NUTRITIONAL QUICK VIEW MODAL */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* 13. QUICK SEARCH MODAL */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[90] flex items-start justify-center pt-24 px-4">
          <div
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />
          <div className="relative z-10 w-full max-w-xl rounded-xl border border-white/20 bg-[#0e0e0e] p-6 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
              <Search className="h-5 w-5 text-[#D4AF37]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search flavors, 28g bars, pints, macros..."
                className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none font-sans"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-white/5 scrollbar-none">
              {searchResults.length === 0 ? (
                <div className="py-8 text-center text-xs font-mono text-white/40">
                  No formulations found matching "{searchQuery}"
                </div>
              ) : (
                searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setQuickViewProduct(product);
                      setIsSearchOpen(false);
                    }}
                    className="py-3 flex items-center justify-between cursor-pointer hover:bg-white/[0.03] px-2 rounded transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imageSrc}
                        alt={product.title}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <div>
                        <div className="font-serif text-sm text-white">{product.title}</div>
                        <div className="text-[10px] font-mono text-[#D4AF37]">
                          {product.rawProteinAmount}g Protein · {product.calories} Cal
                        </div>
                      </div>
                    </div>
                    <span className="font-serif text-sm text-white">${product.price.toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT SIMULATION NOTIFICATION */}
      {checkoutNotification && (
        <div className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 bg-[#D4AF37] text-black px-6 py-4 rounded-lg shadow-2xl font-mono text-xs font-bold uppercase tracking-wider animate-bounce">
          <Check className="h-5 w-5 stroke-[3]" />
          <span>Shopify Checkout Route Initialized</span>
        </div>
      )}
    </div>
  );
}
