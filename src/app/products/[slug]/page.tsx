import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getRelatedProducts } from '@/lib/supabase/server';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductDetails } from '@/components/product/ProductDetails';
import { ProductCard } from '@/components/product/ProductCard';
import { ChevronRight } from 'lucide-react';

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category_id, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-16">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-wider font-mono">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/category/${product.category.slug}`} className="hover:text-white transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-300 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left: Multi-Photo High-Res Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Sizing, Color, Purchase Controls, Accordions */}
        <div className="lg:col-span-5">
          <div className="sticky top-28">
            <ProductDetails product={product} />
          </div>
        </div>

      </div>

      {/* Related Atelier Pieces */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-zinc-800 pt-16 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-mono">Complementary</span>
              <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-white mt-1">
                Curate The Silhouette
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs uppercase tracking-widest text-zinc-400 hover:text-white underline underline-offset-4"
            >
              Browse All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
