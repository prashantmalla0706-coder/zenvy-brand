import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, navigateTo } = useShop();
  const [searchTerm, setSearchTerm] = useState('');

  const trendingQueries = [
    'Unconstructed Cashmere Blazer',
    'Johnny Collar Leisure Polo',
    'Double-Pleated Gurkha Trousers',
    'Zen Gabardine Trench Coat',
    'Tactile Fisherman Cable Knit',
    'Raw Slub Linen Overshirt',
  ];

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.collection.toLowerCase().includes(term) ||
        p.subtitle.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  if (!isSearchOpen) return null;

  const handleSelectProduct = (productId: string) => {
    setIsSearchOpen(false);
    setSearchTerm('');
    navigateTo('product', productId);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-start bg-black/60 backdrop-blur-sm">
      <div className="bg-[#FBFBFA] w-full border-b border-[#121212]/15 shadow-2xl p-6 md:p-8 max-h-[85vh] flex flex-col">
        <div className="max-w-4xl mx-auto w-full">
          {/* Top Bar with Input */}
          <div className="flex items-center gap-3 pb-6 border-b border-[#121212]/15">
            <Search className="w-5 h-5 text-[#888888]" />
            <input
              type="text"
              autoFocus
              placeholder="Search garments, fabrics, styles, or collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 text-base md:text-xl font-light text-[#121212] bg-transparent focus:outline-none placeholder:text-[#999999]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-[#888888] hover:text-[#121212] px-2 py-1 uppercase"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setSearchTerm('');
              }}
              className="p-1 text-[#121212] hover:opacity-60 transition-opacity ml-2"
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Results Area */}
          <div className="pt-6 overflow-y-auto max-h-[60vh]">
            {searchTerm.trim() === '' ? (
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-[#737373] mb-3">
                  Trending Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {trendingQueries.map((query) => (
                    <button
                      key={query}
                      onClick={() => setSearchTerm(query)}
                      className="px-3.5 py-1.5 bg-[#F2F2EE] hover:bg-[#E8E8E2] text-xs text-[#121212] tracking-wide transition-colors flex items-center gap-1.5"
                    >
                      <Search className="w-3 h-3 opacity-60" />
                      <span>{query}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-12 text-center text-[#737373]">
                <p className="text-sm">No items found matching &quot;{searchTerm}&quot;</p>
                <p className="text-xs mt-1">Try searching for &quot;Overcoat&quot;, &quot;Cashmere&quot;, &quot;Hoodie&quot;, or &quot;Denim&quot;</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="group cursor-pointer flex flex-col"
                  >
                    <div className="aspect-[3/4] bg-[#F2F2EE] overflow-hidden mb-2">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="text-[11px] text-[#737373] uppercase tracking-wider">
                      {product.category}
                    </div>
                    <div className="text-xs font-semibold text-[#121212] group-hover:underline line-clamp-1 mt-0.5">
                      {product.name}
                    </div>
                    <div className="text-xs font-mono tabular-nums text-[#121212] mt-1">
                      ${product.price}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1" onClick={() => setIsSearchOpen(false)} />
    </div>
  );
};
