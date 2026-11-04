'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Award,
  RefreshCw,
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  city: string;
  joinedDate: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/customers');
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      c.city?.toLowerCase().includes(search.toLowerCase())
  );

  const totalSpentAll = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const avgOrderValue = customers.length ? Math.round(totalSpentAll / customers.length) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Customer Directory</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your customer database, loyalty tiers, lifetime purchase values, and contact details.
          </p>
        </div>
        <button
          onClick={fetchCustomers}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-semibold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <p className="text-xs text-zinc-400">Total Buyers</p>
          <h3 className="text-2xl font-bold text-white mt-1">{customers.length}</h3>
          <p className="text-[10px] text-zinc-400 mt-1">Active registered profiles</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <p className="text-xs text-zinc-400">Total Customer Lifetime GMV</p>
          <h3 className="text-2xl font-bold text-amber-400 mt-1">
            ₹{totalSpentAll.toLocaleString('en-IN')}
          </h3>
          <p className="text-[10px] text-zinc-400 mt-1">Across all historical purchases</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <p className="text-xs text-zinc-400">Average Spend per Customer</p>
          <h3 className="text-2xl font-bold text-sky-400 mt-1">
            ₹{avgOrderValue.toLocaleString('en-IN')}
          </h3>
          <p className="text-[10px] text-zinc-400 mt-1">Strong brand engagement</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by customer name, email address, mobile phone, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800 bg-zinc-950/60">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-3">Contact</th>
                <th className="py-3.5 px-3">Location</th>
                <th className="py-3.5 px-3">Orders</th>
                <th className="py-3.5 px-3">Total Spend</th>
                <th className="py-3.5 px-4">Member Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
                    Loading customers...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    No customers found matching &quot;{search}&quot;.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const isVip = c.totalSpent >= 4000;
                  return (
                    <tr key={c.id} className="hover:bg-zinc-800/30 transition">
                      {/* Name & Avatar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-zinc-950 font-bold flex items-center justify-center shrink-0 text-xs shadow-sm">
                            {c.name.slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{c.name}</p>
                            <p className="text-[10px] text-zinc-400">
                              Joined {c.joinedDate || 'Recently'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-3 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-zinc-300">
                          <Mail className="w-3 h-3 text-zinc-400" />
                          <span>{c.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
                          <Phone className="w-3 h-3 text-zinc-400" />
                          <span>{c.phone || 'N/A'}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-3 text-zinc-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-zinc-400" />
                          <span>{c.city || 'India'}</span>
                        </div>
                      </td>

                      {/* Orders */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-800 font-semibold text-zinc-200">
                          <ShoppingBag className="w-3 h-3 text-amber-400" /> {c.ordersCount || 1}
                        </span>
                      </td>

                      {/* Total Spend */}
                      <td className="py-3 px-3 font-bold text-white">
                        ₹{(c.totalSpent || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Member Tier */}
                      <td className="py-3 px-4">
                        {isVip ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <Award className="w-3 h-3" /> VIP Gold
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-zinc-300">
                            Standard
                          </span>
                        )}
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
