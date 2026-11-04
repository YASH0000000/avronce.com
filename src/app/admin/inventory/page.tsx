'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Plus,
  Minus,
  Save,
} from 'lucide-react';

interface ProductInventory {
  id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
}

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<ProductInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  // Stock edit tracking
  const [stockEdits, setStockEdits] = useState<{ [id: string]: number }>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/inventory');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        const map: { [id: string]: number } = {};
        for (const p of data.products) {
          map[p.id] = p.stock ?? 0;
        }
        setStockEdits(map);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = (id: string, delta: number) => {
    setStockEdits((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + delta),
    }));
  };

  const handleDirectStockChange = (id: string, val: number) => {
    setStockEdits((prev) => ({
      ...prev,
      [id]: Math.max(0, val),
    }));
  };

  const saveStock = async (id: string) => {
    try {
      setSavingId(id);
      const newStock = stockEdits[id] ?? 0;
      const res = await fetch('/api/admin/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stock: newStock }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
        );
      } else {
        alert('Failed to update stock');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const stock = stockEdits[p.id] ?? p.stock ?? 0;
    const matchesFilter =
      stockFilter === 'all' ||
      (stockFilter === 'low' && stock > 0 && stock < 15) ||
      (stockFilter === 'out' && stock === 0);

    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const lowStockCount = products.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) < 15).length;
  const outOfStockCount = products.filter((p) => (p.stock ?? 0) === 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Warehouse Inventory</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time SKU quantities, inline inventory restock, and low-level threshold monitors.
          </p>
        </div>
        <button
          onClick={fetchInventory}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-semibold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Sync Stock
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setStockFilter('all')}
          className={`p-4 rounded-2xl border text-left transition ${
            stockFilter === 'all'
              ? 'bg-zinc-800 border-amber-500'
              : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Total Catalog SKUs</span>
            <Boxes className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-1">{products.length}</p>
          <p className="text-[10px] text-zinc-400 mt-1">Active inventory references</p>
        </button>

        <button
          onClick={() => setStockFilter('low')}
          className={`p-4 rounded-2xl border text-left transition ${
            stockFilter === 'low'
              ? 'bg-amber-950/40 border-amber-500'
              : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-300 font-semibold">Low Stock Alert (&lt;15)</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-300 mt-1">{lowStockCount}</p>
          <p className="text-[10px] text-zinc-400 mt-1">Urgent replenishment recommended</p>
        </button>

        <button
          onClick={() => setStockFilter('out')}
          className={`p-4 rounded-2xl border text-left transition ${
            stockFilter === 'out'
              ? 'bg-rose-950/40 border-rose-500'
              : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-300 font-semibold">Out of Stock (0)</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-300 mt-1">{outOfStockCount}</p>
          <p className="text-[10px] text-zinc-400 mt-1">Hidden or backordered on storefront</p>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search SKU by product title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800 bg-zinc-950/60">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Price</th>
                <th className="py-3.5 px-3">Health Status</th>
                <th className="py-3.5 px-3">Adjust Quantity</th>
                <th className="py-3.5 px-4 text-right">Commit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
                    Loading inventory records...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    No products match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const currentEdited = stockEdits[p.id] ?? p.stock ?? 0;
                  const isModified = currentEdited !== (p.stock ?? 0);

                  const statusBadge =
                    currentEdited === 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        <XCircle className="w-3 h-3" /> Out of Stock
                      </span>
                    ) : currentEdited < 15 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3" /> Healthy Stock
                      </span>
                    );

                  return (
                    <tr key={p.id} className="hover:bg-zinc-800/30 transition">
                      {/* Product */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 relative rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700/50">
                            <Image
                              src={p.images?.[0] || '/images/collections/cat_boots.webp'}
                              alt={p.title}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p className="font-semibold text-white truncate">{p.title}</p>
                            <p className="text-[10px] text-zinc-400 font-mono">ID: {p.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 text-zinc-300 font-medium">{p.category}</td>

                      {/* Price */}
                      <td className="py-3 px-3 font-semibold text-white">
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">{statusBadge}</td>

                      {/* Quick Adjuster */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleStockChange(p.id, -5)}
                            className="px-1.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-[10px] font-mono"
                            title="Subtract 5"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleStockChange(p.id, -1)}
                            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
                            title="Subtract 1"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <input
                            type="number"
                            min="0"
                            value={currentEdited}
                            onChange={(e) =>
                              handleDirectStockChange(p.id, parseInt(e.target.value) || 0)
                            }
                            className={`w-16 px-2 py-1 text-center font-bold font-mono text-xs rounded-lg border focus:outline-none ${
                              isModified
                                ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                                : 'bg-zinc-950 border-zinc-800 text-white'
                            }`}
                          />

                          <button
                            onClick={() => handleStockChange(p.id, 1)}
                            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
                            title="Add 1"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleStockChange(p.id, 10)}
                            className="px-1.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-[10px] font-mono"
                            title="Add 10"
                          >
                            +10
                          </button>
                        </div>
                      </td>

                      {/* Save */}
                      <td className="py-3 px-4 text-right">
                        <button
                          disabled={!isModified || savingId === p.id}
                          onClick={() => saveStock(p.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            isModified
                              ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow'
                              : 'bg-zinc-800/40 text-zinc-400 cursor-not-allowed'
                          }`}
                        >
                          <Save className="w-3 h-3" />
                          {savingId === p.id ? 'Updating...' : 'Save'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
