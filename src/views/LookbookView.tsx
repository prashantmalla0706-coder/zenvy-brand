import React, { useState } from 'react';
import { ArrowRight, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { LOOKBOOK_LOOKS } from '../data/collections';
import { PRODUCTS } from '../data/products';

export const LookbookView: React.FC = () => {
  const { navigateTo, setQuickViewProduct, addToCart } = useShop();
  const [selectedLookId, setSelectedLookId] = useState<string>(LOOKBOOK_LOOKS[0].id);

  const activeLook = LOOKBOOK_LOOKS.find((l) => l.id === selectedLookId) || LOOKBOOK_LOOKS[0];
  const lookProducts = PRODUCTS.filter((p) => activeLook.itemIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#737373]">
          Campaign Photography
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight uppercase font-['Syne'] text-[#121212] mt-2">
          Editorial Lookbook
        </h1>
        <p className="text-xs sm:text-sm text-[#666666] mt-3 font-light leading-relaxed">
          Curated styling ensembles captured on medium format film across architectural destinations in Berlin, Paris, and Tokyo.
        </p>
      </div>

      {/* Look Selector Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-6 mb-8 border-b border-[#121212]/10">
        {LOOKBOOK_LOOKS.map((look) => (
          <button
            key={look.id}
            onClick={() => setSelectedLookId(look.id)}
            className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors whitespace-nowrap border ${
              selectedLookId === look.id
                ? 'bg-[#121212] text-white border-[#121212]'
                : 'border-[#121212]/15 text-[#555555] hover:border-[#121212]'
            }`}
          >
            {look.title.split(':')[0]}
          </button>
        ))}
      </div>

      {/* Main Editorial Feature */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Full Editorial Portrait / Landscape */}
        <div className="lg:col-span-8 bg-black relative aspect-[16/10] overflow-hidden">
          <img
            src={activeLook.image}
            alt={activeLook.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover brightness-95 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70">
              {activeLook.location} · {activeLook.season}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Syne'] uppercase mt-1">
              {activeLook.title}
            </h2>
            <p className="text-xs sm:text-sm font-serif italic text-white/90 mt-2 max-w-lg">
              &quot;{activeLook.quote}&quot;
            </p>
          </div>
        </div>

        {/* "Shop The Look" Items Module */}
        <div className="lg:col-span-4 bg-[#F4F4F0] border border-[#121212]/10 p-6 md:p-8 space-y-6">
          <div>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#737373]">
              Curated Ensemble
            </span>
            <h3 className="text-xl font-bold uppercase font-['Syne'] text-[#121212] mt-1">
              Shop The Look
            </h3>
            <p className="text-xs text-[#666666] mt-1">
              Click any garment to view details or add directly to your bag.
            </p>
          </div>

          <div className="space-y-4">
            {lookProducts.map((prod) => (
              <div
                key={prod.id}
                className="flex gap-4 p-3 bg-white border border-[#121212]/10 hover:border-[#121212]/40 transition-colors"
              >
                <div
                  className="w-16 h-20 bg-[#F3F3F0] shrink-0 cursor-pointer overflow-hidden"
                  onClick={() => navigateTo('product', prod.id)}
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4
                      onClick={() => navigateTo('product', prod.id)}
                      className="text-xs font-semibold text-[#121212] hover:underline cursor-pointer line-clamp-1"
                    >
                      {prod.name}
                    </h4>
                    <p className="text-[11px] text-[#737373] mt-0.5">{prod.category}</p>
                    <p className="font-mono text-xs font-bold text-[#121212] mt-1">
                      ${prod.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        const defaultSize = prod.sizes.includes('M') ? 'M' : prod.sizes[0];
                        addToCart(prod, prod.colors[0].name, defaultSize, 1);
                      }}
                      className="flex-1 py-1.5 bg-[#121212] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                    <button
                      onClick={() => setQuickViewProduct(prod)}
                      className="p-1.5 border border-[#121212]/20 hover:border-[#121212] text-[#121212] transition-colors"
                      title="Quick View"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
