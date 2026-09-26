import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, toggleWishlist, isInWishlist, setQuickViewProduct, addToCart } = useShop();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const currentImage = product.images[isHovered && product.images.length > 1 ? 1 : 0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Quick add default size (M or first size)
    const defaultSize = product.sizes.includes('M') ? 'M' : product.sizes[0];
    addToCart(product, product.colors[selectedColorIndex].name, defaultSize, 1);
  };

  return (
    <div
      onClick={() => navigateTo('product', product.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer flex flex-col transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] w-full bg-[#F3F3F0] overflow-hidden">
        {!imageError ? (
          <img
            src={currentImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#EFEFEA] text-[#666666]">
            <span className="font-['Syne'] text-sm tracking-widest uppercase font-semibold mb-2">ZENVY</span>
            <span className="text-xs">{product.name}</span>
          </div>
        )}

        {/* Minimal Single Badge */}
        {product.isNew && (
          <div className="absolute top-3 left-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#121212] bg-[#FBFBFA]/90 backdrop-blur-xs px-2 py-1">
            NEW
          </div>
        )}
        {!product.isNew && product.originalPrice && (
          <div className="absolute top-3 left-3 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#121212] bg-[#FBFBFA]/90 backdrop-blur-xs px-2 py-1">
            ARCHIVE SALE
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            isFavorited
              ? 'bg-[#121212] text-white opacity-100'
              : 'bg-white/80 backdrop-blur-xs text-[#121212] opacity-0 group-hover:opacity-100 hover:bg-white'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current stroke-transparent' : 'stroke-[1.5]'}`} />
        </button>

        {/* Quick Action Overlay (Bottom) */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 py-2.5 px-3 bg-[#FBFBFA]/95 hover:bg-white text-[#121212] text-[11px] font-medium tracking-wider uppercase backdrop-blur-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          <button
            type="button"
            onClick={handleQuickAdd}
            className="py-2.5 px-3 bg-[#121212] hover:bg-black text-white text-[11px] font-medium tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            title="Quick add to bag"
            aria-label="Add to bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="pt-3 pb-2 flex flex-col gap-1.5">
        {/* Zero-Pill Quiet Metadata */}
        <div className="flex items-center gap-2 text-[11px] tracking-wider uppercase text-[#737373]">
          <span>{product.category}</span>
          <span aria-hidden="true">·</span>
          <span>{product.collection}</span>
        </div>

        {/* Product Title */}
        <h3 className="text-[14px] font-medium text-[#121212] group-hover:text-black line-clamp-1 transition-colors">
          {product.name}
        </h3>

        {/* Color Swatches and Pricing Row */}
        <div className="flex items-center justify-between mt-1">
          {/* Price with tabular numbers */}
          <div className="flex items-baseline gap-2 font-mono tabular-nums text-[14px]">
            <span className="font-semibold text-[#121212]">${product.price}</span>
            {product.originalPrice && (
              <span className="text-[12px] text-[#888888] line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Color Swatch Dots */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.colors.map((color, idx) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColorIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all border ${
                  selectedColorIndex === idx
                    ? 'border-[#121212] scale-125'
                    : 'border-transparent opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={`Select color ${color.name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
