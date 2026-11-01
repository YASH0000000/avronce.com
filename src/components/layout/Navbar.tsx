'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, Heart, Package, Sparkles, ChevronRight, Zap } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { useCart } from '@/lib/cart-context';

export function Navbar() {
  const { openCart, itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  const announcements = [
    '⚡ FLASH SALE: BUY 2 GET 1 FREE • USE CODE: B2G1 ⚡',
    '✨ FREE SHIPPING ON ALL PREPAID ORDERS ABOVE ₹999 ✨',
    '🔥 FLAT 10% OFF ON YOUR FIRST ORDER • CODE: NEW10 🔥',
    '📦 EASY 7-DAY SIZE EXCHANGE & COD AVAILABLE ACROSS INDIA 📦',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const navLinks = [
    { label: 'New In', href: '/shop?filter=new', badge: 'HOT' },
    { label: 'Best Sellers', href: '/shop?filter=bestseller' },
    { label: 'Boots', href: '/category/boots' },
    { label: 'Heels & Flats', href: '/category/flats' },
    { label: 'Dresses', href: '/category/dressup15' },
    { label: 'Tops & Coords', href: '/category/tops15' },
    { label: 'Shop By Mood', href: '/#mood-section' },
    { label: 'Sale B2G1', href: '/shop?filter=sale', isSale: true },
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
      {/* 1. Animated Announcement Bar */}
      <div className="bg-zinc-950 text-white text-[11px] sm:text-xs font-semibold py-2 px-4 border-b border-zinc-800 flex items-center justify-center overflow-hidden transition-all">
        <div className="animate-fade-in flex items-center gap-2 tracking-wider uppercase font-mono">
          <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 shrink-0" />
          <span>{announcements[announcementIndex]}</span>
        </div>
      </div>

      {/* 2. Main Sticky Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* LEFT: Logo */}
          <div className="flex items-center gap-8 shrink-0">
            <Logo variant="combined" size="md" />
          </div>

          {/* CENTER: Desktop Menu Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-bold uppercase tracking-[0.14em] transition-all relative py-1 flex items-center gap-1.5 ${
                  link.isSale
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.2 text-[9px] font-black bg-yellow-400 text-zinc-950 rounded-xs tracking-tighter">
                    {link.badge}
                  </span>
                )}
                {link.isSale && (
                  <span className="px-1.5 py-0.2 text-[9px] font-black bg-red-500 text-white rounded-xs tracking-tighter">
                    OFFER
                  </span>
                )}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-zinc-950 dark:bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Track Order */}
            <Link
              href="/track"
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white px-2 py-1"
            >
              <Package className="w-4 h-4" />
              <span className="hidden xl:inline">Track Order</span>
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={openCart}
              className="relative p-2 text-zinc-900 dark:text-white transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center gap-1.5"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 transition-transform hover:scale-110" />
              <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider">
                Cart
              </span>
              {itemCount > 0 && (
                <span className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-800 dark:text-zinc-200 lg:hidden rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-900"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>

        {/* Search Drawer Modal */}
        {searchOpen && (
          <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-5 h-5 text-zinc-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search chunky boots, party dresses, mary janes, corset tops, coords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white pl-10 pr-24 py-3 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 dark:focus:border-white rounded-sm font-sans"
                />
                <div className="absolute right-2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs uppercase font-bold tracking-wider hover:opacity-90 rounded-sm"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white p-6 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              
              {/* Drawer Top */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <Logo variant="combined" size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between text-sm uppercase tracking-wider font-bold py-3 border-b border-zinc-100 dark:border-zinc-900 ${
                      link.isSale ? 'text-red-500' : 'text-zinc-800 dark:text-zinc-200'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </Link>
                ))}

                <Link
                  href="/track"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-sm uppercase tracking-wider font-bold text-zinc-800 dark:text-zinc-200 py-3 border-b border-zinc-100 dark:border-zinc-900"
                >
                  <span>Track Your Order</span>
                  <Package className="w-4 h-4 text-zinc-400" />
                </Link>
              </div>

            </div>

            {/* Drawer Bottom Perks */}
            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 space-y-2">
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                ⚡ Free Shipping above ₹999
              </p>
              <p>
                7-day easy exchange & Cash on Delivery across India.
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
