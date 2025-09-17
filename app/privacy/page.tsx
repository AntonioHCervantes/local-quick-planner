'use client';

import Link from 'next/link';
import { useI18n } from '../../lib/i18n';

export default function PrivacyPage() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-16">
      <h1 className="text-2xl font-bold">{t('privacyPage.title')}</h1>
      <p>{t('privacyPage.intro')}</p>
      <h2 className="text-xl font-semibold">
        {t('privacyPage.localData.title')}
      </h2>
      <p>{t('privacyPage.localData.description')}</p>
      <h2 className="text-xl font-semibold">
        {t('privacyPage.analytics.title')}
      </h2>
      <p>{t('privacyPage.analytics.description')}</p>
      <h2 className="text-xl font-semibold">
        {t('privacyPage.contact.title')}
      </h2>
      <p>
        {t('privacyPage.contact.description')}{' '}
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
