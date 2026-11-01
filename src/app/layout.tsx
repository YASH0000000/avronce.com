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
  title: 'LITTLEBOX INDIA | Fast Fashion, Chunky Boots, Y2K Apparel & Party Dresses',
  description: 'Shop viral chunky boots, platforms, romantic party dresses, Mary Janes, corset tops, and aesthetic street fashion made for Gen Z. Free shipping above ₹999 & COD available.',
  keywords: ['littlebox', 'littlebox india', 'littlebox boots', 'chunky boots', 'party dresses', 'y2k fashion', 'mary janes', 'fast fashion india'],
  openGraph: {
    title: 'LITTLEBOX INDIA | Fast Fashion for Trendsetters',
    description: 'Shop viral chunky boots, romantic party dresses, and aesthetic street fashion.',
    url: 'https://littleboxindia.com',
    siteName: 'LITTLEBOX INDIA',
    images: [
      {
        url: '/images/collections/cat_boots.webp',
        width: 1200,
        height: 630,
        alt: 'LITTLEBOX Signature Boots & Footwear',
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
      <body className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-yellow-400 selection:text-zinc-950 font-sans">
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
