'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Tag,
  Star,
  Flame,
  RefreshCw,
  Upload,
  ArrowLeft,
  ArrowRight,
  Archive,
  Image as ImageIcon,
} from 'lucide-react';

interface Product {
  id: string;
  title: string;
  handle: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  images: string[];
  stock: number;
  available: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  tags?: string[];
  status?: 'published' | 'draft' | 'archived';
}

const CATEGORIES = [
  'All',
  'Boots',
  'Heels',
  'Flats & Loafers',
  'Sneakers',
  'Dresses',
  'Tops',
  'Co-Ords',
  'Bottoms',
  'Outerwear',
  'Accessories',
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Boots',
    price: 999,
    originalPrice: 1499,
    stock: 50,
    images: ['/images/collections/cat_boots.webp'],
    description: '',
    tags: 'new arrival, trending',
    isFeatured: false,
    isBestseller: false,
    status: 'published' as 'published' | 'draft' | 'archived',
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      category: 'Boots',
      price: 1299,
      originalPrice: 2499,
      stock: 40,
      images: ['/images/collections/cat_boots.webp'],
      description: 'Handcrafted luxury trendsetter piece designed for modern everyday luxury.',
      tags: 'trendsetter, luxury, new',
      isFeatured: false,
      isBestseller: false,
      status: 'published',
    });
    setNewImageUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      title: p.title,
      category: p.category || 'Boots',
      price: p.price,
      originalPrice: p.originalPrice || Math.round(p.price * 1.5),
      stock: p.stock ?? 30,
      images: p.images && p.images.length > 0 ? p.images : ['/images/collections/cat_boots.webp'],
      description: p.description || '',
      tags: p.tags ? p.tags.join(', ') : '',
      isFeatured: Boolean(p.isFeatured),
      isBestseller: Boolean(p.isBestseller),
      status: p.status || 'published',
    });
    setNewImageUrl('');
    setIsModalOpen(true);
  };

  // Image Gallery Handlers
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImageUrl.trim()],
    }));
    setNewImageUrl('');
  };

  const handleMakePrimary = (index: number) => {
    if (index === 0) return;
    setFormData((prev) => {
      const next = [...prev.images];
      const [item] = next.splice(index, 1);
      next.unshift(item);
      return { ...prev, images: next };
    });
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    setFormData((prev) => {
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.images.length) return prev;
      const next = [...prev.images];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return { ...prev, images: next };
    });
  };

  const handleRemoveImage = (index: number) => {
    if (formData.images.length <= 1) {
      alert('Product must retain at least one image.');
      return;
    }
    if (!window.confirm('Remove this image from the gallery?')) return;
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingFiles(true);
      const data = new FormData();
      for (let i = 0; i < files.length; i++) {
        data.append('files', files[i]);
      }

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (res.ok && json.success && json.urls) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...json.urls],
        }));
      } else {
        alert(json.error || 'Failed to upload image files.');
      }
    } catch {
      alert('Upload failed. Please check network connection.');
    } finally {
      setUploadingFiles(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return;

    try {
      setSaving(true);
      const payload: any = {
        title: formData.title,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        stock: Number(formData.stock),
        images: formData.images.filter(Boolean),
        description: formData.description,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        isFeatured: formData.isFeatured,
        isBestseller: formData.isBestseller,
        status: formData.status,
      };

      if (editingProduct) {
        payload.id = editingProduct.id;
        const res = await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update product');
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to create product');
      }

      setIsModalOpen(false);
      await fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleArchive = async (p: Product) => {
    const newStatus = p.status === 'archived' ? 'published' : 'archived';
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, status: newStatus }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product? (If it has customer orders, archiving is recommended instead).')) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCat =
      selectedCategory === 'All' ||
      p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
      p.category?.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Product Catalog & Gallery</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your fashion catalog, multi-image product galleries, pricing, and stock levels.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            title="Refresh Catalog"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs transition shadow-md"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by title, tag, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-zinc-400 shrink-0" />
          <span className="text-xs text-zinc-400 shrink-0">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span className="text-xs text-zinc-400 ml-2">
            Showing {filteredProducts.length} of {products.length}
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-zinc-400 border-b border-zinc-800 bg-zinc-950/60">
              <tr>
                <th className="py-3.5 px-4">Item & Images</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Price</th>
                <th className="py-3.5 px-3">Stock & Status</th>
                <th className="py-3.5 px-3">Tags & Badges</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-400 mb-2" />
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-400">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const stockColor =
                    (p.stock ?? 0) <= 0
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : (p.stock ?? 0) < 15
                      ? 'bg-amber-400/10 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

                  const isArchived = p.status === 'archived';

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-zinc-800/30 transition group ${
                        isArchived ? 'opacity-60 bg-zinc-950/40' : ''
                      }`}
                    >
                      {/* Item Thumbnail & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 relative rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700/50">
                            <Image
                              src={p.images?.[0] || '/images/collections/cat_boots.webp'}
                              alt={p.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                            {p.images && p.images.length > 1 && (
                              <span className="absolute bottom-0 right-0 bg-black/80 text-[9px] text-zinc-200 px-1 font-mono">
                                +{p.images.length - 1}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p className="font-semibold text-white truncate group-hover:text-amber-400 transition">
                              {p.title}
                            </p>
                            <p className="text-[10px] text-zinc-400 font-mono">
                              /{p.slug || p.handle}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 text-zinc-300 font-medium">
                        {p.category || 'Footwear'}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-3">
                        <p className="font-bold text-white">₹{p.price.toLocaleString('en-IN')}</p>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <p className="text-[10px] text-zinc-400 line-through">
                            ₹{p.originalPrice.toLocaleString('en-IN')}
                            <span className="text-amber-400 ml-1 no-underline font-semibold">
                              ({p.discountPercent || Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% off)
                            </span>
                          </p>
                        )}
                      </td>

                      {/* Stock & Status */}
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${stockColor}`}>
                            {p.stock ?? 0} in stock
                          </span>
                          <div>
                            <span className={`inline-block text-[9px] uppercase font-bold tracking-wider ${
                              isArchived ? 'text-zinc-500' : 'text-emerald-400'
                            }`}>
                              {isArchived ? 'Archived (Hidden)' : 'Published'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Tags & Badges */}
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {p.isFeatured && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-500/30">
                              <Star className="w-2.5 h-2.5" /> Featured
                            </span>
                          )}
                          {p.isBestseller && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              <Flame className="w-2.5 h-2.5" /> Hot
                            </span>
                          )}
                          {p.tags?.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 rounded text-[9px] bg-zinc-800 text-zinc-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/products/${p.slug || p.handle}`}
                            target="_blank"
                            title="Preview on Live Store"
                            className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => openEditModal(p)}
                            title="Edit Product & Images"
                            className="p-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleArchive(p)}
                            title={isArchived ? 'Unarchive (Publish)' : 'Archive Product'}
                            className={`p-1.5 rounded-lg transition ${
                              isArchived
                                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={deletingId === p.id}
                            onClick={() => handleDelete(p.id)}
                            title="Delete Product"
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal with Multi-Image Management */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h2 className="text-lg font-bold text-white">
                {editingProduct ? 'Edit Product & Gallery' : 'Add New Fashion Item'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-5 text-xs">
              {/* Product Title */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Chunky Lug-Sole Platform Ankle Boots"
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              {/* Category, Status & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-400 text-xs"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-400 text-xs"
                  >
                    <option value="published">Published (Visible on site)</option>
                    <option value="draft">Draft (Admin only)</option>
                    <option value="archived">Archived (Hidden from catalog)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Inventory Stock Units *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Math.max(0, Number(e.target.value)) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Math.max(1, Number(e.target.value)) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Original / MRP Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, originalPrice: Math.max(1, Number(e.target.value)) })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>
              </div>

              {/* MULTI-IMAGE MANAGEMENT SECTION */}
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white text-xs">
                      Product Image Gallery ({formData.images.length} photos)
                    </span>
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition border border-zinc-700">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>{uploadingFiles ? 'Uploading...' : 'Upload Photos'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadingFiles}
                    />
                  </label>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {formData.images.map((img, idx) => {
                    const isPrimary = idx === 0;
                    return (
                      <div
                        key={idx}
                        className={`relative rounded-xl border p-2 flex flex-col justify-between transition ${
                          isPrimary
                            ? 'bg-amber-400/5 border-amber-500/40 shadow-sm'
                            : 'bg-zinc-900 border-zinc-800'
                        }`}
                      >
                        <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-zinc-950 mb-2 border border-zinc-800">
                          <Image
                            src={img}
                            alt={`Product preview ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="120px"
                          />
                          {isPrimary && (
                            <span className="absolute top-1.5 left-1.5 bg-amber-400 text-zinc-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow">
                              Primary
                            </span>
                          )}
                        </div>

                        {/* Control buttons */}
                        <div className="flex items-center justify-between gap-1 pt-1 border-t border-zinc-800/80">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveImage(idx, 'left')}
                              className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30"
                              title="Move Left"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === formData.images.length - 1}
                              onClick={() => handleMoveImage(idx, 'right')}
                              className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-30"
                              title="Move Right"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            {!isPrimary && (
                              <button
                                type="button"
                                onClick={() => handleMakePrimary(idx)}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-amber-400/10 text-amber-300 hover:bg-amber-400/20"
                                title="Set as primary"
                              >
                                Set Main
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Image by URL */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Or paste an image URL (e.g. /images/collections/cat_boots.webp)..."
                    className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the silhouette, fabric, styling tip, and fit..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="boots, luxury, partywear, trending"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              {/* Flags */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({ ...formData, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-950 border-zinc-700"
                  />
                  <span className="text-zinc-200">Show in Featured Showcase</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) =>
                      setFormData({ ...formData, isBestseller: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 bg-zinc-950 border-zinc-700"
                  />
                  <span className="text-zinc-200">Mark as Hot Bestseller</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold transition disabled:opacity-50 shadow-md"
                >
                  {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
