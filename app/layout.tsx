'use client';
import './globals.css';
import type { ReactNode } from 'react';
import Header from '../components/Header';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100 min-h-screen">
        <Header />
        {children}
      </body>
    </html>
  );
}
