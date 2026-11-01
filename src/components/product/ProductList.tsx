'use client';

import React, { useState, useMemo } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { SlidersHorizontal, ArrowUpDown, X, Search, Sparkles, Tag, Flame } from 'lucide-react';

interface ProductListProps {
  initialProducts: any[];
  categories: any[];
  selectedCategorySlug?: string;
  initialSearch?: string;
  initialFilter?: string;
  initialMood?: string;
}

export function ProductList({
  initialProducts,
  categories,
  selectedCategorySlug = 'all',
  initialSearch = '',
  initialFilter = 'all',
  initialMood = '',
}: ProductListProps) {
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategorySlug);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);
  const [activeMood, setActiveMood] = useState<string>(initialMood);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category filter
      if (activeCategory !== 'all') {
        const cat = activeCategory.toLowerCase();
        const pCat = (product.category || '').toLowerCase();
        const pCol = (product.collectionHandle || '').toLowerCase();
        const pType = (product.productType || product.type || '').toLowerCase();
        const matchesCat =
          pCat.includes(cat) ||
          pCol === cat ||
          pType.includes(cat) ||
          product.category?.slug === activeCategory;
        if (!matchesCat) return false;
      }

      // Hot filter (new, bestseller, sale)
      if (activeFilter === 'new' && !product.isNew) {
        return false;
      }
      if (activeFilter === 'bestseller' && !product.isBestseller) {
        return false;
      }
      if (activeFilter === 'sale' && product.discountPercent < 25 && product.price > 999) {
        return false;
      }

      // Mood filter
      if (activeMood) {
        const m = activeMood.toLowerCase();
        if (m === 'edgy' && !(product.category === 'Boots' || product.category === 'Bottoms')) return false;
        if (m === 'cute' && !(product.category === 'Dresses' || product.category === 'Tops')) return false;
        if (m === 'kpop' && !(product.category === 'Coords' || product.category === 'Boots')) return false;
        if (m === 'sexy' && !(product.category === 'Dresses' || product.category === 'Heels & Platforms')) return false;
        if (m === 'cozy' && !(product.category === 'Bottoms' || product.category === 'Flats & Mary Janes')) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const title = (product.title || product.name || '').toLowerCase();
        const desc = (product.description || '').toLowerCase();
        const cat = (product.category?.name || product.category || '').toLowerCase();
        const tags = (product.tags || []).join(' ').toLowerCase();

        if (!title.includes(query) && !desc.includes(query) && !cat.includes(query) && !tags.includes(query)) {
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
      if (sortBy === 'rating') {
        return Number(b.rating || 0) - Number(a.rating || 0);
      }
      if (sortBy === 'discount') {
        return Number(b.discountPercent || 0) - Number(a.discountPercent || 0);
      }
      // default 'featured'
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return 0;
    });
  }, [initialProducts, activeCategory, activeFilter, activeMood, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      {/* 1. Control Filter Bar */}
      <div className="flex flex-col gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        
        {/* Category Pills (Scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => {
              setActiveCategory('all');
              setActiveFilter('all');
              setActiveMood('');
            }}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-bold whitespace-nowrap rounded-full transition-all ${
              activeCategory === 'all' && activeFilter === 'all' && !activeMood
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
            }`}
          >
            All Products ({initialProducts.length})
          </button>

          {categories.map((cat) => {
            const handle = cat.handle || cat.slug || cat.id;
            const title = cat.title || cat.name;
            const isSelected = activeCategory === handle || activeCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(handle);
                  setActiveMood('');
                }}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-bold whitespace-nowrap rounded-full transition-all ${
                  isSelected
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
                }`}
              >
                {title}
              </button>
            );
          })}
        </div>

        {/* Quick Filter Badges + Search + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          
          {/* Quick Filter Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveFilter(activeFilter === 'new' ? 'all' : 'new')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${
                activeFilter === 'new'
                  ? 'bg-yellow-400 text-zinc-950'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>New Drops</span>
            </button>

            <button
              onClick={() => setActiveFilter(activeFilter === 'bestseller' ? 'all' : 'bestseller')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${
                activeFilter === 'bestseller'
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <Flame className="w-3 h-3 text-red-500 fill-red-500" />
              <span>Best Sellers</span>
            </button>

            <button
              onClick={() => setActiveFilter(activeFilter === 'sale' ? 'all' : 'sale')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${
                activeFilter === 'sale'
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <Tag className="w-3 h-3" />
              <span>Special Offers / B2G1</span>
            </button>
          </div>

          {/* Right side controls: Search input & Sort dropdown */}
          <div className="flex items-center gap-2">
            
            {/* Quick Filter Search */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white pl-8 pr-7 py-2 rounded-full focus:outline-none focus:border-zinc-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
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
                className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 pl-3 pr-8 py-2 rounded-full focus:outline-none focus:border-zinc-500 appearance-none font-bold cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="rating">Top Rated ★</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
              </select>
              <ArrowUpDown className="w-3 h-3 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

          </div>

        </div>

      </div>

      {/* 2. Active Filters indicator */}
      {(activeCategory !== 'all' || searchQuery || activeFilter !== 'all' || activeMood) && (
        <div className="flex items-center gap-2 flex-wrap text-xs text-zinc-500">
          <span className="font-semibold">Showing {filteredProducts.length} items with:</span>
          {activeCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded-full font-bold text-zinc-800 dark:text-zinc-200">
              Category: {activeCategory}
              <button onClick={() => setActiveCategory('all')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {activeMood && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded-full font-bold text-zinc-800 dark:text-zinc-200">
              Mood: {activeMood}
              <button onClick={() => setActiveMood('')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded-full font-bold text-zinc-800 dark:text-zinc-200">
              Query: &ldquo;{searchQuery}&rdquo;
              <button onClick={() => setSearchQuery('')}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
              setActiveFilter('all');
              setActiveMood('');
            }}
            className="text-red-500 hover:underline font-bold text-xs ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* 3. Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-sm">
          <p className="text-base font-bold text-zinc-700 dark:text-zinc-300 mb-1">No Matching Items Found</p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">
            Try resetting your filters or search terms to discover more styles.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
              setActiveFilter('all');
              setActiveMood('');
            }}
            className="px-6 py-2 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs uppercase font-bold rounded-xs"
          >
            View All Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
