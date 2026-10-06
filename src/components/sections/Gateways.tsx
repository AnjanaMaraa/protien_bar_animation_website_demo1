/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive Catalog Gateway Section
 * 4-column high-impact layout for routing into core product collections:
 * Bars, Pints, Subscribe & Save, and Science/Merch.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface GatewayItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  imageSrc: string;
  accentColor: string;
  href: string;
}

const GATEWAYS: GatewayItem[] = [
  {
    id: 'bars-gateway',
    title: 'Protein Bars',
    subtitle: 'Gold (28g) & Bronze (20g)',
    category: 'Collection 01',
    imageSrc: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1000&auto=format&fit=crop',
    accentColor: '#D4AF37',
    href: '#bars',
  },
  {
    id: 'pints-gateway',
    title: 'Frozen Pints',
    subtitle: '36g Protein Gelato Base',
    category: 'Collection 02',
    imageSrc: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop',
    accentColor: '#A5C9EB',
    href: '#pints',
  },
  {
    id: 'bundle-gateway',
    title: 'Custom Bundle',
    subtitle: 'Save up to 25% + Free Gifts',
    category: 'Collection 03',
    imageSrc: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop',
    accentColor: '#CD7F32',
    href: '#bundle',
  },
  {
    id: 'science-gateway',
    title: 'The Science',
    subtitle: 'Clinical Assays & Huberman Lab',
    category: 'Collection 04',
    imageSrc: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1000&auto=format&fit=crop',
    accentColor: '#FFFFFF',
    href: '#science',
  },
];

interface GatewaysProps {
  onSelectCategory?: (id: string) => void;
}

export function Gateways({ onSelectCategory }: GatewaysProps) {
  // FUTURE INTEGRATION POINT: Connect to dynamic collection feeds from Shopify CMS

  return (
    <section className="relative w-full border-b border-white/10 bg-black">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full min-h-[560px] lg:h-[620px]">
        {GATEWAYS.map((item, index) => (
          <a
            key={item.id}
            href={item.href}
            onClick={(e) => {
              if (onSelectCategory) {
                e.preventDefault();
                onSelectCategory(item.id);
              }
            }}
            className="group relative flex flex-col justify-between overflow-hidden border-b sm:border-b-0 sm:border-r border-white/10 p-8 transition-colors hover:border-white/30"
          >
            {/* BACKGROUND IMAGE CONTAINER WITH ZOOM INTERACTION */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={item.imageSrc}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover object-center opacity-40 transition-all duration-700 ease-out group-hover:scale-108 group-hover:opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            </div>

            {/* TOP METADATA LINE */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50 group-hover:text-white/80 transition-colors">
                {item.category}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-sm text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* BOTTOM LABELS & TITLES */}
            <div className="relative z-10 transform transition-transform duration-300 group-hover:-translate-y-1">
              <span
                style={{ color: item.accentColor }}
                className="text-[11px] font-mono uppercase tracking-widest block mb-1"
              >
                {item.subtitle}
              </span>
              <h3 className="font-serif text-3xl md:text-4xl text-white font-normal tracking-tight">
                {item.title}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
