import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { LittleboxCollection } from '@/lib/store';

interface CategoryGridProps {
  collections: LittleboxCollection[];
}

export function CategoryGrid({ collections }: CategoryGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-mono font-bold">
            TRENDING ESSENTIALS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-white mt-1">
            Shop by Category ⚡
          </h2>
        </div>
        <Link
          href="/shop"
          className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white inline-flex items-center gap-1 transition-colors"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
        {collections.slice(0, 7).map((col) => (
          <Link
            key={col.id}
            href={`/category/${col.handle}`}
            className="group relative flex flex-col items-center text-center overflow-hidden"
          >
            {/* Round/rounded aspect image */}
            <div className="relative aspect-[3/4] w-full rounded-sm overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all group-hover:shadow-md group-hover:border-zinc-400 dark:group-hover:border-zinc-600">
              {col.image && (
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 15vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
              <div className="absolute inset-x-2 bottom-2 text-center">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-300">
                  {col.productsCount}+ Styles
                </span>
              </div>
            </div>

            {/* Category title */}
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mt-2 group-hover:underline">
              {col.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
