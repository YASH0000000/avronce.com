'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: any[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Normalize image items to string URLs
  const imageUrls: string[] = images
    .map((img) => (typeof img === 'string' ? img : img?.image_url || img?.src || null))
    .filter(Boolean);

  const fallback = '/images/collections/cat_boots.webp';
  const displayImages = imageUrls.length > 0 ? imageUrls : [fallback];
  const currentImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-3 sm:gap-4">
      {/* Thumbnails Filmstrip */}
      {displayImages.length > 1 && (
        <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto scrollbar-none shrink-0 py-1">
          {displayImages.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 h-20 lg:w-20 lg:h-24 bg-zinc-100 dark:bg-zinc-900 border rounded-xs overflow-hidden shrink-0 transition-all ${
                selectedIndex === idx
                  ? 'border-zinc-950 dark:border-white ring-2 ring-zinc-950 dark:ring-white scale-102'
                  : 'border-zinc-200 dark:border-zinc-800 opacity-60 hover:opacity-100'
              }`}
              aria-label={`View photo ${idx + 1}`}
            >
              <Image
                src={url}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Focus Image */}
      <div className="relative aspect-[3/4] w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm overflow-hidden group">
        <Image
          src={currentImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute bottom-3 right-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-bold text-white rounded-xs pointer-events-none">
          {selectedIndex + 1} / {displayImages.length}
        </div>
      </div>
    </div>
  );
}
