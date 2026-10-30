import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getCategories } from '@/lib/supabase/server';
import { ProductCard } from '@/components/product/ProductCard';
import { ArrowRight, Sparkles, Truck, RefreshCw, ShieldCheck, Feather, ArrowUpRight } from 'lucide-react';

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts({ isFeatured: true, limit: 8 }),
    getCategories(),
  ]);

  return (
    <div className="space-y-20 lg:space-y-28 pb-24">
      
      {/* 1. HERO SECTION: Clean, Warm, Natural Apparel */}
      <section className="relative min-h-[80vh] lg:min-h-[88vh] flex items-end justify-start overflow-hidden bg-zinc-950">
        {/* Warm, Natural Apparel Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=2400&q=85"
            alt="Avronce Premium Everyday Clothing Collection"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-40 scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Balanced gradient overlays for high legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/50 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24 w-full">
          <div className="max-w-2xl space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900/90 backdrop-blur-md border border-zinc-700/80 rounded-full text-xs uppercase tracking-wider text-zinc-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>New Arrivals 2026 • Made in India</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white tracking-tight leading-[1.1]">
              Everyday Luxury Clothing. <br />
              <span className="italic font-normal">Crafted to Last.</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 max-w-lg leading-relaxed font-light">
              Premium clothing made with breathable organic cotton, Japanese selvedge denim, and pure wool. Designed for comfort, fit, and lasting style.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/shop"
                className="px-8 py-4 bg-white text-zinc-950 hover:bg-zinc-200 text-xs uppercase tracking-[0.2em] font-semibold transition-colors text-center shadow-xl rounded-sm flex items-center justify-center gap-2"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/lookbook"
                className="px-8 py-4 bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700 text-xs uppercase tracking-[0.2em] font-medium transition-colors text-center backdrop-blur-md rounded-sm"
              >
                View Lookbook
              </Link>
            </div>

          </div>
        </div>

      </section>

      {/* 2. TRUST & ASSURANCE STRIP (Tailored for Indian Shoppers) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 bg-zinc-900/95 border border-zinc-800 rounded-sm shadow-2xl backdrop-blur-md">
          
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-sm bg-zinc-800 flex items-center justify-center shrink-0 text-white">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white">Free Delivery</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Across India on orders above ₹2,999</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-sm bg-zinc-800 flex items-center justify-center shrink-0 text-white">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white">Easy 7-Day Returns</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Hassle-free size & style exchange</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-sm bg-zinc-800 flex items-center justify-center shrink-0 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white">100% Secure Checkout</h4>
              <p className="text-xs text-zinc-400 mt-0.5">UPI (GPay/PhonePe), Cards & NetBanking</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-sm bg-zinc-800 flex items-center justify-center shrink-0 text-white">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-white">Pure Natural Fabrics</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Breathable organic cottons & pure wool</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CATEGORY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-zinc-800 pb-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-mono">Collections</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-wider text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
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
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
              <div className="absolute inset-x-3 bottom-3 flex items-end justify-between">
                <div>
                  <h3 className="font-serif text-base text-white tracking-wide group-hover:translate-x-1 transition-transform">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Explore →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. BESTSELLERS & FEATURED STYLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-zinc-800 pb-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-mono">Popular This Season</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white mt-1">
              Bestsellers & Featured Styles
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-wider text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>
      </section>

      {/* 5. WHY AVRONCE / HONEST QUALITY SECTION */}
      <section className="bg-zinc-900/40 border-y border-zinc-800/80 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-mono">The Avronce Promise</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-white leading-tight">
                Quality you can feel. <br />
                <span className="italic font-normal">Honest prices you can respect.</span>
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed font-light">
                We started Avronce to fix what modern fast-fashion broke: clothes that shrink after two washes, or foreign designer brands charging ₹15,000 for synthetic blends. We craft premium essentials in India using genuine heavyweight cotton, Japanese selvedge denim, and authentic virgin wool.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-zinc-800 text-xs">
                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider">Breathable in All Seasons</h4>
                  <p className="text-zinc-400 mt-1">Natural fibers that let your skin breathe in warm weather and insulate in the cold.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider">Direct & Transparent</h4>
                  <p className="text-zinc-400 mt-1">Made in India and shipped directly to you without luxury mall markups.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-white hover:underline underline-offset-8"
                >
                  <span>Read Our Full Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative aspect-[4/3] sm:aspect-[16/10] rounded-sm overflow-hidden border border-zinc-800 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80"
                alt="Avronce Tailoring Craftsmanship in India"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 6. STYLE INSPIRATION / LOOKBOOK PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-sm overflow-hidden border border-zinc-800 bg-zinc-900 min-h-[360px] flex items-center p-8 sm:p-14">
          <Image
            src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1800&q=80"
            alt="Avronce Style Inspiration"
            fill
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-zinc-300 font-mono">Style Guide</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-light">
              See How to Style Avronce
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
              Explore easy outfit ideas, jacket pairings, and everyday fits captured in our latest seasonal lookbook.
            </p>
            <Link
              href="/lookbook"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-zinc-950 font-semibold text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors rounded-sm shadow-lg"
            >
              <span>Explore The Lookbook</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
