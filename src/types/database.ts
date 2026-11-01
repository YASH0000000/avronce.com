export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color_name: string;
  color_hex: string;
  sku: string;
  stock_quantity: number;
  price_override: number | null;
}

export interface ProductDetails {
  composition?: string;
  origin?: string;
  care?: string;
  fit?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  category_id: string | null;
  price: number;
  compare_at_price: number | null;
  is_featured: boolean;
  is_new: boolean;
  gender: 'men' | 'women' | 'unisex';
  details: ProductDetails;
  created_at: string;
  updated_at: string;
  category?: Category;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: string;
  colorName?: string;
  colorHex?: string;
  quantity: number;
  stock?: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  product_slug: string | null;
  product_image: string | null;
  size: string;
  color_name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  subtotal: number;
  tax_amount: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'authorized' | 'captured' | 'failed';
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}
