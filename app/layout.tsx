import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { I18nProvider } from '../lib/i18n';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Local Quick Planner',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <I18nProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </I18nProvider>
      </body>
    </html>
  );
}
