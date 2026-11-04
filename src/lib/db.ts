import fs from 'node:fs/promises';
import path from 'node:path';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'store-db.json');

export interface ProductItem {
  id: string;
  title: string;
  handle: string;
  slug: string;
  description: string;
  productType: string;
  category: string;
  collectionHandle: string;
  type: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  images: string[];
  available: boolean;
  options: { name: string; values: string[] }[];
  variants: any[];
  tags: string[];
  rating: string;
  reviewsCount: number;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  status: 'published' | 'draft' | 'archived';
  stock: number;
  createdAt?: string;
  publishedAt?: string;
}

export interface CategoryItem {
  id: number | string;
  title: string;
  handle: string;
  type: string;
  productsCount: number;
  image: string;
  description: string;
  active?: boolean;
}

export interface OrderItemRecord {
  id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'paid' | 'pending' | 'failed' | 'refunded';
  payment_method: string;
  razorpay_payment_id?: string;
  tracking_id?: string;
  courier?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping_address: {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: {
    id: string;
    productId: string;
    name: string;
    slug: string;
    size: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  discount_amount: number;
  coupon_code?: string;
  shipping_fee: number;
  tax_amount: number;
  total_amount: number;
  created_at: string;
}

export interface CouponItem {
  id: string;
  code: string;
  discountPercent: number;
  discountType: 'percentage' | 'fixed';
  minSpend: number;
  maxDiscount: number;
  usageLimit: number;
  usageCount: number;
  active: boolean;
  description: string;
  expiryDate: string;
}

export interface StoreDbSchema {
  brand: {
    name: string;
    tagline: string;
    logo: string;
    contact: {
      email: string;
      phone: string;
      address: string;
    };
    social: {
      instagram: string;
      facebook: string;
    };
  };
  cms: {
    announcements: string[];
    heroSlides: {
      id: string;
      tag: string;
      title: string;
      subtitle: string;
      offer: string;
      image: string;
      ctaText: string;
      ctaLink: string;
      active: boolean;
    }[];
  };
  featuredCollections: CategoryItem[];
  moodCollections: any[];
  products: ProductItem[];
  orders: OrderItemRecord[];
  customers: any[];
  coupons: CouponItem[];
  shippingSettings: {
    freeShippingThreshold: number;
    standardShippingFee: number;
    codAvailable: boolean;
    taxPercent: number;
  };
}

export async function readDb(): Promise<StoreDbSchema> {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file:', err);
    throw err;
  }
}

export async function writeDb(data: StoreDbSchema): Promise<void> {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database file:', err);
    throw err;
  }
}

// ---------------- PRODUCTS ----------------
export async function getDbProducts(): Promise<ProductItem[]> {
  const db = await readDb();
  return db.products;
}

export async function getDbProductBySlug(slug: string): Promise<ProductItem | null> {
  const db = await readDb();
  const p = db.products.find(
    (item) => item.slug.toLowerCase() === slug.toLowerCase() || item.handle.toLowerCase() === slug.toLowerCase() || item.id === slug
  );
  return p || null;
}

export async function saveDbProduct(product: Partial<ProductItem>): Promise<ProductItem> {
  const db = await readDb();
  let updatedProduct: ProductItem;

  if (product.id) {
    const idx = db.products.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      updatedProduct = {
        ...db.products[idx],
        ...product,
      } as ProductItem;
      db.products[idx] = updatedProduct;
    } else {
      updatedProduct = {
        ...product,
        id: product.id,
      } as ProductItem;
      db.products.unshift(updatedProduct);
    }
  } else {
    const newId = String(Date.now());
    const slug = (product.title || 'new-product').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    updatedProduct = {
      id: newId,
      title: product.title || 'New Product',
      handle: slug,
      slug: slug,
      description: product.description || '',
      productType: product.category || 'Clothing',
      category: product.category || 'Clothing',
      collectionHandle: (product.category || 'clothing').toLowerCase().replace(/\s+/g, '-'),
      type: product.type || 'Clothing',
      price: product.price || 999,
      originalPrice: product.originalPrice || Math.round((product.price || 999) * 1.5),
      discountPercent: Math.round((((product.originalPrice || 1499) - (product.price || 999)) / (product.originalPrice || 1499)) * 100),
      images: product.images?.length ? product.images : ['/images/collections/cat_boots.webp'],
      available: true,
      options: product.options || [{ name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] }],
      variants: product.variants || [],
      tags: product.tags || ['new arrival'],
      rating: '4.8',
      reviewsCount: 1,
      isFeatured: Boolean(product.isFeatured),
      isBestseller: Boolean(product.isBestseller),
      isNew: true,
      status: product.status || 'published',
      stock: product.stock ?? 50,
      createdAt: new Date().toISOString(),
    };
    db.products.unshift(updatedProduct);
  }

  await writeDb(db);
  return updatedProduct;
}

export async function deleteDbProduct(id: string): Promise<boolean> {
  const db = await readDb();
  const initialLen = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length !== initialLen) {
    await writeDb(db);
    return true;
  }
  return false;
}

export async function updateDbStock(id: string, stock: number): Promise<ProductItem | null> {
  const db = await readDb();
  const prod = db.products.find((p) => p.id === id);
  if (!prod) return null;
  prod.stock = Math.max(0, stock);
  prod.available = prod.stock > 0;
  await writeDb(db);
  return prod;
}

// ---------------- ORDERS ----------------
export async function getDbOrders(): Promise<OrderItemRecord[]> {
  const db = await readDb();
  return db.orders;
}

export async function createDbOrder(order: Partial<OrderItemRecord>): Promise<OrderItemRecord> {
  const db = await readDb();
  const orderNumber = `AVR-${Math.floor(10000 + Math.random() * 90000)}`;
  const newOrder: OrderItemRecord = {
    id: `ord-${Date.now()}`,
    order_number: orderNumber,
    status: order.status || 'pending',
    payment_status: order.payment_status || 'pending',
    payment_method: order.payment_method || 'Online Payment',
    razorpay_payment_id: order.razorpay_payment_id || '',
    tracking_id: '',
    courier: 'BlueDart Express',
    customer: order.customer || { name: 'Customer', email: 'guest@avronce.com', phone: '' },
    shipping_address: order.shipping_address as any,
    items: order.items || [],
    subtotal: order.subtotal || 0,
    discount_amount: order.discount_amount || 0,
    coupon_code: order.coupon_code || '',
    shipping_fee: order.shipping_fee || 0,
    tax_amount: order.tax_amount || 0,
    total_amount: order.total_amount || 0,
    created_at: new Date().toISOString(),
  };

  db.orders.unshift(newOrder);

  // Update customer record
  if (order.customer?.email) {
    const custIdx = db.customers.findIndex((c) => c.email.toLowerCase() === order.customer?.email.toLowerCase());
    if (custIdx >= 0) {
      db.customers[custIdx].ordersCount += 1;
      db.customers[custIdx].totalSpent += newOrder.total_amount;
    } else {
      db.customers.unshift({
        id: `cust-${Date.now()}`,
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone,
        ordersCount: 1,
        totalSpent: newOrder.total_amount,
        city: (order.shipping_address as any)?.city || 'India',
        joinedDate: new Date().toISOString().split('T')[0],
      });
    }
  }

  // Adjust stock
  for (const item of newOrder.items) {
    const prod = db.products.find((p) => p.id === item.productId);
    if (prod && prod.stock) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  }

  await writeDb(db);
  return newOrder;
}

export async function updateDbOrderStatus(
  id: string,
  status: OrderItemRecord['status'],
  trackingId?: string,
  courier?: string
): Promise<OrderItemRecord | null> {
  const db = await readDb();
  const order = db.orders.find((o) => o.id === id || o.order_number === id);
  if (!order) return null;

  order.status = status;
  if (trackingId !== undefined) order.tracking_id = trackingId;
  if (courier !== undefined) order.courier = courier;

  await writeDb(db);
  return order;
}

// ---------------- CATEGORIES ----------------
export async function getDbCategories(): Promise<CategoryItem[]> {
  const db = await readDb();
  return db.featuredCollections;
}

export async function saveDbCategory(cat: Partial<CategoryItem>): Promise<CategoryItem> {
  const db = await readDb();
  let updated: CategoryItem;

  if (cat.id) {
    const idx = db.featuredCollections.findIndex((c) => String(c.id) === String(cat.id));
    if (idx >= 0) {
      updated = { ...db.featuredCollections[idx], ...cat } as CategoryItem;
      db.featuredCollections[idx] = updated;
    } else {
      updated = { ...cat, id: cat.id } as CategoryItem;
      db.featuredCollections.push(updated);
    }
  } else {
    updated = {
      id: Date.now(),
      title: cat.title || 'New Category',
      handle: (cat.title || 'new').toLowerCase().replace(/\s+/g, '-'),
      type: cat.type || 'Clothing',
      productsCount: 0,
      image: cat.image || '/images/collections/cat_boots.webp',
      description: cat.description || '',
      active: true,
    };
    db.featuredCollections.push(updated);
  }

  await writeDb(db);
  return updated;
}

export async function deleteDbCategory(id: number | string): Promise<boolean> {
  const db = await readDb();
  const initLen = db.featuredCollections.length;
  db.featuredCollections = db.featuredCollections.filter((c) => String(c.id) !== String(id) && c.handle !== String(id));
  if (db.featuredCollections.length !== initLen) {
    await writeDb(db);
    return true;
  }
  return false;
}

// ---------------- CUSTOMERS ----------------
export async function getDbCustomers(): Promise<any[]> {
  const db = await readDb();
  return db.customers;
}

// ---------------- SETTINGS ----------------
export async function getDbSettings() {
  const db = await readDb();
  return {
    brand: db.brand,
    shippingSettings: db.shippingSettings,
  };
}

export async function saveDbSettings(settings: { brand?: any; shippingSettings?: any }) {
  const db = await readDb();
  if (settings.brand) {
    db.brand = { ...db.brand, ...settings.brand };
  }
  if (settings.shippingSettings) {
    db.shippingSettings = { ...db.shippingSettings, ...settings.shippingSettings };
  }
  await writeDb(db);
  return {
    brand: db.brand,
    shippingSettings: db.shippingSettings,
  };
}

// ---------------- COUPONS ----------------
export async function getDbCoupons(): Promise<CouponItem[]> {
  const db = await readDb();
  return db.coupons;
}

export async function saveDbCoupon(coupon: Partial<CouponItem>): Promise<CouponItem> {
  const db = await readDb();
  let updated: CouponItem;

  if (coupon.id) {
    const idx = db.coupons.findIndex((c) => c.id === coupon.id);
    if (idx >= 0) {
      updated = { ...db.coupons[idx], ...coupon } as CouponItem;
      db.coupons[idx] = updated;
    } else {
      updated = { ...coupon, id: coupon.id } as CouponItem;
      db.coupons.push(updated);
    }
  } else {
    updated = {
      id: `cpn-${Date.now()}`,
      code: (coupon.code || 'PROMO').toUpperCase().trim(),
      discountPercent: coupon.discountPercent || 10,
      discountType: coupon.discountType || 'percentage',
      minSpend: coupon.minSpend || 0,
      maxDiscount: coupon.maxDiscount || 500,
      usageLimit: coupon.usageLimit || 1000,
      usageCount: 0,
      active: true,
      description: coupon.description || '',
      expiryDate: coupon.expiryDate || '2027-12-31',
    };
    db.coupons.push(updated);
  }

  await writeDb(db);
  return updated;
}

export async function deleteDbCoupon(id: string): Promise<boolean> {
  const db = await readDb();
  const initLen = db.coupons.length;
  db.coupons = db.coupons.filter((c) => c.id !== id && c.code !== id);
  if (db.coupons.length !== initLen) {
    await writeDb(db);
    return true;
  }
  return false;
}

// ---------------- CMS ----------------
export async function getDbCms() {
  const db = await readDb();
  return db.cms;
}

export async function saveDbCms(cmsData: any) {
  const db = await readDb();
  db.cms = {
    ...db.cms,
    ...cmsData,
  };
  await writeDb(db);
  return db.cms;
}

// ---------------- DASHBOARD STATS ----------------
export async function getDbStats() {
  const db = await readDb();
  const totalRevenue = db.orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const totalOrders = db.orders.length;
  const totalProducts = db.products.length;
  const totalCustomers = db.customers.length;

  const ordersByStatus = {
    pending: db.orders.filter((o) => o.status === 'pending').length,
    processing: db.orders.filter((o) => o.status === 'processing' || o.status === 'confirmed').length,
    shipped: db.orders.filter((o) => o.status === 'shipped' || o.status === 'packed').length,
    delivered: db.orders.filter((o) => o.status === 'delivered').length,
    cancelled: db.orders.filter((o) => o.status === 'cancelled').length,
  };

  const lowStockProducts = db.products.filter((p) => (p.stock || 0) < 15);

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalCustomers,
    ordersByStatus,
    lowStockCount: lowStockProducts.length,
    lowStockProducts: lowStockProducts.slice(0, 5),
    recentOrders: db.orders.slice(0, 6),
  };
}
