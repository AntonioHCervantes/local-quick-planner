'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

export type Language = 'en' | 'es';

const translations: Record<Language, any> = {
  en: {
    nav: { myDay: 'My Day', myTasks: 'My Tasks' },
    actions: {
      export: 'Export',
      import: 'Import',
      clearAll: 'Clear all',
      toggleTheme: 'Toggle theme',
      language: 'Select language',
      removeTag: 'Remove tag',
      favoriteTag: 'Add tag to favorites',
      unfavoriteTag: 'Remove tag from favorites',
    },
    confirmDelete: {
      message:
        'Are you sure you want to delete the dashboard? We recommend exporting it so you can restore your work later by importing the dashboard.',
      cancel: 'Cancel',
      delete: 'Delete',
    },
    board: { todo: 'To Do', doing: 'In Progress', done: 'Done' },
    lists: {
      ideas: 'Ideas',
      backlog: 'Backlog',
      inprogress: 'In Progress',
      done: 'Done',
    },
    addTask: {
      titleLabel: 'Title',
      titlePlaceholder: 'New task',
      tagsLabel: 'Tags',
      tagsPlaceholder: 'Add tags (press Enter)',
      priorityLabel: 'Priority',
      addButton: 'Add',
    },
    taskCard: {
      markDone: 'Mark as done',
      deleteTask: 'Delete task',
    },
    taskItem: {
      removeMyDay: 'Remove from My Day',
      addMyDay: 'Add to My Day',
      deleteTask: 'Delete task',
      tagPlaceholder: 'Add tag',
    },
    priority: { low: 'Low', medium: 'Medium', high: 'High' },
    taskList: { noTasks: 'No tasks' },
    tagFilter: {
      showAll: 'Show all tasks',
      confirmDelete:
        'Some tasks are using this tag. If you remove it, those tasks will lose the tag. Continue?',
    },
    footer: {
      about: 'About',
      openSource: 'Open Source',
      faqs: 'FAQs & Support',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
    aboutPage: {
      title: 'About Local Quick Planner',
      intro:
        'Local Quick Planner is a simple, fast, and free tool to organize your tasks right in your browser.',
      features: {
        myDay: 'Plan your daily priorities with the "My Day" view.',
        myTasks: 'Organize projects with the "My Tasks" Kanban board.',
        dragDrop: 'Move tasks effortlessly with drag and drop.',
        export: 'Back up or transfer your data with export and import options.',
        privacy:
          'Keep all your data on your device; nothing is sent to a server.',
      },
      personal:
        'This tool is focused on personal planning and is not intended for teams or multi-user workflows.',
      productivity:
        'It helps you stay organized and improve your productivity.',
      freeOpenSource: 'Local Quick Planner is completely free and open source.',
      learnMore: 'Learn more in our',
      and: 'and',
    },
    lang: { en: 'English', es: 'Spanish' },
  },
  es: {
    nav: { myDay: 'Mi Día', myTasks: 'Mis Tareas' },
    actions: {
      export: 'Exportar',
      import: 'Importar',
      clearAll: 'Eliminar todo',
      toggleTheme: 'Cambiar tema',
      language: 'Seleccionar idioma',
      removeTag: 'Eliminar etiqueta',
      favoriteTag: 'Marcar etiqueta como favorita',
      unfavoriteTag: 'Quitar etiqueta de favoritas',
    },
    confirmDelete: {
      message:
        '¿Seguro que quieres borrar el panel? Recomendamos exportarlo para que puedas restaurar tu trabajo más tarde importando el panel.',
      cancel: 'Cancelar',
      delete: 'Eliminar',
    },
    board: { todo: 'Por hacer', doing: 'En progreso', done: 'Hecho' },
    lists: {
      ideas: 'Ideas',
      backlog: 'Pendientes',
      inprogress: 'En Progreso',
      done: 'Hecho',
    },
    addTask: {
      titleLabel: 'Título',
      titlePlaceholder: 'Nueva tarea',
      tagsLabel: 'Etiquetas',
      tagsPlaceholder: 'Añade etiquetas (presiona Enter)',
      priorityLabel: 'Prioridad',
      addButton: 'Añadir',
    },
    taskCard: {
      markDone: 'Marcar como completada',
      deleteTask: 'Eliminar tarea',
    },
    taskItem: {
      removeMyDay: 'Quitar de Mi Día',
      addMyDay: 'Agregar a Mi Día',
      deleteTask: 'Eliminar tarea',
      tagPlaceholder: 'Añadir etiqueta',
    },
    priority: { low: 'Baja', medium: 'Media', high: 'Alta' },
    taskList: { noTasks: 'No hay tareas' },
    tagFilter: {
      showAll: 'Mostrar todas las tareas',
      confirmDelete:
        'Algunas tareas usan esta etiqueta. Si la eliminas, esas tareas perderán la etiqueta. ¿Continuar?',
    },
    footer: {
      about: 'Acerca de',
      openSource: 'Código abierto',
      faqs: 'Preguntas frecuentes y soporte',
      privacy: 'Política de privacidad',
      terms: 'Términos del servicio',
    },
    aboutPage: {
      title: 'Acerca de Local Quick Planner',
      intro:
        'Local Quick Planner es una herramienta simple, rápida y gratuita para organizar tus tareas directamente en tu navegador.',
      features: {
        myDay: 'Planifica tus prioridades diarias con la vista "Mi Día".',
        myTasks: 'Organiza tus proyectos con el tablero Kanban "Mis Tareas".',
        dragDrop: 'Mueve las tareas fácilmente con drag and drop.',
        export:
          'Haz copias de seguridad o traslada tus datos con las opciones de exportar e importar.',
        privacy:
          'Mantén todos tus datos en tu dispositivo; nada se envía a servidores.',
      },
      personal:
        'Esta herramienta está enfocada en la planificación personal y no está pensada para equipos ni flujos multiusuario.',
      productivity:
        'Te ayuda a mantener el enfoque y mejorar tu productividad.',
      freeOpenSource:
        'Local Quick Planner es totalmente gratuito y de código abierto.',
      learnMore: 'Obtén más información en nuestras',
      and: 'y',
    },
    lang: { en: 'Inglés', es: 'Español' },
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: key => key,
});

function getTranslation(lang: Language, key: string): string {
  const parts = key.split('.');
  let result: any = translations[lang];
  for (const part of parts) {
    if (result && typeof result === 'object') {
      result = result[part];
    } else {
      result = undefined;
      break;
    }
  }
  return typeof result === 'string' ? result : key;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const stored = localStorage.getItem('lang');
    if (stored === 'en' || stored === 'es') {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem('lang', language);
  }, [language]);

  const t = (key: string) => getTranslation(language, key);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
