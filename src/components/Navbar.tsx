import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Navbar: React.FC = () => {
  const {
    currentView,
    navigateTo,
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsAccountOpen,
    setIsConciergeOpen,
    user,
    setShopCategoryFilter,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: string, filter?: string) => {
    setMobileMenuOpen(false);
    if (filter) {
      setShopCategoryFilter(filter as any);
    }
    navigateTo(view);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#FBFBFA]/90 backdrop-blur-md border-b border-[#121212]/10 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
            : 'bg-[#FBFBFA] border-b border-[#121212]/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#121212] hover:opacity-70 transition-opacity"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
            </button>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('home');
              }}
              className="text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase font-['Syne'] text-[#121212] hover:opacity-80 transition-opacity"
            >
              ZENVY
            </a>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium tracking-[0.12em] uppercase">
            <button
              onClick={() => handleNavClick('shop')}
              className={`transition-colors hover:text-[#121212] relative py-1 ${
                currentView === 'shop' ? 'text-[#121212] font-semibold' : 'text-[#666666]'
              }`}
            >
              Shop
              {currentView === 'shop' && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#121212]" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('outfits')}
              className={`transition-colors hover:text-[#121212] relative py-1 ${
                currentView === 'outfits' ? 'text-[#121212] font-semibold' : 'text-[#666666]'
              }`}
            >
              Old Money Outfits
              {currentView === 'outfits' && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#121212]" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('collections')}
              className={`transition-colors hover:text-[#121212] relative py-1 ${
                currentView === 'collections' ? 'text-[#121212] font-semibold' : 'text-[#666666]'
              }`}
            >
              Collections
              {currentView === 'collections' && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#121212]" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('lookbook')}
              className={`transition-colors hover:text-[#121212] relative py-1 ${
                currentView === 'lookbook' ? 'text-[#121212] font-semibold' : 'text-[#666666]'
              }`}
            >
              Lookbook
              {currentView === 'lookbook' && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#121212]" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('about')}
              className={`transition-colors hover:text-[#121212] relative py-1 ${
                currentView === 'about' ? 'text-[#121212] font-semibold' : 'text-[#666666]'
              }`}
            >
              About
              {currentView === 'about' && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#121212]" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`transition-colors hover:text-[#121212] relative py-1 ${
                currentView === 'contact' ? 'text-[#121212] font-semibold' : 'text-[#666666]'
              }`}
            >
              Contact
              {currentView === 'contact' && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#121212]" />
              )}
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions / functional affordances */}
          <div className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#121212] hover:opacity-70 transition-opacity"
              aria-label="Search collection"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-2 text-[#121212] hover:opacity-70 transition-opacity relative"
              aria-label={`Wishlist, ${wishlist.length} items`}
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#121212] text-white text-[9px] font-semibold rounded-full flex items-center justify-center tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsAccountOpen(true)}
              className="p-2 text-[#121212] hover:opacity-70 transition-opacity hidden sm:flex items-center gap-1"
              aria-label="Account profile"
            >
              {user.isLoggedIn && user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full object-cover border border-[#121212]/30"
                />
              ) : (
                <User className="w-5 h-5 stroke-[1.5]" />
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-[#121212] hover:opacity-70 transition-opacity relative"
              aria-label={`Shopping bag, ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#121212] text-white text-[9px] font-semibold rounded-full flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* AI Concierge Trigger */}
            <button
              onClick={() => setIsConciergeOpen(true)}
              className="ml-1 px-3 py-1.5 bg-[#121212] text-white hover:bg-black text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
              title="Consult AI Sartorial Concierge"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden md:inline">Concierge</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FBFBFA] shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#121212]/10">
                <span className="text-lg font-bold tracking-[0.2em] font-['Syne'] uppercase">
                  ZENVY
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#121212] hover:opacity-70"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 flex flex-col gap-4 text-sm font-medium tracking-[0.1em] uppercase">
                {/* Mobile Concierge Feature Link */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsConciergeOpen(true);
                  }}
                  className="flex items-center justify-between text-left py-2.5 px-3 bg-[#121212] text-white font-bold tracking-wider rounded-none"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>AI Sartorial Concierge</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 opacity-70" />
                </button>
                <button
                  onClick={() => handleNavClick('shop')}
                  className="flex items-center justify-between text-left py-2 hover:translate-x-1 transition-transform"
                >
                  <span>Shop All Products</span>
                  <ArrowUpRight className="w-4 h-4 opacity-50" />
                </button>
                <button
                  onClick={() => handleNavClick('outfits')}
                  className="flex items-center justify-between text-left py-2 hover:translate-x-1 transition-transform font-bold text-[#121212]"
                >
                  <span>Old Money Outfits</span>
                  <ArrowUpRight className="w-4 h-4 opacity-50" />
                </button>
                <button
                  onClick={() => handleNavClick('collections')}
                  className="flex items-center justify-between text-left py-2 hover:translate-x-1 transition-transform"
                >
                  <span>Collections & Drops</span>
                  <ArrowUpRight className="w-4 h-4 opacity-50" />
                </button>
                <button
                  onClick={() => handleNavClick('lookbook')}
                  className="flex items-center justify-between text-left py-2 hover:translate-x-1 transition-transform"
                >
                  <span>Lookbook Editorial</span>
                  <ArrowUpRight className="w-4 h-4 opacity-50" />
                </button>
                <button
                  onClick={() => handleNavClick('about')}
                  className="flex items-center justify-between text-left py-2 hover:translate-x-1 transition-transform"
                >
                  <span>The Zenvy Story</span>
                  <ArrowUpRight className="w-4 h-4 opacity-50" />
                </button>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="flex items-center justify-between text-left py-2 hover:translate-x-1 transition-transform"
                >
                  <span>Client Care & Stores</span>
                  <ArrowUpRight className="w-4 h-4 opacity-50" />
                </button>
              </div>

              <div className="pt-6 border-t border-[#121212]/10 space-y-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAccountOpen(true);
                  }}
                  className="w-full flex items-center gap-3 py-2 text-xs tracking-wider uppercase font-medium text-[#666666]"
                >
                  <User className="w-4 h-4" />
                  <span>My Zenvy Account</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsWishlistOpen(true);
                  }}
                  className="w-full flex items-center gap-3 py-2 text-xs tracking-wider uppercase font-medium text-[#666666]"
                >
                  <Heart className="w-4 h-4" />
                  <span>Saved Wishlist ({wishlist.length})</span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#121212]/10 text-xs text-[#888888] space-y-1">
              <p className="font-medium text-[#121212]">Flagship Concierge</p>
              <p>contact@zenvy.com</p>
              <p>+1 (800) 492-3837 · Mon–Sat 9am–8pm EST</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
