import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import React from 'react';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata = {
  title: 'Peacock Blouse House | Cinematic Couture',
  description:
    'Hand-embroidered couture blouses, crafted one thread at a time in the ateliers of southern India. Explore our luxurious, scroll-animated digital experience.',
  keywords: ['Peacock Blouse House', 'Couture Blouses', 'Hand-embroidery', 'Luxury Fashion', 'Atelier'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
