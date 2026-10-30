import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { ArrowRight, CheckCircle, Shield, Award, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-24">
      
      {/* 1. Header & Brand Essence */}
      <div className="max-w-3xl space-y-6">
        <span className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-mono">
          The Origin
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-light text-white tracking-tight leading-tight">
          A declaration against <br />
          <span className="italic font-normal">disposable fashion.</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
          <strong>AVRONCE</strong> (avronce.com) was founded on a singular conviction: that clothing should be engineered as architectural objects meant to endure decades, not discarded after a season.
        </p>
      </div>

      {/* 2. Visual Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 relative aspect-[16/10] bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80"
            alt="Avronce Atelier Studio"
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-white">
            Material Sourcing Without Compromise
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            We bypass middlemen and source textiles directly from legacy mills across the globe. Our denim is shuttle-loom woven in Okayama, Japan; our tailoring wools are milled in Biella, Italy; and our heavyweight 480 GSM combed cotton fleece is knit in Tirupur, India.
          </p>
          <div className="space-y-3 pt-2 text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>GOTS Certified Organic Indian Cotton</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Biodegradable Packaging & Recycled Paper Tags</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero Synthetic Poly-blends or Microplastics</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. The Three Pillars of Avronce */}
      <div className="border-t border-zinc-800 pt-16">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-400 font-mono">Guiding Principles</span>
          <h3 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-white">
            The Avronce Tenets
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-sm space-y-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg tracking-wider uppercase text-white">01. Permanent Rotation</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We design in timeless architectural palettes—Obsidian Black, Bone Ecru, Charcoal Melange, and Raw Indigo. Garments designed to pair seamlessly across drops.
            </p>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-sm space-y-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg tracking-wider uppercase text-white">02. Disciplined Proportions</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every drop-shoulder angle, collar rib width, and trouser drape is calibrated in our atelier through dozens of wear-tests until the silhouette moves effortlessly.
            </p>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-sm space-y-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg tracking-wider uppercase text-white">03. Honest Atelier Pricing</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              By selling directly to you via our digital flagship on avronce.com, we provide luxury couture materials at half the price of traditional fashion houses.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Atelier CTA */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-10 sm:p-16 rounded-sm text-center space-y-6">
        <Logo variant="combined" size="lg" className="mx-auto" />
        <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
          Experience the tactile standard of Avronce.
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Explore our permanent collection with complimentary express delivery and 7-day atelier size exchanges.
        </p>
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-zinc-950 font-medium text-xs uppercase tracking-[0.25em] hover:bg-zinc-200 transition-colors shadow-lg"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
