import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'AVRONCE | Modern Everyday Luxury & Trendsetter Fashion',
  description: 'Official digital flagship of AVRONCE (avronce.com). Shop viral chunky boots, statement party dresses, Mary Janes, and contemporary aesthetic apparel. Free shipping above ₹999 & COD available.',
  keywords: ['avronce', 'avronce.com', 'avronce boots', 'chunky boots india', 'party dresses', 'luxury fashion india', 'trendsetter apparel'],
  openGraph: {
    title: 'AVRONCE | Modern Everyday Luxury & Trendsetter Fashion',
    description: 'Shop viral chunky boots, romantic party dresses, and aesthetic street fashion.',
    url: 'https://avronce.com',
    siteName: 'AVRONCE',
    images: [
      {
        url: '/images/avronce-logo.png',
        width: 743,
        height: 198,
        alt: 'AVRONCE Official Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-yellow-400 selection:text-zinc-950 font-sans">
        <CartProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
