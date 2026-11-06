import React from 'react';
import Image from 'next/image';

const INSTA_IMAGES = [
  { img: '/images/collections/cat_boots.webp', handle: '@riya_style' },
  { img: '/images/collections/cat_dressup15.webp', handle: '@ananya_fits' },
  { img: '/images/collections/cat_flats.jpg', handle: '@tanya_aesthetic' },
  { img: '/images/collections/cat_heels.webp', handle: '@sneha_drops' },
  { img: '/images/collections/mood_edgy.webp', handle: '@kavya.vibe' },
  { img: '/images/collections/mood_kpop.webp', handle: '@natasha_y2k' },
];

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function InstaFeed() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
          <InstagramIcon className="w-3.5 h-3.5" />
          <span>#AVRONCEAtelier</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
          As Seen On Instagram ✨
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Tag @avronce.official on your fit-check reels and photos to get featured on our feed!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {INSTA_IMAGES.map((item, i) => (
          <div
            key={i}
            className="group relative aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-sm"
          >
            <Image
              src={item.img}
              alt="AVRONCE Community Fit"
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white p-2 text-center">
              <InstagramIcon className="w-5 h-5 text-pink-400" />
              <span className="text-[11px] font-bold font-mono truncate max-w-full">
                {item.handle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
