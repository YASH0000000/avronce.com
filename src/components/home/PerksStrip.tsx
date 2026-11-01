import React from 'react';
import { Truck, RefreshCw, ShieldCheck, Zap } from 'lucide-react';

export function PerksStrip() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 sm:p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm shadow-xs">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs uppercase font-black text-zinc-950 dark:text-white tracking-wider">
              Free Shipping
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              On prepaid orders above ₹999
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs uppercase font-black text-zinc-950 dark:text-white tracking-wider">
              Easy 7-Day Exchange
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Hassle-free size replacement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs uppercase font-black text-zinc-950 dark:text-white tracking-wider">
              100% Secure Checkout
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              UPI, Cards & NetBanking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
          <div>
            <h4 className="text-xs uppercase font-black text-zinc-950 dark:text-white tracking-wider">
              COD Available
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Pay cash at your doorstep
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
