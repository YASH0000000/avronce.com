import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const COLLECTIONS = [
  { handle: 'boots', category: 'Boots', type: 'Footwear' },
  { handle: 'flats', category: 'Flats & Mary Janes', type: 'Footwear' },
  { handle: 'heels', category: 'Heels & Platforms', type: 'Footwear' },
  { handle: 'dressup15', category: 'Dresses', type: 'Clothing' },
  { handle: 'tops15', category: 'Tops', type: 'Clothing' },
  { handle: 'matching-sets', category: 'Coords', type: 'Clothing' },
  { handle: 'baggy-pants', category: 'Bottoms', type: 'Clothing' },
  { handle: 'best-sellers', category: 'Best Sellers', type: 'Trending' },
];

const MOODS = [
  { id: 'edgy', name: 'Feeling Edgy 🖤', handle: 'feeling-edgy', color: '#111827' },
  { id: 'cute', name: 'Feeling Cute 🌸', handle: 'feeling-cute', color: '#F472B6' },
  { id: 'kpop', name: 'Feeling K-Pop ⚡', handle: 'feeling-k-pop', color: '#8B5CF6' },
  { id: 'cozy', name: 'Feeling Cozy ☁️', handle: 'feeling-cozy', color: '#60A5FA' },
  { id: 'sexy', name: 'Feeling Sexy 🔥', handle: 'feeling-sexy', color: '#EF4444' },
  { id: 'elegant', name: 'Feeling Elegant ✨', handle: 'feeling-elegant', color: '#D97706' },
];

async function downloadFile(url, destPath) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!res.ok) {
      console.warn(`Failed to download ${url}: status ${res.status}`);
      return false;
    }
    const arrayBuffer = await res.arrayBuffer();
    await fs.writeFile(destPath, Buffer.from(arrayBuffer));
    return true;
  } catch (err) {
    console.warn(`Error downloading ${url}:`, err.message);
    return false;
  }
}

function sanitizeFilename(str) {
  return str.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 80);
}

async function main() {
  console.log('Fetching Littlebox collections metadata...');
  const collectionsRes = await fetch('https://littleboxindia.com/collections.json?limit=250');
  const collectionsData = await collectionsRes.json();
  const rawCollections = collectionsData.collections || [];

  const collectionMap = new Map();
  for (const c of rawCollections) {
    collectionMap.set(c.handle, c);
  }

  // Download collection category images
  const featuredCollections = [];
  for (const item of COLLECTIONS) {
    const found = collectionMap.get(item.handle);
    if (!found) continue;

    let localImg = null;
    if (found.image && found.image.src) {
      const ext = path.extname(found.image.src.split('?')[0]) || '.webp';
      const filename = `cat_${sanitizeFilename(item.handle)}${ext}`;
      const dest = path.join(ROOT, 'public', 'images', 'collections', filename);
      const ok = await downloadFile(found.image.src, dest);
      if (ok) {
        localImg = `/images/collections/${filename}`;
        console.log(`Downloaded collection image: ${localImg}`);
      }
    }

    featuredCollections.push({
      id: found.id,
      title: item.category,
      handle: item.handle,
      type: item.type,
      productsCount: found.products_count,
      image: localImg || found.image?.src || '',
      description: found.description || `Trendy ${item.category} collection by Littlebox`
    });
  }

  // Download Mood images from matching collections
  const moodCollections = [];
  for (const mood of MOODS) {
    const found = collectionMap.get(mood.handle);
    let localImg = null;
    if (found?.image?.src) {
      const ext = path.extname(found.image.src.split('?')[0]) || '.webp';
      const filename = `mood_${sanitizeFilename(mood.id)}${ext}`;
      const dest = path.join(ROOT, 'public', 'images', 'collections', filename);
      const ok = await downloadFile(found.image.src, dest);
      if (ok) {
        localImg = `/images/collections/${filename}`;
        console.log(`Downloaded mood image: ${localImg}`);
      }
    }
    moodCollections.push({
      ...mood,
      image: localImg || found?.image?.src || '',
      productsCount: found?.products_count || 100
    });
  }

  // Fetch products from key collections
  console.log('Fetching curated products from Littlebox...');
  const allProducts = [];
  const seenIds = new Set();

  for (const col of COLLECTIONS) {
    try {
      console.log(`Fetching products for collection: ${col.handle}...`);
      const res = await fetch(`https://littleboxindia.com/collections/${col.handle}/products.json?limit=6`);
      if (!res.ok) continue;
      const data = await res.json();
      const products = data.products || [];

      for (const p of products) {
        if (seenIds.has(p.id)) continue;
        seenIds.add(p.id);

        // Download up to 3 images per product
        const downloadedImages = [];
        const rawImages = (p.images || []).slice(0, 3);
        let imgIdx = 1;

        for (const img of rawImages) {
          const ext = path.extname(img.src.split('?')[0]) || '.webp';
          const filename = `prod_${p.id}_${imgIdx}${ext}`;
          const dest = path.join(ROOT, 'public', 'images', 'products', filename);
          const ok = await downloadFile(img.src, dest);
          if (ok) {
            downloadedImages.push(`/images/products/${filename}`);
          } else {
            downloadedImages.push(img.src);
          }
          imgIdx++;
        }

        const primaryPrice = parseFloat(p.variants?.[0]?.price || '999');
        const compareAtPrice = p.variants?.[0]?.compare_at_price
          ? parseFloat(p.variants[0].compare_at_price)
          : Math.round(primaryPrice * 1.55);

        const discountPercent = Math.round(((compareAtPrice - primaryPrice) / compareAtPrice) * 100);

        allProducts.push({
          id: String(p.id),
          title: p.title,
          handle: p.handle,
          slug: p.handle,
          description: p.body_html || '',
          productType: p.product_type || col.category,
          category: col.category,
          collectionHandle: col.handle,
          type: col.type,
          price: primaryPrice,
          originalPrice: compareAtPrice,
          discountPercent,
          images: downloadedImages.length ? downloadedImages : ['/placeholder.jpg'],
          available: p.variants?.some((v) => v.available) ?? true,
          options: p.options || [{ name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] }],
          variants: (p.variants || []).map((v) => ({
            id: String(v.id),
            title: v.title,
            sku: v.sku || `LB-${p.id}`,
            price: parseFloat(v.price),
            compareAtPrice: v.compare_at_price ? parseFloat(v.compare_at_price) : compareAtPrice,
            available: v.available,
            option1: v.option1,
            option2: v.option2
          })),
          tags: p.tags || [],
          rating: (4.4 + Math.random() * 0.5).toFixed(1),
          reviewsCount: Math.floor(40 + Math.random() * 280),
          isFeatured: Math.random() > 0.4,
          isBestseller: col.handle === 'best-sellers' || col.handle === 'boots' || Math.random() > 0.6,
          isNew: (p.tags || []).some((t) => t.toLowerCase().includes('new')),
          createdAt: p.created_at,
          publishedAt: p.published_at
        });
      }
    } catch (err) {
      console.warn(`Error fetching ${col.handle}:`, err.message);
    }
  }

  console.log(`Successfully compiled ${allProducts.length} real Littlebox products!`);

  const outputData = {
    brand: {
      name: 'LITTLEBOX',
      tagline: 'Fast Fashion For The Bold & Trendsetters',
      announcements: [
        '⚡ FLASH SALE: BUY 2 GET 1 FREE | USE CODE: B2G1',
        '✨ FREE SHIPPING ON ALL PREPAID ORDERS ACROSS INDIA',
        '🔥 FLAT ₹200 OFF ON FIRST ORDER | CODE: WELCOME200',
        '📦 EASY 7-DAY EXCHANGE & CASH ON DELIVERY AVAILABLE'
      ],
      social: {
        instagram: 'https://instagram.com/littleboxindia',
        facebook: 'https://facebook.com/littleboxindia'
      }
    },
    featuredCollections,
    moodCollections,
    products: allProducts
  };

  const jsonPath = path.join(ROOT, 'src', 'data', 'littlebox.json');
  await fs.writeFile(jsonPath, JSON.stringify(outputData, null, 2), 'utf-8');
  console.log(`Saved littlebox data to ${jsonPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
