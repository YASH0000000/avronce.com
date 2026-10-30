import type { Metadata } from 'next';
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
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

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AVRONCE | Architectural Ready-to-Wear Atelier',
  description: 'Official digital flagship of avronce.com. Permanent clothing collections engineered from Japanese selvedge denim, Italian virgin wool, and 480 GSM organic cotton.',
  keywords: ['avronce', 'avronce.com', 'luxury clothing', 'selvedge denim', 'minimalist fashion', 'atelier clothing India'],
  openGraph: {
    title: 'AVRONCE | Architectural Ready-to-Wear Atelier',
    description: 'Permanent luxury garments. Designed without compromise.',
    url: 'https://avronce.com',
    siteName: 'AVRONCE',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'AVRONCE Autumn Winter Campaign',
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
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} dark antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-white selection:text-zinc-950 font-sans">
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
