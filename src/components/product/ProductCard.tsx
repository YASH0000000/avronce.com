'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Plus, Check } from 'lucide-react';
import { Product } from '@/types/database';
import { useCart } from '@/lib/cart-context';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const primaryImage = product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80';
  const secondaryImage = product.images?.[1]?.image_url || primaryImage;

  const currentVariant = product.variants?.[selectedVariantIndex] || product.variants?.[0];

  const handleQuickAdd = (e: React.MouseEvent, variant: typeof currentVariant) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant) return;

    addItem({
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      image: primaryImage,
      size: variant.size,
      colorName: variant.color_name,
      colorHex: variant.color_hex,
      quantity: 1,
      stock: variant.stock_quantity,
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  // Group unique colors for swatches
  const uniqueColors = Array.from(
    new Map(product.variants?.map((v) => [v.color_name, v])).values()
  );

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900 border border-zinc-800/80 rounded-sm">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.is_new && (
            <span className="bg-white text-zinc-950 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 shadow-sm">
              New
            </span>
          )}
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="bg-zinc-950/80 backdrop-blur-md text-white text-[10px] uppercase font-medium tracking-wider px-2 py-0.5 border border-zinc-700/60">
              Seasonal Offer
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 p-2 bg-zinc-950/60 hover:bg-zinc-950/90 text-white rounded-full backdrop-blur-md border border-zinc-700/40 transition-colors z-10"
          aria-label="Save to Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-zinc-300 hover:text-white'}`}
          />
        </button>

        {/* Desktop Quick Size Selector Bar (revealed on hover) */}
        <div className="absolute inset-x-3 bottom-3 hidden lg:flex flex-col gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
          <div className="bg-zinc-950/90 backdrop-blur-md border border-zinc-700/80 p-1.5 flex items-center justify-between gap-1 shadow-xl">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 pl-1 font-mono">Quick Size:</span>
            <div className="flex items-center gap-1">
              {product.variants?.map((v) => (
                <button
                  key={v.id}
                  disabled={v.stock_quantity <= 0}
                  onClick={(e) => handleQuickAdd(e, v)}
                  className={`text-[11px] font-mono font-medium px-2 py-1 rounded-sm transition-all ${
                    v.stock_quantity <= 0
                      ? 'text-zinc-600 line-through cursor-not-allowed'
                      : 'text-zinc-200 hover:text-zinc-950 hover:bg-white active:scale-95'
                  }`}
                  title={`${v.size} - ${v.color_name} (${v.stock_quantity > 0 ? `${v.stock_quantity} left` : 'Sold out'})`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 2. Product Information */}
      <div className="pt-3 pb-1 flex flex-col">
        {/* Category & Tagline */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400 uppercase tracking-widest">
          <span>{product.category?.name || 'Collection'}</span>
          {product.gender && <span>{product.gender}</span>}
        </div>

        {/* Title */}
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-medium text-white hover:underline mt-1 line-clamp-1 transition-colors"
        >
          {product.name}
        </Link>

        {/* Color swatches */}
        {uniqueColors.length > 1 && (
          <div className="flex items-center gap-1.5 mt-1.5">
            {uniqueColors.map((v) => (
              <span
                key={v.id}
                title={v.color_name}
                className="w-2.5 h-2.5 rounded-full border border-zinc-700"
                style={{ backgroundColor: v.color_hex }}
              />
            ))}
            <span className="text-[10px] text-zinc-500 ml-1">
              {uniqueColors.length} shades
            </span>
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-sm font-semibold text-white tracking-tight">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-xs text-zinc-500 line-through">
              ₹{Number(product.compare_at_price).toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Mobile Quick Add Button */}
        <button
          onClick={(e) => handleQuickAdd(e, currentVariant)}
          className="mt-3 lg:hidden w-full py-2 bg-zinc-900 border border-zinc-800 text-xs uppercase tracking-wider font-medium text-zinc-200 flex items-center justify-center gap-1.5 active:bg-zinc-800 transition-colors"
        >
          {addedAnimation ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Added to Bag</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Bag ({currentVariant?.size || 'M'})</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
}
