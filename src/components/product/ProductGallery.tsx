'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/types/database';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fallbackImage = 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80';
  const displayImages = images.length > 0 ? images : [{ id: '1', product_id: '1', image_url: fallbackImage, alt_text: productName, display_order: 1, is_primary: true }];
  const currentImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      
      {/* Thumbnails Filmstrip */}
      {displayImages.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar shrink-0">
          {displayImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 h-20 lg:w-20 lg:h-24 bg-zinc-900 border rounded-sm overflow-hidden shrink-0 transition-all ${
                selectedIndex === idx
                  ? 'border-white ring-1 ring-white'
                  : 'border-zinc-800 opacity-60 hover:opacity-100'
              }`}
              aria-label={`View photo ${idx + 1}`}
            >
              <Image
                src={img.image_url}
                alt={img.alt_text || `${productName} preview ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Focus Image */}
      <div className="relative aspect-[3/4] w-full bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden group">
        <Image
          src={currentImage.image_url}
          alt={currentImage.alt_text || productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute bottom-3 right-3 bg-zinc-950/70 backdrop-blur-md px-2.5 py-1 text-[10px] uppercase font-mono tracking-wider text-zinc-300 border border-zinc-800 pointer-events-none">
          {selectedIndex + 1} / {displayImages.length}
        </div>
      </div>

    </div>
  );
}
