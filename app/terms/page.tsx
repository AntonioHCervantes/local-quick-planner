'use client';

import Link from 'next/link';
import { useI18n } from '../../lib/i18n';

export default function TermsPage() {
  const { t } = useI18n();

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-16">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold">{t('termsPage.title')}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('termsPage.intro')}
        </p>
      </header>
      <section className="space-y-6 text-gray-700 dark:text-gray-200">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            {t('termsPage.usage.title')}
          </h2>
          <p>{t('termsPage.usage.description')}</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            {t('termsPage.privacy.title')}
          </h2>
          <p>
            {t('termsPage.privacy.description')}{' '}
            <Link
              href="/privacy"
              className="underline hover:no-underline"
            >
              {t('footer.privacy')}
            </Link>
            .
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            {t('termsPage.liability.title')}
          </h2>
          <p>{t('termsPage.liability.description')}</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            {t('termsPage.changes.title')}
          </h2>
          <p>{t('termsPage.changes.description')}</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            {t('termsPage.contact.title')}
          </h2>
          <p>
            {t('termsPage.contact.description')}{' '}
            <Link
              href="https://github.com/AntonioHCervantes/local-quick-planner/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              {t('faqs.supportLink')}
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
