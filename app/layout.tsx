import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { I18nProvider } from '../lib/i18n';
import WelcomeModal from '../components/WelcomeModal/WelcomeModal';
import ServiceWorker from '../components/ServiceWorker';
import TaskTimerManager from '../components/TaskTimerManager/TaskTimerManager';
import WorkScheduleManager from '../components/WorkScheduleManager/WorkScheduleManager';
import RecurringTaskManager from '../components/RecurringTaskManager/RecurringTaskManager';

const description =
  'CheckPlanner is a free, fast, private, and open source task manager that boosts your productivity and personal organization at work.';

export const metadata: Metadata = {
  title: 'CheckPlanner',
  description,
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
  },
  openGraph: {
    title: 'CheckPlanner',
    description,
    siteName: 'CheckPlanner',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'CheckPlanner logo',
      },
    ],
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
          <Toaster
            position="top-center"
            gutter={16}
            containerStyle={{ top: '4.5rem' }}
            toastOptions={{
              duration: 5000,
              className:
                'text-lg leading-relaxed px-6 py-4 rounded-xl shadow-lg border border-slate-200/70 bg-white text-slate-900 dark:border-slate-700/70 dark:bg-slate-900 dark:text-slate-100 lg:text-xl lg:leading-loose lg:px-8 lg:py-5 xl:text-2xl xl:leading-relaxed xl:px-10 xl:py-6',
            }}
          />
          <TaskTimerManager />
          <WorkScheduleManager />
          <RecurringTaskManager />
          <WelcomeModal />
          <ServiceWorker />
        </I18nProvider>
      </body>
    </html>
  );
}
