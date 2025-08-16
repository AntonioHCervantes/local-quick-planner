'use client';

import Link from 'next/link';
import { useI18n } from '../../lib/i18n';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-[hsl(var(--surface-2))] py-4">
      <nav className="mx-auto flex flex-wrap justify-center gap-4 px-4 text-sm text-[hsl(var(--text-muted))]">
        <Link
          href="/about"
          className="hover:underline"
        >
          {t('footer.about')}
        </Link>
        <Link
          href="https://github.com/AntonioHCervantes/local-quick-planner"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {t('footer.openSource')}
        </Link>
        <Link
          href="/faqs"
          className="hover:underline"
        >
          {t('footer.faqs')}
        </Link>
        <Link
          href="/privacy"
          className="hover:underline"
        >
          {t('footer.privacy')}
        </Link>
        <Link
          href="/terms"
          className="hover:underline"
        >
          {t('footer.terms')}
        </Link>
      </nav>
    </footer>
  );
}
