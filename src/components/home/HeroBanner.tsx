'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Tag, Flame } from 'lucide-react';

interface Slide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  offer: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  accent: string;
}

const SLIDES: Slide[] = [
  {
    id: 'boots',
    tag: 'SIGNATURE DROP • 2026',
    title: 'THE CHUNKY BOOTS EDIT',
    subtitle: 'Motorcycle platforms, knee-high boots, and lug-sole oxfords made to turn heads.',
    offer: '⚡ BUY 2 GET 1 FREE WITH CODE: B2G1',
    image: '/images/collections/cat_boots.webp',
    ctaText: 'SHOP BOOTS & HEELS',
    ctaLink: '/category/boots',
    accent: 'bg-zinc-950 text-white',
  },
  {
    id: 'dresses',
    tag: 'NIGHT OUT & PARTYWEAR',
    title: 'STATEMENT DRESSES & SETS',
    subtitle: 'From cowl neck slip dresses to bodycons and romantic ruffle trims.',
    offer: '✨ UNDER ₹999 SPECIAL PICKS',
    image: '/images/collections/cat_dressup15.webp',
    ctaText: 'EXPLORE DRESSES',
    ctaLink: '/category/dressup15',
    accent: 'bg-red-600 text-white',
  },
  {
    id: 'street',
    tag: 'GEN-Z STREETWEAR & COORDS',
    title: 'Y2K TOPS & BAGGY CARGOS',
    subtitle: 'Casual statement pieces designed for everyday trendsetters & college fits.',
    offer: '🔥 FLAT 10% OFF ON PREPAID: PREPAID10',
    image: '/images/collections/cat_matching-sets.webp',
    ctaText: 'SHOP NEW ARRIVALS',
    ctaLink: '/shop?filter=new',
    accent: 'bg-yellow-400 text-zinc-950',
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <div className="relative w-full overflow-hidden bg-zinc-950 text-white">
      {/* Slide Background Image */}
      <div className="relative min-h-[75vh] sm:min-h-[82vh] lg:min-h-[88vh] flex items-center">
        {SLIDES.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-center scale-100"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/60 to-transparent lg:w-3/5" />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl space-y-5 sm:space-y-6">
            
            {/* Pill Offer */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold uppercase tracking-wider text-white">
              <Flame className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span>{slide.tag}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-sans text-3xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.05]">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-zinc-300 max-w-lg leading-relaxed font-normal">
              {slide.subtitle}
            </p>

            {/* Offer highlight */}
            <div className="inline-block px-3.5 py-1.5 bg-yellow-400 text-zinc-950 font-black text-xs sm:text-sm tracking-wide uppercase rounded-xs shadow-md">
              {slide.offer}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
              <Link
                href={slide.ctaLink}
                className="px-8 py-4 bg-white text-zinc-950 hover:bg-zinc-200 text-xs sm:text-sm uppercase tracking-[0.18em] font-black transition-all text-center rounded-xs flex items-center justify-center gap-2 shadow-xl hover:scale-102"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/shop"
                className="px-8 py-4 bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700 text-xs sm:text-sm uppercase tracking-[0.18em] font-bold transition-all text-center backdrop-blur-md rounded-xs"
              >
                VIEW ALL DROPS
              </Link>
            </div>

          </div>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-2">
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
            className="p-3 bg-zinc-900/80 hover:bg-white hover:text-zinc-950 text-white rounded-full border border-zinc-700 transition-colors backdrop-blur-md"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
            className="p-3 bg-zinc-900/80 hover:bg-white hover:text-zinc-950 text-white rounded-full border border-zinc-700 transition-colors backdrop-blur-md"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 transition-all rounded-full ${
                i === current ? 'w-8 bg-white' : 'w-2 bg-white/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
