'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Settings,
  Save,
  RefreshCw,
  Building,
  Truck,
  CreditCard,
  Share2,
  CheckCircle,
} from 'lucide-react';

interface StoreSettings {
  brand: {
    name: string;
    tagline: string;
    logo: string;
    contact: {
      email: string;
      phone: string;
      address: string;
    };
    social: {
      instagram: string;
      facebook: string;
    };
  };
  shippingSettings: {
    freeShippingThreshold: number;
    standardShippingFee: number;
    codAvailable: boolean;
    taxPercent: number;
  };
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      setSavedSuccess(false);
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        alert('Failed to save settings');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="py-20 text-center text-zinc-400 bg-zinc-900 rounded-2xl border border-zinc-800">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
        Loading system configuration...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Store Settings</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Global store identity, shipping thresholds, COD payment rules, and brand contact info.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSettings}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs transition shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Store configuration updated and applied live to all customers.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Brand Identity */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
            <Building className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Brand Identity & Official Logo</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Store Brand Name *
              </label>
              <input
                type="text"
                required
                value={settings.brand.name}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    brand: { ...settings.brand, name: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings.brand.tagline}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    brand: { ...settings.brand, tagline: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">
              Store Logo Path
            </label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={settings.brand.logo}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    brand: { ...settings.brand, logo: e.target.value },
                  })
                }
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono focus:outline-none focus:border-amber-500"
              />
              <div className="h-10 px-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                <Image
                  src={settings.brand.logo || '/images/avronce-logo.png'}
                  alt="Current Logo"
                  width={100}
                  height={28}
                  className="h-6 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Commerce Rules */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
            <Truck className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold text-white">Shipping & Fulfillment Rules</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                min="0"
                value={settings.shippingSettings.freeShippingThreshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shippingSettings: {
                      ...settings.shippingSettings,
                      freeShippingThreshold: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
              />
              <p className="text-[10px] text-zinc-400 mt-1">
                Carts above this amount unlock free shipping.
              </p>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                min="0"
                value={settings.shippingSettings.standardShippingFee}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shippingSettings: {
                      ...settings.shippingSettings,
                      standardShippingFee: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
              />
              <p className="text-[10px] text-zinc-400 mt-1">
                Charged when cart is below free shipping threshold.
              </p>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                GST / Sales Tax Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="28"
                value={settings.shippingSettings.taxPercent}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shippingSettings: {
                      ...settings.shippingSettings,
                      taxPercent: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
              />
              <p className="text-[10px] text-zinc-400 mt-1">
                Standard GST rate applied at checkout (currently 5%).
              </p>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.shippingSettings.codAvailable}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shippingSettings: {
                      ...settings.shippingSettings,
                      codAvailable: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-950 border-zinc-700"
              />
              <span className="text-zinc-200 font-semibold">
                Enable Cash on Delivery (COD) for Pan-India Orders
              </span>
            </label>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Customer Support & Headquarters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Customer Care Email
              </label>
              <input
                type="email"
                value={settings.brand.contact.email}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    brand: {
                      ...settings.brand,
                      contact: { ...settings.brand.contact, email: e.target.value },
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Helpline Phone
              </label>
              <input
                type="text"
                value={settings.brand.contact.phone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    brand: {
                      ...settings.brand,
                      contact: { ...settings.brand.contact, phone: e.target.value },
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">
              Registered Office Address
            </label>
            <textarea
              rows={2}
              value={settings.brand.contact.address}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  brand: {
                    ...settings.brand,
                    contact: { ...settings.brand.contact, address: e.target.value },
                  },
                })
              }
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
            <Share2 className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white">Social Media Channels</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Instagram Page Link
              </label>
              <input
                type="text"
                value={settings.brand.social.instagram}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    brand: {
                      ...settings.brand,
                      social: { ...settings.brand.social, instagram: e.target.value },
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Facebook Page Link
              </label>
              <input
                type="text"
                value={settings.brand.social.facebook}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    brand: {
                      ...settings.brand,
                      social: { ...settings.brand.social, facebook: e.target.value },
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition shadow-lg disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
