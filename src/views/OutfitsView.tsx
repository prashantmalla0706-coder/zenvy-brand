import React from 'react';
import { OldMoneyZenOutfits } from '../components/OldMoneyZenOutfits';
import { ArrowLeft, Sparkles, Compass } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const OutfitsView: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <div className="w-full pb-20">
      {/* Editorial Top Banner */}
      <section className="relative h-[55vh] flex items-center justify-center bg-[#121212] text-white overflow-hidden mb-12">
        <img
          src="/src/assets/images/zenvy_old_money_zen_hero_1790432251674.jpg"
          alt="Old Money Zen Outfits"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.70] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-white/70">
            Sartorial Curation
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase font-['Syne'] text-white mt-3">
            Old Money × Zen Outfits
          </h1>
          <p className="mt-4 text-sm sm:text-base font-serif italic text-white/90 max-w-xl mx-auto">
            &quot;Generational ease meeting meditative discipline. Pure tactile fabrics, zero logos, quiet authority.&quot;
          </p>
        </div>
      </section>

      {/* Main Interactive Outfit Showcase */}
      <OldMoneyZenOutfits 
        title="Curated Outfits & Styling Formulas"
        subtitle="Explore complete coordinated ensembles. Acquire single signature pieces or bundle the full look with our 10% wardrobe privilege."
        showSensoryPillars={true}
      />

      {/* Bottom CTA to shop single items */}
      <div className="max-w-4xl mx-auto px-6 mt-16 text-center">
        <h3 className="text-xl sm:text-2xl font-bold uppercase font-['Syne'] text-[#121212]">
          Seeking Individual Garments?
        </h3>
        <p className="text-xs sm:text-sm text-[#666666] mt-2 max-w-md mx-auto">
          Browse our entire catalog of Italian wools, Mongolian cashmeres, and Japanese cottons.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-6 px-8 py-3.5 bg-[#121212] text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors"
        >
          Explore Full Catalog
        </button>
      </div>
    </div>
  );
};
