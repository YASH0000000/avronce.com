'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Printer,
  MapPin,
  Phone,
  Mail,
  CreditCard,
} from 'lucide-react';

interface OrderItem {
  id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: string;
  payment_method: string;
  razorpay_payment_id?: string;
  tracking_id?: string;
  courier?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping_address: {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: {
    id: string;
    productId: string;
    name: string;
    slug: string;
    size: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  tax_amount: number;
  total_amount: number;
  created_at: string;
}

const COURIER_OPTIONS = [
  'BlueDart Express',
  'Delhivery Surface',
  'DTDC Express',
  'India Post Speed Post',
  'Ekart Logistics',
  'Shiprocket Air',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Editing courier/tracking
  const [trackingForm, setTrackingForm] = useState<{ [key: string]: { courier: string; tracking_id: string } }>({});
  const [savingTrackingId, setSavingTrackingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        const map: any = {};
        for (const o of data.orders) {
          map[o.id] = {
            courier: o.courier || 'BlueDart Express',
            tracking_id: o.tracking_id || '',
          };
        }
        setTrackingForm(map);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTracking = async (orderId: string) => {
    try {
      setSavingTrackingId(orderId);
      const current = trackingForm[orderId] || { courier: 'BlueDart Express', tracking_id: '' };
      const order = orders.find((o) => o.id === orderId);
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          status: order?.status || 'shipped',
          courier: current.courier,
          tracking_id: current.tracking_id,
        }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, courier: current.courier, tracking_id: current.tracking_id }
              : o
          )
        );
        alert('Tracking updated successfully!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingTrackingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      selectedStatus === 'all' || o.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesSearch =
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.phone?.includes(search) ||
      o.customer?.email?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; icon: any }> = {
      pending: { bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400', icon: Clock },
      processing: { bg: 'bg-sky-500/10 border-sky-500/30', text: 'text-sky-400', icon: Package },
      confirmed: { bg: 'bg-sky-500/10 border-sky-500/30', text: 'text-sky-400', icon: Package },
      shipped: { bg: 'bg-indigo-500/10 border-indigo-500/30', text: 'text-indigo-400', icon: Truck },
      delivered: { bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400', icon: CheckCircle },
      cancelled: { bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-400', icon: AlertTriangle },
    };
    const c = map[status] || { bg: 'bg-zinc-800 border-zinc-700', text: 'text-zinc-300', icon: Package };
    const Icon = c.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${c.bg} ${c.text}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Orders Fulfillment</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Track, update shipping status, allocate courier AWB tracking IDs, and fulfill orders.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-semibold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Orders
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((tab) => {
            const count =
              tab === 'all'
                ? orders.length
                : orders.filter((o) => o.status === tab).length;
            const isActive = selectedStatus === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedStatus(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                  isActive
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, Mobile Phone, or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-2xl">
            No orders match the selected filters.
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const isExpanded = expandedOrderId === ord.id;
            const currentTracking = trackingForm[ord.id] || { courier: ord.courier || 'BlueDart Express', tracking_id: ord.tracking_id || '' };

            return (
              <div
                key={ord.id}
                className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-sm hover:border-zinc-700 transition"
              >
                {/* Order Summary Bar */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950/40">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-bold text-white px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700">
                      {ord.order_number}
                    </span>
                    {getStatusBadge(ord.status)}
                    <span className="text-xs text-zinc-400">
                      {new Date(ord.created_at).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-zinc-400">Amount</p>
                      <p className="text-base font-bold text-white">
                        ₹{(ord.total_amount || 0).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className="bg-zinc-800 text-zinc-200 text-xs rounded-xl px-3 py-2 border border-zinc-700 focus:outline-none focus:border-amber-500 font-semibold cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
                        title="Toggle Details"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-zinc-800 space-y-6 text-xs bg-zinc-900">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Customer Info */}
                      <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                        <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" /> Customer & Shipping
                        </h4>
                        <p className="font-bold text-zinc-200 text-sm">{ord.customer?.name}</p>
                        <p className="text-zinc-400 flex items-center gap-1.5">
                          <Phone className="w-3 h-3" /> {ord.customer?.phone || 'No phone'}
                        </p>
                        <p className="text-zinc-400 flex items-center gap-1.5">
                          <Mail className="w-3 h-3" /> {ord.customer?.email}
                        </p>
                        <div className="pt-2 text-zinc-300 leading-relaxed border-t border-zinc-800/60">
                          {ord.shipping_address?.addressLine1}
                          {ord.shipping_address?.addressLine2 && `, ${ord.shipping_address.addressLine2}`}
                          <br />
                          {ord.shipping_address?.city}, {ord.shipping_address?.state} - {ord.shipping_address?.postalCode}
                          <br />
                          {ord.shipping_address?.country || 'India'}
                        </div>
                      </div>

                      {/* Payment & Billing */}
                      <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                        <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-sky-400" /> Payment & Billing
                        </h4>
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Payment Gateway:</span>
                            <span className="font-medium text-zinc-200">{ord.payment_method}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Payment Status:</span>
                            <span className="font-bold uppercase text-emerald-400">
                              {ord.payment_status}
                            </span>
                          </div>
                          {ord.razorpay_payment_id && (
                            <div className="flex justify-between">
                              <span className="text-zinc-400">Txn Ref:</span>
                              <span className="font-mono text-zinc-300 text-[10px]">
                                {ord.razorpay_payment_id}
                              </span>
                            </div>
                          )}
                          <div className="pt-2 border-t border-zinc-800 space-y-1">
                            <div className="flex justify-between text-zinc-400">
                              <span>Subtotal:</span>
                              <span>₹{ord.subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            {ord.discount_amount > 0 && (
                              <div className="flex justify-between text-amber-400">
                                <span>Discount:</span>
                                <span>-₹{ord.discount_amount.toLocaleString('en-IN')}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-zinc-400">
                              <span>Shipping:</span>
                              <span>{ord.shipping_fee === 0 ? 'FREE' : `₹${ord.shipping_fee}`}</span>
                            </div>
                            <div className="flex justify-between font-bold text-white text-sm pt-1 border-t border-zinc-800">
                              <span>Total:</span>
                              <span>₹{ord.total_amount.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Shipping & Tracking Configuration */}
                      <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-3">
                        <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-indigo-400" /> Dispatch & Tracking
                        </h4>
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase font-semibold mb-1">
                            Courier Partner
                          </label>
                          <select
                            value={currentTracking.courier}
                            onChange={(e) =>
                              setTrackingForm({
                                ...trackingForm,
                                [ord.id]: { ...currentTracking, courier: e.target.value },
                              })
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs focus:outline-none focus:border-amber-500"
                          >
                            {COURIER_OPTIONS.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase font-semibold mb-1">
                            Tracking Number / AWB
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. BLUEDART-88392019"
                            value={currentTracking.tracking_id}
                            onChange={(e) =>
                              setTrackingForm({
                                ...trackingForm,
                                [ord.id]: { ...currentTracking, tracking_id: e.target.value },
                              })
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs focus:outline-none focus:border-amber-500 font-mono"
                          />
                        </div>

                        <button
                          disabled={savingTrackingId === ord.id}
                          onClick={() => handleSaveTracking(ord.id)}
                          className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition disabled:opacity-50"
                        >
                          {savingTrackingId === ord.id ? 'Saving...' : 'Update Tracking'}
                        </button>
                      </div>
                    </div>

                    {/* Ordered Items Table */}
                    <div>
                      <h4 className="font-semibold text-white mb-2 uppercase tracking-wider text-[11px]">
                        Order Items ({ord.items?.length || 0})
                      </h4>
                      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/40">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-zinc-950 text-[10px] uppercase text-zinc-400 border-b border-zinc-800">
                            <tr>
                              <th className="py-2.5 px-3">Product</th>
                              <th className="py-2.5 px-3">Size</th>
                              <th className="py-2.5 px-3">Price</th>
                              <th className="py-2.5 px-3">Quantity</th>
                              <th className="py-2.5 px-3 text-right">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800/60">
                            {ord.items?.map((item, idx) => (
                              <tr key={idx}>
                                <td className="py-2.5 px-3 flex items-center gap-2.5">
                                  <div className="w-10 h-12 relative rounded bg-zinc-800 shrink-0 overflow-hidden">
                                    <Image
                                      src={item.image || '/images/collections/cat_boots.webp'}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                      sizes="40px"
                                    />
                                  </div>
                                  <span className="font-medium text-white truncate max-w-xs">
                                    {item.name}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 font-semibold text-amber-400">
                                  {item.size || 'Free Size'}
                                </td>
                                <td className="py-2.5 px-3 text-zinc-300">
                                  ₹{item.price.toLocaleString('en-IN')}
                                </td>
                                <td className="py-2.5 px-3 text-zinc-300">{item.quantity}</td>
                                <td className="py-2.5 px-3 text-right font-bold text-white">
                                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition text-xs font-semibold"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print Packing Slip
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
