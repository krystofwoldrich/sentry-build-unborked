export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'runtime' | 'syntax' | 'logic' | 'performance' | 'security';
  image: string;
  rating: number;
  reviews: number;
  compatibleWith: string[];
  sku: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'paypal' | 'applepay';
  last4?: string;
  expiryDate?: string;
  cardType?: string;
  isDefault: boolean;
}

export interface Address {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'processing' | 'completed' | 'cancelled';
  paymentMethod: PaymentMethod;
}