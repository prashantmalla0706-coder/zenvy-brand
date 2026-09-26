export type Category = 
  | 'All' 
  | 'Outerwear' 
  | 'Tailoring' 
  | 'Knitwear' 
  | 'Streetwear' 
  | 'Trousers' 
  | 'Essentials' 
  | 'Accessories';

export type Gender = 'All' | 'Men' | 'Women' | 'Unisex';

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: Category;
  gender: Gender;
  collection: string;
  price: number;
  originalPrice?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  images: string[];
  colors: ProductColor[];
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL')[];
  description: string;
  composition: string;
  fit: string;
  careInstructions: string[];
  sustainability: string;
  rating: number;
  reviewCount: number;
  sku: string;
  reviews?: ProductReview[];
}

export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface Collection {
  id: string;
  name: string;
  tagline: string;
  season: string;
  description: string;
  image: string;
  itemCount: number;
  badge?: string;
}

export interface LookbookLook {
  id: string;
  title: string;
  location: string;
  season: string;
  image: string;
  quote: string;
  itemIds: string[];
}

export interface OutfitItemPiece {
  productId: string;
  role: 'Layer' | 'Base' | 'Bottom' | 'Outer' | 'Accessory';
  defaultColor?: string;
  defaultSize?: string;
}

export interface Outfit {
  id: string;
  name: string;
  tagline: string;
  occasion: string;
  zenSense: string;
  vibe: string;
  image: string;
  pieces: OutfitItemPiece[];
  description: string;
  stylingNotes: string[];
}

export interface OrderItem {
  id: string;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  trackingNumber: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface GroundingCitation {
  title: string;
  uri: string;
  placeAnswerSources?: any;
}

export interface GroundingData {
  mode: 'general' | 'search' | 'maps';
  webChunks?: GroundingCitation[];
  mapsChunks?: GroundingCitation[];
  searchQueries?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  grounding?: GroundingData;
}
