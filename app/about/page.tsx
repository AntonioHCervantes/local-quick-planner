'use client';

import Link from 'next/link';
import { useI18n } from '../../lib/i18n';

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-16">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold">{t('aboutPage.title')}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('aboutPage.intro')}
        </p>
      </header>
      <section className="space-y-4">
        <ul className="list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-200">
          <li>{t('aboutPage.features.freeOpenSource')}</li>
          <li>{t('aboutPage.features.privacy')}</li>
          <li>{t('aboutPage.features.fast')}</li>
          <li>{t('aboutPage.features.personal')}</li>
          <li>{t('aboutPage.features.export')}</li>
          <li>{t('aboutPage.features.myTasks')}</li>
          <li>{t('aboutPage.features.myDay')}</li>
        </ul>
        <p className="text-gray-700 dark:text-gray-200">
          {t('aboutPage.sourceCode')}{' '}
          <a
            href="https://github.com/AntonioHCervantes/checkplanner"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
          >
            GitHub
          </a>
          .
        </p>
        <p className="text-gray-700 dark:text-gray-200">
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
      </section>
    </main>
  );
}
