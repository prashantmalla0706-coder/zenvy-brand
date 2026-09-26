import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { COLLECTIONS } from '../data/collections';

export const CollectionsView: React.FC = () => {
  const { navigateTo, setShopCategoryFilter } = useShop();

  const handleCollectionClick = (collectionId: string) => {
    if (collectionId === 'old-money-zen') {
      setShopCategoryFilter('Tailoring');
    } else if (collectionId === 'quiet-luxury-knitwear') {
      setShopCategoryFilter('Knitwear');
    } else if (collectionId === 'tailored-outerwear') {
      setShopCategoryFilter('Outerwear');
    } else if (collectionId === 'resort-riviera') {
      setShopCategoryFilter('Essentials');
    } else if (collectionId === 'minimalist-essentials') {
      setShopCategoryFilter('Trousers');
    } else {
      setShopCategoryFilter('All');
    }
    navigateTo('shop');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#737373]">
          Curated Archives & Drops
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight uppercase font-['Syne'] text-[#121212] mt-2">
          Collections
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] mt-3 font-light leading-relaxed">
          Explore seasonal capsules, core foundational essentials, and numbered micro-batch releases crafted in collaboration with master weavers.
        </p>
      </div>

      {/* Collections Stack */}
      <div className="space-y-12">
        {COLLECTIONS.map((col, idx) => (
          <div
            key={col.id}
            onClick={() => handleCollectionClick(col.id)}
            className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 bg-[#F4F4F0] border border-[#121212]/10 overflow-hidden transition-all duration-300 hover:shadow-xl"
          >
            {/* Image (alternates left/right) */}
            <div
              className={`lg:col-span-7 relative h-[380px] sm:h-[460px] overflow-hidden bg-black ${
                idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'
              }`}
            >
              <img
                src={col.image}
                alt={col.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
              {col.badge && (
                <div className="absolute top-4 left-4 bg-white/95 text-[#121212] text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 backdrop-blur-xs">
                  {col.badge}
                </div>
              )}
            </div>

            {/* Editorial Content */}
            <div
              className={`lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between ${
                idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 text-xs tracking-wider uppercase text-[#737373]">
                  <span>{col.season}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{col.itemCount} Garments</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase font-['Syne'] text-[#121212] mt-3">
                  {col.name}
                </h2>

                <p className="text-xs sm:text-sm font-serif italic text-[#444444] mt-2">
                  &quot;{col.tagline}&quot;
                </p>

                <p className="text-xs text-[#666666] mt-4 leading-relaxed font-light">
                  {col.description}
                </p>
              </div>

              <div className="pt-8">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#121212] group-hover:translate-x-1 transition-transform"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
