'use client';
import './globals.css';
import type { ReactNode } from 'react';
import Header from '../components/Header';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 text-gray-100">
        <Header />
        {children}
      </body>
    </html>
  );
}
