'use client';

import Link from 'next/link';
import { useI18n } from '../../lib/i18n';

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <main className="mx-auto max-w-2xl space-y-4 px-4 py-16">
      <h1 className="text-2xl font-bold">{t('aboutPage.title')}</h1>
      <p>{t('aboutPage.intro')}</p>
      <ul className="list-disc space-y-1 pl-6">
        <li>{t('aboutPage.features.freeOpenSource')}</li>
        <li>{t('aboutPage.features.privacy')}</li>
        <li>{t('aboutPage.features.fast')}</li>
        <li>{t('aboutPage.features.personal')}</li>
        <li>{t('aboutPage.features.export')}</li>
        <li>{t('aboutPage.features.myTasks')}</li>
        <li>{t('aboutPage.features.myDay')}</li>
      </ul>
      <p>
        {t('aboutPage.sourceCode')}{' '}
        <a
          href="https://github.com/AntonioHCervantes/local-quick-planner"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:no-underline"
        >
          GitHub
        </a>
        .
      </p>
      <p>
        {t('aboutPage.learnMore')}{' '}
        <Link
          href="/faqs"
          className="underline hover:no-underline"
        >
          {t('footer.faqs')}
        </Link>
        ,{' '}
        <Link
          href="/privacy"
          className="underline hover:no-underline"
        >
          {t('footer.privacy')}
        </Link>{' '}
        {t('aboutPage.and')}{' '}
        <Link
          href="/terms"
          className="underline hover:no-underline"
        >
          {t('footer.terms')}
        </Link>
        .
      </p>
    </main>
  );
}
