'use client';

import Link from 'next/link';
import Accordion from '../../components/Accordion/Accordion';
import { useI18n } from '../../lib/i18n';

export default function FAQsPage() {
  const { t } = useI18n();
  const faqs = [
    { question: t('faqs.q1.question'), answer: t('faqs.q1.answer') },
    { question: t('faqs.q2.question'), answer: t('faqs.q2.answer') },
    { question: t('faqs.q3.question'), answer: t('faqs.q3.answer') },
    { question: t('faqs.q4.question'), answer: t('faqs.q4.answer') },
    { question: t('faqs.q5.question'), answer: t('faqs.q5.answer') },
    { question: t('faqs.q6.question'), answer: t('faqs.q6.answer') },
    { question: t('faqs.q7.question'), answer: t('faqs.q7.answer') },
    { question: t('faqs.q8.question'), answer: t('faqs.q8.answer') },
    { question: t('faqs.q9.question'), answer: t('faqs.q9.answer') },
  ];

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-16">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold">{t('faqs.title')}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('faqs.intro')}
        </p>
      </header>
      <section className="space-y-6">
        <Accordion items={faqs} />
        <div className="space-y-2 text-gray-700 dark:text-gray-200">
          <h2 className="text-xl font-semibold">{t('faqs.supportTitle')}</h2>
          <p>
            {t('faqs.support')}{' '}
            <Link
              href="https://github.com/AntonioHCervantes/checkplanner/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              {t('faqs.supportLink')}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
