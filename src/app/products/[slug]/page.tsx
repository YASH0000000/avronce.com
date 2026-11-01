import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getProductsByCategory, getAllProducts } from '@/lib/store';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductDetails } from '@/components/product/ProductDetails';
import { ProductCard } from '@/components/product/ProductCard';
import { ChevronRight } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return { title: 'Product Not Found | LITTLEBOX INDIA' };
  }
  return {
    title: `${product.title} | LITTLEBOX INDIA`,
    description: `Buy ${product.title} online at best price in India. Free shipping above ₹999, cash on delivery & 7-day easy exchange available.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getProductsByCategory(product.category || product.productType, 4).filter(
    (p) => p.id !== product.id
  );
  const fallbackRelated = getAllProducts().slice(0, 4);
  const relatedProducts = related.length >= 2 ? related : fallbackRelated;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-zinc-500 uppercase tracking-wider font-mono overflow-x-auto pb-1 scrollbar-none">
        <Link href="/" className="hover:text-zinc-950 dark:hover:text-white transition-colors shrink-0">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <Link href="/shop" className="hover:text-zinc-950 dark:hover:text-white transition-colors shrink-0">
          Shop
        </Link>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <Link
          href={`/category/${product.collectionHandle || 'boots'}`}
          className="hover:text-zinc-950 dark:hover:text-white transition-colors shrink-0"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <span className="text-zinc-900 dark:text-zinc-200 truncate max-w-xs shrink-0 font-bold">
          {product.title}
        </span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.title} />
        </div>

        {/* Right: Product Details & Purchase Controls */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <ProductDetails product={product} />
          </div>
        </div>
      </div>

      {/* Related / Styled With */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 pt-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono font-bold">
              STYLE INSPIRATION
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-950 dark:text-white mt-1">
              You May Also Love ✨
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white underline underline-offset-4"
          >
            Explore All Catalog
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {relatedProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

    </div>
  );
}
