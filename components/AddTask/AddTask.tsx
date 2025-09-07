'use client';
import { useRef, useState, useEffect } from 'react';
import { Plus, Mic } from 'lucide-react';
import { Priority } from '../../lib/types';
import { useI18n, Language } from '../../lib/i18n';
import useAddTask, { UseAddTaskProps } from './useAddTask';

export default function AddTask(props: UseAddTaskProps) {
  const { state, actions } = useAddTask(props);
  const { title, tags, priority, existingTags } = state;
  const {
    setTitle,
    setPriority,
    handleAdd,
    handleTagInputChange,
    handleExistingTagSelect,
    handleTagInputBlur,
    removeTag,
  } = actions;
  const { t, language } = useI18n();
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [showVoiceWarning, setShowVoiceWarning] = useState(false);
  const speechLangMap: Record<Language, string> = { en: 'en-US', es: 'es-ES' };
  const titleRef = useRef(title);
  const initialTitleRef = useRef('');
  const tagInputRef = useRef<HTMLInputElement>(null);

  const getTagColor = (tagLabel: string) => {
    const tag = existingTags.find(t => t.label === tagLabel);
    return tag ? tag.color : '#ccc';
  };

  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.interimResults = false;
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setTitle(prev => (prev ? `${prev} ${transcript}` : transcript));
        recognition.stop();
      };
      recognition.onspeechend = () => recognition.stop();
      recognition.onend = () => {
        setIsListening(false);
        if (initialTitleRef.current === titleRef.current) {
          setShowVoiceWarning(true);
        }
      };
      recognitionRef.current = recognition;
    }

    recognitionRef.current.lang = speechLangMap[language] || language;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      initialTitleRef.current = titleRef.current;
      recognitionRef.current.start();
    }
    setIsListening(prev => !prev);
  };

  return (
    <>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleAdd(tagInputRef.current?.value);
          if (tagInputRef.current) tagInputRef.current.value = '';
        }}
        autoComplete="off"
        className="flex flex-col gap-2 p-4 sm:flex-row sm:flex-wrap sm:items-center lg:my-2 lg:py-6"
      >
        <div className="relative w-full sm:flex-1">
          <label
            htmlFor="task-title"
            className="sr-only"
          >
            {t('addTask.titleLabel')}
          </label>
          <input
            id="task-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full rounded bg-gray-200 p-2 pr-8 text-sm focus:ring dark:bg-gray-800"
            placeholder={t('addTask.titlePlaceholder')}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={handleVoiceInput}
            aria-label={t('addTask.voiceInput')}
            title={t('addTask.voiceInput')}
            className={`absolute right-2 top-1/2 -translate-y-1/2 ${
              isListening ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
            } hover:text-gray-700 dark:hover:text-gray-200`}
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>
        <div
          className={`flex w-full flex-wrap items-center sm:w-auto${
            tags.length ? ' gap-2' : ''
          }`}
        >
          <label
            htmlFor="task-tags"
            className="sr-only"
          >
            {t('addTask.tagsLabel')}
          </label>
          <input
            id="task-tags"
            ref={tagInputRef}
            onKeyDown={handleTagInputChange}
            onChange={handleExistingTagSelect}
            onBlur={handleTagInputBlur}
            className="w-full min-w-[245px] rounded bg-gray-200 p-2 text-sm focus:ring dark:bg-gray-800 sm:w-auto"
            placeholder={t('addTask.tagsPlaceholder')}
            list="existing-tags"
          />
          <datalist id="existing-tags">
            {existingTags.map(tag => (
              <option
                key={tag.id}
                value={tag.label}
              />
            ))}
          </datalist>
          <div className="flex flex-wrap gap-1">
            {tags.map(tag => (
              <span
                key={tag}
                style={{ backgroundColor: getTagColor(tag) }}
                className="flex items-center rounded-full pl-2 pr-1 py-1 text-xs text-white"
              >
                <span className="mr-1 select-none">{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  aria-label={t('actions.removeTag')}
                  title={t('actions.removeTag')}
                  className="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/20"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex w-full gap-2 lg:w-auto">
          <div className="flex-1 lg:flex-none">
            <label
              htmlFor="task-priority"
              className="sr-only"
            >
              {t('addTask.priorityLabel')}
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={e => setPriority(e.target.value as Priority)}
              className="w-full rounded bg-gray-200 p-2 text-sm focus:ring dark:bg-gray-800 lg:w-auto"
            >
              <option value="low">{t('priority.low')}</option>
              <option value="medium">{t('priority.medium')}</option>
              <option value="high">{t('priority.high')}</option>
            </select>
          </div>
          <button
            type="submit"
            className="flex flex-1 items-center justify-center gap-1 rounded bg-[#57886C] px-3 py-2 text-sm text-white hover:brightness-110 focus:ring lg:flex-none lg:w-auto"
          >
            <Plus className="h-4 w-4" /> {t('addTask.addButton')}
          </button>
        </div>
      </form>
      {showVoiceWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded bg-gray-900 p-6 text-center text-gray-100">
            <p className="mb-4">{t('addTask.voiceInputNoText')}</p>
            <button
              onClick={() => setShowVoiceWarning(false)}
              className="rounded bg-gray-700 px-3 py-1 hover:bg-gray-600 focus:bg-gray-600"
            >
              {t('actions.close')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
