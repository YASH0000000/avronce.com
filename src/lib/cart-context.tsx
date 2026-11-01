'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/types/database';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  taxAmount: number;
  totalAmount: number;
  freeShippingThreshold: number;
  freeShippingProgress: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 99;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('littlebox_cart') || localStorage.getItem('avronce_cart');
      if (stored) {
        setItems(JSON.parse(stored));
      }
      const storedCoupon = localStorage.getItem('littlebox_coupon') || localStorage.getItem('avronce_coupon');
      if (storedCoupon) {
        const { code, percent } = JSON.parse(storedCoupon);
        setCouponCode(code);
        setDiscountPercent(percent);
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('littlebox_cart', JSON.stringify(items));
      if (couponCode) {
        localStorage.setItem('littlebox_coupon', JSON.stringify({ code: couponCode, percent: discountPercent }));
      } else {
        localStorage.removeItem('littlebox_coupon');
      }
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [items, couponCode, discountPercent, isHydrated]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = (item: Omit<CartItem, 'id'>) => {
    const id = `${item.productId}-${item.variantId}-${item.size}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        const newQty = Math.min(existing.quantity + item.quantity, item.stock || 99);
        return prev.map((i) => (i.id === id ? { ...i, quantity: newQty } : i));
      }
      return [...prev, { ...item, id }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: Math.min(nextQty, i.stock || 99) } : null;
          }
          return i;
        })
        .filter((i): i is CartItem => i !== null)
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setDiscountPercent(0);
  };

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'B2G1' || clean === 'BUY2GET1') {
      setCouponCode('B2G1');
      setDiscountPercent(33);
      return true;
    } else if (clean === 'NEW10' || clean === 'WELCOME10') {
      setCouponCode('NEW10');
      setDiscountPercent(10);
      return true;
    } else if (clean === 'WELCOME200' || clean === 'LITTLEBOX20') {
      setCouponCode('WELCOME200');
      setDiscountPercent(20);
      return true;
    } else if (clean === 'PREPAID10') {
      setCouponCode('PREPAID10');
      setDiscountPercent(10);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const shippingFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * 0.05); // 5% GST on footwear/apparel
  const totalAmount = taxableAmount + shippingFee;
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        shippingFee,
        discountAmount,
        couponCode,
        applyCoupon,
        removeCoupon,
        taxAmount,
        totalAmount,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingProgress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
