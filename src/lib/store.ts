import littleboxData from '@/data/littlebox.json';

export interface LittleboxVariant {
  id: string;
  title: string;
  sku: string;
  price: number;
  compareAtPrice: number;
  available: boolean;
  option1?: string | null;
  option2?: string | null;
}

export interface LittleboxProduct {
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
  variants: LittleboxVariant[];
  tags: string[];
  rating: string;
  reviewsCount: number;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  createdAt: string;
  publishedAt: string;
}

export interface LittleboxCollection {
  id: number;
  title: string;
  handle: string;
  type: string;
  productsCount: number;
  image: string;
  description: string;
}

export interface LittleboxMood {
  id: string;
  name: string;
  handle: string;
  color: string;
  image: string;
  productsCount: number;
}

export interface LittleboxBrand {
  name: string;
  tagline: string;
  announcements: string[];
  social: {
    instagram: string;
    facebook: string;
  };
}

const data = littleboxData as {
  brand: LittleboxBrand;
  featuredCollections: LittleboxCollection[];
  moodCollections: LittleboxMood[];
  products: LittleboxProduct[];
};

export function getBrand(): LittleboxBrand {
  return data.brand;
}

export function getCollections(): LittleboxCollection[] {
  return data.featuredCollections;
}

export function getMoods(): LittleboxMood[] {
  return data.moodCollections;
}

export function getAllProducts(): LittleboxProduct[] {
  return data.products;
}

export function getProductBySlug(slug: string): LittleboxProduct | null {
  const p = data.products.find(
    (item) => item.slug.toLowerCase() === slug.toLowerCase() || item.handle.toLowerCase() === slug.toLowerCase()
  );
  return p || null;
}

export function getProductsByCategory(category: string, limit?: number): LittleboxProduct[] {
  const filtered = data.products.filter(
    (p) =>
      p.category.toLowerCase().includes(category.toLowerCase()) ||
      p.collectionHandle.toLowerCase() === category.toLowerCase() ||
      p.productType.toLowerCase().includes(category.toLowerCase()) ||
      p.type.toLowerCase().includes(category.toLowerCase())
  );
  return limit ? filtered.slice(0, limit) : filtered;
}

export function getProductsByMood(moodId: string, limit?: number): LittleboxProduct[] {
  // Map moods to tags or styles
  const mood = moodId.toLowerCase();
  let filtered: LittleboxProduct[] = [];

  if (mood === 'edgy') {
    filtered = data.products.filter(
      (p) => p.category === 'Boots' || p.category === 'Bottoms' || p.tags.some((t) => t.toLowerCase().includes('edgy') || t.toLowerCase().includes('club'))
    );
  } else if (mood === 'cute') {
    filtered = data.products.filter(
      (p) => p.category === 'Dresses' || p.category === 'Tops' || p.tags.some((t) => t.toLowerCase().includes('pink') || t.toLowerCase().includes('lace'))
    );
  } else if (mood === 'kpop') {
    filtered = data.products.filter(
      (p) => p.category === 'Coords' || p.category === 'Tops' || p.category === 'Boots'
    );
  } else if (mood === 'sexy') {
    filtered = data.products.filter(
      (p) => p.category === 'Dresses' || p.category === 'Heels & Platforms'
    );
  } else if (mood === 'cozy') {
    filtered = data.products.filter(
      (p) => p.category === 'Bottoms' || p.category === 'Tops' || p.category === 'Flats & Mary Janes'
    );
  } else {
    filtered = data.products.slice(0, 8);
  }

  if (filtered.length < 4) {
    filtered = data.products.slice(0, 6);
  }

  return limit ? filtered.slice(0, limit) : filtered;
}

export function getBestsellers(limit = 8): LittleboxProduct[] {
  return data.products.filter((p) => p.isBestseller).slice(0, limit);
}

export function getFeaturedProducts(limit = 8): LittleboxProduct[] {
  return data.products.filter((p) => p.isFeatured).slice(0, limit);
}

export function getFootwear(limit = 8): LittleboxProduct[] {
  return data.products.filter((p) => p.type === 'Footwear').slice(0, limit);
}

export function getDresses(limit = 8): LittleboxProduct[] {
  return data.products.filter((p) => p.category === 'Dresses').slice(0, limit);
}

export function searchProducts(query: string): LittleboxProduct[] {
  const q = query.toLowerCase().trim();
  if (!q) return data.products;
  return data.products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.productType.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}
