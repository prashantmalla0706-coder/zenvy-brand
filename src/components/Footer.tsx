import React, { useState } from 'react';
import { ArrowRight, Check, Instagram, Facebook, Twitter } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { navigateTo, setShopCategoryFilter } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail('');
  };

  const handleCategoryClick = (cat: string) => {
    setShopCategoryFilter(cat as any);
    navigateTo('shop');
  };

  return (
    <footer className="bg-[#121212] text-[#FBFBFA] pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top VIP Inner Circle Bar */}
        <div className="pb-16 border-b border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-white/60">
              The Inner Circle
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase font-['Syne'] text-white mt-1">
              Join Zenvy Private Access
            </h3>
            <p className="text-xs text-white/70 mt-2 max-w-md leading-relaxed">
              Receive private invitations to seasonal runway debuts, archived micro-releases, and 10% privilege on your inaugural acquisition.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="flex items-center gap-2 p-4 bg-white/5 border border-white/20 text-xs text-white">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>You have been granted Inner Circle status. Check your inbox for invitation code.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your private email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/20 px-4 py-3 text-xs tracking-wider text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-[#121212] text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#F2F2EE] transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 4-Column Navigation Links */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Col 1: Shop */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white mb-4">
              Shop Archive
            </h4>
            <ul className="space-y-2.5 text-xs text-white/60 font-light">
              <li>
                <button
                  onClick={() => {
                    setShopCategoryFilter('All');
                    navigateTo('shop');
                  }}
                  className="hover:text-white transition-colors"
                >
                  All Garments
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('outfits')}
                  className="hover:text-white transition-colors font-semibold text-white/90"
                >
                  Old Money Outfits
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Tailoring')}
                  className="hover:text-white transition-colors"
                >
                  Quiet Luxury Tailoring
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Outerwear')}
                  className="hover:text-white transition-colors"
                >
                  Zen Fluid Outerwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Knitwear')}
                  className="hover:text-white transition-colors"
                >
                  Silk & Cashmere Knits
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Streetwear')}
                  className="hover:text-white transition-colors"
                >
                  Urban Selvedge & Terry
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Accessories')}
                  className="hover:text-white transition-colors"
                >
                  Tuscan Leather & Optical
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Client Services */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white mb-4">
              Client Care
            </h4>
            <ul className="space-y-2.5 text-xs text-white/60 font-light">
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  Contact Concierge
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  Global Shipping & Duties
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  30-Day Complimentary Returns
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  Garment Care Instructions
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: The Zenvy Brand */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white mb-4">
              The Brand
            </h4>
            <ul className="space-y-2.5 text-xs text-white/60 font-light">
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                  Zenvy Philosophy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                  Sustainable Mills & Portugal
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('lookbook')} className="hover:text-white transition-colors">
                  Campaign Lookbooks
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">
                  Flagship Showrooms
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">
                  Careers at Zenvy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Flagships & Presence */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white mb-4">
              Global Flagships
            </h4>
            <div className="space-y-3 text-xs text-white/60 font-light">
              <div>
                <p className="text-white font-medium">SoHo, New York</p>
                <p>45 Crosby St · 10am – 7pm</p>
              </div>
              <div>
                <p className="text-white font-medium">Le Marais, Paris</p>
                <p>18 Rue Vieille du Temple · 11am – 8pm</p>
              </div>
              <div>
                <p className="text-white font-medium">Omotesando, Tokyo</p>
                <p>4-12-10 Jingumae · 11am – 8pm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/50 font-light">
          <div className="flex items-center gap-6">
            <span>© 2026 ZENVY. All Rights Reserved.</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">Privacy Policy</span>
            <span className="hidden md:inline">·</span>
            <span className="hidden md:inline">Terms & Conditions</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-white/70">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors p-1"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors p-1"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors p-1"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
