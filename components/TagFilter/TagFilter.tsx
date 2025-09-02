'use client';
import { Tag } from '../../lib/types';
import { useI18n } from '../../lib/i18n';
import { Star } from 'lucide-react';

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
    <div className="flex flex-wrap items-center gap-2 px-4 pb-2">
      {tags.map(tag => {
        const isActive = activeTags.includes(tag.label);
        return (
          <div
            key={tag.id}
            onClick={() => toggleTag(tag.label)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTag(tag.label);
              }
            }}
            role="button"
            tabIndex={0}
            style={{ backgroundColor: tag.color, opacity: isActive ? 1 : 0.5 }}
            className="flex items-center rounded-full pl-2 pr-1 py-1 text-xs cursor-pointer text-white"
          >
            <span className="mr-1 select-none">{tag.label}</span>
            <button
              onClick={e => {
                e.stopPropagation();
                toggleFavorite(tag.label);
              }}
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
              className="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/20"
            >
              <Star
                className="h-3 w-3"
                fill={tag.favorite ? 'currentColor' : 'none'}
              />
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                removeTag(tag.label);
              }}
              aria-label={t('actions.removeTag')}
              title={t('actions.removeTag')}
              className="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/20"
            >
              ×
            </button>
          </div>
        );
      })}
      <button
        onClick={showAll}
        className="text-xs underline"
      >
        {t('tagFilter.showAll')}
      </button>
    </div>
  );
}
