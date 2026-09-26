import React from 'react';
import { ArrowRight, Sparkles, Shield, Compass, ChevronRight, Eye, Feather, Wind } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { OldMoneyZenOutfits } from '../components/OldMoneyZenOutfits';

export const HomeView: React.FC = () => {
  const { navigateTo, setShopCategoryFilter } = useShop();

  const featuredProducts = PRODUCTS.filter((p) => p.isFeatured).slice(0, 4);
  const newArrivals = PRODUCTS.filter((p) => p.isNew).slice(0, 4);

  return (
    <div className="w-full">
      {/* 1. Full-Screen Cinematic Hero Section: Old Money × Zen Harmony */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-[#121212] text-white overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/zenvy_old_money_zen_hero_1790432251674.jpg"
            alt="Zenvy Old Money Zen Campaign"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-[0.78] contrast-[1.05] transition-transform duration-1000 scale-100"
          />
          {/* Measured Scrim for media overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-bold tracking-[0.3em] uppercase mb-4 animate-in fade-in duration-700">
            <span>Quiet Luxury × Zen Serenity</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight uppercase font-['Syne'] leading-[1.05] text-balance max-w-4xl text-white">
            Define Your Style.<br />Wear Your Identity.
          </h1>

          <p className="mt-6 text-sm sm:text-base text-white/90 max-w-2xl font-light tracking-wide leading-relaxed">
            Unconstructed Italian cashmere, double-pleated Gurkha trousers, and tranquil silk-cashmere polos. Generational poise meeting Japanese wabi-sabi restraint — strictly zero logos, pure tactile grace.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigateTo('outfits')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#121212] text-xs font-bold tracking-[0.25em] uppercase hover:bg-[#F2F2EE] transition-all transform hover:-translate-y-0.5 shadow-xl flex items-center justify-center gap-2"
            >
              <span>Explore Old Money Outfits</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => navigateTo('shop')}
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/40 text-white text-xs font-bold tracking-[0.25em] uppercase hover:bg-white/10 hover:border-white transition-all backdrop-blur-xs"
            >
              Shop Full Archive
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60">
          <span className="text-[10px] tracking-[0.25em] uppercase">Scroll</span>
          <div className="w-[1px] h-8 bg-white/40 animate-pulse" />
        </div>
      </section>

      {/* Brand Value Ticker / Micro-Bar */}
      <section className="bg-[#121212] text-white/70 py-4 border-y border-white/10 overflow-hidden text-[11px] font-medium tracking-[0.2em] uppercase">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-center sm:text-left">
          <span className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-white/40" />
            <span>Biella & Kyoto Artisanal Craftsmanship</span>
          </span>
          <span className="hidden md:inline text-white/20">/</span>
          <span>Responsible Mongolian Cashmere & Virgin Wools</span>
          <span className="hidden md:inline text-white/20">/</span>
          <span>Complimentary Express Shipping Over $200</span>
          <span className="hidden md:inline text-white/20">/</span>
          <span>30-Day Effortless Global Returns</span>
        </div>
      </section>

      {/* 2. Interactive Curated Ensembles: Old Money Outfits with Zen Senses */}
      <section className="py-20 border-b border-[#121212]/10 bg-white">
        <OldMoneyZenOutfits 
          title="Old Money Outfits · The Zen Archive"
          subtitle="Complete coordinated looks blending quiet luxury tailoring, wabi-sabi ease, and sensory poise. Acquire full looks with 10% wardrobe privilege."
          showSensoryPillars={true}
        />
      </section>

      {/* 3. Featured Single Garments */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#737373]">
              Signature Pieces
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase font-['Syne'] text-[#121212] mt-1">
              Curated Garments
            </h2>
          </div>

          <button
            onClick={() => navigateTo('shop')}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-[#121212] hover:opacity-70 transition-opacity group"
          >
            <span>View All Garments</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 4-column product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Flagship Collections Visual Showcase (Bento Style with Generated Old Money & Zen Assets) */}
      <section className="py-16 bg-[#F4F4F0] border-y border-[#121212]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#737373]">
              Zenvy Archives
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight uppercase font-['Syne'] text-[#121212] mt-1">
              Capsules & Architectural Themes
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] mt-2">
              Each capsule represents an intentional harmony between quiet aristocratic heritage and contemplative Zen serenity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Old Money Polo & Leisure Knitwear */}
            <div
              onClick={() => {
                setShopCategoryFilter('Knitwear');
                navigateTo('shop');
              }}
              className="group cursor-pointer md:col-span-7 relative h-[480px] bg-black overflow-hidden"
            >
              <img
                src="/src/assets/images/zenvy_old_money_polo_knit_1790432267374.jpg"
                alt="Quiet Luxury Leisure Knitwear"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-85 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70">
                  Quiet Luxury Knitwear
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-['Syne'] uppercase mt-1">
                  Johnny Collar Silk Polos & Cable Knits
                </h3>
                <p className="text-xs text-white/80 mt-2 max-w-md line-clamp-2">
                  Seamless 18-gauge mulberry silk and 4-ply Mongolian cashmere woven for effortless aristocratic leisure.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-white underline underline-offset-4 group-hover:opacity-80">
                  <span>Explore Knitwear</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Zen Sashed Trench & Outerwear */}
            <div
              onClick={() => {
                setShopCategoryFilter('Outerwear');
                navigateTo('shop');
              }}
              className="group cursor-pointer md:col-span-5 relative h-[480px] bg-black overflow-hidden"
            >
              <img
                src="/src/assets/images/zenvy_old_money_trench_coat_1790432282846.jpg"
                alt="Zen Fluid Outerwear"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-85 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70">
                  Zen Outerwear
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-['Syne'] uppercase mt-1">
                  Sculptural Gabardine Trench
                </h3>
                <p className="text-xs text-white/80 mt-2 max-w-sm line-clamp-2">
                  Japanese water-repellent gabardine with meditative sash belt and unconstrained movement.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-white underline underline-offset-4 group-hover:opacity-80">
                  <span>Explore Outerwear</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Unconstructed Tailoring Card */}
            <div
              onClick={() => {
                setShopCategoryFilter('Tailoring');
                navigateTo('shop');
              }}
              className="group cursor-pointer md:col-span-6 relative h-[360px] bg-black overflow-hidden"
            >
              <img
                src="/src/assets/images/zenvy_old_money_zen_hero_1790432251674.jpg"
                alt="Unconstructed Tailoring"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-85 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70">
                  Old Money Tailoring
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-['Syne'] uppercase mt-0.5">
                  Double-Faced Cashmere Blazers & Gurkhas
                </h3>
                <p className="text-xs text-white/80 mt-1 max-w-sm line-clamp-2">
                  Unpadded shoulders, twin-buckle Gurkha waistbands, and natural drape.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-white underline underline-offset-4">
                  <span>Explore Tailoring</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Resort & Riviera Linens Card */}
            <div
              onClick={() => {
                setShopCategoryFilter('Essentials');
                navigateTo('shop');
              }}
              className="group cursor-pointer md:col-span-6 relative h-[360px] bg-black overflow-hidden"
            >
              <img
                src="/src/assets/images/lookbook_editorial_1790431120367.jpg"
                alt="Resort & Riviera Linens"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-85 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/70">
                  Resort Capsule
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-['Syne'] uppercase mt-0.5">
                  Raw Slub Linens & Grandfather Tunics
                </h3>
                <p className="text-xs text-white/80 mt-1 max-w-sm line-clamp-2">
                  Wabi-sabi flax textures and breathable band-collars designed for coastal sanctuaries.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-white underline underline-offset-4">
                  <span>Explore Linens</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. New Arrivals Dedicated Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#121212] mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Just Arrived</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase font-['Syne'] text-[#121212]">
              New Arrivals Drop
            </h2>
          </div>

          <button
            onClick={() => {
              setShopCategoryFilter('All');
              navigateTo('shop');
            }}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-[#121212] hover:opacity-70 transition-opacity"
          >
            <span>View All New Pieces</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. About the Brand Philosophy Section */}
      <section className="py-24 bg-[#121212] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-[4/5] overflow-hidden bg-white/5">
            <img
              src="/src/assets/images/zenvy_old_money_zen_hero_1790432251674.jpg"
              alt="Zenvy Old Money & Zen Craftsmanship"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover brightness-95"
            />
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-white/60 mb-2">
              The Zenvy Creed
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight uppercase font-['Syne'] leading-tight">
              Quiet Wealth.<br />Tranquil Mind.
            </h2>
            <p className="mt-6 text-xs sm:text-sm text-white/80 font-light leading-relaxed">
              We reject the frantic pace of disposable luxury and screaming logos. ZENVY designs for those who carry quiet confidence — where a soft unconstructed cashmere shoulder and a relaxed Gurkha waistband say everything without uttering a single word.
            </p>
            <p className="mt-4 text-xs sm:text-sm text-white/80 font-light leading-relaxed">
              Our patterns combine the permanent dignity of British and Northern Italian tailoring with the contemplative wabi-sabi balance of Kyoto temple courtyards. Every garment is balanced to bring calm to the senses.
            </p>

            <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-3 gap-6 text-center sm:text-left">
              <div>
                <span className="block text-2xl font-bold font-mono tracking-tight text-white">
                  100%
                </span>
                <span className="text-[11px] text-white/60 tracking-wider uppercase mt-1 block">
                  Noble Fibres
                </span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-mono tracking-tight text-white">
                  Zero
                </span>
                <span className="text-[11px] text-white/60 tracking-wider uppercase mt-1 block">
                  Outward Logos
                </span>
              </div>
              <div>
                <span className="block text-2xl font-bold font-mono tracking-tight text-white">
                  30+ Yrs
                </span>
                <span className="text-[11px] text-white/60 tracking-wider uppercase mt-1 block">
                  Garment Lifespan
                </span>
              </div>
            </div>

            <div className="mt-10">
              <button
                onClick={() => navigateTo('about')}
                className="inline-flex items-center gap-3 px-8 py-3.5 border border-white/30 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-[#121212] transition-colors"
              >
                <span>Read The Manifesto</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Press & Curators Quotes */}
      <section className="py-16 bg-[#FBFBFA] border-b border-[#121212]/10 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#737373]">
            Curator Acclaim
          </span>
          <blockquote className="text-xl sm:text-2xl font-serif italic text-[#121212] mt-4 leading-relaxed">
            &quot;ZENVY redefines Old Money luxury by stripping away pretension and infusing it with Zen tranquility. The unconstructed cashmere blazer and Gurkha trousers are absolute modern masterpieces.&quot;
          </blockquote>
          <p className="mt-4 text-xs font-bold tracking-[0.2em] uppercase font-['Syne'] text-[#121212]">
            International Architectural Gazette · Autumn Edit
          </p>
        </div>
      </section>
    </div>
  );
};
