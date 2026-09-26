import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlistProducts,
    toggleWishlist,
    addToCart,
    navigateTo,
  } = useShop();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#FBFBFA] shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="p-6 border-b border-[#121212]/10 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h2 className="text-base font-bold tracking-[0.15em] uppercase font-['Syne']">
              Wishlist Archive
            </h2>
            <span className="text-xs text-[#737373] tabular-nums">
              ({wishlistProducts.length})
            </span>
          </div>

          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1 text-[#121212] hover:opacity-60 transition-opacity"
            aria-label="Close wishlist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {wishlistProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 text-[#737373]">
              <Heart className="w-12 h-12 stroke-[1] mb-4 opacity-40" />
              <p className="text-base font-medium text-[#121212]">Your wishlist is empty</p>
              <p className="text-xs mt-1 max-w-xs">
                Save your favorite runway pieces and capsule releases to view them later.
              </p>
              <button
                onClick={() => {
                  setIsWishlistOpen(false);
                  navigateTo('shop');
                }}
                className="mt-6 py-3 px-6 bg-[#121212] text-white text-xs font-semibold tracking-widest uppercase hover:bg-black transition-colors"
              >
                Explore Shop
              </button>
            </div>
          ) : (
            wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="flex gap-4 pb-6 border-b border-[#121212]/10 last:border-b-0"
              >
                <div
                  className="w-20 h-26 bg-[#F3F3F0] shrink-0 cursor-pointer overflow-hidden"
                  onClick={() => {
                    setIsWishlistOpen(false);
                    navigateTo('product', product.id);
                  }}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3
                        onClick={() => {
                          setIsWishlistOpen(false);
                          navigateTo('product', product.id);
                        }}
                        className="text-xs font-semibold text-[#121212] hover:underline cursor-pointer line-clamp-1"
                      >
                        {product.name}
                      </h3>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="text-[#888888] hover:text-[#121212] transition-colors p-1"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#737373] mt-1">
                      <span>{product.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums font-semibold text-[#121212]">${product.price}</span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => {
                        const defaultSize = product.sizes.includes('M') ? 'M' : product.sizes[0];
                        addToCart(product, product.colors[0].name, defaultSize, 1);
                      }}
                      className="w-full py-2 px-3 bg-[#121212] hover:bg-black text-white text-[11px] font-semibold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
