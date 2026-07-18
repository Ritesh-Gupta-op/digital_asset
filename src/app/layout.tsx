import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LiquidCursor } from '@/components/LiquidCursor';

export const metadata: Metadata = {
  title: 'LicenseCraft',
  description: 'Your one-click digital license generator for NFTs, contracts, and tokens.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <ThemeProvider>
          <QueryProvider>
            <LiquidCursor />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
