'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEMO_TEMPLATES } from '../../lib/demoTemplates';
import { useI18n } from '../../lib/i18n';
import { useStore } from '../../lib/store';

export default function DemoTemplatesPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { tasks, tags, importData, exportData } = useStore(state => ({
    tasks: state.tasks,
    tags: state.tags,
    importData: state.importData,
    exportData: state.exportData,
  }));
  const [importedTemplateId, setImportedTemplateId] = useState<string | null>(
    null
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showExistingDataModal, setShowExistingDataModal] = useState(false);
  const [pendingTemplateId, setPendingTemplateId] = useState<string | null>(
    null
  );

  const importedTemplate = useMemo(() => {
    if (!importedTemplateId) {
      return null;
    }
    return DEMO_TEMPLATES.find(item => item.id === importedTemplateId) ?? null;
  }, [importedTemplateId]);
  const importedTemplateTitle = useMemo(() => {
    if (!importedTemplate) {
      return null;
    }
    const roleTitleKey =
      `demoTemplatesPage.roles.${importedTemplate.roleKey}.title` as const;
    return t(roleTitleKey);
  }, [importedTemplate, t]);

  const importTemplate = (templateId: string) => {
    const template = DEMO_TEMPLATES.find(item => item.id === templateId);
    if (!template) {
      return;
    }

    const nextState = template.createState();
    importData(nextState);
    setPendingTemplateId(null);
    setShowExistingDataModal(false);
    setImportedTemplateId(template.id);
    setShowSuccessModal(true);
  };

  const handleImportTemplate = (templateId: string) => {
    const hasExistingData = tasks.length > 0 || tags.length > 0;
    if (hasExistingData) {
      setPendingTemplateId(templateId);
      setShowExistingDataModal(true);
      return;
    }

    importTemplate(templateId);
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
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#57886C] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#57886C] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-[#57886C] dark:focus-visible:ring-offset-gray-900"
              >
                {t(`${rolePath}.importCta`)}
              </button>
            </article>
          );
        })}
      </section>
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('demoTemplatesPage.successTitle')}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {t('demoTemplatesPage.successDescription')}
            </p>
            {importedTemplate && importedTemplateTitle ? (
              <p className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                {t('demoTemplatesPage.successRoleLabel')}{' '}
                <span className="font-semibold">{importedTemplateTitle}</span>
              </p>
            ) : null}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#57886C] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
              >
                {t('actions.close')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push('/my-tasks');
                }}
                className="inline-flex items-center justify-center rounded-lg bg-[#57886C] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#57886C] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-[#57886C] dark:focus-visible:ring-offset-gray-900"
              >
                {t('demoTemplatesPage.viewDemoCta')}
              </button>
            </div>
          </div>
        </div>
      )}
      {showExistingDataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('demoTemplatesPage.confirmExistingTitle')}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {t('demoTemplatesPage.confirmExistingDescription')}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowExistingDataModal(false);
                  setPendingTemplateId(null);
                }}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#57886C] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
              >
                {t('actions.cancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (pendingTemplateId) {
                    importTemplate(pendingTemplateId);
                  }
                }}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#57886C] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-offset-gray-900"
              >
                {t('demoTemplatesPage.confirmExistingContinueCta')}
              </button>
              <button
                type="button"
                onClick={() => {
                  exportData();
                }}
                className="inline-flex items-center justify-center rounded-lg bg-[#57886C] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#57886C] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-[#57886C] dark:focus-visible:ring-offset-gray-900"
              >
                {t('demoTemplatesPage.confirmExistingExportCta')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
