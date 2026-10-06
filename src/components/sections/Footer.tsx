/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Global Footer Hub
 * Section 10: Multi-column directory, newsletter subscription portal,
 * social media links, and 2026 legal disclaimers.
 */

import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  // FUTURE INTEGRATION POINT: Connect newsletter form to Klaviyo, Mailchimp, or Shopify Customers API

  return (
    <footer className="relative w-full bg-black border-t border-white/10 pt-20 pb-12">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-12">
        
        {/* TOP SIGN-UP & BRAND STATEMENT ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-5">
            <span className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-white block mb-3">
DigiMaraa Nutrition
            </span>
            <p className="text-sm text-white/60 font-sans leading-relaxed max-w-sm mb-6">
              The world's most protein-dense formulation. Engineered for those who understand 
              that nutrition is the fundamental substrate of human performance.
            </p>
            <div className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
              75% Caloric Efficiency · 28g Bioavailable Isolate
            </div>
          </div>

          {/* NEWSLETTER CAPTURE */}
          <div className="lg:col-span-7 flex flex-col justify-end">
            <h4 className="font-serif text-xl sm:text-2xl text-white font-normal mb-2">
              Never Miss A Batch Drop
            </h4>
            <p className="text-xs text-white/60 font-sans mb-4">
              Receive private notifications for limited flavor runs, clinical trial releases, and VIP volume pricing.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-white/5 border border-white/20 rounded px-4 py-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37] font-sans"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#e0bc42] text-black px-6 py-3 text-xs font-mono uppercase tracking-wider font-semibold rounded transition-colors shrink-0"
              >
                {isSubscribed ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>
            {isSubscribed && (
              <span className="text-[11px] font-mono text-emerald-400 mt-2">
                Thank you. You are enrolled in private batch drop dispatches.
              </span>
            )}
          </div>
        </div>

        {/* DIRECTORY GRID COLUMNS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-b border-white/10 text-xs font-sans">
          
          {/* SUPPORT */}
          <div>
            <h5 className="font-mono uppercase tracking-[0.2em] text-[#D4AF37] text-[11px] mb-4">
              Support
            </h5>
            <ul className="flex flex-col gap-2.5 text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center & FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Satisfaction Guarantee</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
            </ul>
          </div>

          {/* ABOUT */}
          <div>
            <h5 className="font-mono uppercase tracking-[0.2em] text-[#D4AF37] text-[11px] mb-4">
              About DigiMaraa Nutrition
            </h5>
            <ul className="flex flex-col gap-2.5 text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Our Formulation Story</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Third-Party Lab Assays</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers at DigiMaraa Nutrition</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Scientific Advisory Board</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press & Publications</a></li>
            </ul>
          </div>

          {/* PARTNERSHIPS */}
          <div>
            <h5 className="font-mono uppercase tracking-[0.2em] text-[#D4AF37] text-[11px] mb-4">
              Partnerships
            </h5>
            <ul className="flex flex-col gap-2.5 text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Wholesale Portal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ambassador Program</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gym & Studio Accounts</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Medical & Clinical Pro</a></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h5 className="font-mono uppercase tracking-[0.2em] text-[#D4AF37] text-[11px] mb-4">
              Legal & Privacy
            </h5>
            <ul className="flex flex-col gap-2.5 text-white/60">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessibility Statement</a></li>
              <li><a href="#" className="hover:text-white transition-colors">California Privacy Choices</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FDA Disclaimer</a></li>
            </ul>
          </div>

        </div>

        {/* BOTTOM ADDRESS, CONTACT & COPYRIGHT NOTICE */}
        <div className="pt-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 text-xs font-mono text-white/40">
          <div className="max-w-sm leading-relaxed">
            DigiMaraa Nutrition
            <br />
            #1, First Floor, Ambalam Street, Srivaikundam,
            <br />
            Tuticorin-628 601, Tamilnadu, India.
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2">
            <a href="tel:+917200251560" className="hover:text-white transition-colors">
              Phone: +91 72002 51560
            </a>
            <a href="mailto:info@digimaraa.com" className="hover:text-white transition-colors">
              Official: info@digimaraa.com
            </a>
            <a href="mailto:maraa.care@gmail.com" className="hover:text-white transition-colors">
              New Business: maraa.care@gmail.com
            </a>
            <a href="mailto:akash@digimaraa.com" className="hover:text-white transition-colors">
              Career: akash@digimaraa.com
            </a>
          </div>
          <div>&copy; 2026 DigiMaraa Nutrition. All rights reserved.</div>
        </div>

      </div>
    </footer>
  );
}
