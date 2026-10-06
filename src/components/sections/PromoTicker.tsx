/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Promo Ticker Component
 * Infinite looping announcement bar for store promos, shipping thresholds,
 * and scientific claims.
 */

import React from 'react';
import { motion } from 'framer-motion';

const TICKER_MESSAGES = [
  '75% OF CALORIES FROM PROTEIN',
  'FREE SHIPPING ON ALL CARTONS',
  '28G BIO-AVAILABLE WHEY ISOLATE',
  'ZERO ARTIFICIAL FLAVORS OR GUMS',
  'CLINICALLY TESTED FORMULATION',
  '0G SUGAR · NO GLYCEMIC SPIKE',
];

export function PromoTicker() {
  return (
    <div className="relative h-9 w-full overflow-hidden bg-[#0a0a0a] border-b border-white/10 z-40 flex items-center select-none">
      <div className="flex w-max">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 25,
            ease: 'linear',
          }}
          className="flex whitespace-nowrap items-center text-[10px] md:text-[11px] font-mono uppercase tracking-[0.25em] text-white/70"
        >
          {/* Double list for continuous seamless loop */}
          {[...TICKER_MESSAGES, ...TICKER_MESSAGES].map((msg, index) => (
            <span key={index} className="flex items-center px-6">
              <span>{msg}</span>
              <span className="ml-6 text-[#D4AF37]">✦</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
