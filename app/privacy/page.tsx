'use client';

import Link from 'next/link';
import { useI18n } from '../../lib/i18n';

export default function PrivacyPage() {
  const { t } = useI18n();

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-16">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold">{t('privacyPage.title')}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('privacyPage.intro')}
        </p>
      </header>
      <section className="space-y-6 text-gray-700 dark:text-gray-200">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            {t('privacyPage.localData.title')}
          </h2>
          <p>{t('privacyPage.localData.description')}</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            {t('privacyPage.analytics.title')}
          </h2>
          <p>{t('privacyPage.analytics.description')}</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">
            {t('privacyPage.contact.title')}
          </h2>
          <p>
            {t('privacyPage.contact.description')}{' '}
            <Link
              href="https://github.com/AntonioHCervantes/checkplanner/issues"
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
