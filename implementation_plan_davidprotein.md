# David Protein Website: Complete Implementation Plan & Technical Build Specification

This document serves as a comprehensive, production-ready frontend architecture plan and technical build specification for rebuilding the high-performance e-commerce platform [davidprotein.com](https://davidprotein.com/).

---

## 1. Website Overview

### Purpose
To deliver a high-impact, frictionless Direct-to-Consumer (D2C) e-commerce experience that showcases the brand’s high-protein, low-calorie products. The site serves to educate consumers on unmatched protein density (75% of calories from protein) and facilitate rapid, high-average-order-value (AOV) transactions through visual bundling and direct subscription paths.

### Target Audience
Elite athletes, fitness professionals, biohackers, health-conscious consumers, and followers of premium health platforms (e.g., communities aligned with Dr. Andrew Huberman and Dr. Peter Attia).

### Visual Style & Design System
* **Aesthetic:** Editorial minimalism, high-contrast luxury, clean layout rules, and raw close-up human and product photography.
* **Color Palette:** Pure blacks (`#000000`), deep charcoals (`#121212`), pure whites (`#FFFFFF`), premium metallic golds (`#D4AF37`) for the Gold line, bronze tones (`#CD7F32`) for the Bronze line, and light electric ice-blue (`#A5C9EB`) to designate new frozen product lines (pints).
* **Typography:**
  * **Headings:** High-contrast editorial display serif (e.g., custom Georgia variant or luxury editorial serif).
  * **Body & Labels:** Neo-grotesque sans-serif (e.g., custom clean Sans-Serif or Inter-variant fallbacks) optimized for readability under tight layout conditions.

### Core User Journey
```
[Page Entry] ---> [Hero Section / Brand Hook] ---> [Interactive Catalog Gateways]
                     |                                       |
                     v                                       v
          [Bundle Customizer Form] <--------------- [Best Seller Carousel]
                     |
                     v
           [Dynamic Sliding Cart] ---> [Shopify Checkout]
```

### Navigation & Scrolling Flow
* **Header:** Sticky dynamic navigation with "Hide on Scroll Down / Reveal on Scroll Up" visual states.
* **Layout Transitions:** Block-based vertical progression interspersed with horizontal, physics-based slide selectors and tabbed analytical comparison components.

---

## 2. Complete Site Map

### 1. Root Route (`/`) - Homepage
* **Top Promo Banner:** Dynamic loop ticker.
* **Section 1: Hero Section:** Canvas layout container for cinematic media sequence.
* **Section 2: Interactive Catalog Gateway:** A 4-column viewport layout ("Shop Bars", "Shop Pints", "Subscribe & Save").
* **Section 3: Bundle Constructor:** Split layout containing high-impact lifestyle imagery alongside a direct multi-pack config CTA.
* **Section 4: Best Sellers (Horizontal Card Carousel):** Touch, mouse-drag, and wheel-scrollable card horizontal list.
* **Section 5: Scientific Validation Section:** Dr. Andrew Huberman spotlight panel with dynamic overlay drawer for reading biography details.
* **Section 6: Social Proof Grid:** TikTok/UGC-style video feedback loops using custom HTML5 inline-video-player nodes.
* **Section 7: Protein Efficiency Comparator:** Dynamic horizontal bar graph comparing brand macro-efficiency ratios to market competitors, alongside an interactive "Calories from protein / Macros" toggle switch.
* **Section 8: Footer Global Hub:** Legal, directory, and contact panel.

### 2. Collection Routes
* **Shop All Collections (`/collections/all`):** Integrated catalog grid displaying all bars and pints.
* **Protein Bars Collection (`/collections/bars`):** Dedicated segment showcasing Gold (28g Protein) and Bronze (20g Protein) lines.
* **Pints Collection (`/collections/pints`):** Dedicated segment detailing frozen high-protein flavors.

### 3. Dynamic Modal / Overlay Paths (Globally Accessible)
* **Cart Slider Drawer:** Accessible via the header shopping cart button.
* **Search Panel Overlays:** Accessible via the utility bar magnifying-glass button.
* **Scientific Profile Modal:** Slide-out/Fade-in profile detailing partner bios.

---

## 3. Global Layout System

### Layout Rules & Containers
All layout sections conform to the following container properties to ensure visual alignment:

| Property | Value (Tailwind / CSS) | Description |
| :--- | :--- | :--- |
| **Max Content Width** | `max-w-[1440px]` | Applied to all centered text and structural blocks. |
| **Global Background** | `bg-[#000000]` / `bg-[#121212]` | Consistent deep dark background transitions. |
| **Grid System** | `grid grid-cols-12 gap-6` | Standard structural grid for structural interfaces. |
| **Desktop Page Margins** | `px-8` or `px-12` (`32px` to `48px`) | Standard side-paddings. |
| **Tablet Page Margins** | `px-6` (`24px`) | Standard scaling layout boundaries. |
| **Mobile Page Margins** | `px-4` (`16px`) | Compact layout boundaries. |

### Typography Scale & Hierarchy

```css
--font-serif: "GT Super Display", Georgia, serif;
--font-sans: "Inter", "Helvetica Neue", sans-serif;

h1 {
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 6vw, 5.5rem);
  line-height: 0.95;
  letter-spacing: -0.03em;
}

h2 {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
}

h3 {
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 2.5vw, 2.25rem);
  line-height: 1.1;
}

.label-mono {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
```

---

## 4. Header Specification

### Layout Structure
* **Desktop Layout:** 
  * Left: Navigation Group (`Shop All`, `Bars`, `Pints`, `Bundle`, `About`).
  * Center: Logo branding (`David`).
  * Right: Utility Group (`Store Locator`, `Wholesale`, Search Icon, Profile/Account link, Cart Drawer Trigger).
* **Tablet/Mobile Layout:** Logo positioned to the left; Cart Trigger + Mobile Hamburger Menu placed to the right. Navigation links collapse into a full-screen flyout menu with staggered animations.

### Scroll Interaction Engine
To maximize vertical reading area and maintain layout cleanly, the header implements a smooth directional transition based on scroll behavior:
1. **Initial View:** Transparent, fixed overlay at top of window.
2. **Scroll Down:** Hidden smoothly by translating up on the Y-axis.
3. **Scroll Up:** Revealed smoothly with a frosted-glass background blur.

```typescript
// React Scroll Direction Detection Hook
import { useState, useEffect, useRef } from 'react';

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'top'>('top');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      
      if (scrollY <= 50) {
        setScrollDirection('top');
        return;
      }
      
      const direction = scrollY > lastScrollY.current ? 'down' : 'up';
      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY.current) > 10) {
        setScrollDirection(direction);
      }
      lastScrollY.current = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener('scroll', updateScrollDirection);
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, [scrollDirection]);

  return scrollDirection;
}
```

#### Framer Motion Header Implementation:
```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollDirection } from '@/hooks/useScrollDirection';

export function Header() {
  const direction = useScrollDirection();
  
  const isHidden = direction === 'down';
  const isTop = direction === 'top';

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ 
        y: isHidden ? -100 : 0,
        backgroundColor: isTop ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0.85)',
        backdropFilter: isTop ? 'blur(0px)' : 'blur(12px)',
        borderBottom: isTop ? '1px solid rgba(255,255,255,0)' : '1px solid rgba(255,255,255,0.1)'
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 h-16 w-full flex items-center px-8 transition-colors"
    >
      {/* Navigation Nodes */}
    </motion.header>
  );
}
```

---

## 5. Hero Section

### Architecture for Future Cinematic Image-Sequence Rendering
To lay the technical foundation for high-performance canvas-based scroll-controlled frame rendering, the Hero component utilizes a viewport canvas fallback wrapper.

```
+-----------------------------------------------------------------+
| Hero container (relative, overflow-hidden, h-screen)            |
|                                                                 |
|  +-----------------------------------------------------------+  |
|  | WebGL/2D Canvas Rendering Context (absolute, inset-0)     |  |
|  | [Frame Preloader / Memory Buffers / Interpolation Node]   |  |
|  +-----------------------------------------------------------+  |
|                                                                 |
|  +-----------------------------------------------------------+  |
|  | Static Image Fallback Node (Visible during load / mobile) |  |
|  +-----------------------------------------------------------+  |
|                                                                 |
|  +-----------------------------------------------------------+  |
|  | Typography Overlay Layout (Absolute container, z-10)       |  |
|  +-----------------------------------------------------------+  |
+-----------------------------------------------------------------+
```

### Future-Proof Scroll-Controlled Engine Specification
```typescript
interface FrameAnimationConfig {
  sequenceDirectory: string;
  totalFrames: number;
  frameFormat: 'webp' | 'jpg';
  onProgress?: (progress: number) => void;
}

export class ImageSequencePlayer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private frames: HTMLImageElement[] = [];
  private config: FrameAnimationConfig;
  private activeFrameIndex: number = 0;

  constructor(canvas: HTMLCanvasElement, config: FrameAnimationConfig) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.config = config;
    this.preloadFrames();
  }

  private preloadFrames() {
    let loadedCount = 0;
    for (let i = 1; i <= this.config.totalFrames; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(4, '0');
      img.src = `${this.config.sequenceDirectory}/frame_${paddedIndex}.${this.config.frameFormat}`;
      img.onload = () => {
        loadedCount++;
        if (this.config.onProgress) {
          this.config.onProgress(loadedCount / this.config.totalFrames);
        }
      };
      this.frames.push(img);
    }
  }

  public renderFrame(progress: number) {
    // Linear scale frame index from [0, 1] scroll bounds
    const rawIndex = progress * (this.config.totalFrames - 1);
    const targetIndex = Math.min(
      this.config.totalFrames - 1, 
      Math.max(0, Math.round(rawIndex))
    );

    if (this.frames[targetIndex] && targetIndex !== this.activeFrameIndex) {
      this.activeFrameIndex = targetIndex;
      const img = this.frames[targetIndex];
      
      // Calculate aspect-ratio safe rendering boundaries (cover strategy)
      const canvasWidth = this.canvas.width;
      const canvasHeight = this.canvas.height;
      const imgWidth = img.width;
      const imgHeight = img.height;
      
      const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
      const xOffset = (canvasWidth - imgWidth * ratio) / 2;
      const yOffset = (canvasHeight - imgHeight * ratio) / 2;
      
      this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      this.ctx.drawImage(img, xOffset, yOffset, imgWidth * ratio, imgHeight * ratio);
    }
  }
}
```

---

## 6. Section-by-Section Documentation

---

## 7. Shop All Section

Instead of a static grid, the Shop All interface layout is planned as a reusable horizontal scroll component. This component features snapping layout behaviors, responsive adjustments, and drag/wheel support.

```
                                            [ Drag / Swipe Swipe Area ]
+--------------------------------------------------------------------------------------------------------+
|                                                                                                        |
|  +-------------------+    +-------------------+    +-------------------+    +-------------------+      |
|  | [ Product Card 1 ]|    | [ Product Card 2 ]|    | [ Product Card 3 ]|    | [ Product Card 4 ]| ...  |
|  | Gold Cookie Dough |    | Gold Choc Chip    |    | Bronze Caramel    |    | Pint Cookie Dough |      |
|  |                   |    |                   |    |                   |    |                   |      |
|  +-------------------+    +-------------------+    +-------------------+    +-------------------+      |
|                                                                                                        |
+--------------------------------------------------------------------------------------------------------+
|<========================================== Dynamic Viewport ==========================================>|
```

### Specifications & Component Dimensions
* **Desktop Card Dimensions:** Width: `320px`, Height: `460px`, Gap: `24px` (`gap-6`).
* **Mobile Card Dimensions:** Width: `260px`, Height: `380px`, Gap: `16px` (`gap-4`).
* **Interactive Mechanics:** Swiping/dragging on touchscreens, mouse-drag emulation on desktop viewports, and kinetic deceleration mapping.

### Technical Implementation

```tsx
import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface CarouselProps {
  children: React.ReactNode[];
}

export function HorizontalCarousel({ children }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        const currentX = x.get();
        const trackWidth = trackRef.current?.scrollWidth || 0;
        const containerWidth = containerRef.current?.offsetWidth || 0;
        const limit = -(trackWidth - containerWidth);
        
        const nextX = Math.min(0, Math.max(limit, currentX - e.deltaX));
        x.set(nextX);
      }
    };

    const container = containerRef.current;
    container?.addEventListener('wheel', handleWheel, { passive: false });
    return () => container?.removeEventListener('wheel', handleWheel);
  }, [x]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden cursor-grab active:cursor-grabbing">
      <motion.div
        ref={trackRef}
        style={{ x: springX }}
        drag="x"
        dragConstraints={containerRef}
        className="flex gap-6 px-12 py-4"
      >
        {children}
      </motion.div>
    </div>
  );
}
```

---

## 8. Best Seller Section

Designed as a wider, horizontal card display with snap scrolling for key highlight items.

### Layout Specifications
* **Desktop Dimensions:** Card Width: `520px`, Card Height: `340px` (Horizontal layout displaying the wrapped product alongside ingredients).
* **Mobile Dimensions:** Card Width: `300px`, Card Height: `240px` (Optimized for swiping gesture zones).
* **Scroll-Snap Settings:** CSS `snap-x snap-mandatory` container configuration; children configured with `snap-start snap-always`.

```tsx
export function BestSellerCarousel({ items }: { items: Product[] }) {
  return (
    <div className="w-full overflow-x-auto scrollbar-none snap-x snap-mandatory flex gap-6 px-12 py-8 scroll-smooth">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="flex-none w-[520px] max-w-[85vw] snap-start snap-always bg-[#121212] border border-white/10 rounded-lg overflow-hidden flex flex-col justify-between p-6 transition-all duration-300 hover:border-white/30"
        >
          {/* Card Media Container & Overlay Controls */}
        </div>
      ))}
    </div>
  );
}
```

---

## 9. Every Other Section

### 1. Section 2: Gateways Grid (4-Column)
* **Purpose:** Initial routing gateway to key collection categories.
* **Layout:** `grid grid-cols-1 md:grid-cols-4 w-full h-[600px] border-b border-white/10`.
* **Visual States:** Stretched full-bleed images matching categories (Bars, Pints, Subscribe, Merch).
* **Hover Interaction:** Zoom overlay animation (`scale-105`) + text slide transitions.

### 2. Section 3: Bundle Constructor Block
* **Purpose:** Prompts direct bundling choices to drive conversion rates.
* **Layout:** Grid layout containing dynamic content columns:
  * Left Column: High-intensity graphic illustrating athletes or protein bar textures.
  * Right Column: Interactive purchase portal offering options such as "Buy 4 cartons, get 1 free", "Free shipping on every order", and "Free gift with your bundle".
* **Interactive Element:** Target package option configurations (1 Carton, 3 Cartons, 5 Cartons, etc.) dynamically updating CTA price calculations.

### 3. Section 5: Scientific Validation Section (Dr. Andrew Huberman Spotlight)
* **Purpose:** Highlights clinical credibility and third-party testing.
* **Visual Configuration:** Portrait image frame of Dr. Andrew Huberman side-by-side with scientific statements regarding the protein absorption efficiency of David bars.
* **Interactive Trigger:** Dynamic slide-out biographical details drawer.

### 4. Section 6: Social Review Matrix (UGC Video Loop)
* **Purpose:** Displays customer testimonials and social proof.
* **Visual Configuration:** Horizontal video layout cards that launch inline vertical HTML5 video players on scroll/hover detection. Clicking the card opens a detail overlay with quick-add CTA buttons.

### 5. Section 7: Protein Efficiency Comparator Block
* **Purpose:** Visual scientific data validation.
* **Interactive Design:** Tabs toggle between "Calories from Protein" (Horizontal Bar Chart layout) and "Macros" (Interactive comparison grid).

```
Tab [ Calories from protein ]  Tab [ Macros ]

David Gold        | [==================================== 75% ]
David Bronze      | [======================== 53% ]
Competitor A      | [====================== 49% ]
Competitor B      | [===================== 47% ]
Competitor C      | [================== 40% ]
```

#### Macros Grid View (Toggle state):
```tsx
export function MacrosTable() {
  return (
    <div className="grid grid-cols-3 gap-4 border border-white/10 p-6 rounded-md bg-[#050505]">
      <div className="col-span-1 text-zinc-400 font-mono text-sm uppercase">Metric</div>
      <div className="col-span-1 text-white font-serif text-lg">David Gold</div>
      <div className="col-span-1 text-zinc-400 font-serif text-lg">Competitor A</div>
      
      <div className="col-span-3 h-[1px] bg-white/10" />
      
      <div className="col-span-1 text-zinc-400 font-mono text-xs">Protein</div>
      <div className="col-span-1 text-white font-sans font-bold">28g</div>
      <div className="col-span-1 text-zinc-400 font-sans">15g</div>
    </div>
  );
}
```

---

## 10. Footer

### Columns Structure & Directory Map
* **Sign-up Column:** "Miss out on David updates." email and SMS input blocks.
* **Directory Grid:**
  * **Support Column:** Track Order, Help Center, FAQs, Contact Us, Satisfaction Guarantee.
  * **About Column:** Our Story, Third-Party Test Results, Careers, Blog, Reviews.
  * **Partnership Column:** Wholesale, Ambassador Program.
  * **Legal Column:** Privacy Policy, Terms of Service, Accessibility, Your Privacy Choices.
* **Social Connections:** Icon layout with links to Instagram, TikTok, Facebook, and LinkedIn.
* **Legal Disclaimer:** "© 2026 David" and "California Privacy".

---

## 11. Component Library

### Reusable UI Components

#### 1. Dynamic Button (`<Button />`)
* **Variants:** Primary (Fill White/Black Text), Secondary (Outline White), Accented (Gold Glow).
* **States:** Hover, Active, Disabled, Loading/Spinner.
* **Props interface:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold';
  isLoading?: boolean;
}
```

#### 2. Product Showcase Card (`<ProductCard />`)
* **Variants:** Gold Category, Bronze Category, Pint Ice-Blue.
* **Interaction:** Transition triggers displaying nutrition panels on tap/hover.

#### 3. Inline Input Form (`<Input />`)
* **State Mapping:** Default, Focus, Error, Disabled, Success.

---

## 12. Motion Specification

Animations utilize CSS curves or coordinate interpolation values designed for a premium feel.

| Animation Class | Trigger Event | Property Changes | Timing Curve / Value |
| :--- | :--- | :--- | :--- |
| **Card Transition Reveal** | In-View Visibility | `opacity: 0 -> 1`<br>`translateY: 40px -> 0px` | `easeOutQuint` (Duration: `0.8s`) |
| **Hero Graphics Scale** | Scroll Delta | `scale: 1.0 -> 1.08` | Linear-Scroll Interpolation |
| **Interactive CTA Hover**| Mouse Enter | `scale: 1.0 -> 1.02`<br>`box-shadow: gold-glow`| `cubic-bezier(0.16, 1, 0.3, 1)` (Duration: `0.3s`) |
| **Dynamic Cart Transition**| Toggle Trigger | `translateX: 100% -> 0%` | `spring` (Stiffness: `380`, Damping: `38`) |

---

## 13. Scrolling Behavior

### Pinned Transition Flow
Sections such as the *Protein Efficiency Comparator* map vertical scroll scroll-ticks onto visual parameters without layout shifting.

```
                  +-----------------------------------+
                  |  Enter Pinned Viewport Container  |
                  +-----------------------------------+
                                    |
                                    v
                  +-----------------------------------+
                  |  Pin Target Layout Container      |
                  |  (CSS position: sticky)           |
                  +-----------------------------------+
                                    |
                                    v
+-----------------------------------------------------------------------+
|  Scroll Action Progress (mapped value from [0.0] to [1.0]):           |
|                                                                       |
|  - Frame 0.0: Render Gold efficiency bar values                       |
|  - Frame 0.5: Scale Competitor efficiency values downward             |
|  - Frame 1.0: Display ingredient comparison tables                    |
+-----------------------------------------------------------------------+
                                    |
                                    v
                  +-----------------------------------+
                  |  Unpin Layout Container           |
                  |  (Normal scroll resumes)          |
                  +-----------------------------------+
```

---

## 14. Responsive Specification

The layout system automatically scales across devices using dynamic viewport units (`vw`, `vh`) and CSS fluid properties:

```css
@media (max-width: 768px) {
  /* Scale grid gap sizes */
  .grid-container {
    gap: 16px;
  }
  
  /* Disable resource-heavy animations on devices running in low power modes */
  .animated-canvas {
    display: none;
  }
  
  .static-fallback {
    display: block;
  }
}
```

---

## 15. Technical Architecture

The technical stack is chosen for performance, SEO optimization, and smooth visual transitions:

* **Framework:** Next.js (App Router API) for quick initial rendering.
* **Rendering Engine:** React with TypeScript types for components.
* **Styling Framework:** Tailwind CSS for structured utility layouts.
* **Animation Library:** Framer Motion for interface layout changes and menu transitions.
* **Scrolling Dynamics:** GSAP (ScrollTrigger API) for scroll-pinned layouts.
* **Image Engine:** Custom Canvas sequence preloader with WebP/AVIF output.

---

## 16. Scale-Ready Folder Structure

```
david-frontend/
├── app/                      # Next.js App Router layout blocks
│   ├── layout.tsx
│   ├── page.tsx
│   └── collections/
├── components/               # High-reuse visual modules
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Carousel.tsx
│   │   └── Drawer.tsx
│   └── sections/             # Core layout page blocks
│       ├── Hero.tsx
│       ├── Comparators.tsx
│       └── Footer.tsx
├── animations/               # Anim engines and interpolation modules
│   ├── canvas-render.ts
│   └── page-curves.ts
├── public/                   # Asset distribution folders
│   ├── assets/
│   └── hero-frames/          # Preloaded visual image sequences
└── types/                    # System data models
```

---

## 17. Future-Proof Architecture

To prevent design updates from requiring a complete code rewrite, the frontend implements a modular block design:

```
+--------------------------------------------------------------------------+
|  CMS Payload Configuration                                               |
+--------------------------------------------------------------------------+
  |
  |--- Section Type: "HeroCanvas"  ===> Maps dynamically to app/Hero.tsx
  |--- Section Type: "Carousel"    ===> Maps dynamically to app/Carousel.tsx
  |--- Section Type: "GraphToggle" ===> Maps dynamically to app/Toggle.tsx
```

The rendering interface reads these blocks dynamically, allowing marketing updates to adjust layouts without redeploying the core platform.

---

## 18. Suggested Improvements

* **Performance Optimization:** implement CSS containment techniques (`contain-intrinsic-size`) on heavy sections like the comparison charts and reviews grid to minimize browser reflows during fast scrolling.
* **Accessibility Enhancements:** Add `aria-live="polite"` tags to comparison table elements to ensure layout updates are properly announced by screen readers.
* **Unified State Management:** Use lightweight state systems like Zustand to coordinate the sync between the dynamic cart drawer and dynamic page-level pricing details.

---

## 19. Final Build Roadmap

```
Phase 1: Foundation Setup [=====>                             ] Core Next.js, tailwind-themes, global types
Phase 2: Global Structures  [===========>                       ] Sticky-headers, Drawer architectures
Phase 3: Hero Engine Build  [=================>                 ] Frame canvas players, responsive fallback structures
Phase 4: Scroll Sections     [=========================>         ] Carousel implementations, scientific comparisons
Phase 5: Integrations & QA  [==================================>] Shopify API hooks, performance optimization
```