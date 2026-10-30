'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, Compass, Package, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { useCart } from '@/lib/cart-context';

export function Navbar() {
  const { openCart, itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { label: 'Shop All', href: '/shop' },
    { label: 'Outerwear', href: '/category/outerwear' },
    { label: 'Essentials', href: '/category/essentials' },
    { label: 'Tailoring', href: '/category/tailoring' },
    { label: 'Knitwear', href: '/category/knitwear' },
    { label: 'Lookbook', href: '/lookbook' },
    { label: 'About', href: '/about' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* 1. Top Announcement Bar */}
      <div className="bg-zinc-900 border-b border-zinc-800 text-zinc-300 py-2 px-4 text-center text-[11px] uppercase tracking-[0.25em] font-medium flex items-center justify-center gap-3">
        <span>Complimentary Domestic Shipping On Orders Over ₹2,999</span>
        <span className="hidden md:inline-block w-1 h-1 bg-zinc-600 rounded-full" />
        <span className="hidden md:inline-block text-zinc-400">Use Code <strong className="text-white">AVRONCE10</strong> for 10% Off</span>
      </div>

      {/* 2. Main Sticky Header */}
      <header className="sticky top-0 z-40 w-full bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-zinc-400 hover:text-white transition-colors ml-1"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Left Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.slice(0, 5).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-[0.2em] font-medium text-zinc-400 hover:text-white transition-colors duration-200 relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Center Brand Logo */}
          <div className="flex items-center justify-center">
            <Logo variant="combined" size="md" />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Desktop Editorial links */}
            <div className="hidden lg:flex items-center gap-6">
              <Link
                href="/lookbook"
                className="text-xs uppercase tracking-[0.2em] font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Lookbook
              </Link>
              <Link
                href="/track"
                className="text-xs uppercase tracking-[0.2em] font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Track</span>
              </Link>
              
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
                aria-label="Search Catalog"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Shopping Bag Trigger */}
            <button
              onClick={openCart}
              className="relative p-2 text-zinc-200 hover:text-white transition-colors group"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-105" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-zinc-950 text-[10px] font-bold font-mono w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-950 animate-in zoom-in-75 duration-200">
                  {itemCount}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* Search Modal Overlay */}
        {searchOpen && (
          <div className="border-t border-zinc-800 bg-zinc-900/95 px-4 py-4 animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-5 h-5 text-zinc-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search denim, jackets, coats, knitwear..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-sm text-white pl-10 pr-24 py-3 rounded-none placeholder:text-zinc-500 focus:outline-none focus:border-white font-sans"
                />
                <div className="absolute right-2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-white text-zinc-950 text-xs uppercase font-medium tracking-wider hover:bg-zinc-200 transition-colors"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-1.5 text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* 3. Mobile Slide-Over Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-zinc-950 text-white p-6 border-r border-zinc-800 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <Logo variant="combined" size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Links */}
              <div className="space-y-4 pt-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base uppercase tracking-[0.25em] font-medium text-zinc-300 hover:text-white py-1.5 border-b border-zinc-900"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/track"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base uppercase tracking-[0.25em] font-medium text-zinc-300 hover:text-white py-1.5 flex items-center gap-2 text-zinc-400"
                >
                  <Package className="w-4 h-4" />
                  <span>Track Order</span>
                </Link>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-6 text-xs text-zinc-500 space-y-2">
              <p className="uppercase tracking-widest text-zinc-400">Atelier Avronce</p>
              <p>Timeless design, slow fashion & unyielding craftsmanship.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
