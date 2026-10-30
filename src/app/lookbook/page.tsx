import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const lookbookItems = [
  {
    id: 1,
    title: 'Look 01: Architectural Oversize',
    garments: 'Raw Selvedge Denim Jacket & Pleated Wool Trousers',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    link: '/products/avronce-raw-selvedge-denim-jacket',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 2,
    title: 'Look 02: Monolithic Wool',
    garments: 'Double-Breasted Wool Atelier Coat',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80',
    link: '/products/double-breasted-wool-atelier-coat',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 3,
    title: 'Look 03: Tactile Contrast',
    garments: '480 GSM French Terry Hoodie & Washed Coal Tee',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80',
    link: '/products/heavyweight-french-terry-hoodie',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 4,
    title: 'Look 04: Equatorial Ease',
    garments: 'Camp Collar Silk-Linen Resort Shirt in Sand',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80',
    link: '/products/camp-collar-silk-linen-resort-shirt',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 5,
    title: 'Look 05: Thermal Equilibrium',
    garments: '19.5 Micron Merino Wool Crewneck in Forest Olive',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80',
    link: '/products/fine-gauge-merino-wool-crewneck',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 6,
    title: 'Look 06: Heavyweight Texture',
    garments: 'Brushed Waffle Knit Quarter-Zip in Oat',
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80',
    link: '/products/brushed-waffle-knit-quarter-zip',
    aspect: 'aspect-[4/5]',
  },
];

export default function LookbookPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Header */}
      <div className="max-w-2xl space-y-4 border-b border-zinc-800 pb-8">
        <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-mono">
          Style Inspiration
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-white tracking-tight">
          Stylebook & Outfit Ideas
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
          Explore how our jackets, tees, trousers, and shirts come together. Clean silhouettes and effortless everyday outfits designed for modern India.
        </p>
      </div>

      {/* Editorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lookbookItems.map((item) => (
          <div key={item.id} className="group flex flex-col space-y-3">
            <div className={`relative ${item.aspect} w-full bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden`}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <Link
                  href={item.link}
                  className="w-full py-2.5 bg-white text-zinc-950 text-xs uppercase tracking-wider font-semibold text-center flex items-center justify-center gap-1.5 shadow-lg rounded-sm hover:bg-zinc-200 transition-colors"
                >
                  <span>Shop This Look</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-base text-white tracking-wider uppercase">
                {item.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {item.garments}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
