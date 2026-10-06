/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Scientific Validation Section
 * Features Dr. Andrew Huberman spotlight panel with interactive slide-out drawer
 * detailing clinical assays and laboratory assay findings.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, CheckCircle2, Award, FlaskConical } from 'lucide-react';
import { SCIENTIFIC_PROFILE } from '@/data/products.ts';

export function ScientificValidation() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // FUTURE INTEGRATION POINT: Link to Huberman Lab podcast affiliate tracking
  // or published scientific papers on PubMed.

  return (
    <>
      <section className="relative w-full bg-black py-24 md:py-32 border-b border-white/10">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-12">
          
          <div className="relative rounded-xl border border-white/15 bg-[#0d0d0d] overflow-hidden p-8 sm:p-12 lg:p-16">
            
            {/* Subtle background ambient glow */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* PORTRAIT HEADSHOT */}
              <div className="lg:col-span-4 flex justify-center lg:justify-start">
                <div className="relative aspect-[3/4] w-full max-w-[320px] rounded-lg overflow-hidden border border-white/20 shadow-2xl">
                  <img
                    src={SCIENTIFIC_PROFILE.headshotUrl}
                    alt={SCIENTIFIC_PROFILE.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top filter grayscale contrast-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">
                      Scientific Advisory
                    </span>
                    <span className="font-serif text-lg text-white font-medium">
                      {SCIENTIFIC_PROFILE.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* QUOTE & SCIENTIFIC STATEMENT */}
              <div className="lg:col-span-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] mb-4">
                  <FlaskConical className="h-4 w-4" />
                  <span>Clinical Validation · Section 05</span>
                </div>

                <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal leading-snug tracking-tight mb-6">
                  "{SCIENTIFIC_PROFILE.summaryQuote}"
                </blockquote>

                <div className="mb-8">
                  <div className="text-base font-serif text-[#F3E5AB]">
                    {SCIENTIFIC_PROFILE.name}
                  </div>
                  <div className="text-xs font-mono uppercase tracking-wider text-white/50 mt-0.5">
                    {SCIENTIFIC_PROFILE.roleTitle} · {SCIENTIFIC_PROFILE.affiliation}
                  </div>
                </div>

                {/* CLINICAL BULLET POINTS (Zero-Pill Restraint) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/10 mb-8">
                  {SCIENTIFIC_PROFILE.keyFindings.slice(0, 2).map((finding, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-white/70 font-sans leading-relaxed">
                      <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <span>{finding}</span>
                    </div>
                  ))}
                </div>

                {/* SLIDE-OUT DRAWER TRIGGER */}
                <div>
                  <button
                    onClick={() => setDrawerOpen(true)}
                    className="inline-flex items-center gap-2 border border-white/20 hover:border-[#D4AF37] bg-white/5 hover:bg-white/10 text-white px-6 py-3.5 text-xs font-mono uppercase tracking-[0.2em] transition-all rounded"
                  >
                    <span>Read Full Scientific Biography & Findings</span>
                    <ExternalLink className="h-3.5 w-3.5 text-[#D4AF37]" />
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* DYNAMIC OVERLAY DRAWER FOR READING BIOGRAPHY */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[80] w-full max-w-xl bg-[#0d0d0d] border-l border-white/15 p-8 sm:p-10 overflow-y-auto flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
                  <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
                    Scientific Advisory Dossier
                  </span>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    aria-label="Close dossier"
                    className="p-2 text-white/60 hover:text-white transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={SCIENTIFIC_PROFILE.headshotUrl}
                    alt={SCIENTIFIC_PROFILE.name}
                    className="h-16 w-16 rounded-full object-cover grayscale border border-white/20"
                  />
                  <div>
                    <h3 className="font-serif text-2xl text-white font-medium">
                      {SCIENTIFIC_PROFILE.name}
                    </h3>
                    <p className="text-xs font-mono text-white/50 uppercase tracking-wider">
                      {SCIENTIFIC_PROFILE.affiliation}
                    </p>
                  </div>
                </div>

                <div className="prose prose-invert mb-8">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] mb-2">
                    Academic Background & Protocol
                  </h4>
                  <p className="text-sm font-sans text-white/70 leading-relaxed mb-6">
                    {SCIENTIFIC_PROFILE.fullBiography}
                  </p>

                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] mb-3">
                    Assay Verifications & Biochemical Findings
                  </h4>
                  <div className="flex flex-col gap-3">
                    {SCIENTIFIC_PROFILE.keyFindings.map((point, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded bg-white/[0.02] border border-white/10 text-xs text-white/80">
                        <Award className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-full py-3.5 bg-white text-black font-mono text-xs uppercase tracking-widest font-semibold hover:bg-[#D4AF37] transition-colors rounded"
                >
                  Close Dossier
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
