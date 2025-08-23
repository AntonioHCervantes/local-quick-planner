'use client';

import Link from 'next/link';
import { useI18n } from '../../lib/i18n';

export default function TermsPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">{t('termsPage.title')}</h1>
      <p>{t('termsPage.intro')}</p>
      <h2 className="text-xl font-semibold">{t('termsPage.usage.title')}</h2>
      <p>{t('termsPage.usage.description')}</p>
      <h2 className="text-xl font-semibold">{t('termsPage.privacy.title')}</h2>
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
      <h2 className="text-xl font-semibold">
        {t('termsPage.liability.title')}
      </h2>
      <p>{t('termsPage.liability.description')}</p>
      <h2 className="text-xl font-semibold">{t('termsPage.changes.title')}</h2>
      <p>{t('termsPage.changes.description')}</p>
      <h2 className="text-xl font-semibold">{t('termsPage.contact.title')}</h2>
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
  );
}
