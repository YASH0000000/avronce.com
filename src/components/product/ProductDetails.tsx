'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductVariant } from '@/types/database';
import { useCart } from '@/lib/cart-context';
import { 
  ShoppingBag, 
  Ruler, 
  Check, 
  ChevronDown, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Sparkles,
  X
} from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants?.[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState<boolean>(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('composition');
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId) || product.variants?.[0];

  // Unique sizes and colors
  const uniqueSizes = Array.from(new Set(product.variants?.map((v) => v.size) || []));
  const uniqueColors = Array.from(
    new Map(product.variants?.map((v) => [v.color_name, v])).values()
  );

  const handleSelectSize = (size: string) => {
    // Find variant with matching size and currently selected color, or first available with that size
    const matching = product.variants?.find(
      (v) => v.size === size && (selectedVariant ? v.color_name === selectedVariant.color_name : true)
    ) || product.variants?.find((v) => v.size === size);

    if (matching) {
      setSelectedVariantId(matching.id);
    }
  };

  const handleSelectColor = (colorName: string) => {
    const matching = product.variants?.find(
      (v) => v.color_name === colorName && (selectedVariant ? v.size === selectedVariant.size : true)
    ) || product.variants?.find((v) => v.color_name === colorName);

    if (matching) {
      setSelectedVariantId(matching.id);
    }
  };

  const handleAddToCart = (instantCheckout = false) => {
    if (!selectedVariant) return;

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      slug: product.slug,
      price: Number(selectedVariant.price_override || product.price),
      image: product.images?.[0]?.image_url || '',
      size: selectedVariant.size,
      colorName: selectedVariant.color_name,
      colorHex: selectedVariant.color_hex,
      quantity,
      stock: selectedVariant.stock_quantity,
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);

    if (instantCheckout) {
      router.push('/checkout');
    }
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  return (
    <div className="flex flex-col space-y-6">
      
      {/* 1. Header Info */}
      <div className="space-y-2 border-b border-zinc-800 pb-5">
        <div className="flex items-center justify-between text-xs text-zinc-400 uppercase tracking-widest">
          <span>{product.category?.name || 'Exclusive Atelier'}</span>
          <span className="font-mono">{selectedVariant?.sku}</span>
        </div>
        
        <h1 className="font-serif text-2xl lg:text-3xl font-normal tracking-wide text-white">
          {product.name}
        </h1>

        {product.tagline && (
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-medium">
            {product.tagline}
          </p>
        )}

        <div className="flex items-baseline gap-3 pt-2">
          <span className="text-2xl font-semibold text-white tracking-tight">
            ₹{Number(selectedVariant?.price_override || product.price).toLocaleString('en-IN')}
          </span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-sm text-zinc-500 line-through">
              ₹{Number(product.compare_at_price).toLocaleString('en-IN')}
            </span>
          )}
          <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-900/60 px-2 py-0.5 rounded-sm">
            Taxes & Duties Included
          </span>
        </div>
      </div>

      {/* 2. Color Selection */}
      {uniqueColors.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400 uppercase tracking-wider">Color:</span>
            <span className="text-white font-medium">{selectedVariant?.color_name}</span>
          </div>
          <div className="flex items-center gap-3">
            {uniqueColors.map((col) => {
              const isSelected = selectedVariant?.color_name === col.color_name;
              return (
                <button
                  key={col.id}
                  onClick={() => handleSelectColor(col.color_name)}
                  className={`group relative p-1 rounded-full border transition-all ${
                    isSelected ? 'border-white scale-110' : 'border-transparent hover:border-zinc-700'
                  }`}
                  aria-label={`Select color ${col.color_name}`}
                >
                  <span
                    className="block w-6 h-6 rounded-full border border-zinc-700/80 shadow-inner"
                    style={{ backgroundColor: col.color_hex }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Size Selection & Sizing Guide */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-400 uppercase tracking-wider">Select Size:</span>
          <button
            onClick={() => setSizeGuideOpen(true)}
            className="text-zinc-400 hover:text-white inline-flex items-center gap-1.5 underline underline-offset-4 transition-colors"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Size Guide</span>
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {uniqueSizes.map((size) => {
            const variantForSize = product.variants?.find(
              (v) => v.size === size && (selectedVariant ? v.color_name === selectedVariant.color_name : true)
            );
            const isOutOfStock = !variantForSize || variantForSize.stock_quantity <= 0;
            const isSelected = selectedVariant?.size === size;

            return (
              <button
                key={size}
                disabled={isOutOfStock}
                onClick={() => handleSelectSize(size)}
                className={`py-3 text-xs font-mono font-medium border rounded-sm transition-all ${
                  isSelected
                    ? 'bg-white text-zinc-950 border-white shadow-md font-bold'
                    : isOutOfStock
                    ? 'border-zinc-900 bg-zinc-900/50 text-zinc-600 line-through cursor-not-allowed'
                    : 'border-zinc-800 text-zinc-300 hover:border-zinc-500 bg-zinc-950'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>

        {/* Live Stock Notification */}
        {selectedVariant && selectedVariant.stock_quantity <= 5 && selectedVariant.stock_quantity > 0 && (
          <p className="text-xs text-amber-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
            <span>Limited edition run: only {selectedVariant.stock_quantity} left in stock</span>
          </p>
        )}
      </div>

      {/* 4. Action Buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex gap-3">
          <button
            onClick={() => handleAddToCart(false)}
            disabled={!selectedVariant || selectedVariant.stock_quantity <= 0}
            className="flex-1 py-4 bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleAddToCart(true)}
            disabled={!selectedVariant || selectedVariant.stock_quantity <= 0}
            className="py-4 px-6 bg-zinc-900 border border-zinc-700 hover:border-white text-white font-semibold text-xs uppercase tracking-[0.15em] rounded-sm transition-colors whitespace-nowrap"
          >
            Buy Now
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-y border-zinc-800 text-[11px] text-zinc-400 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-zinc-300" />
            <span>Free Express Delivery</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 border-x border-zinc-800">
            <RotateCcw className="w-3.5 h-3.5 text-zinc-300" />
            <span>7-Day Easy Returns</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
            <span>100% Original Fabric</span>
          </div>
        </div>
      </div>

      {/* 5. Details Accordions */}
      <div className="divide-y divide-zinc-800/80 border-b border-zinc-800 text-xs">
        
        {/* Description & Overview */}
        <div className="py-4">
          <h3 className="font-semibold text-white uppercase tracking-wider mb-2">Description & Details</h3>
          <p className="text-zinc-400 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Composition & Fabric */}
        <div className="py-4">
          <button
            onClick={() => toggleAccordion('composition')}
            className="w-full flex justify-between items-center text-white font-medium uppercase tracking-wider text-left"
          >
            <span>Fabric & Materials</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === 'composition' ? 'rotate-180' : ''}`} />
          </button>
          {openAccordion === 'composition' && (
            <div className="mt-3 text-zinc-400 space-y-2">
              <p><strong>Composition:</strong> {product.details?.composition || '100% Premium Sourced Natural Fabric'}</p>
              <p><strong>Origin:</strong> {product.details?.origin || 'Crafted in India'}</p>
            </div>
          )}
        </div>

        {/* Fit & Sizing */}
        <div className="py-4">
          <button
            onClick={() => toggleAccordion('fit')}
            className="w-full flex justify-between items-center text-white font-medium uppercase tracking-wider text-left"
          >
            <span>Size & Fit</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === 'fit' ? 'rotate-180' : ''}`} />
          </button>
          {openAccordion === 'fit' && (
            <div className="mt-3 text-zinc-400 space-y-2">
              <p>{product.details?.fit || 'Relaxed tailored fit designed for comfortable all-day wear.'}</p>
              <p>Model is 6&apos;1&quot; wearing size L for a relaxed drape.</p>
            </div>
          )}
        </div>

        {/* Care Instructions */}
        <div className="py-4">
          <button
            onClick={() => toggleAccordion('care')}
            className="w-full flex justify-between items-center text-white font-medium uppercase tracking-wider text-left"
          >
            <span>Wash & Care Instructions</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${openAccordion === 'care' ? 'rotate-180' : ''}`} />
          </button>
          {openAccordion === 'care' && (
            <div className="mt-3 text-zinc-400 space-y-2">
              <p>{product.details?.care || 'Cold gentle hand wash or specialist dry clean. Air dry flat away from direct sunlight.'}</p>
            </div>
          )}
        </div>

      </div>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSizeGuideOpen(false)}
          />
          <div className="relative bg-zinc-950 border border-zinc-800 p-6 sm:p-8 max-w-lg w-full rounded-sm shadow-2xl z-10 text-zinc-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-lg tracking-wider uppercase text-white">AVRONCE Size Chart (Inches)</h3>
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-mono uppercase">
                    <th className="py-2.5">Size</th>
                    <th className="py-2.5">Chest</th>
                    <th className="py-2.5">Shoulder</th>
                    <th className="py-2.5">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 font-mono text-zinc-300">
                  <tr>
                    <td className="py-2 font-bold text-white">S</td>
                    <td className="py-2">40&quot;</td>
                    <td className="py-2">19.5&quot;</td>
                    <td className="py-2">27.5&quot;</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-white">M</td>
                    <td className="py-2">42&quot;</td>
                    <td className="py-2">20.5&quot;</td>
                    <td className="py-2">28.5&quot;</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-white">L</td>
                    <td className="py-2">44&quot;</td>
                    <td className="py-2">21.5&quot;</td>
                    <td className="py-2">29.5&quot;</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-white">XL</td>
                    <td className="py-2">46&quot;</td>
                    <td className="py-2">22.5&quot;</td>
                    <td className="py-2">30.5&quot;</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-[11px] text-zinc-400 leading-normal border-t border-zinc-800/80 pt-4">
              All Avronce garments are engineered with relaxed drop-shoulder tailoring. If you prefer a closer slim fit, we recommend taking one size down.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
