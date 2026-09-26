import React, { useState } from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  Check, 
  Compass, 
  Feather, 
  Eye, 
  Wind, 
  ShieldCheck, 
  Layers,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import { OLD_MONEY_OUTFITS } from '../data/outfits';
import { PRODUCTS } from '../data/products';
import { Outfit, Product } from '../types';
import { useShop } from '../context/ShopContext';

export const OldMoneyZenOutfits: React.FC<{
  title?: string;
  subtitle?: string;
  showSensoryPillars?: boolean;
}> = ({
  title = 'Old Money Outfits · The Zen Archive',
  subtitle = 'Understated aristocratic tailoring infused with peaceful Japanese minimalism and tactile serenity.',
  showSensoryPillars = true,
}) => {
  const { addOutfitToCart, addToCart, navigateTo, toggleWishlist, isInWishlist } = useShop();
  const [selectedOutfitIndex, setSelectedOutfitIndex] = useState(0);
  const currentOutfit = OLD_MONEY_OUTFITS[selectedOutfitIndex];

  // Custom size selection state for each piece in current outfit
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    'zenvy-01': 'M',
    'zenvy-02': 'M',
    'zenvy-03': 'L',
    'zenvy-04': 'M',
    'zenvy-05': 'L',
    'zenvy-06': 'M',
    'zenvy-07': 'L',
    'zenvy-08': 'M',
    'zenvy-09': 'M',
    'zenvy-10': 'M',
    'zenvy-11': 'L',
    'zenvy-12': 'M',
  });

  // Calculate ensemble total
  const ensembleProducts = currentOutfit.pieces
    .map((piece) => {
      const product = PRODUCTS.find((p) => p.id === piece.productId);
      return { piece, product };
    })
    .filter((item): item is { piece: (typeof currentOutfit.pieces)[0]; product: Product } => !!item.product);

  const ensembleSubtotal = ensembleProducts.reduce((sum, item) => sum + item.product.price, 0);
  const ensembleDiscountPrice = Math.round(ensembleSubtotal * 0.9);

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddPiece = (product: Product, defaultColor: string, role: string) => {
    const size = selectedSizes[product.id] || product.sizes[0] || 'M';
    addToCart(product, defaultColor, size, 1);
  };

  const sensoryPillars = [
    {
      icon: Feather,
      title: 'Sense of Touch',
      sub: 'Tactile Tranquility',
      desc: 'Double-faced Mongolian cashmere, unbleached Irish slub flax, and combed silk that drape against bare skin with weightless calm.',
    },
    {
      icon: Eye,
      title: 'Sense of Sight',
      sub: 'Muted Harmonies',
      desc: 'A palette born of natural minerals: Sand ivory, warm espresso, stone olive, and melange charcoal. Strictly zero flashy logos.',
    },
    {
      icon: Wind,
      title: 'Sense of Breath',
      sub: 'Fluid Aerodynamics',
      desc: 'Unstructured shoulders and double-pleated Gurkha trousers that encourage airflow and unimpeded natural posture.',
    },
    {
      icon: Sparkles,
      title: 'Sense of Mind',
      sub: 'Wabi-Sabi Restraint',
      desc: 'Quiet authority. Every horn button, hidden placket, and pick-stitched lapel is executed with meditative precision.',
    },
    {
      icon: ShieldCheck,
      title: 'Sense of Permanence',
      sub: 'Generational Craft',
      desc: 'Constructed to transcend micro-trend obsolescence. Heirloom garments designed to be worn across decades.',
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#737373]">
          Curated Ensembles
        </span>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight font-['Syne'] text-[#121212] mt-2">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-[#666666] max-w-2xl mx-auto mt-3 font-light leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Outfit Selector Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none border-b border-[#121212]/10">
          {OLD_MONEY_OUTFITS.map((outfit, index) => {
            const isSelected = index === selectedOutfitIndex;
            return (
              <button
                key={outfit.id}
                onClick={() => setSelectedOutfitIndex(index)}
                className={`flex items-center gap-3.5 px-5 py-3 text-left whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#121212] text-white border-[#121212] shadow-sm'
                    : 'bg-white text-[#121212] border-[#121212]/15 hover:border-[#121212]'
                }`}
              >
                <div className="w-10 h-12 bg-[#F3F3F0] overflow-hidden shrink-0">
                  <img
                    src={outfit.image}
                    alt={outfit.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono opacity-60">0{index + 1}</span>
                    <span className="text-xs font-bold uppercase tracking-wider font-['Syne']">
                      {outfit.name}
                    </span>
                  </div>
                  <p className={`text-[10px] truncate max-w-[200px] mt-0.5 ${isSelected ? 'text-white/70' : 'text-[#737373]'}`}>
                    {outfit.vibe}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Active Outfit Stage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Large Editorial Photography */}
          <div className="lg:col-span-6 relative aspect-[3/4] bg-[#F3F3F0] overflow-hidden group">
            <img
              src={currentOutfit.image}
              alt={currentOutfit.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Badges on Image */}
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
              <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-bold tracking-[0.2em] uppercase text-[#121212]">
                {currentOutfit.vibe}
              </span>
              <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-[10px] font-semibold tracking-wider uppercase text-white/90">
                {currentOutfit.occasion}
              </span>
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="text-[11px] font-mono tracking-widest uppercase text-white/80">
                {currentOutfit.zenSense}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold uppercase font-['Syne'] mt-1">
                {currentOutfit.name}
              </h3>
              <p className="text-xs text-white/90 mt-1 italic font-serif">
                &quot;{currentOutfit.tagline}&quot;
              </p>
            </div>
          </div>

          {/* Right Column: Narrative & Garment Acquisition Module */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#737373]">
                <Layers className="w-3.5 h-3.5" />
                <span>Outfit Formula · 0{selectedOutfitIndex + 1} of 05</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold uppercase font-['Syne'] text-[#121212] mt-1">
                {currentOutfit.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#555555] mt-3 leading-relaxed font-light">
                {currentOutfit.description}
              </p>
            </div>

            {/* Styling Rituals Accordion / Card */}
            <div className="p-4 bg-[#F5F5F1] border border-[#121212]/10 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[#121212] flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[#555555]" />
                <span>Styling & Poise Rituals</span>
              </h4>
              <ul className="space-y-1.5 pt-1">
                {currentOutfit.stylingNotes.map((note, idx) => (
                  <li key={idx} className="text-xs text-[#555555] flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#121212] mt-1.5 shrink-0" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Garments in this Ensemble */}
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#121212]/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212]">
                  Garments in this Look ({ensembleProducts.length} Pieces)
                </h4>
                <span className="text-[11px] text-[#737373]">
                  Bundle Privilege: <strong className="text-[#121212]">10% Off</strong>
                </span>
              </div>

              <div className="space-y-3">
                {ensembleProducts.map(({ piece, product }) => {
                  const selectedSize = selectedSizes[product.id] || piece.defaultSize || product.sizes[0];
                  const inWish = isInWishlist(product.id);

                  return (
                    <div
                      key={product.id}
                      className="p-3 bg-white border border-[#121212]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#121212] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => navigateTo('product', product.id)}
                          className="w-14 h-18 bg-[#F3F3F0] overflow-hidden shrink-0 cursor-pointer"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-[#F2F2EE] text-[#555555]">
                            {piece.role}
                          </span>
                          <h5
                            onClick={() => navigateTo('product', product.id)}
                            className="text-xs font-semibold text-[#121212] hover:underline cursor-pointer mt-1"
                          >
                            {product.name}
                          </h5>
                          <p className="text-[11px] text-[#737373]">
                            Color: {piece.defaultColor} · ${product.price}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                        {/* Size Picker */}
                        <div className="flex items-center gap-1">
                          {product.sizes.map((s) => (
                            <button
                              key={s}
                              onClick={() => handleSizeChange(product.id, s)}
                              className={`w-7 h-7 text-[10px] font-semibold flex items-center justify-center border transition-colors ${
                                selectedSize === s
                                  ? 'bg-[#121212] text-white border-[#121212]'
                                  : 'bg-white text-[#666666] border-[#121212]/15 hover:border-[#121212]'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>

                        {/* Individual Add */}
                        <button
                          onClick={() => handleAddPiece(product, piece.defaultColor || product.colors[0].name, piece.role)}
                          className="px-3 py-1.5 bg-[#F4F4F0] hover:bg-[#121212] hover:text-white text-xs font-bold uppercase tracking-wider text-[#121212] transition-colors"
                          title="Add individual garment to bag"
                        >
                          Add
                        </button>

                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className={`p-1.5 transition-colors ${inWish ? 'text-red-500' : 'text-[#888888] hover:text-[#121212]'}`}
                          aria-label="Wishlist"
                        >
                          <Bookmark className={`w-4 h-4 ${inWish ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bundle Purchase Card */}
            <div className="p-5 bg-[#121212] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/60">
                  Curated Ensemble Bundle
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-bold font-mono">${ensembleDiscountPrice}</span>
                  <span className="text-xs text-white/50 line-through font-mono">${ensembleSubtotal}</span>
                  <span className="text-[11px] text-emerald-400 font-semibold uppercase">Save 10%</span>
                </div>
                <p className="text-[11px] text-white/70 mt-1">
                  Includes all {ensembleProducts.length} coordinated garments in selected sizes.
                </p>
              </div>

              <button
                onClick={() => addOutfitToCart(currentOutfit, selectedSizes)}
                className="w-full sm:w-auto px-6 py-3.5 bg-white text-[#121212] text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#EBEBE6] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Acquire Full Outfit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* The 5 Zen Senses of Quiet Luxury Section */}
      {showSensoryPillars && (
        <section className="py-20 bg-[#F4F4F0] border-y border-[#121212]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#737373]">
                Design Philosophy
              </span>
              <h3 className="text-2xl sm:text-4xl font-bold uppercase font-['Syne'] text-[#121212] mt-1">
                The Five Zen Senses
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] mt-2 font-light">
                How quiet luxury and Japanese wabi-sabi balance create true sartorial equilibrium.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {sensoryPillars.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 bg-white border border-[#121212]/10 flex flex-col justify-between hover:border-[#121212] transition-colors group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-9 h-9 bg-[#F4F4F0] flex items-center justify-center text-[#121212] group-hover:bg-[#121212] group-hover:text-white transition-colors">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-mono font-bold text-[#888888]">0{idx + 1}</span>
                      </div>
                      <h4 className="text-xs font-bold uppercase tracking-wider font-['Syne'] text-[#121212]">
                        {pillar.title}
                      </h4>
                      <p className="text-[11px] font-medium text-[#737373] mt-0.5">
                        {pillar.sub}
                      </p>
                      <p className="text-xs text-[#555555] leading-relaxed mt-3 font-light">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
