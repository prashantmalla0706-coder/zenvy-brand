import React, { useState } from 'react';
import {
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  Share2,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailView: React.FC = () => {
  const {
    selectedProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSizeGuideOpen,
    navigateTo,
    showToast,
  } = useShop();

  const product = selectedProduct || PRODUCTS[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('details');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(
      product,
      product.colors[selectedColorIndex].name,
      selectedSize,
      quantity
    );
  };

  const handleBuyNow = () => {
    addToCart(
      product,
      product.colors[selectedColorIndex].name,
      selectedSize,
      quantity
    );
    navigateTo('checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;
    setReviewSubmitted(true);
    showToast('Thank you for your feedback', 'Your review has been verified.');
  };

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.gender === product.gender)
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#737373] uppercase tracking-wider mb-8">
        <button onClick={() => navigateTo('home')} className="hover:text-[#121212]">
          Home
        </button>
        <span aria-hidden="true">/</span>
        <button onClick={() => navigateTo('shop')} className="hover:text-[#121212]">
          Shop
        </button>
        <span aria-hidden="true">/</span>
        <button
          onClick={() => {
            navigateTo('shop');
          }}
          className="hover:text-[#121212]"
        >
          {product.category}
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-[#121212] font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Two-Column PDP Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Multi-Image Product Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 sticky top-24">
          {/* Thumbnails (vertical on desktop) */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible shrink-0 pb-2 md:pb-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-16 h-22 sm:w-20 sm:h-26 bg-[#F3F3F0] overflow-hidden border transition-all ${
                  activeImageIndex === idx
                    ? 'border-[#121212] ring-1 ring-[#121212]'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} view ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Primary Main Image Frame */}
          <div className="flex-1 aspect-[3/4] bg-[#F3F3F0] relative overflow-hidden group cursor-crosshair">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
            />

            {product.isNew && (
              <div className="absolute top-4 left-4 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#121212] bg-[#FBFBFA]/90 backdrop-blur-xs px-2.5 py-1">
                NEW RELEASE
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Category */}
          <div className="pb-5 border-b border-[#121212]/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#737373]">
                {product.collection} · {product.sku}
              </span>

              {/* Rating */}
              <div className="flex items-center gap-1.5 text-xs text-[#121212]">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-mono tabular-nums font-semibold text-xs">
                  {product.rating}
                </span>
                <span className="text-[#888888] font-mono text-xs">
                  ({product.reviewCount})
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase font-['Syne'] text-[#121212] mt-2">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#555555] mt-1 font-light leading-relaxed">
              {product.subtitle}
            </p>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-2xl font-bold font-mono tabular-nums text-[#121212]">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm font-mono tabular-nums text-[#888888] line-through">
                  ${product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">
                  Save ${product.originalPrice - product.price}
                </span>
              )}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider text-[#121212]">
                Colorway:
              </span>
              <span className="text-[#555555]">
                {product.colors[selectedColorIndex].name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {product.colors.map((color, idx) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColorIndex(idx)}
                  className={`w-7 h-7 rounded-full transition-all border ${
                    selectedColorIndex === idx
                      ? 'border-[#121212] ring-2 ring-black/10 scale-110 shadow-xs'
                      : 'border-black/20 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selection & Size Guide */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider text-[#121212]">
                Garment Size:
              </span>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="text-[#737373] hover:text-[#121212] underline uppercase text-[11px] tracking-wider"
              >
                Size Guide & Measurements
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-xs font-semibold uppercase tracking-wider transition-colors border ${
                    selectedSize === size
                      ? 'bg-[#121212] text-white border-[#121212]'
                      : 'bg-white text-[#121212] border-[#121212]/15 hover:border-[#121212]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#737373] mt-2 italic">
              {product.fit}
            </p>
          </div>

          {/* Quantity & Actions */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#121212]/20 h-12">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 h-full hover:bg-black/5 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 font-mono tabular-nums text-xs font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 h-full hover:bg-black/5 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag */}
              <button
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-[#121212] hover:bg-black text-white text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`h-12 px-4 border transition-colors ${
                  isFavorited
                    ? 'bg-[#121212] text-white border-[#121212]'
                    : 'border-[#121212]/20 text-[#121212] hover:border-[#121212]'
                }`}
                aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Buy Now Button (Express Checkout) */}
            <button
              onClick={handleBuyNow}
              className="w-full h-12 bg-[#2A2B2D] hover:bg-[#1A1B1D] text-white text-xs font-bold tracking-[0.2em] uppercase transition-colors"
            >
              Instant Buy Now
            </button>
          </div>

          {/* Value Props */}
          <div className="py-4 border-y border-[#121212]/10 grid grid-cols-2 gap-4 text-xs text-[#555555]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#121212]" />
              <span>Complimentary Shipping Over $200</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#121212]" />
              <span>30-Day Global Returns</span>
            </div>
          </div>

          {/* Accordion Sections: Details, Materials, Care, Shipping */}
          <div className="divide-y divide-[#121212]/10 border-b border-[#121212]/10 text-xs">
            {/* Description & Fit */}
            <div className="py-3">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'details' ? null : 'details')}
                className="w-full flex items-center justify-between text-left font-bold uppercase tracking-wider text-[#121212]"
              >
                <span>Garment Description & Fit</span>
                {activeAccordion === 'details' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {activeAccordion === 'details' && (
                <div className="pt-3 text-[#555555] leading-relaxed space-y-2">
                  <p>{product.description}</p>
                  <p><span className="font-semibold text-[#121212]">Fit Profile:</span> {product.fit}</p>
                </div>
              )}
            </div>

            {/* Materials & Composition */}
            <div className="py-3">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'materials' ? null : 'materials')}
                className="w-full flex items-center justify-between text-left font-bold uppercase tracking-wider text-[#121212]"
              >
                <span>Fabric Composition & Sourcing</span>
                {activeAccordion === 'materials' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {activeAccordion === 'materials' && (
                <div className="pt-3 text-[#555555] leading-relaxed space-y-2">
                  <p><span className="font-semibold text-[#121212]">Composition:</span> {product.composition}</p>
                  <p><span className="font-semibold text-[#121212]">Sustainability:</span> {product.sustainability}</p>
                </div>
              )}
            </div>

            {/* Washing Instructions */}
            <div className="py-3">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'care' ? null : 'care')}
                className="w-full flex items-center justify-between text-left font-bold uppercase tracking-wider text-[#121212]"
              >
                <span>Washing & Garment Care</span>
                {activeAccordion === 'care' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {activeAccordion === 'care' && (
                <div className="pt-3 text-[#555555] leading-relaxed">
                  <ul className="list-disc pl-4 space-y-1">
                    {product.careInstructions.map((instruction, idx) => (
                      <li key={idx}>{instruction}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Shipping & Delivery */}
            <div className="py-3">
              <button
                onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? null : 'shipping')}
                className="w-full flex items-center justify-between text-left font-bold uppercase tracking-wider text-[#121212]"
              >
                <span>Shipping, Duties & Returns</span>
                {activeAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {activeAccordion === 'shipping' && (
                <div className="pt-3 text-[#555555] leading-relaxed space-y-2">
                  <p>Orders dispatched via DHL Express with carbon-neutral logistics.</p>
                  <p>Complimentary 30-day global returns on unworn items with tags attached.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-20 pt-12 border-t border-[#121212]/10">
        <div className="max-w-3xl">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#737373]">
                Client Feedback
              </span>
              <h3 className="text-2xl font-bold uppercase tracking-tight font-['Syne'] text-[#121212] mt-1">
                Verified Reviews ({product.reviewCount})
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="font-mono text-sm font-bold">{product.rating} / 5.0</span>
            </div>
          </div>

          {/* Existing Reviews */}
          <div className="space-y-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((r) => (
                <div key={r.id} className="pb-6 border-b border-[#121212]/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-[#121212]">{r.author}</span>
                      {r.verified && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 uppercase tracking-wider font-semibold">
                          Verified Acquisition
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#888888]">{r.date}</span>
                  </div>
                  <div className="flex text-amber-500">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-[#121212]">{r.title}</p>
                  <p className="text-xs text-[#555555] leading-relaxed">{r.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#737373]">Be the first to review this garment.</p>
            )}
          </div>

          {/* Write a Review Form */}
          <div className="mt-10 p-6 bg-[#F3F3F0] border border-[#121212]/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#121212] mb-4">
              Submit Zenvy Client Review
            </h4>
            {reviewSubmitted ? (
              <div className="flex items-center gap-2 text-xs text-emerald-800">
                <Check className="w-4 h-4" />
                <span>Thank you. Your review has been submitted for verification.</span>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#555555] mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Julian S."
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="w-full bg-white border border-[#121212]/15 px-3 py-2 text-xs text-[#121212] focus:outline-none focus:border-[#121212]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase text-[#555555] mb-1">
                      Rating
                    </label>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="w-full bg-white border border-[#121212]/15 px-3 py-2 text-xs text-[#121212] focus:outline-none focus:border-[#121212]"
                    >
                      <option value={5}>5 Stars - Flawless Craft</option>
                      <option value={4}>4 Stars - High Quality</option>
                      <option value={3}>3 Stars - Satisfactory</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase text-[#555555] mb-1">
                    Your Thoughts on Fit, Weight, & Feel
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the hand feel, drape, and sizing experience..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    className="w-full bg-white border border-[#121212]/15 p-3 text-xs text-[#121212] focus:outline-none focus:border-[#121212]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#121212] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* "You May Also Like" Recommendation Section */}
      <section className="mt-24 pt-12 border-t border-[#121212]/10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#737373]">
              Curated Complements
            </span>
            <h3 className="text-2xl font-bold uppercase tracking-tight font-['Syne'] text-[#121212] mt-1">
              You May Also Like
            </h3>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="text-xs font-bold tracking-wider uppercase text-[#121212] underline"
          >
            Explore All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
};
