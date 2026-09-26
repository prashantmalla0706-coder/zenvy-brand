import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, Grid3X3, Grid2X2, X, RotateCcw, Layers, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { Category, Gender } from '../types';
import { ProductCard } from '../components/ProductCard';
import { OldMoneyZenOutfits } from '../components/OldMoneyZenOutfits';

export const ShopView: React.FC = () => {
  const {
    shopCategoryFilter,
    setShopCategoryFilter,
    shopGenderFilter,
    setShopGenderFilter,
    shopSearchQuery,
    setShopSearchQuery,
    selectedCollectionId,
  } = useShop();

  // Tab State: Individual Garments vs Curated Outfits
  const [activeTab, setActiveTab] = useState<'garments' | 'outfits'>('garments');

  // Filters State
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [gridCols, setGridCols] = useState<2 | 4>(4);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available Filter Options
  const categories: Category[] = [
    'All',
    'Outerwear',
    'Tailoring',
    'Knitwear',
    'Streetwear',
    'Trousers',
    'Essentials',
    'Accessories',
  ];

  const genders: Gender[] = ['All', 'Men', 'Women', 'Unisex'];
  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL'];
  const collections = [
    'All',
    'Old Money & Zen Archive',
    'Quiet Luxury & Zen',
    'Tailored Archive',
    'Resort & Riviera Linens',
    'Minimalist Essentials',
  ];

  const colors = [
    'All',
    'Sand Ivory',
    'Oatmeal Ecru',
    'Quiet Charcoal',
    'Espresso Roast',
    'Stone Olive',
    'Natural Ecru',
    'Washed Flax',
    'Forest Olive',
    'British Khaki',
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category
      if (shopCategoryFilter !== 'All' && product.category !== shopCategoryFilter) {
        return false;
      }
      // Gender
      if (shopGenderFilter !== 'All' && product.gender !== shopGenderFilter && product.gender !== 'Unisex') {
        return false;
      }
      // Size
      if (selectedSize !== 'All' && !product.sizes.includes(selectedSize as any)) {
        return false;
      }
      // Color
      if (
        selectedColor !== 'All' &&
        !product.colors.some((c) => c.name.toLowerCase().includes(selectedColor.toLowerCase()))
      ) {
        return false;
      }
      // Collection
      if (selectedCollection !== 'All' && product.collection !== selectedCollection) {
        return false;
      }
      // Price
      if (product.price > maxPrice) {
        return false;
      }
      // Search
      if (
        shopSearchQuery.trim() &&
        !product.name.toLowerCase().includes(shopSearchQuery.toLowerCase()) &&
        !product.category.toLowerCase().includes(shopSearchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'bestseller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      return 0; // featured default
    });
  }, [
    shopCategoryFilter,
    shopGenderFilter,
    selectedSize,
    selectedColor,
    selectedCollection,
    maxPrice,
    shopSearchQuery,
    sortBy,
  ]);

  const activeFilterCount =
    (shopCategoryFilter !== 'All' ? 1 : 0) +
    (shopGenderFilter !== 'All' ? 1 : 0) +
    (selectedSize !== 'All' ? 1 : 0) +
    (selectedColor !== 'All' ? 1 : 0) +
    (selectedCollection !== 'All' ? 1 : 0) +
    (maxPrice < 1000 ? 1 : 0);

  const resetAllFilters = () => {
    setShopCategoryFilter('All');
    setShopGenderFilter('All');
    setSelectedSize('All');
    setSelectedColor('All');
    setSelectedCollection('All');
    setMaxPrice(1000);
    setShopSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Page Title */}
      <div className="pb-8 border-b border-[#121212]/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#737373]">
            Curated Wardrobe
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight uppercase font-['Syne'] text-[#121212] mt-1">
            {shopCategoryFilter === 'All' ? 'Complete Collection' : shopCategoryFilter}
          </h1>
          <p className="text-xs text-[#737373] mt-1">
            Displaying <span className="font-mono tabular-nums text-[#121212] font-semibold">{filteredProducts.length}</span> pieces engineered with precision fabrics.
          </p>
        </div>

        {/* Sorting & Grid Layout Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-3.5 py-2 border border-[#121212]/20 text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase text-[#737373] hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#121212]/15 px-3 py-2 text-xs font-medium uppercase tracking-wider text-[#121212] focus:outline-none focus:border-[#121212]"
            >
              <option value="featured">Featured Curations</option>
              <option value="newest">Newest Arrivals</option>
              <option value="bestseller">Best Sellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Grid Toggle (Desktop) */}
          <div className="hidden sm:flex border border-[#121212]/15">
            <button
              onClick={() => setGridCols(2)}
              className={`p-2 transition-colors ${
                gridCols === 2 ? 'bg-[#121212] text-white' : 'text-[#737373] hover:text-[#121212]'
              }`}
              title="2-Column Editorial View"
              aria-label="2-column grid"
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridCols(4)}
              className={`p-2 transition-colors ${
                gridCols === 4 ? 'bg-[#121212] text-white' : 'text-[#737373] hover:text-[#121212]'
              }`}
              title="4-Column Grid View"
              aria-label="4-column grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Wardrobe View Mode Tabs */}
      <div className="flex items-center gap-3 mt-6 border-b border-[#121212]/10 pb-4">
        <button
          onClick={() => setActiveTab('garments')}
          className={`px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] transition-colors border ${
            activeTab === 'garments'
              ? 'bg-[#121212] text-white border-[#121212]'
              : 'bg-white text-[#666666] border-[#121212]/15 hover:border-[#121212]'
          }`}
        >
          Individual Pieces ({filteredProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('outfits')}
          className={`px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] transition-colors border flex items-center gap-2 ${
            activeTab === 'outfits'
              ? 'bg-[#121212] text-white border-[#121212]'
              : 'bg-white text-[#666666] border-[#121212]/15 hover:border-[#121212]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Curated Old Money Outfits (5 Ensembles)</span>
        </button>
      </div>

      {activeTab === 'outfits' ? (
        <div className="py-8">
          <OldMoneyZenOutfits
            title="Old Money Outfits · The Zen Archive"
            subtitle="Complete coordinated looks styled with Zen wabi-sabi balance. Bundle full outfits or select individual garments."
            showSensoryPillars={true}
          />
        </div>
      ) : (
        /* Main Layout: Sidebar Filters + Products Grid */
        <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-8 sticky top-24 pr-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#121212]/10">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#121212] flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              <span>Refine Search</span>
            </span>

            {activeFilterCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="text-[11px] text-[#737373] hover:text-[#121212] flex items-center gap-1 underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#121212] mb-3">
              Garment Category
            </h3>
            <div className="flex flex-col gap-1.5 text-xs text-[#666666]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setShopCategoryFilter(cat)}
                  className={`text-left py-1 transition-colors flex items-center justify-between ${
                    shopCategoryFilter === cat
                      ? 'text-[#121212] font-semibold'
                      : 'hover:text-[#121212]'
                  }`}
                >
                  <span>{cat}</span>
                  {shopCategoryFilter === cat && <span className="w-1.5 h-1.5 bg-[#121212]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Gender Filter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#121212] mb-3">
              Department
            </h3>
            <div className="flex gap-2">
              {genders.map((g) => (
                <button
                  key={g}
                  onClick={() => setShopGenderFilter(g)}
                  className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors border ${
                    shopGenderFilter === g
                      ? 'bg-[#121212] text-white border-[#121212]'
                      : 'border-[#121212]/15 text-[#555555] hover:border-[#121212]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#121212] mb-3">
              Size
            </h3>
            <div className="grid grid-cols-3 gap-1.5">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-1.5 text-xs font-medium uppercase tracking-wider transition-colors border ${
                    selectedSize === s
                      ? 'bg-[#121212] text-white border-[#121212]'
                      : 'border-[#121212]/15 text-[#555555] hover:border-[#121212]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-bold uppercase tracking-wider text-[#121212]">
                Maximum Price
              </span>
              <span className="font-mono tabular-nums font-semibold text-[#121212]">
                ${maxPrice}
              </span>
            </div>
            <input
              type="range"
              min="90"
              max="1000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#121212]"
            />
            <div className="flex justify-between text-[10px] text-[#737373] mt-1 font-mono">
              <span>$90</span>
              <span>$1,000+</span>
            </div>
          </div>

          {/* Collection Filter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#121212] mb-3">
              Release Collection
            </h3>
            <div className="flex flex-col gap-1.5 text-xs text-[#666666]">
              {collections.map((col) => (
                <button
                  key={col}
                  onClick={() => setSelectedCollection(col)}
                  className={`text-left py-1 transition-colors flex items-center justify-between ${
                    selectedCollection === col
                      ? 'text-[#121212] font-semibold'
                      : 'hover:text-[#121212]'
                  }`}
                >
                  <span>{col}</span>
                  {selectedCollection === col && <span className="w-1.5 h-1.5 bg-[#121212]" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-9">
          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
              <span className="text-[#737373] uppercase tracking-wider mr-1">Active:</span>

              {shopCategoryFilter !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#121212]/15 text-[#121212]">
                  <span>Category: {shopCategoryFilter}</span>
                  <button onClick={() => setShopCategoryFilter('All')}>
                    <X className="w-3 h-3 hover:text-black" />
                  </button>
                </span>
              )}

              {shopGenderFilter !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#121212]/15 text-[#121212]">
                  <span>Department: {shopGenderFilter}</span>
                  <button onClick={() => setShopGenderFilter('All')}>
                    <X className="w-3 h-3 hover:text-black" />
                  </button>
                </span>
              )}

              {selectedSize !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#121212]/15 text-[#121212]">
                  <span>Size: {selectedSize}</span>
                  <button onClick={() => setSelectedSize('All')}>
                    <X className="w-3 h-3 hover:text-black" />
                  </button>
                </span>
              )}

              {selectedCollection !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#121212]/15 text-[#121212]">
                  <span>Collection: {selectedCollection}</span>
                  <button onClick={() => setSelectedCollection('All')}>
                    <X className="w-3 h-3 hover:text-black" />
                  </button>
                </span>
              )}

              {maxPrice < 1000 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#121212]/15 text-[#121212]">
                  <span>Under ${maxPrice}</span>
                  <button onClick={() => setMaxPrice(1000)}>
                    <X className="w-3 h-3 hover:text-black" />
                  </button>
                </span>
              )}

              <button
                onClick={resetAllFilters}
                className="text-[#737373] hover:text-[#121212] underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Items */}
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center text-[#737373] bg-[#F4F4F0] p-8 border border-[#121212]/10">
              <p className="text-base font-medium text-[#121212]">No garments match your active filters</p>
              <p className="text-xs mt-1">Try resetting your price or category filters to explore the rest of the collection.</p>
              <button
                onClick={resetAllFilters}
                className="mt-6 py-2.5 px-6 bg-[#121212] text-white text-xs font-semibold tracking-wider uppercase hover:bg-black transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-6 lg:gap-8 ${
                gridCols === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3'
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
      )}

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#FBFBFA] shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#121212]/10">
                <span className="font-bold text-sm uppercase tracking-wider">Refine Filters</span>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2">Category</h4>
                <div className="flex flex-col gap-1 text-xs">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setShopCategoryFilter(c)}
                      className={`text-left py-1 ${shopCategoryFilter === c ? 'font-bold' : 'text-[#666666]'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2">Size</h4>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-1 text-xs border ${selectedSize === s ? 'bg-[#121212] text-white' : 'border-[#121212]/20'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#121212]/10 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#121212] text-white text-xs font-bold uppercase tracking-wider"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              <button
                onClick={resetAllFilters}
                className="w-full py-2 text-center text-xs uppercase text-[#737373]"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
