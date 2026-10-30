import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { ArrowRight, CheckCircle, Shield, Award, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-20">
      
      {/* 1. Header & Brand Story */}
      <div className="max-w-3xl space-y-6">
        <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-mono">
          Our Story
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-light text-white tracking-tight leading-tight">
          Built for daily life. <br />
          <span className="italic font-normal">Made to last for years.</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
          <strong>AVRONCE</strong> (avronce.com) was founded in India on a simple promise: great clothing doesn&apos;t need to be disposable or overpriced. We build garments from genuine heavyweight cottons, Japanese selvedge denim, and authentic wools that feel softer, fit better, and last wash after wash.
        </p>
      </div>

      {/* 2. Visual Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 relative aspect-[16/10] bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80"
            alt="Avronce Studio and Workshop"
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl text-white">
            Honest Fabrics. Direct to You.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            We cut out the middlemen and mall distributors so you get world-class fabrics without the luxury markup. Our denim comes directly from Okayama, Japan; our tailoring wool is sourced from Biella, Italy; and our heavyweight combed cotton fleece is knit right here in Tirupur, India.
          </p>
          <div className="space-y-3 pt-2 text-xs text-zinc-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Breathable Long-Staple Indian Combed Cotton</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Eco-Friendly Recycled Paper Packaging</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero Cheap Polyester or Synthetic Fillers</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. The Three Principles */}
      <div className="border-t border-zinc-800 pt-16">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-mono">Our Values</span>
          <h3 className="font-serif text-2xl sm:text-3xl text-white">
            What We Stand For
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-sm space-y-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg text-white">01. Comfort & Fit First</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every drop shoulder, collar, and waistline is carefully proportioned so your clothes move with you naturally throughout your day.
            </p>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-sm space-y-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg text-white">02. Durable Craftsmanship</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Reinforced bar-tacking, double-needle seams, and premium brass hardware ensure your garment lasts through years of regular wear.
            </p>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-sm space-y-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg text-white">03. Transparent Pricing</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              By selling directly to you online at avronce.com, we pass the savings directly to you, offering international quality at honest Indian prices.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Action Banner */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-10 sm:p-16 rounded-sm text-center space-y-6">
        <Logo variant="combined" size="lg" className="mx-auto" />
        <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
          Experience Avronce for yourself.
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Shop our collection with free express shipping across India and easy 7-day doorstep returns & exchanges.
        </p>
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-zinc-950 font-semibold text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors shadow-lg rounded-sm"
          >
            <span>Shop The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
