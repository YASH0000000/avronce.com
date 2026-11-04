'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Sliders,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Eye,
  Megaphone,
  Layout,
  ExternalLink,
} from 'lucide-react';

interface HeroSlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  offer: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
}

interface CmsData {
  announcements: string[];
  heroSlides: HeroSlide[];
}

export default function AdminCmsPage() {
  const [cms, setCms] = useState<CmsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState('');

  const fetchCms = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/cms');
      const data = await res.json();
      if (data.success) {
        setCms(data.cms);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCms();
  }, []);

  const handleSaveCms = async () => {
    if (!cms) return;
    try {
      setSaving(true);
      const res = await fetch('/api/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cms),
      });
      if (res.ok) {
        alert('Storefront CMS configuration saved successfully!');
      } else {
        alert('Failed to save CMS configuration');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Announcement Handlers
  const addAnnouncement = () => {
    if (!newAnnouncement.trim() || !cms) return;
    setCms({
      ...cms,
      announcements: [...cms.announcements, newAnnouncement.trim()],
    });
    setNewAnnouncement('');
  };

  const removeAnnouncement = (index: number) => {
    if (!cms) return;
    setCms({
      ...cms,
      announcements: cms.announcements.filter((_, i) => i !== index),
    });
  };

  const updateAnnouncement = (index: number, val: string) => {
    if (!cms) return;
    const updated = [...cms.announcements];
    updated[index] = val;
    setCms({ ...cms, announcements: updated });
  };

  // Hero Slide Handlers
  const updateSlide = (index: number, field: keyof HeroSlide, val: any) => {
    if (!cms) return;
    const updated = [...cms.heroSlides];
    updated[index] = { ...updated[index], [field]: val };
    setCms({ ...cms, heroSlides: updated });
  };

  const addSlide = () => {
    if (!cms) return;
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      tag: 'NEW COLLECTION',
      title: 'SEASON LUXURY EDIT',
      subtitle: 'Elevated silhouette design for everyday wear.',
      offer: 'FLAT 15% OFF WITH CODE: AVR15',
      image: '/images/hero_mood_boots.webp',
      ctaText: 'SHOP COLLECTION',
      ctaLink: '/collections/all',
      active: true,
    };
    setCms({ ...cms, heroSlides: [...cms.heroSlides, newSlide] });
  };

  const removeSlide = (index: number) => {
    if (!cms) return;
    setCms({
      ...cms,
      heroSlides: cms.heroSlides.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">CMS & Banners</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Customize homepage announcement tickers, hero carousel slides, and promotional banners in real time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCms}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleSaveCms}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs transition shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Publishing...' : 'Save & Publish Live'}
          </button>
        </div>
      </div>

      {loading || !cms ? (
        <div className="py-20 text-center text-zinc-400 bg-zinc-900 rounded-2xl border border-zinc-800">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
          Loading CMS configurations...
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section 1: Top Announcement Bar Lines */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className="text-base font-bold text-white">Announcement Ticker Lines</h2>
                <p className="text-xs text-zinc-400">
                  These rotate horizontally at the very top of the storefront header.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {cms.announcements.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 text-center text-zinc-400 text-xs font-mono">
                    #{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateAnnouncement(idx, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => removeAnnouncement(idx)}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex gap-2">
              <input
                type="text"
                placeholder="Type a new announcement message (e.g. FLASH SALE: 20% OFF TODAY ONLY)..."
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addAnnouncement()}
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder-zinc-400 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={addAnnouncement}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Line
              </button>
            </div>
          </div>

          {/* Section 2: Hero Carousel Slides */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-sky-400" />
                <div>
                  <h2 className="text-base font-bold text-white">Homepage Hero Slides</h2>
                  <p className="text-xs text-zinc-400">
                    High-impact visual banners with headline text, offers, and direct action links.
                  </p>
                </div>
              </div>
              <button
                onClick={addSlide}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
              >
                <Plus className="w-4 h-4" /> Add Slide
              </button>
            </div>

            <div className="space-y-6">
              {cms.heroSlides.map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs">
                      Slide {idx + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={slide.active}
                          onChange={(e) => updateSlide(idx, 'active', e.target.checked)}
                          className="w-4 h-4 rounded text-amber-500 bg-zinc-900 border-zinc-700"
                        />
                        <span className="text-zinc-300">Active</span>
                      </label>
                      {cms.heroSlides.length > 1 && (
                        <button
                          onClick={() => removeSlide(idx)}
                          className="p-1 rounded-lg text-zinc-400 hover:text-rose-400"
                          title="Remove Slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Image Preview & URL */}
                    <div>
                      <div className="relative h-36 w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 mb-2">
                        <Image
                          src={slide.image || '/images/hero_mood_boots.webp'}
                          alt={slide.title}
                          fill
                          className="object-cover"
                          sizes="300px"
                        />
                      </div>
                      <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                        Slide Image URL
                      </label>
                      <input
                        type="text"
                        value={slide.image}
                        onChange={(e) => updateSlide(idx, 'image', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Headlines & Tags */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                          Eyebrow Tag
                        </label>
                        <input
                          type="text"
                          value={slide.tag}
                          onChange={(e) => updateSlide(idx, 'tag', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                          Main Headline
                        </label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => updateSlide(idx, 'title', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={slide.subtitle}
                          onChange={(e) => updateSlide(idx, 'subtitle', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Offers & CTA */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                          Offer Pill Text
                        </label>
                        <input
                          type="text"
                          value={slide.offer}
                          onChange={(e) => updateSlide(idx, 'offer', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                            CTA Button Text
                          </label>
                          <input
                            type="text"
                            value={slide.ctaText}
                            onChange={(e) => updateSlide(idx, 'ctaText', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-zinc-400 font-semibold mb-1">
                            Button Link
                          </label>
                          <input
                            type="text"
                            value={slide.ctaLink}
                            onChange={(e) => updateSlide(idx, 'ctaLink', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
