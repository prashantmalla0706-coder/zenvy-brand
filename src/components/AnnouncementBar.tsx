import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AnnouncementBar: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { navigateTo } = useShop();

  if (dismissed) return null;

  return (
    <div className="bg-[#121212] text-[#FBFBFA] text-[11px] font-medium tracking-[0.15em] uppercase py-2 px-4 relative z-50 flex items-center justify-between border-b border-white/10">
      <div className="w-6" /> {/* Spacer for optical centering */}
      <div className="flex items-center gap-2 text-center overflow-hidden">
        <span className="opacity-90">Complimentary Express Global Shipping on orders over $200</span>
        <span className="hidden md:inline opacity-40">·</span>
        <button
          onClick={() => navigateTo('collections', undefined, 'new-arrivals')}
          className="hidden md:inline-flex items-center gap-1 underline underline-offset-4 hover:opacity-75 transition-opacity"
        >
          <span>Archive Drop 04 Live</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-white/60 hover:text-white p-1 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
