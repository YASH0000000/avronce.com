import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Lookbook & Style Inspirations | LITTLEBOX INDIA',
  description: 'Explore viral fit checks, outfit pairings, and style guides featuring Littlebox chunky boots, party dresses, and Y2K streetwear.',
};

const lookbookItems = [
  {
    id: 1,
    title: 'Look 01: Motorcycle Edge',
    garments: 'Side Zipper Chunky Lug Sole Knee Boots & Leather Miniskirt',
    image: '/images/collections/cat_boots.webp',
    link: '/category/boots',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 2,
    title: 'Look 02: Romantic Party Chic',
    garments: 'One Shoulder Draped Mesh Mini Dress in Deep Merlot',
    image: '/images/collections/cat_dressup15.webp',
    link: '/category/dressup15',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 3,
    title: 'Look 03: Balletcore Aesthetic',
    garments: 'Square Toe Mary Jane Ballet Flats with Ribbon Ties',
    image: '/images/collections/cat_flats.jpg',
    link: '/category/flats',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 4,
    title: 'Look 04: Y2K Campus Fit',
    garments: 'Matching Sets with Halter Lace Trim Ruched Top',
    image: '/images/collections/cat_matching-sets.webp',
    link: '/category/matching-sets',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 5,
    title: 'Look 05: Night Out Glam',
    garments: 'High Heel Platform Boots & Backless Bodycon Fit',
    image: '/images/collections/cat_heels.webp',
    link: '/category/heels',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 6,
    title: 'Look 06: Streetwise Utility',
    garments: 'Baggy Relaxed Cargo Pants with Chunky Platform Oxfords',
    image: '/images/collections/cat_baggy-pants.webp',
    link: '/category/baggy-pants',
    aspect: 'aspect-[4/5]',
  },
];

export default function LookbookPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-2xl space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400 text-zinc-950 font-black text-xs uppercase tracking-widest rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EDITORIAL LOOKBOOK</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-zinc-950 dark:text-white tracking-tight">
          Style Inspirations & Fits ✨
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          See how our community styles chunky boots with romantic dresses, baggy pants with corset tops, and flatforms for everyday fits.
        </p>
      </div>

      {/* Editorial Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {lookbookItems.map((item) => (
          <div key={item.id} className="group flex flex-col space-y-3">
            <div className={`relative ${item.aspect} w-full bg-zinc-950 rounded-sm overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800`}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                <Link
                  href={item.link}
                  className="w-full py-2.5 bg-white text-zinc-950 text-xs uppercase tracking-wider font-bold text-center flex items-center justify-center gap-1.5 shadow-lg rounded-xs hover:bg-zinc-200 transition-colors"
                >
                  <span>Shop This Silhouette</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-zinc-950 dark:text-white">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                {item.garments}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
