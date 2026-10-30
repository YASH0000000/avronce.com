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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 2999;
const STANDARD_SHIPPING_FEE = 250;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('avronce_cart');
      if (stored) {
        setItems(JSON.parse(stored));
      }
      const storedCoupon = localStorage.getItem('avronce_coupon');
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
      localStorage.setItem('avronce_cart', JSON.stringify(items));
      if (couponCode) {
        localStorage.setItem('avronce_coupon', JSON.stringify({ code: couponCode, percent: discountPercent }));
      } else {
        localStorage.removeItem('avronce_coupon');
      }
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [items, couponCode, discountPercent, isHydrated]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = (item: Omit<CartItem, 'id'>) => {
    const id = `${item.productId}-${item.variantId}`;
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
    if (clean === 'AVRONCE10') {
      setCouponCode('AVRONCE10');
      setDiscountPercent(10);
      return true;
    } else if (clean === 'FIRST15') {
      setCouponCode('FIRST15');
      setDiscountPercent(15);
      return true;
    } else if (clean === 'VIP20') {
      setCouponCode('VIP20');
      setDiscountPercent(20);
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
  // 12% GST standard apparel rate (included or calculated)
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * 0.12);
  const totalAmount = taxableAmount + shippingFee;

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
