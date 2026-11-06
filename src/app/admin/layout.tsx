'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  ShoppingCart,
  Users,
  Boxes,
  Ticket,
  Sliders,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Lock,
  Unlock,
  KeyRound,
  LogOut,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import Logo from '@/components/brand/Logo';

const NAV_DEFINITIONS = [
  { name: 'Dashboard', path: '', icon: LayoutDashboard },
  { name: 'Products', path: '/products', icon: ShoppingBag },
  { name: 'Categories', path: '/categories', icon: Layers },
  { name: 'Orders', path: '/orders', icon: ShoppingCart },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Inventory', path: '/inventory', icon: Boxes },
  { name: 'Coupons & Offers', path: '/coupons', icon: Ticket },
  { name: 'CMS & Banners', path: '/cms', icon: Sliders },
  { name: 'Media Library', path: '/media', icon: ImageIcon },
  { name: 'Store Settings', path: '/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Determine active basePath (/admin-avronce or /admin)
  const basePath = pathname.startsWith('/admin-avronce') ? '/admin-avronce' : '/admin';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authentication State
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUsername, setAdminUsername] = useState('admin@avronce.com');
  const [customPath, setCustomPath] = useState('admin-avronce');

  // Login Gate form state
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const checkAuth = async () => {
    try {
      setAuthLoading(true);
      const res = await fetch('/api/admin/auth/check');
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        if (data.username) setAdminUsername(data.username);
        if (data.customPath) setCustomPath(data.customPath);
      } else {
        setIsAuthenticated(false);
        if (data.customPath) setCustomPath(data.customPath);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput) return;

    try {
      setLoggingIn(true);
      setLoginError('');
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPasswordInput('');
        if (data.username) setAdminUsername(data.username);
      } else {
        setLoginError(data.error || 'Invalid administrator password');
      }
    } catch {
      setLoginError('Network error logging in. Please retry.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch {}
    setIsAuthenticated(false);
  };

  // 1. Initial Checking Screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-xs text-zinc-400 tracking-wider font-mono uppercase">
            Verifying AVRONCE Security Clearance...
          </p>
        </div>
      </div>
    );
  }

  // 2. Login Gate if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 antialiased selection:bg-amber-400 selection:text-black">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle gold top border highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600" />

          {/* Logo & Header */}
          <div className="text-center space-y-3 pb-6 border-b border-zinc-800/80">
            <div className="flex justify-center">
              <Logo size="lg" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] tracking-widest font-bold bg-amber-400/10 text-amber-400 border border-amber-500/20 uppercase">
              <Lock className="w-3 h-3" /> Command Center Gate
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Master Admin Authentication
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Restricted area for authorized AVRONCE store managers. Enter your master administrator credentials.
            </p>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Master Administrator Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter administrator password..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs pr-10 focus:outline-none focus:border-amber-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1">
                Default password: <span className="font-mono text-amber-400">admin</span> (can be changed in Store Settings).
              </p>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition shadow-lg hover:shadow-amber-500/20 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              {loggingIn ? 'Authenticating...' : 'Unlock Admin Portal'}
            </button>
          </form>

          {/* Return link */}
          <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1 transition"
            >
              <span>← Return to Public Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Dashboard Layout
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased selection:bg-amber-400 selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href={basePath} className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] tracking-widest font-bold bg-amber-400/10 text-amber-400 border border-amber-500/30 uppercase">
              <ShieldCheck className="w-3 h-3" /> Admin Portal
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Admin URL Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-400">Route:</span>
            <span className="text-amber-400 font-bold">/{customPath}</span>
          </div>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition border border-zinc-700 hover:border-zinc-600"
          >
            <span>View Live Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </Link>

          {/* Admin User / Logout Button */}
          <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-zinc-950 flex items-center justify-center font-bold text-xs shadow-md">
              A
            </div>
            <div className="hidden lg:block text-left text-xs">
              <p className="font-semibold text-zinc-200 leading-tight truncate max-w-[120px]">
                {adminUsername}
              </p>
              <p className="text-[10px] text-amber-400 leading-tight">Master Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition ml-1"
              title="Lock Admin Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800 shrink-0">
          <div className="p-4 flex-1 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-semibold tracking-wider uppercase text-zinc-400">
              Management
            </div>
            {NAV_DEFINITIONS.map((item) => {
              const Icon = item.icon;
              const itemHref = `${basePath}${item.path}`;
              const isActive =
                item.path === ''
                  ? pathname === basePath || pathname === '/admin' || pathname === '/admin-avronce'
                  : pathname === itemHref || pathname === `/admin${item.path}` || pathname === `/admin-avronce${item.path}`;

              return (
                <Link
                  key={item.name}
                  href={itemHref}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-400 text-zinc-950 shadow-md font-bold'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-950' : 'text-zinc-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-zinc-950" />}
                </Link>
              );
            })}
          </div>

          {/* Quick System Badge */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
              <p className="font-semibold text-zinc-200">Avronce Atelier Engine</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Live Razorpay & DB Sync</p>
              <div className="mt-2 text-[10px] text-amber-400 font-mono">
                /{customPath}
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden flex"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="w-72 bg-zinc-900 h-full p-4 flex flex-col border-r border-zinc-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-1 flex-1 overflow-y-auto">
                {NAV_DEFINITIONS.map((item) => {
                  const Icon = item.icon;
                  const itemHref = `${basePath}${item.path}`;
                  const isActive =
                    item.path === ''
                      ? pathname === basePath || pathname === '/admin' || pathname === '/admin-avronce'
                      : pathname === itemHref || pathname === `/admin${item.path}` || pathname === `/admin-avronce${item.path}`;

                  return (
                    <Link
                      key={item.name}
                      href={itemHref}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                        isActive
                          ? 'bg-amber-400 text-zinc-950 font-bold'
                          : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-zinc-800 space-y-2">
                <button
                  onClick={handleLogout}
                  className="w-full py-2 rounded-xl bg-zinc-800 text-xs font-semibold text-rose-400 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Lock Admin Session
                </button>
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Live Storefront
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-950">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
