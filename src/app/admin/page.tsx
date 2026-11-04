'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingCart,
  ShoppingBag,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Plus,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

interface DbStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  ordersByStatus: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  lowStockCount: number;
  lowStockProducts: any[];
  recentOrders: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DbStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) {
        await fetchStats();
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-sm text-zinc-400">Loading AVRONCE Store Metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/40 p-6 sm:p-8 border border-zinc-800 shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
            <span>AVRONCE Atelier Executive Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome to Store Command Center
          </h1>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            Monitor real-time sales, fulfill customer orders, manage inventory, and configure storefront banners directly with instant database synchronization.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs transition shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Product
            </Link>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition border border-zinc-700"
            >
              <ShoppingCart className="w-4 h-4" /> Manage Orders
            </Link>
            <button
              onClick={fetchStats}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 text-xs transition"
              title="Refresh Stats"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Revenue */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Gross Revenue</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white">
              ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
            </h3>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Realtime Gross GMV</span>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Orders Placed</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white">{stats?.totalOrders || 0}</h3>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-sky-400 font-medium">
              <span>{stats?.ordersByStatus.processing || 0} currently processing</span>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Active Catalog Items</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white">{stats?.totalProducts || 0}</h3>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
              <Link href="/admin/products" className="hover:text-amber-400 underline decoration-dotted">
                View all items →
              </Link>
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Registered Buyers</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white">{stats?.totalCustomers || 0}</h3>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-400">
              <span>Across Pan-India delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown Strip */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
          Fulfillment Pipeline Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
              <Clock className="w-4 h-4" /> Pending
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-300">
              {stats?.ordersByStatus.pending || 0}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-500/5 border border-sky-500/20">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold">
              <Package className="w-4 h-4" /> Processing
            </div>
            <p className="mt-2 text-2xl font-bold text-sky-300">
              {stats?.ordersByStatus.processing || 0}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
              <Truck className="w-4 h-4" /> Shipped
            </div>
            <p className="mt-2 text-2xl font-bold text-indigo-300">
              {stats?.ordersByStatus.shipped || 0}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle className="w-4 h-4" /> Delivered
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-300">
              {stats?.ordersByStatus.delivered || 0}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4" /> Cancelled
            </div>
            <p className="mt-2 text-2xl font-bold text-rose-300">
              {stats?.ordersByStatus.cancelled || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Stock Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Recent Customer Orders</h2>
              <p className="text-xs text-zinc-400">Live order activity across the storefront</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1"
            >
              All Orders ({stats?.totalOrders || 0}) <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800 bg-zinc-950/40">
                <tr>
                  <th className="py-3 px-3">Order Ref</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {stats?.recentOrders?.map((ord: any) => {
                  const statusColors: Record<string, string> = {
                    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                    processing: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
                    confirmed: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
                    shipped: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
                    delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                    cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
                  };

                  return (
                    <tr key={ord.id} className="hover:bg-zinc-800/30 transition">
                      <td className="py-3 px-3 font-mono font-semibold text-white">
                        {ord.order_number}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-medium text-zinc-200">{ord.customer?.name}</p>
                        <p className="text-[10px] text-zinc-400">{ord.customer?.phone || ord.customer?.email}</p>
                      </td>
                      <td className="py-3 px-3 text-zinc-300">
                        {ord.items?.length || 1} item(s)
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">
                        ₹{(ord.total_amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                            statusColors[ord.status] || 'bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <select
                          disabled={updatingOrderId === ord.id}
                          value={ord.status}
                          onChange={(e) => handleQuickStatusChange(ord.id, e.target.value)}
                          className="bg-zinc-800 text-zinc-200 text-[11px] rounded-lg px-2 py-1 border border-zinc-700 focus:outline-none focus:border-amber-500 cursor-pointer disabled:opacity-50"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (1 Col) */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white">Stock Alerts</h2>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              Inventory ({stats?.lowStockCount || 0})
            </Link>
          </div>

          <p className="text-xs text-zinc-400">
            Products with low warehouse quantities requiring restock:
          </p>

          <div className="space-y-3">
            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
              stats.lowStockProducts.map((p: any) => (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-white truncate">{p.title}</p>
                    <p className="text-[10px] text-zinc-400">₹{p.price} • {p.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        (p.stock || 0) <= 5
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {p.stock ?? 0} left
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-zinc-400 bg-zinc-950/40 rounded-xl">
                All inventory levels healthy.
              </div>
            )}
          </div>

          <Link
            href="/admin/inventory"
            className="block text-center w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition"
          >
            Open Restock Manager →
          </Link>
        </div>
      </div>
    </div>
  );
}
