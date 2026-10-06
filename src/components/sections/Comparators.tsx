/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Protein Efficiency Comparators Section
 * Interactive data visualization component providing side-by-side macro efficiency
 * comparisons between DigiMaraa Gold/Bronze lines and market legacy bars.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Table, Info, Check, AlertCircle } from 'lucide-react';
import type { ComparisonBrand, MacroMatrixRow } from '@/types/index.ts';

// Comprehensive benchmark data matching clinical validation specs
const COMPARISON_BRANDS: ComparisonBrand[] = [
  {
    id: 'digimaraa-gold',
    name: 'DigiMaraa Gold (28g)',
    proteinGrams: 28,
    calories: 150,
    sugarGrams: 0,
    fatGrams: 2.5,
    proteinPercentage: 75,
    isFlagship: true,
    colorHex: '#D4AF37',
    brandTag: 'Gold Standard',
  },
  {
    id: 'digimaraa-bronze',
    name: 'DigiMaraa Bronze (20g)',
    proteinGrams: 20,
    calories: 150,
    sugarGrams: 1,
    fatGrams: 4,
    proteinPercentage: 53,
    isFlagship: false,
    colorHex: '#CD7F32',
    brandTag: 'Clean Daily',
  },
  {
    id: 'comp-a',
    name: 'Competitor Q (Candy Style)',
    proteinGrams: 20,
    calories: 210,
    sugarGrams: 2,
    fatGrams: 8,
    proteinPercentage: 49,
    colorHex: '#52525b',
  },
  {
    id: 'comp-b',
    name: 'Competitor P (Legacy Whey)',
    proteinGrams: 21,
    calories: 220,
    sugarGrams: 1,
    fatGrams: 9,
    proteinPercentage: 47,
    colorHex: '#3f3f46',
  },
  {
    id: 'comp-c',
    name: 'Competitor B (Plant Base)',
    proteinGrams: 15,
    calories: 230,
    sugarGrams: 14,
    fatGrams: 11,
    proteinPercentage: 40,
    colorHex: '#27272a',
  },
];

const MACRO_MATRIX_ROWS: MacroMatrixRow[] = [
  {
    metric: 'Protein per Bar',
    digimaraaGold: '28g',
    digimaraaBronze: '20g',
    competitorA: '20g',
    competitorB: '21g',
    competitorC: '15g',
    unit: 'grams',
    isHighlight: true,
  },
  {
    metric: 'Total Calories',
    digimaraaGold: '150 kcal',
    digimaraaBronze: '150 kcal',
    competitorA: '210 kcal',
    competitorB: '220 kcal',
    competitorC: '230 kcal',
    unit: 'kcal',
  },
  {
    metric: '% Calories from Protein',
    digimaraaGold: '75%',
    digimaraaBronze: '53%',
    competitorA: '49%',
    competitorB: '47%',
    competitorC: '40%',
    unit: '%',
    isHighlight: true,
  },
  {
    metric: 'Sugar Content',
    digimaraaGold: '0g',
    digimaraaBronze: '1g',
    competitorA: '2g',
    competitorB: '1g',
    competitorC: '14g',
    unit: 'grams',
  },
  {
    metric: 'Total Fat',
    digimaraaGold: '2.5g',
    digimaraaBronze: '4.0g',
    competitorA: '8.0g',
    competitorB: '9.0g',
    competitorC: '11.0g',
    unit: 'grams',
  },
  {
    metric: 'Net Carbs',
    digimaraaGold: '2g',
    digimaraaBronze: '3g',
    competitorA: '7g',
    competitorB: '8g',
    competitorC: '24g',
    unit: 'grams',
  },
  {
    metric: 'Third-Party Tested',
    digimaraaGold: 'Informed-Choice',
    digimaraaBronze: 'Informed-Choice',
    competitorA: 'Not Certified',
    competitorB: 'Unverified',
    competitorC: 'Unverified',
    unit: 'badge',
  },
];

// FUTURE INTEGRATION POINT: Connect this table data to a headless CMS
// (e.g. Sanity dataset) so nutrition scientists can update lab-verified test batches.

export function Comparators() {
  const [activeTab, setActiveTab] = useState<'calories' | 'matrix'>('calories');
  const [selectedBrandInfo, setSelectedBrandInfo] = useState<ComparisonBrand | null>(null);

  return (
    <section
      id="science"
      className="relative w-full bg-[#050505] py-24 md:py-32 border-t border-white/10"
      aria-label="Protein Efficiency and Nutritional Matrix Comparison"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-12">
        
        {/* SECTION HEADER & CONTROL BAR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] block mb-2">
              Empirical Formulation · Section 07
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.05]">
              The Math of <br className="hidden sm:inline" />
              <span className="italic text-[#F3E5AB]">Bio-Density</span>.
            </h2>
            <p className="mt-3 text-sm md:text-base text-white/70 max-w-xl font-sans leading-relaxed">
              Every calorie in a DigiMaraa Nutrition bar is maximized for muscle protein synthesis. 
              While ordinary bars pad their volume with fats, seed oils, and sugar alcohols, 
              DigiMaraa Nutrition hits 75% pure protein caloric density.
            </p>
          </div>

          {/* INTERACTIVE SEGMENTED TAB SELECTOR (Zero-Pill Restraint) */}
          <div className="flex items-center gap-1.5 p-1.5 bg-black border border-white/15 rounded-md self-start md:self-auto">
            <button
              onClick={() => setActiveTab('calories')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-[0.16em] transition-all rounded ${
                activeTab === 'calories'
                  ? 'bg-white/15 text-white font-semibold shadow-inner'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="h-4 w-4 text-[#D4AF37]" />
              <span>Calories from Protein</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-[0.16em] transition-all rounded ${
                activeTab === 'matrix'
                  ? 'bg-white/15 text-white font-semibold shadow-inner'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Table className="h-4 w-4 text-[#A5C9EB]" />
              <span>Macros Matrix</span>
            </button>
          </div>
        </div>

        {/* DATA VISUALIZATION VIEWPORT */}
        <div aria-live="polite" className="relative min-h-[440px]">
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: HORIZONTAL BAR COMPARISON CHART */}
            {activeTab === 'calories' && (
              <motion.div
                key="chart"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#0c0c0c] border border-white/10 rounded-lg p-6 sm:p-8 md:p-10 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
                  <span className="text-xs font-mono uppercase tracking-widest text-white/50">
                    Product / Brand
                  </span>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
                    % Caloric Yield From Protein
                  </span>
                </div>

                <div className="flex flex-col gap-6">
                  {COMPARISON_BRANDS.map((brand, idx) => {
                    const isDigiMaraaGold = brand.id === 'digimaraa-gold';
                    const isDigiMaraaBronze = brand.id === 'digimaraa-bronze';

                    return (
                      <div
                        key={brand.id}
                        className={`group relative rounded p-3 transition-colors ${
                          isDigiMaraaGold ? 'bg-white/[0.03] border border-[#D4AF37]/30' : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                          <div className="flex items-center gap-2.5">
                            <span className={`font-serif text-lg md:text-xl font-medium ${
                              isDigiMaraaGold ? 'text-[#F3E5AB]' : isDigiMaraaBronze ? 'text-[#E0A96D]' : 'text-white/80'
                            }`}>
                              {brand.name}
                            </span>
                            {brand.brandTag && (
                              <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] border border-[#D4AF37]/40 px-1.5 py-0.5 rounded">
                                {brand.brandTag}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs font-mono text-white/60">
                            <span>{brand.proteinGrams}g Protein</span>
                            <span className="text-white/30">/</span>
                            <span>{brand.calories} Cal</span>
                          </div>
                        </div>

                        {/* Bar Track & Fill */}
                        <div className="relative h-8 w-full bg-black/60 rounded overflow-hidden p-1 flex items-center border border-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${brand.proteinPercentage}%` }}
                            // PERFORMANCE OPTIMIZATION: Staggered animation reveals avoid layout thrashing
                            transition={{ duration: 0.9, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                            className={`h-full rounded flex items-center justify-end pr-3 transition-all duration-300 ${
                              isDigiMaraaGold
                                ? 'bg-gradient-to-r from-[#8C6D1F] via-[#D4AF37] to-[#F3E5AB] text-black font-bold'
                                : isDigiMaraaBronze
                                ? 'bg-gradient-to-r from-[#704214] to-[#CD7F32] text-white font-medium'
                                : 'bg-white/20 text-white/80'
                            }`}
                          >
                            <span className="text-xs font-mono tracking-wider">
                              {brand.proteinPercentage}%
                            </span>
                          </motion.div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans text-white/50">
                  <p>
                    *Efficiency formula: <code className="text-white/80 font-mono">(Protein Grams × 4 kcal) ÷ Total Calories</code>.
                  </p>
                  <span className="font-mono text-[#D4AF37]">
                    DigiMaraa Gold delivers 1.5× more protein per calorie than leading competitors.
                  </span>
                </div>
              </motion.div>
            )}

            {/* VIEW 2: INTERACTIVE MACROS COMPARISON MATRIX */}
            {activeTab === 'matrix' && (
              <motion.div
                key="matrix"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-x-auto bg-[#0c0c0c] border border-white/10 rounded-lg shadow-2xl"
              >
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/15 bg-black/60">
                      <th className="py-4 px-6 text-xs font-mono uppercase tracking-widest text-white/50">
                        Nutritional Metric
                      </th>
                      <th className="py-4 px-6 text-sm font-serif font-semibold text-[#D4AF37] bg-white/[0.02]">
                        DigiMaraa Gold (Flagship)
                      </th>
                      <th className="py-4 px-6 text-sm font-serif font-medium text-[#CD7F32]">
                        DigiMaraa Bronze
                      </th>
                      <th className="py-4 px-6 text-xs font-mono text-white/60">
                        Competitor Q
                      </th>
                      <th className="py-4 px-6 text-xs font-mono text-white/60">
                        Competitor P
                      </th>
                      <th className="py-4 px-6 text-xs font-mono text-white/60">
                        Competitor B
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {MACRO_MATRIX_ROWS.map((row, i) => (
                      <tr
                        key={row.metric}
                        className={`transition-colors hover:bg-white/[0.02] ${
                          row.isHighlight ? 'bg-white/[0.015]' : ''
                        }`}
                      >
                        <td className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-white/80">
                          {row.metric}
                        </td>
                        <td className="py-4 px-6 text-sm font-sans font-bold text-white bg-white/[0.02]">
                          <span className="text-[#F3E5AB]">{row.digimaraaGold}</span>
                        </td>
                        <td className="py-4 px-6 text-sm font-sans font-medium text-white/90">
                          {row.digimaraaBronze}
                        </td>
                        <td className="py-4 px-6 text-xs font-sans text-white/60">
                          {row.competitorA}
                        </td>
                        <td className="py-4 px-6 text-xs font-sans text-white/60">
                          {row.competitorB}
                        </td>
                        <td className="py-4 px-6 text-xs font-sans text-white/60">
                          {row.competitorC}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="p-6 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
                  <span>Certified lab assays performed via ISO/IEC 17025 accredited third-party facilities.</span>
                  <span className="text-[#A5C9EB] font-mono">Zero synthetic fillers or gums.</span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
