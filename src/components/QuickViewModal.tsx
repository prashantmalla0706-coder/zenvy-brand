import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Plus, Minus, ArrowRight, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
    setSizeGuideOpen,
  } = useShop();

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!quickViewProduct) return null;

  const isFavorited = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(
      quickViewProduct,
      quickViewProduct.colors[selectedColorIndex].name,
      selectedSize,
      quantity
    );
    setQuickViewProduct(null);
  };

  const handleViewFullDetails = () => {
    const id = quickViewProduct.id;
    setQuickViewProduct(null);
    navigateTo('product', id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FBFBFA] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-[#121212]/10 relative">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-[#121212] transition-colors"
          aria-label="Close quick view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Images */}
          <div className="bg-[#F3F3F0] p-4 flex flex-col justify-between">
            <div className="aspect-[3/4] overflow-hidden bg-white/50">
              <img
                src={quickViewProduct.images[activeImageIndex] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {quickViewProduct.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {quickViewProduct.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-14 h-18 shrink-0 overflow-hidden border ${
                      activeImageIndex === i ? 'border-[#121212]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Actions */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-[#737373] tracking-wider uppercase mb-1">
                <span>{quickViewProduct.category}</span>
                <span aria-hidden="true">·</span>
                <span>{quickViewProduct.collection}</span>
              </div>

              <h2 className="text-lg font-bold text-[#121212] tracking-tight">
                {quickViewProduct.name}
              </h2>

              <p className="text-xs text-[#666666] mt-1">
                {quickViewProduct.subtitle}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2 font-mono tabular-nums text-lg font-bold text-[#121212] mt-3">
                <span>${quickViewProduct.price}</span>
                {quickViewProduct.originalPrice && (
                  <span className="text-sm text-[#888888] font-normal line-through">
                    ${quickViewProduct.originalPrice}
                  </span>
                )}
              </div>

              {/* Color Selector */}
              <div className="mt-5">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider text-[#555555]">
                    Color: {quickViewProduct.colors[selectedColorIndex].name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {quickViewProduct.colors.map((color, idx) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`w-6 h-6 rounded-full border transition-all ${
                        selectedColorIndex === idx ? 'border-[#121212] scale-110 shadow-xs' : 'border-black/20 opacity-80'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mt-5">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold uppercase tracking-wider text-[#555555]">
                    Select Size
                  </span>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-[11px] text-[#737373] hover:text-[#121212] underline"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {quickViewProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 text-xs font-semibold uppercase tracking-wider transition-colors border ${
                        selectedSize === size
                          ? 'bg-[#121212] text-white border-[#121212]'
                          : 'bg-white text-[#121212] border-[#121212]/15 hover:border-[#121212]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="mt-5 flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#555555]">
                  Quantity
                </span>
                <div className="flex items-center border border-[#121212]/20 text-xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 hover:bg-[#121212]/5 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-3 font-mono tabular-nums">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1.5 hover:bg-[#121212]/5 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 space-y-2.5 mt-6 border-t border-[#121212]/10">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-[#121212] hover:bg-black text-white text-xs font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  className={`p-3.5 border transition-colors ${
                    isFavorited
                      ? 'bg-[#121212] text-white border-[#121212]'
                      : 'border-[#121212]/20 text-[#121212] hover:border-[#121212]'
                  }`}
                  aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleViewFullDetails}
                className="w-full py-2.5 text-center text-xs tracking-wider uppercase text-[#737373] hover:text-[#121212] flex items-center justify-center gap-1 transition-colors"
              >
                <span>View Complete Product Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
