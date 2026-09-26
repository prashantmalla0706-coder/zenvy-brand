import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Category, Gender, Outfit } from '../types';
import { PRODUCTS } from '../data/products';
import { db, auth, googleProvider } from '../firebase/config';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDocs, deleteDoc, collection } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../firebase/errors';

export interface ToastData {
  id: string;
  text: string;
  subtext?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface UserProfile {
  name: string;
  email: string;
  isLoggedIn: boolean;
  uid?: string;
  photoURL?: string;
  tier?: string;
}

interface ShopContextType {
  // Navigation & Routing
  currentView: string;
  navigateTo: (view: string, productId?: string, collectionId?: string) => void;
  selectedProductId: string | null;
  selectedProduct: Product | null;
  selectedCollectionId: string | null;

  // Filter shortcuts
  shopCategoryFilter: Category;
  setShopCategoryFilter: (cat: Category) => void;
  shopGenderFilter: Gender;
  setShopGenderFilter: (gen: Gender) => void;
  shopSearchQuery: string;
  setShopSearchQuery: (query: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, color: string, size: string, quantity?: number) => void;
  addOutfitToCart: (outfit: Outfit, customSizes?: Record<string, string>) => void;
  updateQuantity: (productId: string, color: string, size: string, newQty: number) => void;
  removeFromCart: (productId: string, color: string, size: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  shippingCost: number;
  discountAmount: number;
  cartTotal: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistProducts: Product[];
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  // Search & Modals
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAccountOpen: boolean;
  setIsAccountOpen: (open: boolean) => void;
  isConciergeOpen: boolean;
  setIsConciergeOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  sizeGuideOpen: boolean;
  setSizeGuideOpen: (open: boolean) => void;

  // User & Orders & Firebase
  user: UserProfile;
  loginUser: (name: string, email: string) => void;
  logoutUser: () => void;
  signInWithGoogle: () => Promise<void>;
  isFirebaseLoading: boolean;
  orders: Order[];
  createOrder: (shippingDetails: any, paymentMethod: string) => Order;

  // Toast
  toast: ToastData | null;
  showToast: (text: string, subtext?: string, actionLabel?: string, onAction?: () => void) => void;
  dismissToast: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);

  // Shop page pre-filters
  const [shopCategoryFilter, setShopCategoryFilter] = useState<Category>('All');
  const [shopGenderFilter, setShopGenderFilter] = useState<Gender>('All');
  const [shopSearchQuery, setShopSearchQuery] = useState<string>('');

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zenvy_cart') || localStorage.getItem('aeter_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zenvy_wishlist') || localStorage.getItem('aeter_wishlist');
      return saved ? JSON.parse(saved) : ['zenvy-01', 'zenvy-03'];
    } catch {
      return ['zenvy-01', 'zenvy-03'];
    }
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<ToastData | null>(null);

  // User & Orders & Firebase
  const [isFirebaseLoading, setIsFirebaseLoading] = useState(false);
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('zenvy_user') || localStorage.getItem('aeter_user');
      return saved ? JSON.parse(saved) : { name: 'Elena Vance', email: 'elena.vance@zenvy.com', isLoggedIn: false };
    } catch {
      return { name: 'Elena Vance', email: 'elena.vance@zenvy.com', isLoggedIn: false };
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('zenvy_orders') || localStorage.getItem('aeter_orders');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'ZNV-9821',
        date: 'September 18, 2026',
        items: [
          {
            id: 'zenvy-02',
            name: 'Silk-Cashmere Johnny Collar Leisure Polo',
            color: 'Espresso Roast',
            size: 'M',
            price: 340,
            quantity: 1,
            image: '/src/assets/images/zenvy_old_money_polo_knit_1790432267374.jpg',
          },
        ],
        subtotal: 340,
        discount: 0,
        shipping: 0,
        total: 340,
        status: 'Delivered',
        trackingNumber: 'ZNV-DHL-9941029',
        shippingAddress: {
          fullName: 'Elena Vance',
          street: '45 Crosby St, Suite 4B',
          city: 'New York',
          postalCode: '10012',
          country: 'United States',
        },
      },
    ];
  });

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const profile: UserProfile = {
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Client',
          email: firebaseUser.email || '',
          isLoggedIn: true,
          uid: firebaseUser.uid,
          photoURL: firebaseUser.photoURL || undefined,
          tier: 'Zenvy Black Member',
        };
        setUser(profile);

        // Synchronize user profile in Firestore
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          await setDoc(
            userRef,
            {
              userId: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Client',
              photoURL: firebaseUser.photoURL || '',
              tier: 'Zenvy Black Member',
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (error) {
          console.warn('Firestore user doc sync error:', error);
        }

        // Fetch user's wishlist from Firestore
        try {
          const wishlistRef = collection(db, 'users', firebaseUser.uid, 'wishlist');
          const snap = await getDocs(wishlistRef);
          if (!snap.empty) {
            const ids = snap.docs.map((d) => d.id);
            setWishlist(ids);
          }
        } catch (error) {
          console.warn('Firestore wishlist fetch error:', error);
        }

        // Fetch user's orders from Firestore
        try {
          const ordersRef = collection(db, 'users', firebaseUser.uid, 'orders');
          const snap = await getDocs(ordersRef);
          if (!snap.empty) {
            const loaded = snap.docs.map((d) => d.data() as Order);
            setOrders(loaded);
          }
        } catch (error) {
          console.warn('Firestore orders fetch error:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zenvy_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zenvy_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  // Sync user to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zenvy_user', JSON.stringify(user));
    } catch {}
  }, [user]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zenvy_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  // Hash-based simple routing listener for browser back/forward buttons
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) {
        setCurrentView('home');
        setSelectedProductId(null);
      } else if (hash.startsWith('product/')) {
        const pid = hash.replace('product/', '');
        setCurrentView('product');
        setSelectedProductId(pid);
      } else if (hash.startsWith('collection/')) {
        const cid = hash.replace('collection/', '');
        setCurrentView('shop');
        setSelectedCollectionId(cid);
      } else if (['home', 'shop', 'collections', 'lookbook', 'outfits', 'about', 'contact', 'checkout', 'wishlist'].includes(hash)) {
        setCurrentView(hash);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateTo = (view: string, productId?: string, collectionId?: string) => {
    setCurrentView(view);
    if (productId) {
      setSelectedProductId(productId);
      window.location.hash = `product/${productId}`;
    } else if (collectionId) {
      setSelectedCollectionId(collectionId);
      window.location.hash = `collection/${collectionId}`;
    } else {
      window.location.hash = view === 'home' ? '' : view;
      if (view !== 'product') setSelectedProductId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedProduct = selectedProductId 
    ? PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0]
    : null;

  const showToast = (text: string, subtext?: string, actionLabel?: string, onAction?: () => void) => {
    const id = Date.now().toString();
    setToast({ id, text, subtext, actionLabel, onAction });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 4000);
  };

  const dismissToast = () => setToast(null);

  // Cart Functions
  const addToCart = (product: Product, color: string, size: string, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, selectedColor: color, selectedSize: size, quantity }];
    });

    showToast(
      `Added to Bag: ${product.name}`,
      `Size: ${size} · Color: ${color}`,
      'VIEW BAG',
      () => setIsCartOpen(true)
    );
  };

  const addOutfitToCart = (outfit: Outfit, customSizes?: Record<string, string>) => {
    let count = 0;
    outfit.pieces.forEach((piece) => {
      const product = PRODUCTS.find((p) => p.id === piece.productId);
      if (product) {
        const color = piece.defaultColor || product.colors[0]?.name || 'Default';
        const size = (customSizes && customSizes[piece.productId]) || piece.defaultSize || product.sizes[0] || 'M';
        setCart((prev) => {
          const existingIndex = prev.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.selectedColor === color &&
              item.selectedSize === size
          );
          if (existingIndex > -1) {
            const next = [...prev];
            next[existingIndex].quantity += 1;
            return next;
          }
          return [...prev, { product, selectedColor: color, selectedSize: size, quantity: 1 }];
        });
        count++;
      }
    });

    setIsCartOpen(true);
    showToast(
      `Complete Look Added: ${outfit.name}`,
      `${count} curated garments synchronized to your bag with 10% privilege`,
      'VIEW BAG',
      () => setIsCartOpen(true)
    );
  };

  const updateQuantity = (productId: string, color: string, size: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedColor === color &&
          item.selectedSize === size
        ) {
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, color: string, size: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      )
    );
    showToast('Item removed from shopping bag');
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Coupon
  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'ZENVY10' || clean === 'AETER10') {
      setAppliedCoupon('ZENVY10');
      return { success: true, message: 'VIP 10% discount applied to entire order!' };
    }
    if (clean === 'WELCOME15') {
      setAppliedCoupon('WELCOME15');
      return { success: true, message: 'Welcome 15% promotional discount applied!' };
    }
    if (clean === 'FREESHIP') {
      setAppliedCoupon('FREESHIP');
      return { success: true, message: 'Free express shipping unlocked!' };
    }
    return { success: false, message: 'Invalid or expired promotional code' };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  let discountRate = 0;
  if (appliedCoupon === 'ZENVY10' || appliedCoupon === 'AETER10') discountRate = 0.10;
  if (appliedCoupon === 'WELCOME15') discountRate = 0.15;

  const discountAmount = Math.round(cartSubtotal * discountRate);
  const shippingCost = cartSubtotal >= 200 || appliedCoupon === 'FREESHIP' || cartSubtotal === 0 ? 0 : 25;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost);

  // Wishlist Functions
  const toggleWishlist = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];

      if (exists) {
        showToast('Removed from Wishlist', product?.name);
      } else {
        showToast('Saved to Wishlist', product?.name, 'VIEW WISHLIST', () => setIsWishlistOpen(true));
      }

      // Sync with Firestore if authenticated
      if (auth.currentUser) {
        const itemRef = doc(db, 'users', auth.currentUser.uid, 'wishlist', productId);
        if (exists) {
          deleteDoc(itemRef).catch((e) =>
            handleFirestoreError(e, OperationType.DELETE, `users/${auth.currentUser?.uid}/wishlist/${productId}`)
          );
        } else {
          setDoc(itemRef, {
            productId,
            userId: auth.currentUser.uid,
            addedAt: new Date().toISOString(),
          }).catch((e) =>
            handleFirestoreError(e, OperationType.WRITE, `users/${auth.currentUser?.uid}/wishlist/${productId}`)
          );
        }
      }

      return next;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  // User & Google Sign-In
  const signInWithGoogle = async () => {
    try {
      setIsFirebaseLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      showToast('Signed In with Google', `Welcome to ZENVY, ${fbUser.displayName || fbUser.email}`);
    } catch (error: any) {
      console.error('Google Sign-in error:', error);
      showToast('Sign-In Notice', error.message || 'Could not complete Google sign-in');
    } finally {
      setIsFirebaseLoading(false);
    }
  };

  const loginUser = (name: string, email: string) => {
    setUser({ name, email, isLoggedIn: true, tier: 'Zenvy Black Member' });
    showToast(`Welcome back, ${name}`);
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    setUser({ name: '', email: '', isLoggedIn: false });
    showToast('Signed out of Zenvy account');
  };

  // Create Order with Firestore sync
  const createOrder = (shippingDetails: any, paymentMethod: string): Order => {
    const newOrder: Order = {
      id: `ZNV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      items: cart.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        color: item.selectedColor,
        size: item.selectedSize,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0],
      })),
      subtotal: cartSubtotal,
      discount: discountAmount,
      shipping: shippingCost,
      total: cartTotal,
      status: 'Processing',
      trackingNumber: `ZNV-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`,
      shippingAddress: {
        fullName: shippingDetails.fullName,
        street: shippingDetails.street,
        city: shippingDetails.city,
        postalCode: shippingDetails.postalCode,
        country: shippingDetails.country,
      },
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);

    // Save order in Firestore under users/{userId}/orders/{orderId}
    if (auth.currentUser) {
      const orderRef = doc(db, 'users', auth.currentUser.uid, 'orders', newOrder.id);
      setDoc(orderRef, {
        id: newOrder.id,
        userId: auth.currentUser.uid,
        subtotal: newOrder.subtotal,
        shipping: newOrder.shipping,
        discount: newOrder.discount,
        total: newOrder.total,
        status: newOrder.status,
        trackingNumber: newOrder.trackingNumber,
        createdAt: new Date().toISOString(),
      }).catch((e) =>
        handleFirestoreError(e, OperationType.WRITE, `users/${auth.currentUser?.uid}/orders/${newOrder.id}`)
      );
    }

    return newOrder;
  };

  return (
    <ShopContext.Provider
      value={{
        currentView,
        navigateTo,
        selectedProductId,
        selectedProduct,
        selectedCollectionId,
        shopCategoryFilter,
        setShopCategoryFilter,
        shopGenderFilter,
        setShopGenderFilter,
        shopSearchQuery,
        setShopSearchQuery,
        cart,
        addToCart,
        addOutfitToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        shippingCost,
        discountAmount,
        cartTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistProducts,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAccountOpen,
        setIsAccountOpen,
        isConciergeOpen,
        setIsConciergeOpen,
        quickViewProduct,
        setQuickViewProduct,
        sizeGuideOpen,
        setSizeGuideOpen,
        user,
        loginUser,
        logoutUser,
        signInWithGoogle,
        isFirebaseLoading,
        orders,
        createOrder,
        toast,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
