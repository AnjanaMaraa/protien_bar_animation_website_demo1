/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DigiMaraa Nutrition Architecture - Global System Type Definitions
 * Strict TypeScript models for Catalog, Motion Engines, Cart & Analytics.
 */

// FUTURE INTEGRATION POINT: When connecting to Shopify Storefront API or Headless CMS
// (Sanity/Strapi), map GraphQL product nodes to this Product contract in your data fetching layer.

export type ProductColorTheme = 'gold' | 'bronze' | 'ice' | 'neutral';

export type ProductCollectionType = 
  | 'bars-gold' 
  | 'bars-bronze' 
  | 'pints' 
  | 'bundles' 
  | 'merch' 
  | 'all';

/**
 * Core Product Entity
 * Strict contract defining nutrition density, pricing, media, and visual theme.
 */
export interface Product {
  id: string;
  title: string;
  collection: ProductCollectionType;
  price: number;
  rawProteinAmount: number; // e.g., 28 (grams)
  calories: number;        // e.g., 150 (kcal)
  sugarAmount: number;     // e.g., 0 (grams)
  imageSrc: string;
  description: string;
  isBestSeller: boolean;
  colorTheme: ProductColorTheme;
  // Extended nutritional & marketing properties
  flavorSubtitle?: string;
  netCarbs?: number;
  fatAmount?: number;
  efficiencyPercentage?: number; // (rawProteinAmount * 4 / calories) * 100
  secondaryImageSrc?: string;
  inStock?: boolean;
  ingredientsList?: string[];
}

/**
 * Cinematic Canvas Image Sequence Engine Configuration
 * Outlined in Section 5 of Technical Architecture Specification.
 */
export interface FrameAnimationConfig {
  sequenceDirectory: string;
  totalFrames: number;
  frameFormat: 'webp' | 'jpg' | 'png';
  onProgress?: (progress: number) => void;
  // FLEXIBILITY TIP: Adjust targetFps to trade between ultra-smooth 60fps playback 
  // and lower memory footprint on budget mobile hardware.
  targetFps?: number;
  preloadChunkSize?: number;
}

/**
 * Scroll Tracking Direction State
 */
export type ScrollDirection = 'up' | 'down' | 'top';

/**
 * Global Navigation Link Contract
 */
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
}

/**
 * Cart Line Item Contract
 */
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  packSize: number; // e.g., 12 bars per carton
  subscriptionFrequency?: 'one-time' | 'every-4-weeks' | 'every-6-weeks';
  customFlavorMix?: string[];
}

/**
 * Protein Efficiency Comparison Brand Profile
 */
export interface ComparisonBrand {
  id: string;
  name: string;
  proteinGrams: number;
  calories: number;
  sugarGrams: number;
  fatGrams: number;
  proteinPercentage: number; // Efficiency: (proteinGrams * 4) / calories * 100
  isFlagship?: boolean;
  colorHex?: string;
  brandTag?: string;
}

/**
 * Detailed Macro Matrix Comparison Row
 */
export interface MacroMatrixRow {
  metric: string;
  digimaraaGold: string | number;
  digimaraaBronze: string | number;
  competitorA: string | number;
  competitorB: string | number;
  competitorC: string | number;
  unit: string;
  isHighlight?: boolean;
}

/**
 * Multi-Pack Direct Bundling Tier
 */
export interface BundleTier {
  id: string;
  title: string;
  cartonsCount: number;
  barsTotal: number;
  discountPercentage: number;
  bonusGift?: string;
  freeShipping: boolean;
  priceTotal: number;
  pricePerBar: number;
  isBestValue?: boolean;
}

/**
 * Scientific Partner & Clinical Validation Profile
 */
export interface ScientificValidationProfile {
  id: string;
  name: string;
  roleTitle: string;
  affiliation: string;
  headshotUrl: string;
  summaryQuote: string;
  fullBiography: string;
  keyFindings: string[];
  podcastEpisodeUrl?: string;
}

/**
 * UGC Social Video Testimonial Card
 */
export interface SocialProofVideo {
  id: string;
  authorHandle: string;
  authorName: string;
  verifiedBuyer: boolean;
  thumbnailUrl: string;
  videoDuration: string;
  metricHighlight: string;
  favoriteFlavor: string;
  quote: string;
  likesCount: string;
}
