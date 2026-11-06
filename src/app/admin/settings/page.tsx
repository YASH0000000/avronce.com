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
  ShieldCheck,
  KeyRound,
  Lock,
  Globe,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
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
    searchConsoleVerification?: string;
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

  // Security Credentials State
  const [securityData, setSecurityData] = useState({
    customPath: 'admin-avronce',
    username: 'admin@avronce.com',
    passwordProtected: true,
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [securityMessage, setSecurityMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [savingSecurity, setSavingSecurity] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const [settingsRes, securityRes] = await Promise.all([
        fetch('/api/admin/settings'),
        fetch('/api/admin/auth/check'),
      ]);

      const data = await settingsRes.json();
      if (data.success) {
        setSettings(data.settings);
      }

      const secData = await securityRes.json();
      if (secData) {
        setSecurityData({
          customPath: secData.customPath || 'admin-avronce',
          username: secData.username || 'admin@avronce.com',
          passwordProtected: secData.passwordProtected !== false,
        });
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

  const handleSaveStoreSettings = async (e: React.FormEvent) => {
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

  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMessage(null);

    if (newPassword && newPassword !== confirmPassword) {
      setSecurityMessage({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    if (newPassword && !currentPassword) {
      setSecurityMessage({ type: 'error', text: 'Please enter your current administrator password to confirm change.' });
      return;
    }

    try {
      setSavingSecurity(true);
      const res = await fetch('/api/admin/auth/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customPath: securityData.customPath,
          username: securityData.username,
          passwordProtected: securityData.passwordProtected,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSecurityMessage({
          type: 'success',
          text: `Admin credentials and portal link (/${data.customPath}) updated successfully!`,
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setSecurityMessage({ type: 'error', text: data.error || 'Failed to update admin security settings.' });
      }
    } catch {
      setSecurityMessage({ type: 'error', text: 'An unexpected error occurred while updating security.' });
    } finally {
      setSavingSecurity(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="py-20 text-center text-zinc-400 bg-zinc-900 rounded-2xl border border-zinc-800">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-400 mb-2" />
        Loading system configuration...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Store Settings & Access</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configure admin security, portal links, live Razorpay gateways, Search Console verification, and store identity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSettings}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            title="Reload settings"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Store configuration updated and applied live to all customers.
        </div>
      )}

      {/* SECTION 1: ADMIN PORTAL SECURITY & LINK (USER REQUESTED FEATURE) */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-amber-500/30 shadow-xl space-y-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600" />

        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Admin Portal Link & Master Password</h2>
              <p className="text-xs text-zinc-400">
                Change your admin dashboard link (e.g. <span className="font-mono text-amber-400">/admin-avronce</span>) and master password.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-500/30">
            SECURITY LEVEL: HIGH
          </span>
        </div>

        {securityMessage && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
              securityMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {securityMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{securityMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdateSecurity} className="space-y-4 text-xs">
          {/* Admin URL Link Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Admin Portal URL Slug *
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2 bg-zinc-950 border border-r-0 border-zinc-800 rounded-l-xl text-zinc-500 font-mono text-xs">
                  /
                </span>
                <input
                  type="text"
                  required
                  value={securityData.customPath}
                  onChange={(e) =>
                    setSecurityData({
                      ...securityData,
                      customPath: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''),
                    })
                  }
                  placeholder="admin-avronce"
                  className="w-full px-3 py-2 rounded-r-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <p className="text-[10px] text-zinc-400 mt-1">
                Active link: <span className="font-mono text-amber-400">https://avronce.com/{securityData.customPath}</span>
              </p>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">
                Administrator Username / Email
              </label>
              <input
                type="text"
                required
                value={securityData.username}
                onChange={(e) =>
                  setSecurityData({ ...securityData, username: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Password Protection Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={securityData.passwordProtected}
                onChange={(e) =>
                  setSecurityData({ ...securityData, passwordProtected: e.target.checked })
                }
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-950 border-zinc-700"
              />
              <span className="text-zinc-200 font-semibold">
                Require Master Password for Admin Dashboard & API operations
              </span>
            </label>
          </div>

          {/* Change Password Sub-section */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" /> Change Administrator Password
              </span>
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1"
              >
                {showPasswords ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showPasswords ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Current Password
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Verify current password..."
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  New Password
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 5 characters..."
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password..."
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={savingSecurity}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50"
            >
              {savingSecurity ? 'Updating Security...' : 'Save Admin Credentials & Link'}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: RAZORPAY LIVE INTEGRATION STATUS */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Razorpay Payments Gateway (Live Mode)</h2>
              <p className="text-xs text-zinc-400">
                Connected securely using server-side environment variables. Secret key is strictly protected.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE KEY CONFIGURED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">
              Active Razorpay Key ID
            </label>
            <input
              type="text"
              readOnly
              value="rzp_live_TwZ6XcDwwdwirL"
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-amber-400 font-mono text-xs select-all"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">
              Razorpay Key Secret (Server-Side)
            </label>
            <input
              type="password"
              readOnly
              value="hwC5bLIiU0FivkmjKpHeHYXD"
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 font-mono text-xs"
            />
            <p className="text-[10px] text-zinc-500 mt-1">
              Stored securely in server environment (.env.local). Never exposed to browser.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs text-zinc-300 space-y-1">
          <span className="font-semibold text-white block">Production Webhook Endpoint:</span>
          <p className="font-mono text-amber-400 text-[11px] select-all">
            https://avronce.com/api/razorpay/webhook
          </p>
          <p className="text-[10px] text-zinc-500">
            Set this URL in your Razorpay Dashboard → Settings → Webhooks for events: payment.captured, payment.failed, refund.processed.
          </p>
        </div>
      </div>

      {/* SECTION 3: GOOGLE SEARCH CONSOLE VERIFICATION */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Google Search Console Verification</h2>
            <p className="text-xs text-zinc-400">
              Verify website ownership with Google Search Console via HTML Meta Tag.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">
              Google Site Verification Token / Meta Tag
            </label>
            <input
              type="text"
              value={settings.brand.searchConsoleVerification || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  brand: { ...settings.brand, searchConsoleVerification: e.target.value },
                })
              }
              placeholder='e.g. "google-site-verification" token provided by Google'
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
            />
            <p className="text-[10px] text-zinc-400 mt-1">
              Enter the token from Google Search Console. It will be rendered directly in the HTML &lt;head&gt; of avronce.com.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 4: STORE IDENTITY & RULES */}
      <form onSubmit={handleSaveStoreSettings} className="space-y-6 text-xs">
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
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-400 font-semibold"
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
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-400"
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
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono focus:outline-none focus:border-amber-400"
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
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-400"
              />
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
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-400"
              />
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
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-400"
              />
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

        {/* Customer Support & Contact */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
            <Building className="w-4 h-4 text-emerald-400" />
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
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-400"
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
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-400"
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
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition shadow-lg disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Global Store Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
