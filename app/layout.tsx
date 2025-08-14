'use client';
import './globals.css';
import type { ReactNode } from 'react';
import Header from '../components/Header/Header';
import { I18nProvider } from '../lib/i18n';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <I18nProvider>
          <Header />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
