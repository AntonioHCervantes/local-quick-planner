'use client';
import { Tag } from '../../lib/types';
import { useI18n } from '../../lib/i18n';

interface TagFilterProps {
  tags: Tag[];
  activeTags?: string[];
  toggleTag: (label: string) => void;
  showAll: () => void;
  removeTag: (label: string) => void;
}

export default function TagFilter({
  tags,
  activeTags = [],
  toggleTag,
  showAll,
  removeTag,
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
            className="flex items-center"
          >
            <button
              onClick={() => toggleTag(tag.label)}
              style={{ backgroundColor: isActive ? tag.color : '#ccc' }}
              className="rounded-full px-2 py-1 text-xs"
            >
              {tag.label}
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                removeTag(tag.label);
              }}
              aria-label={t('actions.removeTag')}
              title={t('actions.removeTag')}
              className="ml-1 text-xs text-red-500"
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
