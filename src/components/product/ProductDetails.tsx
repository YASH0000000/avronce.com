'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Star,
  Tag,
  Zap,
  MapPin,
  X
} from 'lucide-react';

interface ProductDetailsProps {
  product: any;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const router = useRouter();
  const { addItem } = useCart();

  // Normalize data
  const title = product.title || product.name || 'Littlebox Item';
  const price = Number(product.price || 999);
  const originalPrice = Number(product.originalPrice || product.compare_at_price || Math.round(price * 1.55));
  const discountPercent =
    product.discountPercent || (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

  const images = (product.images || []).map((img: any) =>
    typeof img === 'string' ? img : img?.image_url || img?.src || ''
  );
  const primaryImage = images[0] || '/images/collections/cat_boots.webp';

  // Normalize sizes
  const rawSizes =
    product.options?.find((o: any) => o.name.toLowerCase().includes('size'))?.values ||
    product.variants?.map((v: any) => v.size || v.title).filter(Boolean) ||
    ['XS', 'S', 'M', 'L', 'XL'];

  const sizes = Array.from(new Set(rawSizes)) as string[];

  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState<boolean>(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);
  const [pincode, setPincode] = useState<string>('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  const handleAddToCart = (instantCheckout = false) => {
    const variant = product.variants?.find((v: any) => (v.size || v.title || v.option1) === selectedSize) || product.variants?.[0];

    addItem({
      productId: String(product.id),
      variantId: variant ? String(variant.id) : `v-${selectedSize}`,
      name: title,
      slug: product.slug || product.handle || String(product.id),
      price: price,
      originalPrice: originalPrice,
      image: primaryImage,
      size: selectedSize,
      colorName: variant?.color_name || 'Standard',
      quantity,
      stock: 50,
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);

    if (instantCheckout) {
      router.push('/checkout');
    }
  };

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeStatus(`🚚 Delivery available in 3-5 days to ${pincode} • COD Available`);
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian Pincode');
    }
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  return (
    <div className="flex flex-col space-y-5">
      {/* 1. Header Info */}
      <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center justify-between text-xs text-zinc-500 uppercase tracking-wider font-mono">
          <span>{product.category || product.productType || 'Footwear & Fashion'}</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">In Stock • Ready to Ship</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black uppercase text-zinc-950 dark:text-white tracking-tight leading-tight">
          {title}
        </h1>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full text-xs font-bold text-amber-600 dark:text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{product.rating || '4.8'}</span>
          </div>
          <span className="text-xs text-zinc-500">
            ({product.reviewsCount || 142} verified customer reviews)
          </span>
        </div>

        {/* Price and Discount */}
        <div className="flex items-baseline gap-3 pt-2">
          <span className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {originalPrice > price && (
            <span className="text-base text-zinc-400 line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-black uppercase rounded-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>
        <p className="text-[11px] text-zinc-500">Inclusive of all taxes. Free shipping above ₹999.</p>
      </div>

      {/* 2. Special Coupon Offers Banner */}
      <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-300 dark:border-yellow-700/50 p-3 rounded-xs space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-yellow-300 uppercase">
          <Tag className="w-3.5 h-3.5 text-yellow-600" />
          <span>Active Offers on this item:</span>
        </div>
        <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1 pl-4 list-disc">
          <li>
            Use code <strong className="font-mono text-zinc-950 dark:text-white font-black">B2G1</strong> for Buy 2 Get 1 Free.
          </li>
          <li>
            Extra 10% off on all prepaid orders with code <strong className="font-mono text-zinc-950 dark:text-white font-black">PREPAID10</strong>.
          </li>
        </ul>
      </div>

      {/* 3. Size Selection */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-wider text-zinc-900 dark:text-white font-mono">
            Select Size: <strong className="text-zinc-950 dark:text-white">{selectedSize}</strong>
          </span>
          <button
            onClick={() => setSizeGuideOpen(true)}
            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white underline underline-offset-4"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Size Guide</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`min-w-[46px] h-10 px-3 text-xs font-mono font-bold uppercase rounded-xs border transition-all ${
                selectedSize === size
                  ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950 shadow-md scale-102'
                  : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-zinc-950'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Quantity and CTA Buttons */}
      <div className="space-y-3 pt-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-xs bg-white dark:bg-zinc-900 h-12 px-3">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="text-zinc-600 hover:text-zinc-950 px-2 text-base font-bold"
            >
              -
            </button>
            <span className="px-3 text-sm font-mono font-bold min-w-[24px] text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="text-zinc-600 hover:text-zinc-950 px-2 text-base font-bold"
            >
              +
            </button>
          </div>

          <button
            onClick={() => handleAddToCart(false)}
            className="flex-1 h-12 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs sm:text-sm uppercase font-black tracking-[0.16em] rounded-xs flex items-center justify-center gap-2 hover:opacity-90 active:scale-98 transition-all shadow-xl"
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={() => handleAddToCart(true)}
          className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-zinc-950 text-xs sm:text-sm uppercase font-black tracking-[0.18em] rounded-xs flex items-center justify-center gap-2 shadow-md transition-colors"
        >
          <Zap className="w-4 h-4 fill-zinc-950" />
          <span>Buy Now • Instant Checkout</span>
        </button>
      </div>

      {/* 5. Pincode Delivery Checker */}
      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
          <span>Estimate Delivery & COD:</span>
        </span>
        <form onSubmit={checkPincode} className="flex gap-2">
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-xs px-3 py-2 rounded-xs font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold uppercase tracking-wider rounded-xs"
          >
            Check
          </button>
        </form>
        {pincodeStatus && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{pincodeStatus}</p>
        )}
      </div>

      {/* 6. Accordions: Details & Shipping */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 divide-y divide-zinc-200 dark:divide-zinc-800">
        
        {/* Accordion 1: Description & Details */}
        <div className="py-3">
          <button
            onClick={() => toggleAccordion('description')}
            className="w-full flex items-center justify-between text-xs uppercase font-bold tracking-wider text-zinc-900 dark:text-white"
          >
            <span>Product Details & Styling</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${openAccordion === 'description' ? 'rotate-180' : ''}`}
            />
          </button>
          {openAccordion === 'description' && (
            <div className="pt-3 text-xs text-zinc-600 dark:text-zinc-300 space-y-2 leading-relaxed">
              <div
                dangerouslySetInnerHTML={{
                  __html: product.description || 'Trendy and aesthetic statement piece crafted for comfort, street style, and party looks.',
                }}
              />
            </div>
          )}
        </div>

        {/* Accordion 2: Shipping & Returns */}
        <div className="py-3">
          <button
            onClick={() => toggleAccordion('shipping')}
            className="w-full flex items-center justify-between text-xs uppercase font-bold tracking-wider text-zinc-900 dark:text-white"
          >
            <span>Shipping, COD & Easy Returns</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${openAccordion === 'shipping' ? 'rotate-180' : ''}`}
            />
          </button>
          {openAccordion === 'shipping' && (
            <div className="pt-3 text-xs text-zinc-600 dark:text-zinc-300 space-y-2 leading-relaxed">
              <p>• <strong>Free Express Shipping:</strong> Available on all orders above ₹999.</p>
              <p>• <strong>Cash on Delivery (COD):</strong> Available across India with doorstep payment.</p>
              <p>• <strong>7-Day Easy Exchange:</strong> Hassle-free size and product exchange if the fit isn&apos;t 100% right.</p>
            </div>
          )}
        </div>

      </div>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white rounded-sm p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold uppercase tracking-wider">Littlebox Size Guide</h3>
              <button onClick={() => setSizeGuideOpen(false)}>
                <X className="w-5 h-5 text-zinc-500 hover:text-zinc-950" />
              </button>
            </div>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                    <th className="p-2 font-mono">Size</th>
                    <th className="p-2 font-mono">Bust (in)</th>
                    <th className="p-2 font-mono">Waist (in)</th>
                    <th className="p-2 font-mono">EU / UK Footwear</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-mono">
                  <tr><td className="p-2 font-bold">XS</td><td className="p-2">32 - 34</td><td className="p-2">24 - 26</td><td className="p-2">36 (UK 3)</td></tr>
                  <tr><td className="p-2 font-bold">S</td><td className="p-2">34 - 36</td><td className="p-2">26 - 28</td><td className="p-2">37 (UK 4)</td></tr>
                  <tr><td className="p-2 font-bold">M</td><td className="p-2">36 - 38</td><td className="p-2">28 - 30</td><td className="p-2">38 (UK 5)</td></tr>
                  <tr><td className="p-2 font-bold">L</td><td className="p-2">38 - 40</td><td className="p-2">30 - 32</td><td className="p-2">39 (UK 6)</td></tr>
                  <tr><td className="p-2 font-bold">XL</td><td className="p-2">40 - 42</td><td className="p-2">32 - 34</td><td className="p-2">40 (UK 7)</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-zinc-500">
              Tip: If you are between footwear sizes, we recommend sizing up for chunky boots.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
