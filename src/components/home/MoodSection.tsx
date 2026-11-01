'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { LittleboxMood, LittleboxProduct } from '@/lib/store';
import { ProductCard } from '@/components/product/ProductCard';

interface MoodSectionProps {
  moods: LittleboxMood[];
  allProducts: LittleboxProduct[];
}

export function MoodSection({ moods, allProducts }: MoodSectionProps) {
  const [activeMoodId, setActiveMoodId] = useState<string>(moods[0]?.id || 'edgy');

  const activeMood = moods.find((m) => m.id === activeMoodId) || moods[0];

  // Filter products for the active mood
  const moodProducts = allProducts.filter((p) => {
    if (activeMoodId === 'edgy') {
      return p.category === 'Boots' || p.category === 'Bottoms';
    } else if (activeMoodId === 'cute') {
      return p.category === 'Dresses' || p.category === 'Tops';
    } else if (activeMoodId === 'kpop') {
      return p.category === 'Coords' || p.category === 'Boots' || p.category === 'Tops';
    } else if (activeMoodId === 'sexy') {
      return p.category === 'Dresses' || p.category === 'Heels & Platforms';
    } else if (activeMoodId === 'cozy') {
      return p.category === 'Bottoms' || p.category === 'Flats & Mary Janes';
    }
    return true;
  }).slice(0, 4);

  return (
    <section id="mood-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs uppercase font-mono font-bold tracking-widest text-zinc-500 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            <span>LITTLEBOX EXCLUSIVE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
            Shop By Mood 💅
          </h2>
        </div>

        {/* Mood Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {moods.map((mood) => {
            const isActive = mood.id === activeMoodId;
            return (
              <button
                key={mood.id}
                onClick={() => setActiveMoodId(mood.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all shadow-xs ${
                  isActive
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 scale-105'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {mood.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mood Showcase: Mood Hero Feature Card + 3 Matching Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Mood Card */}
        <div className="lg:col-span-4 relative rounded-sm overflow-hidden bg-zinc-950 text-white min-h-[380px] lg:min-h-auto flex flex-col justify-end p-6 sm:p-8 border border-zinc-800 shadow-xl group">
          {activeMood.image && (
            <Image
              src={activeMood.image}
              alt={activeMood.name}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover object-center opacity-70 group-hover:scale-105 transition-transform duration-700"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
          
          <div className="relative z-10 space-y-3">
            <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-mono uppercase tracking-widest text-white">
              VIBE CURATION
            </span>
            <h3 className="text-3xl font-black uppercase tracking-tight text-white">
              {activeMood.name}
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Curated fashion pieces matching your current vibe. Bold cuts, trending aesthetics, and statement details.
            </p>
            <div className="pt-2">
              <Link
                href={`/shop?mood=${activeMood.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xs hover:bg-zinc-200 transition-colors shadow-md"
              >
                <span>Shop This Vibe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Product Grid */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {moodProducts.slice(0, 3).map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx === 0} />
          ))}
        </div>

      </div>
    </section>
  );
}
