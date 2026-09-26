import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    shippingCost,
    discountAmount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    navigateTo,
  } = useShop();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyCoupon(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoError(null);
      setPromoInput('');
    }
  };

  const freeShippingThreshold = 200;
  const progressToFreeShipping = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigateTo('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#FBFBFA] shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="p-6 border-b border-[#121212]/10 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h2 className="text-base font-bold tracking-[0.15em] uppercase font-['Syne']">
              Shopping Bag
            </h2>
            <span className="text-xs text-[#737373] tabular-nums">
              ({cart.reduce((a, b) => a + b.quantity, 0)})
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 text-[#121212] hover:opacity-60 transition-opacity"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#F3F3F0] px-6 py-3 border-b border-[#121212]/5 text-xs">
          {amountNeededForFreeShipping > 0 ? (
            <p className="text-[#555555]">
              Add <span className="font-semibold text-[#121212] tabular-nums">${amountNeededForFreeShipping}</span> more to unlock <span className="font-medium text-[#121212]">Complimentary Global Express Shipping</span>.
            </p>
          ) : (
            <p className="text-[#121212] font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>You have unlocked Complimentary Express Shipping!</span>
            </p>
          )}
          <div className="w-full bg-[#E5E5E0] h-1.5 mt-2 rounded-full overflow-hidden">
            <div
              className="bg-[#121212] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 text-[#737373]">
              <ShoppingBag className="w-12 h-12 stroke-[1] mb-4 opacity-40" />
              <p className="text-base font-medium text-[#121212]">Your shopping bag is empty</p>
              <p className="text-xs mt-1 max-w-xs">
                Explore our latest architectural garments, luxury knits, and handcrafted footwear.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigateTo('shop');
                }}
                className="mt-6 py-3 px-6 bg-[#121212] text-white text-xs font-semibold tracking-widest uppercase hover:bg-black transition-colors"
              >
                Discover Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                className="flex gap-4 pb-6 border-b border-[#121212]/10 last:border-b-0"
              >
                {/* Thumbnail */}
                <div
                  className="w-20 h-26 bg-[#F3F3F0] shrink-0 cursor-pointer overflow-hidden"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigateTo('product', item.product.id);
                  }}
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3
                        onClick={() => {
                          setIsCartOpen(false);
                          navigateTo('product', item.product.id);
                        }}
                        className="text-xs font-semibold text-[#121212] hover:underline cursor-pointer line-clamp-1"
                      >
                        {item.product.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                        className="text-[#888888] hover:text-[#121212] transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#737373] mt-1">
                      <span>Size: {item.selectedSize}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.selectedColor}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#121212]/20 text-xs">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedColor, item.selectedSize, item.quantity - 1)}
                        className="p-1.5 hover:bg-[#121212]/5 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 font-mono tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                        className="p-1.5 hover:bg-[#121212]/5 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono tabular-nums font-semibold text-xs text-[#121212]">
                      ${item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo Code & Summary Footer */}
        {cart.length > 0 && (
          <div className="p-6 bg-[#F8F8F6] border-t border-[#121212]/10 space-y-4">
            {/* Promo Code */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-white border border-[#121212]/10 text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#121212]" />
                  <span className="font-mono font-medium">{appliedCoupon}</span>
                  <span className="text-[#737373]">(-${discountAmount})</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-[#888888] hover:text-[#121212] underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="PROMO CODE (e.g. ZENVY10)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 bg-white border border-[#121212]/15 px-3 py-2 text-xs tracking-wider placeholder:text-[#999999] focus:outline-none focus:border-[#121212]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#121212] text-white text-xs font-semibold tracking-wider uppercase hover:bg-black transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            {promoError && (
              <p className="text-[11px] text-red-600 mt-1">{promoError}</p>
            )}

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-[#555555]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-[#121212]">${cartSubtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promotional Discount</span>
                  <span className="font-mono tabular-nums">-${discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-mono tabular-nums text-[#121212]">
                  {shippingCost === 0 ? 'Complimentary' : `$${shippingCost}`}
                </span>
              </div>
              <div className="pt-2 border-t border-[#121212]/10 flex justify-between text-sm font-semibold text-[#121212]">
                <span>Estimated Total</span>
                <span className="font-mono tabular-nums">${cartTotal}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 bg-[#121212] hover:bg-black text-white text-xs font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full py-2.5 text-center text-xs tracking-wider uppercase text-[#666666] hover:text-[#121212] transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
