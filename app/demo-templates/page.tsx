'use client';

import { DEMO_TEMPLATES } from '../../lib/demoTemplates';
import { useI18n } from '../../lib/i18n';
import { useStore } from '../../lib/store';

export default function DemoTemplatesPage() {
  const { t } = useI18n();
  const { tasks, tags, importData } = useStore(state => ({
    tasks: state.tasks,
    tags: state.tags,
    importData: state.importData,
  }));

  const handleImportTemplate = (templateId: string) => {
    const template = DEMO_TEMPLATES.find(item => item.id === templateId);
    if (!template) {
      return;
    }

    const hasExistingData = tasks.length > 0 || tags.length > 0;
    if (hasExistingData) {
      const proceed = window.confirm(t('demoTemplatesPage.confirmExisting'));
      if (!proceed) {
        return;
      }
    }

    const nextState = template.createState();
    importData(nextState);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-16">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold">{t('demoTemplatesPage.title')}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('demoTemplatesPage.intro')}
        </p>
      </header>
      <section className="grid gap-6 md:grid-cols-2">
        {DEMO_TEMPLATES.map(template => {
          const rolePath =
            `demoTemplatesPage.roles.${template.roleKey}` as const;
          return (
            <article
              key={template.id}
              className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900/60"
            >
              <h2 className="text-xl font-semibold">
                {t(`${rolePath}.title`)}
              </h2>
              <p className="mt-2 flex-1 text-gray-600 dark:text-gray-300">
                {t(`${rolePath}.description`)}
              </p>
              <button
                type="button"
                onClick={() => handleImportTemplate(template.id)}
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:hover:bg-blue-500 dark:focus-visible:ring-offset-gray-900"
              >
                {t(`${rolePath}.importCta`)}
              </button>
            </article>
          );
        })}
      </section>
    </div>
  );
}
