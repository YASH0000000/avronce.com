import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { createServerSupabase } from '@/lib/supabase/server';

const SOURCE_DB_PATH = path.join(process.cwd(), 'src', 'data', 'store-db.json');
const RUNTIME_DB_PATH = path.join(os.tmpdir(), 'avronce-store-db.json');

// Global in-memory database cache for warm Node.js / serverless invocations
declare global {
  // eslint-disable-next-line no-var
  var __avronce_db_cache__: StoreDbSchema | undefined;
}

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
  status: 'pending_payment' | 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'paid' | 'pending' | 'failed' | 'refunded' | 'captured';
  payment_method: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  tracking_token?: string;
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
  notes?: string;
  created_at: string;
  updated_at?: string;
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
    searchConsoleVerification?: string;
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
  adminSecurity?: {
    customPath: string;
    username?: string;
    passwordHash?: string;
    salt?: string;
    passwordProtected: boolean;
    lastUpdated?: string;
  };
}

export async function readDb(): Promise<StoreDbSchema> {
  // 1. If in-memory cache exists in current Node runtime, return a deep copy
  if (globalThis.__avronce_db_cache__) {
    return JSON.parse(JSON.stringify(globalThis.__avronce_db_cache__));
  }

  // 2. Try reading from runtime /tmp file if previously written
  try {
    const rawTmp = await fs.readFile(RUNTIME_DB_PATH, 'utf-8');
    const parsedTmp = JSON.parse(rawTmp);
    if (parsedTmp && Array.isArray(parsedTmp.products) && parsedTmp.products.length > 0) {
      globalThis.__avronce_db_cache__ = parsedTmp;
      return JSON.parse(JSON.stringify(parsedTmp));
    }
  } catch {
    // /tmp file not present yet
  }

  // 3. Fallback to read from repository source file
  try {
    const rawSource = await fs.readFile(SOURCE_DB_PATH, 'utf-8');
    const parsedSource = JSON.parse(rawSource);
    globalThis.__avronce_db_cache__ = parsedSource;

    // Asynchronously populate /tmp runtime file so future writes have a ready copy
    fs.writeFile(RUNTIME_DB_PATH, rawSource, 'utf-8').catch(() => {});

    return JSON.parse(JSON.stringify(parsedSource));
  } catch (err: any) {
    console.error('Error reading store database:', err);
    throw err;
  }
}

export async function writeDb(data: StoreDbSchema): Promise<void> {
  // 1. Immediately update global in-memory cache so all reads within this process see the update
  globalThis.__avronce_db_cache__ = JSON.parse(JSON.stringify(data));
  const jsonStr = JSON.stringify(data, null, 2);

  // 2. Write to runtime /tmp file (always writable on Vercel, AWS Lambda, Linux, Mac, Windows)
  try {
    await fs.writeFile(RUNTIME_DB_PATH, jsonStr, 'utf-8');
  } catch (tmpErr: any) {
    console.warn('Warning: Could not write to runtime tmp file:', tmpErr?.message);
  }

  // 3. Write to repository source file (works in local dev, VPS, Docker)
  try {
    await fs.writeFile(SOURCE_DB_PATH, jsonStr, 'utf-8');
  } catch (sourceErr: any) {
    // In serverless environments like Vercel or AWS Lambda, the root filesystem is read-only (EROFS).
    // This is expected in serverless; the state is already safely saved in memory and runtime /tmp file.
    if (sourceErr.code === 'EROFS' || sourceErr.code === 'EPERM' || sourceErr.code === 'EACCES') {
      console.info(`Serverless read-only filesystem (${sourceErr.code}): state persisted to runtime tmp storage.`);
    } else {
      console.warn('Could not write to source database path:', sourceErr?.message);
    }
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

  try {
    const supabase = createServerSupabase();
    const { data: sbOrders, error: sbErr } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false });

    if (!sbErr && sbOrders && Array.isArray(sbOrders)) {
      const mappedSbOrders: OrderItemRecord[] = sbOrders
        .filter((s: any) => s.order_number && s.order_number !== 'AVRONCE_STATE_SYNC' && s.order_number !== 'AVR-DUP-TEST')
        .map((s: any) => {
          let parsedNotes: any = {};
          try {
            if (s.notes && (s.notes.startsWith('{') || s.notes.startsWith('['))) {
              parsedNotes = JSON.parse(s.notes);
            }
          } catch {}

          const items: OrderItemRecord['items'] = Array.isArray(s.items) && s.items.length > 0
            ? s.items.map((it: any) => ({
                id: it.id || `item-${Date.now()}`,
                productId: it.product_id || it.productId || 'prod-custom',
                name: it.product_name || 'AVRONCE Item',
                slug: it.product_slug || 'item',
                size: it.size || 'Standard',
                price: Number(it.price || 0),
                quantity: Number(it.quantity || 1),
                image: it.product_image || '/images/collections/cat_boots.webp',
              }))
            : [];

          return {
            id: s.id,
            order_number: s.order_number,
            status: (s.status as any) || 'processing',
            payment_status: s.payment_status === 'captured' ? 'paid' : (s.payment_status || 'paid'),
            payment_method: parsedNotes.payment_method || (s.razorpay_payment_id ? 'Razorpay Secure Online' : 'Cash on Delivery (COD)'),
            razorpay_order_id: s.razorpay_order_id || '',
            razorpay_payment_id: s.razorpay_payment_id || '',
            razorpay_signature: s.razorpay_signature || '',
            tracking_token: parsedNotes.tracking_token || '',
            tracking_id: parsedNotes.tracking_id || '',
            courier: parsedNotes.courier || 'BlueDart Express',
            customer: {
              name: s.customer_name || s.shipping_address?.fullName || 'Customer',
              email: s.customer_email || s.shipping_address?.email || 'customer@avronce.com',
              phone: s.customer_phone || s.shipping_address?.phone || '',
            },
            shipping_address: s.shipping_address || {
              fullName: s.customer_name || 'Customer',
              email: s.customer_email || 'customer@avronce.com',
              phone: s.customer_phone || '',
              addressLine1: 'Address on file',
              city: 'India',
              state: '',
              postalCode: '',
              country: 'India',
            },
            items,
            subtotal: Number(s.subtotal || s.total_amount || 0),
            discount_amount: Number(s.discount_amount || 0),
            coupon_code: parsedNotes.coupon_code || '',
            shipping_fee: Number(s.shipping_fee || 0),
            tax_amount: Number(s.tax_amount || 0),
            total_amount: Number(s.total_amount || 0),
            notes: typeof s.notes === 'string' ? s.notes : '',
            created_at: s.created_at || new Date().toISOString(),
            updated_at: s.updated_at || s.created_at || new Date().toISOString(),
          };
        });

      // Merge Supabase orders with local db orders
      const orderMap = new Map<string, OrderItemRecord>();
      
      for (const o of mappedSbOrders) {
        orderMap.set(o.order_number, o);
      }

      for (const localO of db.orders || []) {
        if (!localO.order_number) continue;
        if (orderMap.has(localO.order_number)) {
          const existing = orderMap.get(localO.order_number)!;
          if (localO.tracking_id && !existing.tracking_id) existing.tracking_id = localO.tracking_id;
          if (localO.courier && existing.courier === 'BlueDart Express') existing.courier = localO.courier;
          if (localO.status && localO.status !== existing.status) existing.status = localO.status;
          if (localO.payment_status && localO.payment_status !== existing.payment_status) {
            existing.payment_status = localO.payment_status;
          }
          if (localO.razorpay_payment_id && !existing.razorpay_payment_id) {
            existing.razorpay_payment_id = localO.razorpay_payment_id;
          }
          if (localO.razorpay_signature && !existing.razorpay_signature) {
            existing.razorpay_signature = localO.razorpay_signature;
          }
          if ((!existing.items || existing.items.length === 0) && localO.items && localO.items.length > 0) {
            existing.items = localO.items;
          }
        } else {
          orderMap.set(localO.order_number, localO);
        }
      }

      const merged = Array.from(orderMap.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      db.orders = merged;
      return merged;
    }
  } catch (sbErr) {
    console.warn('Fallback to local database for orders:', sbErr);
  }

  return (db.orders || []).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getDbOrderByIdOrNumber(identifier: string): Promise<OrderItemRecord | null> {
  const orders = await getDbOrders();
  const clean = identifier.trim().toLowerCase();
  const match = orders.find(
    (o) =>
      o.id.toLowerCase() === clean ||
      o.order_number.toLowerCase() === clean ||
      (o.tracking_token && o.tracking_token.toLowerCase() === clean) ||
      (o.razorpay_order_id && o.razorpay_order_id.toLowerCase() === clean)
  );
  return match || null;
}

export async function createDbOrder(order: Partial<OrderItemRecord>): Promise<OrderItemRecord> {
  const db = await readDb();
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randNum = Math.floor(10000 + Math.random() * 90000);
  const orderNumber = order.order_number || `AVR-${dateStr}-${randNum}`;
  const trackingToken = order.tracking_token || `trk_${crypto.randomBytes(16).toString('hex')}`;
  const now = new Date().toISOString();

  const newOrder: OrderItemRecord = {
    id: order.id || `ord-${Date.now()}`,
    order_number: orderNumber,
    status: order.status || 'pending',
    payment_status: order.payment_status || 'pending',
    payment_method: order.payment_method || 'Online Payment',
    razorpay_order_id: order.razorpay_order_id || '',
    razorpay_payment_id: order.razorpay_payment_id || '',
    razorpay_signature: order.razorpay_signature || '',
    tracking_token: trackingToken,
    tracking_id: order.tracking_id || '',
    courier: order.courier || 'BlueDart Express',
    customer: order.customer || {
      name: (order.shipping_address as any)?.fullName || 'Customer',
      email: (order.shipping_address as any)?.email || 'guest@avronce.com',
      phone: (order.shipping_address as any)?.phone || '',
    },
    shipping_address: order.shipping_address as any,
    items: order.items || [],
    subtotal: Number(order.subtotal || 0),
    discount_amount: Number(order.discount_amount || 0),
    coupon_code: order.coupon_code || '',
    shipping_fee: Number(order.shipping_fee || 0),
    tax_amount: Number(order.tax_amount || 0),
    total_amount: Number(order.total_amount || 0),
    notes: order.notes || '',
    created_at: order.created_at || now,
    updated_at: now,
  };

  // Sync to Supabase orders and order_items
  try {
    const supabase = createServerSupabase();
    const metaNotes = JSON.stringify({
      payment_method: newOrder.payment_method,
      courier: newOrder.courier,
      tracking_id: newOrder.tracking_id,
      coupon_code: newOrder.coupon_code,
      tracking_token: newOrder.tracking_token,
      items_count: newOrder.items.length,
      note: newOrder.notes || '',
    });

    const { data: sbOrder, error: sbErr } = await supabase
      .from('orders')
      .insert({
        order_number: newOrder.order_number,
        customer_name: newOrder.customer.name,
        customer_email: newOrder.customer.email,
        customer_phone: newOrder.customer.phone || (newOrder.shipping_address?.phone) || '9999999999',
        shipping_address: newOrder.shipping_address,
        subtotal: newOrder.subtotal,
        tax_amount: newOrder.tax_amount,
        shipping_fee: newOrder.shipping_fee,
        discount_amount: newOrder.discount_amount,
        total_amount: newOrder.total_amount,
        status: newOrder.status === 'pending_payment' ? 'pending' : (newOrder.status === 'confirmed' ? 'processing' : newOrder.status),
        payment_status: newOrder.payment_status === 'paid' ? 'captured' : newOrder.payment_status,
        razorpay_order_id: newOrder.razorpay_order_id || null,
        razorpay_payment_id: newOrder.razorpay_payment_id || null,
        razorpay_signature: newOrder.razorpay_signature || null,
        notes: metaNotes,
      })
      .select()
      .single();

    if (!sbErr && sbOrder) {
      newOrder.id = sbOrder.id; // Store Supabase UUID on order

      // Insert order items into Supabase
      if (newOrder.items && newOrder.items.length > 0) {
        const itemsToInsert = newOrder.items.map((it) => ({
          order_id: sbOrder.id,
          product_name: it.name,
          product_slug: it.slug || null,
          product_image: it.image || null,
          size: it.size || 'Standard',
          color_name: (it as any).colorName || 'Default',
          price: Number(it.price || 0),
          quantity: Number(it.quantity || 1),
          total: Number((it.price || 0) * (it.quantity || 1)),
        }));

        await supabase.from('order_items').insert(itemsToInsert);
      }
    }
  } catch (sbInsertErr) {
    console.warn('Supabase order creation warning:', sbInsertErr);
  }

  // Update in-memory local DB
  const existingIdx = db.orders.findIndex(
    (o) => o.order_number === newOrder.order_number || o.id === newOrder.id
  );
  if (existingIdx >= 0) {
    db.orders[existingIdx] = newOrder;
  } else {
    db.orders.unshift(newOrder);
  }

  // Update customer record
  if (newOrder.customer?.email) {
    const custIdx = db.customers.findIndex(
      (c) => c.email.toLowerCase() === newOrder.customer.email.toLowerCase()
    );
    if (custIdx >= 0) {
      db.customers[custIdx].ordersCount += 1;
      db.customers[custIdx].totalSpent += newOrder.total_amount;
    } else {
      db.customers.unshift({
        id: `cust-${Date.now()}`,
        name: newOrder.customer.name,
        email: newOrder.customer.email,
        phone: newOrder.customer.phone,
        ordersCount: 1,
        totalSpent: newOrder.total_amount,
        city: (newOrder.shipping_address as any)?.city || 'India',
        joinedDate: new Date().toISOString().split('T')[0],
      });
    }
  }

  // Adjust stock
  if (newOrder.payment_status === 'paid' || newOrder.status === 'confirmed' || newOrder.status === 'processing') {
    for (const item of newOrder.items) {
      const prod = db.products.find((p) => p.id === item.productId || p.slug === item.slug);
      if (prod && prod.stock !== undefined) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        prod.available = prod.stock > 0;
      }
    }
  }

  await writeDb(db);
  return newOrder;
}

export async function updateDbOrderStatus(
  id: string,
  status: OrderItemRecord['status'],
  trackingId?: string,
  courier?: string,
  paymentStatus?: OrderItemRecord['payment_status'],
  razorpayPaymentId?: string
): Promise<OrderItemRecord | null> {
  const db = await readDb();
  if (!db.orders || db.orders.length === 0) {
    await getDbOrders();
  }

  const order = db.orders.find((o) => o.id === id || o.order_number === id);
  if (!order) {
    const allOrders = await getDbOrders();
    const found = allOrders.find((o) => o.id === id || o.order_number === id);
    if (!found) return null;
    return updateDbOrderStatus(found.id, status, trackingId, courier, paymentStatus, razorpayPaymentId);
  }

  const previousStatus = order.status;
  order.status = status;
  order.updated_at = new Date().toISOString();

  if (trackingId !== undefined) order.tracking_id = trackingId;
  if (courier !== undefined) order.courier = courier;
  if (paymentStatus !== undefined) order.payment_status = paymentStatus;
  if (razorpayPaymentId !== undefined) order.razorpay_payment_id = razorpayPaymentId;

  // Stock restoration on cancellation
  if (status === 'cancelled' && previousStatus !== 'cancelled') {
    for (const item of order.items || []) {
      const prod = db.products.find((p) => p.id === item.productId || p.slug === item.slug);
      if (prod && prod.stock !== undefined) {
        prod.stock += item.quantity;
        prod.available = prod.stock > 0;
      }
    }
  }

  // Stock deduction if moving from pending_payment to processing/confirmed
  if ((status === 'processing' || status === 'confirmed') && previousStatus === 'pending_payment') {
    for (const item of order.items || []) {
      const prod = db.products.find((p) => p.id === item.productId || p.slug === item.slug);
      if (prod && prod.stock !== undefined) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        prod.available = prod.stock > 0;
      }
    }
  }

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
  const orders = await getDbOrders();
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled' && o.payment_status !== 'failed')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const totalOrders = orders.length;
  const totalProducts = db.products.length;
  const totalCustomers = db.customers.length;

  const ordersByStatus = {
    pending: orders.filter((o) => o.status === 'pending' || o.status === 'pending_payment').length,
    processing: orders.filter((o) => o.status === 'processing' || o.status === 'confirmed').length,
    shipped: orders.filter((o) => o.status === 'shipped' || o.status === 'packed').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
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
    recentOrders: orders.slice(0, 8),
  };
}

// ---------------- ADMIN SECURITY & AUTHENTICATION ----------------
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'avronce_super_secure_admin_session_key_2026';

export function hashAdminPassword(password: string, salt = crypto.randomBytes(16).toString('hex')): { hash: string; salt: string } {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyAdminPassword(password: string, salt: string, expectedHash: string): boolean {
  if (!password || !salt || !expectedHash) return false;
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
}

export function generateAdminSessionToken(username: string): string {
  const issuedAt = Date.now();
  const payload = Buffer.from(JSON.stringify({ username, issuedAt })).toString('base64');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

export function verifyAdminSessionToken(token: string): { valid: boolean; username?: string } {
  if (!token || !token.includes('.')) return { valid: false };
  const [payloadBase64, signature] = token.split('.');
  try {
    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadBase64).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'))) {
      return { valid: false };
    }

    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
    // Valid for 7 days
    if (Date.now() - payload.issuedAt > 7 * 24 * 60 * 60 * 1000) {
      return { valid: false };
    }

    return { valid: true, username: payload.username };
  } catch {
    return { valid: false };
  }
}

export async function getDbAdminSecurity() {
  const db = await readDb();
  if (!db.adminSecurity) {
    // Initialize defaults
    const { hash, salt } = hashAdminPassword('admin');
    db.adminSecurity = {
      customPath: 'admin-avronce',
      username: 'admin@avronce.com',
      passwordHash: hash,
      salt: salt,
      passwordProtected: true,
      lastUpdated: new Date().toISOString(),
    };
    await writeDb(db);
  } else if (!db.adminSecurity.passwordHash) {
    // If password was stored as plain text before, hash it now securely
    const rawPwd = (db.adminSecurity as any).password || 'admin';
    const { hash, salt } = hashAdminPassword(rawPwd);
    db.adminSecurity.passwordHash = hash;
    db.adminSecurity.salt = salt;
    delete (db.adminSecurity as any).password;
    if (!db.adminSecurity.username) db.adminSecurity.username = 'admin@avronce.com';
    await writeDb(db);
  }

  return {
    customPath: db.adminSecurity.customPath || 'admin-avronce',
    username: db.adminSecurity.username || 'admin@avronce.com',
    passwordProtected: db.adminSecurity.passwordProtected !== false,
    lastUpdated: db.adminSecurity.lastUpdated,
  };
}

export async function updateDbAdminSecurity(updates: {
  customPath?: string;
  username?: string;
  currentPassword?: string;
  newPassword?: string;
  passwordProtected?: boolean;
}): Promise<{ success: boolean; error?: string; customPath?: string }> {
  const db = await readDb();
  if (!db.adminSecurity) {
    await getDbAdminSecurity();
  }

  const sec = db.adminSecurity!;

  // If changing password, verify current password
  if (updates.newPassword) {
    if (!updates.currentPassword) {
      return { success: false, error: 'Current password is required to set a new password' };
    }

    const isMatch = verifyAdminPassword(updates.currentPassword, sec.salt || '', sec.passwordHash || '');
    if (!isMatch) {
      return { success: false, error: 'Current password is incorrect' };
    }

    if (updates.newPassword.length < 5) {
      return { success: false, error: 'New password must be at least 5 characters long' };
    }

    const { hash, salt } = hashAdminPassword(updates.newPassword);
    sec.passwordHash = hash;
    sec.salt = salt;
  }

  if (updates.customPath) {
    // Clean path slug
    const cleanPath = updates.customPath.toLowerCase().replace(/[^a-z0-9-_]/g, '').trim();
    if (!cleanPath) {
      return { success: false, error: 'Invalid admin path slug' };
    }
    sec.customPath = cleanPath;
  }

  if (updates.username) {
    sec.username = updates.username.trim();
  }

  if (updates.passwordProtected !== undefined) {
    sec.passwordProtected = updates.passwordProtected;
  }

  sec.lastUpdated = new Date().toISOString();
  await writeDb(db);

  return { success: true, customPath: sec.customPath };
}

export async function authenticateAdmin(password: string): Promise<{ success: boolean; username?: string; token?: string }> {
  const db = await readDb();
  if (!db.adminSecurity) {
    await getDbAdminSecurity();
  }

  const sec = db.adminSecurity!;
  if (!sec.passwordProtected) {
    const token = generateAdminSessionToken(sec.username || 'admin@avronce.com');
    return { success: true, username: sec.username || 'admin@avronce.com', token };
  }

  // Master recovery fallback from environment variable
  const envPassword = process.env.ADMIN_DEFAULT_PASSWORD;
  if (envPassword && password === envPassword) {
    const token = generateAdminSessionToken(sec.username || 'admin@avronce.com');
    return { success: true, username: sec.username || 'admin@avronce.com', token };
  }

  const isMatch = verifyAdminPassword(password, sec.salt || '', sec.passwordHash || '');
  if (!isMatch) {
    return { success: false };
  }

  const token = generateAdminSessionToken(sec.username || 'admin@avronce.com');
  return { success: true, username: sec.username || 'admin@avronce.com', token };
}
