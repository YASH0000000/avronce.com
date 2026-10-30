'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, Package, ShieldCheck, PhoneCall } from 'lucide-react';
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
    { label: 'Daily Essentials', href: '/category/essentials' },
    { label: 'Tailored Trousers', href: '/category/tailoring' },
    { label: 'Knitwear', href: '/category/knitwear' },
    { label: 'Shirts', href: '/category/shirts' },
    { label: 'Lookbook', href: '/lookbook' },
    { label: 'Our Story', href: '/about' },
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
      <div className="bg-zinc-900 border-b border-zinc-800 text-zinc-300 py-2.5 px-4 text-center text-[11px] sm:text-xs tracking-[0.15em] font-medium flex items-center justify-center gap-2 sm:gap-4">
        <span>🚚 Free Express Delivery Across India on Orders Above ₹2,999</span>
        <span className="hidden sm:inline-block w-1 h-1 bg-zinc-600 rounded-full" />
        <span className="hidden sm:inline-block text-zinc-400">Use Code <strong className="text-white font-semibold">AVRONCE10</strong> for 10% Off</span>
      </div>

      {/* 2. Main Header: LOGO FIRST */}
      <header className="sticky top-0 z-40 w-full bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          
          {/* LEFT: LOGO FIRST */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group focus:outline-none" aria-label="Avronce Home">
              <Logo variant="combined" size="md" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs tracking-[0.12em] uppercase font-medium text-zinc-400 hover:text-white transition-colors duration-200 relative group py-1"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-white transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT: Search, Track Order, Cart, Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-5">
            
            {/* Desktop Quick Links */}
            <Link
              href="/track"
              className="hidden md:flex items-center gap-1.5 text-xs uppercase tracking-wider text-zinc-400 hover:text-white transition-colors px-2 py-1"
            >
              <Package className="w-4 h-4 text-zinc-400" />
              <span>Track Order</span>
            </Link>

            {/* Search Icon Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-zinc-300 hover:text-white transition-colors rounded-sm hover:bg-zinc-900"
              aria-label="Search Products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-zinc-100 hover:text-white transition-colors rounded-sm hover:bg-zinc-900 group flex items-center gap-2"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-105" />
              <span className="hidden sm:inline-block text-xs uppercase tracking-wider font-medium text-zinc-300">
                Cart
              </span>
              {itemCount > 0 && (
                <span className="bg-white text-zinc-950 text-[10px] font-bold font-mono w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-950 animate-in zoom-in-75 duration-200">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-white transition-colors lg:hidden rounded-sm hover:bg-zinc-900"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>

        {/* Search Modal Dropdown */}
        {searchOpen && (
          <div className="border-t border-zinc-800 bg-zinc-900/98 px-4 py-4 animate-in slide-in-from-top-2 duration-200 shadow-xl">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-5 h-5 text-zinc-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search shirts, denim jackets, trousers, hoodies, t-shirts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 text-sm text-white pl-10 pr-24 py-3 placeholder:text-zinc-500 focus:outline-none focus:border-white font-sans"
                />
                <div className="absolute right-2 flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-white text-zinc-950 text-xs uppercase font-semibold tracking-wider hover:bg-zinc-200 transition-colors"
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-zinc-950 text-white p-6 border-r border-zinc-800 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              
              {/* Mobile Drawer Header: LOGO FIRST */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <Logo variant="combined" size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-zinc-400 hover:text-white"
                  aria-label="Close Menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Links */}
              <div className="space-y-1 pt-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm uppercase tracking-wider font-medium text-zinc-300 hover:text-white py-3 border-b border-zinc-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                
                <Link
                  href="/track"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm uppercase tracking-wider font-medium text-zinc-300 hover:text-white py-3 border-b border-zinc-900 flex items-center gap-2"
                >
                  <Package className="w-4 h-4 text-zinc-400" />
                  <span>Track Your Order</span>
                </Link>
              </div>

            </div>

            {/* Mobile Footer Reassurances */}
            <div className="border-t border-zinc-800 pt-6 text-xs text-zinc-400 space-y-3">
              <div className="flex items-center gap-2 text-zinc-300">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>100% Genuine Fabrics & Easy Returns</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Avronce India. Contemporary everyday luxury crafted for durability and comfort.
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
