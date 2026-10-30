'use client';

import React, { useState, useMemo } from 'react';
import { Product, Category } from '@/types/database';
import { ProductCard } from '@/components/product/ProductCard';
import { SlidersHorizontal, ArrowUpDown, X, Search } from 'lucide-react';

interface ProductListProps {
  initialProducts: Product[];
  categories: Category[];
  selectedCategorySlug?: string;
  initialSearch?: string;
}

export function ProductList({
  initialProducts,
  categories,
  selectedCategorySlug = 'all',
  initialSearch = '',
}: ProductListProps) {
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategorySlug);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [genderFilter, setGenderFilter] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category filter
      if (activeCategory !== 'all') {
        const matchesCat =
          product.category?.slug === activeCategory ||
          product.category_id === activeCategory;
        if (!matchesCat) return false;
      }

      // Gender filter
      if (genderFilter !== 'all') {
        if (product.gender !== genderFilter && product.gender !== 'unisex') {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description?.toLowerCase().includes(query);
        const matchesTagline = product.tagline?.toLowerCase().includes(query);
        const matchesCategory = product.category?.name.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesTagline && !matchesCategory) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        return Number(a.price) - Number(b.price);
      }
      if (sortBy === 'price-high') {
        return Number(b.price) - Number(a.price);
      }
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      // default 'featured'
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return 0;
    });
  }, [initialProducts, activeCategory, genderFilter, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      {/* 1. Control Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        
        {/* Category Pills (Scrollable on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-medium whitespace-nowrap rounded-sm transition-all ${
              activeCategory === 'all'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            All Pieces ({initialProducts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 text-xs uppercase tracking-widest font-medium whitespace-nowrap rounded-sm transition-all ${
                activeCategory === cat.slug
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Right side controls: Search input & Sort dropdown */}
        <div className="flex items-center gap-3">
          
          {/* Quick Filter Search */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter pieces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white pl-8 pr-7 py-2 rounded-sm focus:outline-none focus:border-zinc-500 placeholder:text-zinc-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 pl-3 pr-8 py-2 rounded-sm focus:outline-none focus:border-zinc-500 appearance-none font-medium cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

        </div>

      </div>

      {/* 2. Active Filters indicator */}
      {(activeCategory !== 'all' || searchQuery || genderFilter !== 'all') && (
        <div className="flex items-center gap-2 flex-wrap text-xs text-zinc-400">
          <span className="text-zinc-500">Filtered by:</span>
          {activeCategory !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-200">
              Category: {categories.find((c) => c.slug === activeCategory)?.name || activeCategory}
              <button onClick={() => setActiveCategory('all')} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-200">
              Query: &ldquo;{searchQuery}&rdquo;
              <button onClick={() => setSearchQuery('')} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
              setGenderFilter('all');
            }}
            className="text-zinc-400 hover:text-white underline text-[11px] ml-2"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 3. Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-zinc-800 rounded-sm">
          <p className="font-serif text-lg text-zinc-300 mb-2">No Matching Garments Found</p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-6">
            We couldn&apos;t find any items matching your criteria. Try adjusting your search or clearing active filters.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 bg-white text-zinc-950 text-xs uppercase font-medium tracking-widest hover:bg-zinc-200 transition-colors"
          >
            View All Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
