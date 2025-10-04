'use client';
import { Tag } from '../../lib/types';
import { useI18n } from '../../lib/i18n';
import { Star } from 'lucide-react';
import Link from '../Link/Link';

interface TagFilterProps {
  tags: Tag[];
  activeTags?: string[];
  toggleTag: (label: string) => void;
  showAll: () => void;
  removeTag: (label: string) => void;
  toggleFavorite: (label: string) => void;
}

export default function TagFilter({
  tags,
  activeTags = [],
  toggleTag,
  showAll,
  removeTag,
  toggleFavorite,
}: TagFilterProps) {
  const { t } = useI18n();
  if (tags.length === 0) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 px-4 pb-2">
      {tags.map(tag => {
        const isActive = activeTags.includes(tag.label);
        return (
          <div
            key={tag.id}
            className="relative inline-flex items-center rounded-full pr-1 py-1 text-xs text-white"
            style={{
              backgroundColor: tag.color,
              opacity: isActive ? 1 : 0.5,
            }}
          >
            <button
              type="button"
              onClick={() => toggleTag(tag.label)}
              aria-pressed={isActive}
              className="flex h-full cursor-pointer items-center rounded-full pl-2 pr-8 text-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
            >
              <span className="select-none">{tag.label}</span>
              {isActive ? (
                <span className="sr-only">{t('tagFilter.activeIndicator')}</span>
              ) : null}
            </button>
            <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center gap-1">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  toggleFavorite(tag.label);
                }}
                aria-pressed={tag.favorite}
                aria-label={
                  tag.favorite
                    ? t('actions.unfavoriteTag')
                    : t('actions.favoriteTag')
                }
                title={
                  tag.favorite
                    ? t('actions.unfavoriteTag')
                    : t('actions.favoriteTag')
                }
                className="pointer-events-auto flex h-4 w-4 items-center justify-center rounded-full text-white hover:bg-black/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              >
                <Star
                  className="h-3 w-3"
                  fill={tag.favorite ? 'currentColor' : 'none'}
                />
              </button>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  removeTag(tag.label);
                }}
                aria-label={t('actions.removeTag')}
                title={t('actions.removeTag')}
                className="pointer-events-auto flex h-4 w-4 items-center justify-center rounded-full text-white hover:bg-black/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              >
                ×
              </button>
            </div>
          </div>
        );
      })}
      <Link
        onClick={showAll}
        className="text-xs"
      >
        {t('tagFilter.showAll')}
      </Link>
    </div>
  );
}
