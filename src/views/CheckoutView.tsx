import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Tag,
  DollarSign,
  Printer,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    shippingCost,
    discountAmount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    createOrder,
    navigateTo,
  } = useShop();

  // Form State
  const [email, setEmail] = useState('elena.vance@zenvy.com');
  const [phone, setPhone] = useState('+1 (555) 392-1084');
  const [fullName, setFullName] = useState('Elena Vance');
  const [street, setStreet] = useState('45 Crosby Street, Suite 4B');
  const [city, setCity] = useState('New York');
  const [country, setCountry] = useState('United States');
  const [postalCode, setPostalCode] = useState('10012');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8829');
  const [cardExpiry, setCardExpiry] = useState('09/28');
  const [cardCvc, setCardCvc] = useState('841');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  // Placed Order state
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (cart.length === 0 && !placedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <ShoppingBag className="w-12 h-12 stroke-[1] text-[#737373] mx-auto mb-4" />
        <h2 className="text-xl font-bold uppercase font-['Syne'] text-[#121212]">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs text-[#666666] mt-2">
          Add items to your bag before proceeding to checkout.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-6 px-8 py-3.5 bg-[#121212] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const order = createOrder(
      { fullName, street, city, postalCode, country },
      paymentMethod
    );
    setPlacedOrder(order);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    const res = applyCoupon(promoCodeInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoError(null);
      setPromoCodeInput('');
    }
  };

  // Order Confirmation View
  if (placedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white border border-[#121212]/10 p-8 sm:p-12 shadow-sm space-y-8">
          {/* Header */}
          <div className="text-center pb-8 border-b border-[#121212]/10">
            <div className="w-16 h-16 bg-[#121212] text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-800">
              Acquisition Confirmed
            </span>
            <h1 className="text-3xl font-bold uppercase font-['Syne'] text-[#121212] mt-1">
              Order #{placedOrder.id}
            </h1>
            <p className="text-xs text-[#737373] mt-2">
              A formal confirmation receipt has been transmitted to <span className="font-medium text-[#121212]">{email}</span>.
            </p>
          </div>

          {/* Logistics Tracking */}
          <div className="p-4 bg-[#F4F4F0] border border-[#121212]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Express Courier Waybill
              </p>
              <p className="font-mono font-semibold text-sm text-[#121212] mt-0.5">
                {placedOrder.trackingNumber}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373]">
                Estimated Delivery
              </p>
              <p className="font-medium text-[#121212] mt-0.5">
                Within 2–4 Business Days via DHL Express
              </p>
            </div>
          </div>

          {/* Itemized Receipt */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#121212] mb-3">
              Itemized Garments
            </h3>
            <div className="divide-y divide-[#121212]/10 border-y border-[#121212]/10">
              {placedOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-16 object-cover bg-[#F3F3F0]"
                    />
                    <div>
                      <p className="font-semibold text-[#121212]">{item.name}</p>
                      <p className="text-[#737373] text-[11px]">
                        Size: {item.size} · Color: {item.color} · Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono tabular-nums font-semibold text-[#121212]">
                    ${item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-1.5 text-xs text-[#555555] pt-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">${placedOrder.subtotal}</span>
            </div>
            {placedOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-800">
                <span>Promotional Privilege</span>
                <span className="font-mono tabular-nums">-${placedOrder.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Express Delivery</span>
              <span className="font-mono tabular-nums">
                {placedOrder.shipping === 0 ? 'Complimentary' : `$${placedOrder.shipping}`}
              </span>
            </div>
            <div className="flex justify-between font-bold text-sm text-[#121212] pt-2 border-t border-[#121212]/10">
              <span>Total Paid</span>
              <span className="font-mono tabular-nums">${placedOrder.total}</span>
            </div>
          </div>

          {/* Shipping Address Summary */}
          <div className="p-4 bg-[#F9F9F8] border border-[#121212]/10 text-xs">
            <p className="font-bold uppercase tracking-wider text-[#121212] mb-1">
              Destination Address
            </p>
            <p className="text-[#555555]">{placedOrder.shippingAddress.fullName}</p>
            <p className="text-[#555555]">{placedOrder.shippingAddress.street}</p>
            <p className="text-[#555555]">
              {placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.postalCode}, {placedOrder.shippingAddress.country}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => window.print()}
              className="flex-1 py-3 border border-[#121212]/20 hover:border-[#121212] text-xs font-bold uppercase tracking-wider text-[#121212] flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice Receipt</span>
            </button>
            <button
              onClick={() => {
                setPlacedOrder(null);
                navigateTo('shop');
              }}
              className="flex-1 py-3 bg-[#121212] hover:bg-black text-white text-xs font-bold uppercase tracking-[0.2em] transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Checkout Form View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#737373]">
          Secure Checkout
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold uppercase font-['Syne'] text-[#121212] mt-1">
          Finalize Acquisition
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Customer & Shipping Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Contact Details */}
          <div className="p-6 bg-white border border-[#121212]/10 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#121212]/10">
              <span className="w-5 h-5 bg-[#121212] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                1
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#121212]">
                Customer Contact
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#555555] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FBFBFA] border border-[#121212]/15 px-3 py-2 text-xs text-[#121212] focus:outline-none focus:border-[#121212]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#555555] mb-1">
                  Mobile Number (For Courier SMS)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#FBFBFA] border border-[#121212]/15 px-3 py-2 text-xs text-[#121212] focus:outline-none focus:border-[#121212]"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-6 bg-white border border-[#121212]/10 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#121212]/10">
              <span className="w-5 h-5 bg-[#121212] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                2
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#121212]">
                Shipping Address
              </h2>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#555555] mb-1">
                Full Recipient Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#FBFBFA] border border-[#121212]/15 px-3 py-2 text-xs text-[#121212] focus:outline-none focus:border-[#121212]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase text-[#555555] mb-1">
                Street Address / Suite
              </label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-[#FBFBFA] border border-[#121212]/15 px-3 py-2 text-xs text-[#121212] focus:outline-none focus:border-[#121212]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#555555] mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#FBFBFA] border border-[#121212]/15 px-3 py-2 text-xs text-[#121212] focus:outline-none focus:border-[#121212]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#555555] mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-[#FBFBFA] border border-[#121212]/15 px-3 py-2 text-xs text-[#121212] focus:outline-none focus:border-[#121212]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-[#555555] mb-1">
                  Country
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#FBFBFA] border border-[#121212]/15 px-3 py-2 text-xs text-[#121212] focus:outline-none focus:border-[#121212]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-6 bg-white border border-[#121212]/10 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#121212]/10">
              <span className="w-5 h-5 bg-[#121212] text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                3
              </span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#121212]">
                Payment Specification
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 text-xs font-semibold uppercase tracking-wider border flex flex-col items-center gap-1.5 transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-[#121212] bg-[#FBFBFA]'
                    : 'border-[#121212]/15 text-[#737373]'
                }`}
              >
                <CreditCard className="w-4 h-4 text-[#121212]" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple')}
                className={`p-3 text-xs font-semibold uppercase tracking-wider border flex flex-col items-center gap-1.5 transition-colors ${
                  paymentMethod === 'apple'
                    ? 'border-[#121212] bg-[#FBFBFA]'
                    : 'border-[#121212]/15 text-[#737373]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#121212]" />
                <span>Apple Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 text-xs font-semibold uppercase tracking-wider border flex flex-col items-center gap-1.5 transition-colors ${
                  paymentMethod === 'cod'
                    ? 'border-[#121212] bg-[#FBFBFA]'
                    : 'border-[#121212]/15 text-[#737373]'
                }`}
              >
                <Truck className="w-4 h-4 text-[#121212]" />
                <span>Cash on Delivery</span>
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#555555] mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-[#FBFBFA] border border-[#121212]/15 px-3 py-2 text-xs font-mono text-[#121212] focus:outline-none focus:border-[#121212]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#555555] mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-[#FBFBFA] border border-[#121212]/15 px-3 py-2 text-xs font-mono text-[#121212] focus:outline-none focus:border-[#121212]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#555555] mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="3 digits"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-[#FBFBFA] border border-[#121212]/15 px-3 py-2 text-xs font-mono text-[#121212] focus:outline-none focus:border-[#121212]"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-3 bg-[#F4F4F0] text-xs text-[#555555]">
                Cash on Delivery requires direct payment upon arrival to the courier. Please prepare the exact balance of <span className="font-bold text-[#121212] font-mono">${cartTotal}</span>.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-[#F4F4F0] border border-[#121212]/10 p-6 md:p-8 space-y-6 sticky top-24">
          <div className="flex items-baseline justify-between pb-4 border-b border-[#121212]/10">
            <h2 className="text-xs font-bold uppercase tracking-wider font-['Syne'] text-[#121212]">
              Order Summary
            </h2>
            <span className="text-xs text-[#737373]">
              ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
            </span>
          </div>

          {/* Mini List */}
          <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
            {cart.map((item, idx) => (
              <div key={idx} className="flex gap-3 text-xs">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-18 object-cover bg-white shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#121212] truncate">{item.product.name}</p>
                  <p className="text-[11px] text-[#737373] mt-0.5">
                    {item.selectedSize} · {item.selectedColor}
                  </p>
                  <p className="text-[11px] text-[#737373]">Qty: {item.quantity}</p>
                </div>
                <span className="font-mono tabular-nums font-semibold text-[#121212]">
                  ${item.product.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Coupon Code Input */}
          <div className="pt-4 border-t border-[#121212]/10">
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-white border border-[#121212]/10 text-xs">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#121212]" />
                  <span className="font-mono font-medium">{appliedCoupon}</span>
                  <span className="text-emerald-700 font-semibold">(-${discountAmount})</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs text-[#888888] hover:text-[#121212] underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon (e.g. ZENVY10)"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="flex-1 bg-white border border-[#121212]/15 px-3 py-2 text-xs text-[#121212] focus:outline-none focus:border-[#121212]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-[#121212] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-red-600 mt-1">{promoError}</p>
                )}
              </div>
            )}
          </div>

          {/* Calculations */}
          <div className="space-y-2 text-xs text-[#555555] pt-4 border-t border-[#121212]/10">
            <div className="flex justify-between">
              <span>Bag Subtotal</span>
              <span className="font-mono tabular-nums text-[#121212]">${cartSubtotal}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-800">
                <span>Promotional Discount</span>
                <span className="font-mono tabular-nums">-${discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Express Delivery</span>
              <span className="font-mono tabular-nums text-[#121212]">
                {shippingCost === 0 ? 'Complimentary' : `$${shippingCost}`}
              </span>
            </div>
            <div className="pt-2 border-t border-[#121212]/10 flex justify-between text-base font-bold text-[#121212]">
              <span>Final Total</span>
              <span className="font-mono tabular-nums">${cartTotal}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            className="w-full py-4 bg-[#121212] hover:bg-black text-white text-xs font-bold tracking-[0.25em] uppercase flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <Lock className="w-4 h-4" />
            <span>Place Order (${cartTotal})</span>
          </button>

          <p className="text-[11px] text-[#737373] text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>256-Bit Encrypted Zenvy Bank-Grade Security</span>
          </p>
        </div>
      </form>
    </div>
  );
};
