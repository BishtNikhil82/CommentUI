import React, { useEffect } from 'react';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import ServiceWorkerRegister from '../components/ServiceWorkerRegister';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YouTube Analytics - Discover Content Insights',
  description: 'Analyze YouTube content and discover insights with our powerful analytics tool',
  keywords: 'YouTube, analytics, content analysis, video insights',
  authors: [{ name: 'YouTube Analytics Team' }],
}

export const viewport = 'width=device-width, initial-scale=1';

console.log('LAYOUT: file loaded');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log('LAYOUT: RootLayout render');
  return (
    <html lang="en">
      <body className={inter.className}>
        <ServiceWorkerRegister />
        <Theme appearance="dark">
          {children}
        </Theme>
      </body>
    </html>
  );
}