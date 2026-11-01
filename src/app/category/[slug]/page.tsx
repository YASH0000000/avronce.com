import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getCollections, getProductsByCategory, getAllProducts } from '@/lib/store';
import { ProductList } from '@/components/product/ProductList';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const collections = getCollections();
  const currentCategory = collections.find(
    (c) => c.handle.toLowerCase() === slug.toLowerCase() || c.title.toLowerCase().includes(slug.toLowerCase())
  );
  return {
    title: `${currentCategory?.title || 'Collection'} | LITTLEBOX INDIA`,
    description: `Shop trending ${currentCategory?.title || slug} from Littlebox India. Free shipping above ₹999 & COD available.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const collections = getCollections();
  const currentCategory = collections.find(
    (c) => c.handle.toLowerCase() === slug.toLowerCase() || c.title.toLowerCase().includes(slug.toLowerCase())
  );

  const categoryProducts = getProductsByCategory(slug);
  const allProducts = getAllProducts();

  return (
    <div className="space-y-8 pb-16">
      {/* Category Banner */}
      <div className="relative min-h-[35vh] sm:min-h-[42vh] flex items-end bg-zinc-950 overflow-hidden border-b border-zinc-800">
        {currentCategory?.image && (
          <Image
            src={currentCategory.image}
            alt={currentCategory.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 w-full">
          <span className="text-xs uppercase tracking-widest text-yellow-400 font-mono font-bold">
            LITTLEBOX CATEGORY
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight mt-1">
            {currentCategory?.title || slug}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mt-2 leading-relaxed">
            {currentCategory?.description || `Explore ${currentCategory?.title || slug} styles with authentic streetwear & aesthetic vibes.`}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductList
          initialProducts={categoryProducts.length > 0 ? categoryProducts : allProducts}
          categories={collections}
          selectedCategorySlug={slug}
        />
      </div>
    </div>
  );
}
