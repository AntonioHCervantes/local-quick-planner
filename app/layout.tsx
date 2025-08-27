import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { I18nProvider } from '../lib/i18n';
import WelcomeModal from '../components/WelcomeModal/WelcomeModal';
import ServiceWorker from '../components/ServiceWorker';

export const metadata: Metadata = {
  title: 'Local Quick Planner',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
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
          <WelcomeModal />
          <ServiceWorker />
        </I18nProvider>
      </body>
    </html>
  );
}
