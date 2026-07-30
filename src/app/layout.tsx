import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';

export const metadata: Metadata = {
  title: 'LicenseCraft — Digital Asset Licensing OS on Stellar',
  description: 'Production-grade digital license registry for NFTs, smart contracts, and digital tokens. Built on Stellar Soroban.',
  openGraph: {
    title: 'LicenseCraft — Digital Asset Licensing OS',
    description: 'One-click digital license deployment for creators and businesses on Stellar Soroban.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Manrope:wght@200;400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black text-white antialiased selection:bg-[#ef233c] selection:text-white">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
