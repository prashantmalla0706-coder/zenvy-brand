import React from 'react';
import { ArrowRight, Compass, Shield, Feather, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AboutView: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <div className="w-full">
      {/* Editorial Hero Banner */}
      <section className="relative h-[65vh] flex items-center justify-center bg-[#121212] text-white overflow-hidden">
        <img
          src="/src/assets/images/hero_fashion_editorial_1790431069068.jpg"
          alt="Zenvy Philosophy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.70] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-white/70">
            The Zenvy Manifesto
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase font-['Syne'] text-white mt-3">
            Fashion Is Identity
          </h1>
          <p className="mt-4 text-sm sm:text-base font-serif italic text-white/90 max-w-xl mx-auto">
            &quot;We believe fashion is more than clothing. It&apos;s a way to express who you are.&quot;
          </p>
        </div>
      </section>

      {/* Narrative Section 1: The Origin */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6 space-y-4">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#737373]">
              Chapter 01: The Genesis
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase font-['Syne'] text-[#121212]">
              Rejecting Ephemeral Trends
            </h2>
            <p className="text-xs sm:text-sm text-[#555555] leading-relaxed font-light">
              Founded in 2022 by a collective of young patternmakers and architectural designers, ZENVY was conceived as an antidote to fast fashion cycles and disposable novelty.
            </p>
            <p className="text-xs sm:text-sm text-[#555555] leading-relaxed font-light">
              We asked a foundational question: What if modern urban garments were built with the structural permanence of brutalist architecture and the tactile grace of bespoke Savile Row tailoring?
            </p>
          </div>

          <div className="md:col-span-6 aspect-[4/5] bg-[#F3F3F0] overflow-hidden">
            <img
              src="/src/assets/images/collection_tailoring_1790431096418.jpg"
              alt="Zenvy Cutting Room"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 3 Pillars of Zenvy Design */}
      <section className="py-16 bg-[#F4F4F0] border-y border-[#121212]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#737373]">
              Our Guiding Pillars
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold uppercase font-['Syne'] text-[#121212] mt-1">
              The Three Disciplines
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white border border-[#121212]/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#888888]">01</span>
                <h3 className="text-lg font-bold uppercase font-['Syne'] text-[#121212] mt-2">
                  Structural Weight
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed mt-3">
                  We custom-knit our French terry at 500 GSM and mill our wools at 620 GSM. Weight creates drape; drape commands respect.
                </p>
              </div>
            </div>

            <div className="p-8 bg-white border border-[#121212]/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#888888]">02</span>
                <h3 className="text-lg font-bold uppercase font-['Syne'] text-[#121212] mt-2">
                  Master Sourcing
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed mt-3">
                  Our raw selvedge denim is shuttle-loomed in Okayama; our organic cotton is spun in Barcelos, Portugal; our cashmere is sourced from nomadic cooperatives.
                </p>
              </div>
            </div>

            <div className="p-8 bg-white border border-[#121212]/10 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#888888]">03</span>
                <h3 className="text-lg font-bold uppercase font-['Syne'] text-[#121212] mt-2">
                  Zero-Waste Architecture
                </h3>
                <p className="text-xs text-[#555555] leading-relaxed mt-3">
                  Our pattern templates utilize geometric tessellation to reduce fabric off-cuts by 34%, ensuring thoughtful stewardship of every fiber.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-20 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold uppercase font-['Syne'] text-[#121212]">
          Experience The Wardrobe
        </h2>
        <p className="text-xs sm:text-sm text-[#666666] mt-2 max-w-md mx-auto">
          Explore the current season&apos;s creations online or visit our flagships in New York, Paris, and Tokyo.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-6 px-8 py-3.5 bg-[#121212] text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-black transition-colors"
        >
          Discover The Collection
        </button>
      </section>
    </div>
  );
};
