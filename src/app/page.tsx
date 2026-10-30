import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getCategories } from '@/lib/supabase/server';
import { ProductCard } from '@/components/product/ProductCard';
import { ArrowRight, Sparkles, Shield, Compass, ArrowUpRight } from 'lucide-react';

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts({ isFeatured: true, limit: 8 }),
    getCategories(),
  ]);

  return (
    <div className="space-y-24 lg:space-y-32 pb-24">
      
      {/* 1. EDITORIAL HERO BANNER */}
      <section className="relative min-h-[85vh] lg:min-h-[92vh] flex items-end justify-start overflow-hidden bg-zinc-950">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2400&q=85"
            alt="Avronce Autumn Winter Campaign"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-70 scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Subtle gradient overlays for high-fashion editorial mood */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24 w-full">
          <div className="max-w-2xl space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/80 backdrop-blur-md border border-zinc-700/60 rounded-full text-[11px] uppercase tracking-[0.25em] text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Autumn / Winter &apos;26 Drop</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.08]">
              Architectural Form. <br />
              <span className="italic font-normal">Permanent Luxury.</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 max-w-lg leading-relaxed font-light">
              Rejecting seasonal churn. Precision-cut 14.5oz Okayama selvedge denim, 480 GSM organic loopback fleece, and Italian virgin wool tailored for life.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                href="/shop"
                className="px-8 py-4 bg-white text-zinc-950 hover:bg-zinc-200 text-xs uppercase tracking-[0.25em] font-medium transition-colors text-center shadow-2xl rounded-sm flex items-center justify-center gap-2"
              >
                <span>Acquire The Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/lookbook"
                className="px-8 py-4 bg-zinc-950/60 hover:bg-zinc-900 text-white border border-zinc-700 text-xs uppercase tracking-[0.25em] font-medium transition-colors text-center backdrop-blur-md rounded-sm"
              >
                Explore Lookbook
              </Link>
            </div>

          </div>
        </div>

      </section>

      {/* 2. CURATED CATEGORY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-mono">Disciplines</span>
            <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-white mt-1">
              Curated Silhouettes
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-zinc-900 border border-zinc-800"
            >
              {cat.image_url && (
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-75 group-hover:opacity-90"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
                <div>
                  <h3 className="font-serif text-lg tracking-wider uppercase text-white group-hover:translate-x-1 transition-transform">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                    {cat.description}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-white group-hover:text-zinc-950 transition-colors shrink-0 ml-2">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED ATELIER PIECES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-mono">Flagship Drop</span>
            <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-white mt-1">
              Atelier Highlights
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View All Pieces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>
      </section>

      {/* 4. THE AVRONCE MANIFESTO / CRAFT SECTION */}
      <section className="bg-zinc-900/40 border-y border-zinc-800/80 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-mono">The Avronce Philosophy</span>
              <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
                Crafted for wear, <br />
                <span className="italic font-normal">never for the landfill.</span>
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                Every pattern in our workshop undergoes rigorous trial drape analysis. We source strictly natural fibers: long-staple Indian combed cottons, Kuroki Mills unwashed selvedge denim from Okayama, and pure Italian virgin wool that breaks in gracefully year after year.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-zinc-800 text-xs">
                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider font-mono">Zero Synthetics</h4>
                  <p className="text-zinc-400 mt-1">100% natural organic cotton, linen, silk, and virgin wool.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider font-mono">Limited Runs</h4>
                  <p className="text-zinc-400 mt-1">Produced in small numbered batches to prevent overproduction.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white hover:underline underline-offset-8"
                >
                  <span>Read The Full Manifesto</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative aspect-[4/5] rounded-sm overflow-hidden border border-zinc-800">
              <Image
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80"
                alt="Avronce Atelier Craftsmanship"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 5. EDITORIAL LOOKBOOK PREVIEW BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-sm overflow-hidden border border-zinc-800 bg-zinc-900 min-h-[400px] flex items-center p-8 sm:p-16">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80"
            alt="Editorial Lookbook"
            fill
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-300 font-mono">Volume IV</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
              Visual Chronicles: <br />
              The Winter Lookbook
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
              Captured in brutalist architectural spaces, revealing how Avronce outerwear and tailoring drape under natural atmospheric light.
            </p>
            <Link
              href="/lookbook"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-950 font-medium text-xs uppercase tracking-[0.25em] hover:bg-zinc-200 transition-colors rounded-sm"
            >
              <span>Explore The Story</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
