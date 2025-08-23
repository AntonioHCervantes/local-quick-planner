'use client';
import { useRef, useState } from 'react';
import { Plus, Mic } from 'lucide-react';
import { Priority } from '../../lib/types';
import { useI18n } from '../../lib/i18n';
import useAddTask, { UseAddTaskProps } from './useAddTask';

export default function AddTask(props: UseAddTaskProps) {
  const { state, actions } = useAddTask(props);
  const { title, tags, priority, existingTags } = state;
  const { setTitle, setPriority, handleAdd, handleTagInputChange, removeTag } =
    actions;
  const { t, language } = useI18n();
  const recognitionRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'es' ? 'es-ES' : 'en-US';
      recognition.interimResults = false;
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setTitle(prev => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(prev => !prev);
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        handleAdd();
      }}
      autoComplete="off"
      className="flex flex-wrap items-center gap-2 p-4"
    >
      <div className="relative flex-1">
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
      <div className="flex items-center gap-2">
        <label
          htmlFor="task-tags"
          className="sr-only"
        >
          {t('addTask.tagsLabel')}
        </label>
        <input
          id="task-tags"
          onKeyDown={handleTagInputChange}
          className="rounded bg-gray-200 p-2 text-sm focus:ring dark:bg-gray-800"
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
              className="flex items-center rounded-full bg-gray-300 pl-2 pr-1 py-1 text-xs dark:bg-gray-700"
            >
              <span className="mr-1 select-none">{tag}</span>
              <button
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
        className="rounded bg-gray-200 p-2 text-sm focus:ring dark:bg-gray-800"
      >
        <option value="low">{t('priority.low')}</option>
        <option value="medium">{t('priority.medium')}</option>
        <option value="high">{t('priority.high')}</option>
      </select>
      <button
        type="submit"
        className="flex items-center gap-1 rounded bg-[#57886C] px-3 py-2 text-sm text-white hover:brightness-110 focus:ring"
      >
        <Plus className="h-4 w-4" /> {t('addTask.addButton')}
      </button>
    </form>
  );
}
