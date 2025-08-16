'use client';

import Link from 'next/link';
import { useI18n } from '../../lib/i18n';

export default function FAQsPage() {
  const { t } = useI18n();
  const faqs = [
    { q: t('faqs.q1.question'), a: t('faqs.q1.answer') },
    { q: t('faqs.q2.question'), a: t('faqs.q2.answer') },
    { q: t('faqs.q3.question'), a: t('faqs.q3.answer') },
    { q: t('faqs.q4.question'), a: t('faqs.q4.answer') },
    { q: t('faqs.q5.question'), a: t('faqs.q5.answer') },
    { q: t('faqs.q6.question'), a: t('faqs.q6.answer') },
    { q: t('faqs.q7.question'), a: t('faqs.q7.answer') },
    { q: t('faqs.q8.question'), a: t('faqs.q8.answer') },
    { q: t('faqs.q9.question'), a: t('faqs.q9.answer') },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">{t('faqs.title')}</h1>
      {faqs.map((item, index) => (
        <div key={index}>
          <h2 className="font-semibold">{item.q}</h2>
          <p>{item.a}</p>
        </div>
      ))}
      <div>
        <h2 className="font-semibold">{t('faqs.supportTitle')}</h2>
        <p>
          {t('faqs.support')}{' '}
          <Link
            href="https://github.com/AntonioHCervantes/local-quick-planner/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {t('faqs.supportLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}
