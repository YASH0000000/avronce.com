'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Plus, Check, Star } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { LittleboxProduct } from '@/lib/store';

interface ProductCardProps {
  product: LittleboxProduct | any;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Normalize images
  const primaryImage =
    product.images?.[0]?.image_url ||
    (typeof product.images?.[0] === 'string' ? product.images[0] : null) ||
    '/images/collections/cat_boots.webp';

  const secondaryImage =
    product.images?.[1]?.image_url ||
    (typeof product.images?.[1] === 'string' ? product.images[1] : null) ||
    primaryImage;

  // Normalize pricing
  const price = Number(product.price || 999);
  const originalPrice = Number(product.originalPrice || product.compare_at_price || Math.round(price * 1.5));
  const discountPercent =
    product.discountPercent || (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

  // Normalize title and slug
  const title = product.title || product.name || 'Littlebox Item';
  const slug = product.slug || product.handle || product.id;
  const rating = product.rating || '4.8';
  const reviewsCount = product.reviewsCount || 128;

  // Normalize sizes
  const sizes =
    product.options?.find((o: any) => o.name.toLowerCase().includes('size'))?.values ||
    product.variants?.map((v: any) => v.size || v.title).filter(Boolean) ||
    ['XS', 'S', 'M', 'L', 'XL'];

  const handleQuickAdd = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();

    const variant = product.variants?.find((v: any) => (v.size || v.title || v.option1) === size) || product.variants?.[0];

    addItem({
      productId: String(product.id),
      variantId: variant ? String(variant.id) : `v-${size}`,
      name: title,
      slug: slug,
      price: price,
      originalPrice: originalPrice,
      image: primaryImage,
      size: size,
      colorName: variant?.color_name || 'Standard',
      quantity: 1,
      stock: 50,
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div
      className="group relative flex flex-col transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 rounded-sm border border-zinc-200/80 dark:border-zinc-800/80">
        <Link href={`/products/${slug}`} className="block w-full h-full">
          <Image
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-all duration-500 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-red-600 text-white text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-xs shadow-md">
              {discountPercent}% OFF
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-zinc-950 text-white text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-xs shadow-sm">
              BESTSELLER
            </span>
          )}
          {product.isNew && (
            <span className="bg-yellow-400 text-zinc-950 text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-xs shadow-sm">
              NEW DROP
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-2.5 right-2.5 p-2 bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-800 rounded-full shadow-md transition-transform hover:scale-110 z-10 backdrop-blur-xs"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-zinc-700 dark:text-zinc-300'
            }`}
          />
        </button>

        {/* Desktop Quick Size Selector (Hovers up) */}
        <div className="absolute inset-x-2.5 bottom-2.5 hidden lg:flex flex-col gap-1 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
          <div className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 p-2 rounded-xs shadow-xl flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-mono">
              <span>Quick Add Size:</span>
              {addedAnimation && (
                <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3" /> Added!
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {sizes.slice(0, 6).map((size: string) => (
                <button
                  key={size}
                  onClick={(e) => handleQuickAdd(e, size)}
                  className="flex-1 min-w-[28px] py-1 text-[11px] font-bold border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-950 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 text-zinc-800 dark:text-zinc-200 rounded-xs transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Product Details */}
      <div className="pt-2.5 pb-1 flex flex-col flex-1">
        {/* Rating and category */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="uppercase tracking-wider font-medium truncate max-w-[140px]">
            {product.category || product.productType || 'Fashion'}
          </span>
          <div className="flex items-center gap-1 text-zinc-800 dark:text-zinc-200 font-bold text-[10px]">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>{rating}</span>
            <span className="text-zinc-400 font-normal">({reviewsCount})</span>
          </div>
        </div>

        {/* Title */}
        <Link
          href={`/products/${slug}`}
          className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 mt-1 line-clamp-1 transition-colors leading-snug"
        >
          {title}
        </Link>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-sm sm:text-base font-black text-zinc-950 dark:text-white tracking-tight">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {originalPrice > price && (
            <span className="text-xs text-zinc-400 dark:text-zinc-500 line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[11px] font-bold text-red-600 dark:text-red-400">
              ({discountPercent}% OFF)
            </span>
          )}
        </div>

        {/* Mobile Quick Add Button */}
        <button
          onClick={(e) => handleQuickAdd(e, sizes[0] || 'M')}
          className="mt-2.5 lg:hidden w-full py-1.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs uppercase font-bold tracking-wider rounded-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
        >
          {addedAnimation ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
