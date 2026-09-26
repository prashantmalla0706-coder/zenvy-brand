import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { AccountModal } from './components/AccountModal';
import { QuickViewModal } from './components/QuickViewModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { ConciergeChatModal } from './components/ConciergeChatModal';
import { Toast } from './components/Toast';
import { Sparkles } from 'lucide-react';

import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CollectionsView } from './views/CollectionsView';
import { LookbookView } from './views/LookbookView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { CheckoutView } from './views/CheckoutView';
import { OutfitsView } from './views/OutfitsView';

const MainContent: React.FC = () => {
  const { currentView, setIsConciergeOpen } = useShop();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'shop':
        return <ShopView />;
      case 'outfits':
        return <OutfitsView />;
      case 'product':
        return <ProductDetailView />;
      case 'collections':
        return <CollectionsView />;
      case 'lookbook':
        return <LookbookView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'checkout':
        return <CheckoutView />;
      case 'home':
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFA] text-[#121212]">
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        {renderCurrentView()}
      </main>

      <Footer />

      {/* Floating Concierge Action Trigger */}
      <button
        onClick={() => setIsConciergeOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-[#121212] hover:bg-black text-white shadow-2xl border border-white/20 flex items-center gap-2.5 transition-transform hover:scale-105 group"
        aria-label="Open AI Sartorial Concierge"
      >
        <div className="relative">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full" />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold uppercase tracking-wider leading-none">
            AI Concierge
          </p>
          <p className="text-[9px] text-white/60 tracking-tight leading-none mt-1">
            Search & Maps Grounded
          </p>
        </div>
      </button>

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <WishlistDrawer />
      <SearchModal />
      <AccountModal />
      <ConciergeChatModal />
      <QuickViewModal />
      <SizeGuideModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}
