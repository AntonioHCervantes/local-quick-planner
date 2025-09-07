'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

export type Language = 'en' | 'es';

export const LANGUAGES: Language[] = ['en', 'es'];

const translations: Record<Language, any> = {
  en: {
    nav: { myDay: 'My Day', myTasks: 'My Tasks' },
    actions: {
      export: 'Export',
      import: 'Import',
      clearAll: 'Clear all',
      toggleTheme: 'Toggle theme',
      language: 'Select language',
      more: 'More actions',
      settings: 'Settings',
      removeTag: 'Remove tag',
      addTag: 'Add tag',
      favoriteTag: 'Add tag to favorites',
      unfavoriteTag: 'Remove tag from favorites',
      close: 'Close',
      notifications: 'Notifications',
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
      voiceInput: 'Add by voice',
      voiceInputNoText:
        'No text was captured. Please try again and make sure to speak in the selected language.',
    },
    taskCard: {
      markInProgress: 'Move to In Progress',
      markDone: 'Mark as done',
      deleteTask: 'Delete task',
      showTimer: 'Plan time',
    },
    taskItem: {
      removeMyDay: 'Remove from My Day',
      addMyDay: 'Add to My Day',
      deleteTask: 'Delete task',
      tagPlaceholder: 'Add tag',
    },
    myDayPage: {
      empty: 'No tasks added to My Day',
      goToMyTasks: 'Go to My Tasks',
      progress: {
        full: "Big day ahead—let's get started!",
        medium: "You're making progress—keep going!",
        low: 'Almost there—keep it up!',
        done: 'All tasks completed! Great job!',
      },
    },
    timer: {
      start: 'Start timer',
      pause: 'Pause timer',
      finished: 'Time for "{task}" finished',
    },
    priority: { low: 'Low', medium: 'Medium', high: 'High' },
    taskList: { noTasks: 'No tasks' },
    tagFilter: {
      showAll: 'Show all',
      confirmDelete:
        'Some tasks are using this tag. If you remove it, those tasks will lose the tag. Continue?',
    },
    welcomeModal: {
      title: 'Local Quick Planner',
      p1: 'Improve your productivity, plan your tasks and organize your daily work.',
      p2: 'Your data is stored locally, nothing is sent to any server.',
      p3: 'Export your data to make local backups from time to time.',
      p4: 'Designed for personal use, not for teams.',
      p5: '100% free and unlimited, open source.',
      cta: "Let's go!",
    },
    notifications: {
      title: 'Notifications',
      empty: 'No notifications',
      welcome: {
        title: 'Welcome to Local Quick Planner',
        description:
          'Use the "My Tasks" board to collect and prioritize everything you need to do. Move items into "My Day" when you are ready to focus on them. Open settings to switch theme, export your data and more.',
      },
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
    faqs: {
      title: 'Frequently Asked Questions',
      q1: {
        question: 'What is Local Quick Planner?',
        answer:
          'Local Quick Planner is a fast, free and open-source task manager that boosts your productivity by organizing tasks right in your browser.',
      },
      q2: {
        question: 'How do I create a new task?',
        answer:
          'Use the input at the top, type your task and press Enter or click Add; you can also tag tasks to filter them by topic or project.',
      },
      q3: {
        question: 'Can I export my tasks?',
        answer:
          'Yes, use the Export action in the header to download your data.',
      },
      q4: {
        question: 'What is the difference between My Day and My Tasks?',
        answer:
          'My Day lets you focus on tasks for today with the "To Do", "In Progress" and "Done" states. My Tasks is a place to collect and prioritize everything long term before moving tasks into My Day.',
      },
      q5: {
        question: 'How do I move tasks between columns?',
        answer:
          'Drag tasks between columns or use the icons on each card to move them to the next column.',
      },
      q6: {
        question: 'Where is my data stored?',
        answer:
          'All information is saved locally in your browser. Nothing is sent to any server.',
      },
      q7: {
        question: 'How do I import tasks from another device?',
        answer:
          'Use the Import action in the header to load a previously exported JSON file.',
      },
      q8: {
        question: 'Can I change the theme or language?',
        answer:
          'Yes, use the header controls to toggle the theme and select your language.',
      },
      q9: {
        question: 'How do I reset or clear all tasks?',
        answer:
          'Use the Clear all action in the header to remove every task; consider exporting first.',
      },
      supportTitle: 'Support',
      support:
        'Need more help? Use our GitHub issues to report problems or suggestions.',
      supportLink: 'Open an issue',
    },

    privacyPage: {
      title: 'Privacy Policy',
      intro:
        'Local Quick Planner is a client-side application. We respect your privacy and do not collect personal data.',
      localData: {
        title: 'Local Data',
        description:
          'All tasks and settings are stored locally in your browser and never sent to a server.',
      },
      analytics: {
        title: 'Analytics',
        description:
          'The application does not use analytics or tracking cookies.',
      },
      contact: {
        title: 'Contact',
        description: 'If you have questions, reach out through GitHub issues.',
      },
    },
    termsPage: {
      title: 'Terms of Service',
      intro: 'By using Local Quick Planner, you agree to the following terms.',
      usage: {
        title: 'Use of the Application',
        description:
          'The app is provided “as is” without warranties. You are responsible for your data.',
      },
      privacy: {
        title: 'Privacy',
        description: 'For information about data handling, please review our',
      },
      liability: {
        title: 'Limitation of Liability',
        description:
          'We are not liable for any damages or data loss resulting from the use of the app.',
      },
      changes: {
        title: 'Changes to These Terms',
        description:
          'We may update these terms at any time. Continued use of the app constitutes acceptance of the new terms.',
      },
      contact: {
        title: 'Contact',
        description: 'If you have questions, reach out through GitHub issues.',
      },
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
      more: 'Más acciones',
      settings: 'Ajustes',
      removeTag: 'Eliminar etiqueta',
      addTag: 'Añadir etiqueta',
      favoriteTag: 'Marcar etiqueta como favorita',
      unfavoriteTag: 'Quitar etiqueta de favoritas',
      close: 'Cerrar',
      notifications: 'Notificaciones',
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
      voiceInput: 'Añadir por voz',
      voiceInputNoText:
        'No se ha capturado texto. Vuelve a intentarlo y asegúrate de hablar en el idioma seleccionado.',
    },
    taskCard: {
      markInProgress: 'Mover a En progreso',
      markDone: 'Marcar como completada',
      deleteTask: 'Eliminar tarea',
      showTimer: 'Planificar tiempo',
    },
    taskItem: {
      removeMyDay: 'Quitar de Mi Día',
      addMyDay: 'Agregar a Mi Día',
      deleteTask: 'Eliminar tarea',
      tagPlaceholder: 'Añadir etiqueta',
    },
    myDayPage: {
      empty: 'No hay tareas añadidas a Mi Día',
      goToMyTasks: 'Ir a Mis Tareas',
      progress: {
        full: '¡Qué gran día, a por ello!',
        medium: '¡Buen progreso, sigue así!',
        low: '¡Ánimo, ya falta poco!',
        done: '¡Todo hecho, gran trabajo!',
      },
    },
    timer: {
      start: 'Iniciar temporizador',
      pause: 'Pausar temporizador',
      finished: 'Tiempo para "{task}" terminado',
    },
    priority: { low: 'Baja', medium: 'Media', high: 'Alta' },
    taskList: { noTasks: 'No hay tareas' },
    tagFilter: {
      showAll: 'Mostrar todas',
      confirmDelete:
        'Algunas tareas usan esta etiqueta. Si la eliminas, esas tareas perderán la etiqueta. ¿Continuar?',
    },
    welcomeModal: {
      title: 'Local Quick Planner',
      p1: 'Mejora tu productividad, planifica tus tareas y organiza tu trabajo diario.',
      p2: 'Tus datos se almacenan en local, no se envían a ningún servidor.',
      p3: 'Exporta tus datos para hacer copias de seguridad en local cada cierto tiempo.',
      p4: 'Diseñado para uso personal, no para equipos.',
      p5: '100% gratis e ilimitado, open source.',
      cta: '¡Vamos!',
    },
    notifications: {
      title: 'Notificaciones',
      empty: 'Sin notificaciones',
      welcome: {
        title: '¡Hola! Te damos la bienvenida a Local Quick Planner',
        description:
          'Usa el tablero "Mis Tareas" para reunir y priorizar todo lo que debes hacer. Pasa los elementos a "Mi Día" cuando quieras enfocarte en ellos. Abre los ajustes para cambiar el tema, exportar tus datos y más.',
      },
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
    faqs: {
      title: 'Preguntas frecuentes',
      q1: {
        question: '¿Qué es Local Quick Planner?',
        answer:
          'Local Quick Planner es un gestor de tareas rápido, gratuito y de código abierto que mejora tu productividad gracias a la organización de tus tareas en el navegador.',
      },
      q2: {
        question: '¿Cómo creo una nueva tarea?',
        answer:
          'Usa la entrada en la parte superior, escribe tu tarea y pulsa Enter o el botón Añadir; además puedes etiquetar las tareas para filtrarlas fácilmente por temas o proyectos.',
      },
      q3: {
        question: '¿Puedo exportar mis tareas?',
        answer:
          'Sí, utiliza la acción Exportar en la cabecera para descargar tus datos.',
      },
      q4: {
        question: '¿Cuál es la diferencia entre Mi Día y Mis Tareas?',
        answer:
          'Mi Día te permite controlar las tareas que quieres hacer hoy con los estados "Por hacer", "En progreso" y "Hecho". En Mis Tareas puedes ir agregando todo lo que debas hacer, priorizarlo a largo plazo y moverlo luego a Mi Día.',
      },
      q5: {
        question: '¿Cómo muevo tareas entre columnas?',
        answer:
          'Puedes arrastrar las tareas entre columnas o usar los iconos que aparecen en cada tarjeta para pasarlas a la siguiente columna.',
      },
      q6: {
        question: '¿Dónde se guardan mis datos?',
        answer:
          'Toda la información se guarda localmente en tu navegador. Nada se envía a servidores.',
      },
      q7: {
        question: '¿Cómo importo tareas de otro dispositivo?',
        answer:
          'Usa la acción Importar en la cabecera para cargar un archivo JSON exportado previamente.',
      },
      q8: {
        question: '¿Puedo cambiar el tema o el idioma?',
        answer:
          'Sí, utiliza los controles de la cabecera para alternar el tema y seleccionar tu idioma.',
      },
      q9: {
        question: '¿Cómo puedo reiniciar o eliminar todas las tareas?',
        answer:
          'Usa la acción Eliminar todo en la cabecera para borrar todas las tareas; te recomendamos exportarlas antes.',
      },
      supportTitle: 'Soporte',
      support:
        '¿Necesitas más ayuda? Usa las issues de GitHub para reportar incidencias o sugerencias.',
      supportLink: 'Abrir un issue',
    },

    privacyPage: {
      title: 'Política de privacidad',
      intro:
        'Local Quick Planner es una aplicación que se ejecuta en tu dispositivo. Respetamos tu privacidad y no recopilamos datos personales.',
      localData: {
        title: 'Datos locales',
        description:
          'Todas las tareas y ajustes se guardan localmente en tu navegador y nunca se envían a un servidor.',
      },
      analytics: {
        title: 'Analítica',
        description:
          'La aplicación no utiliza analítica ni cookies de seguimiento.',
      },
      contact: {
        title: 'Contacto',
        description:
          'Si tienes preguntas, contáctanos mediante las issues de GitHub.',
      },
    },
    termsPage: {
      title: 'Términos del servicio',
      intro: 'Al usar Local Quick Planner, aceptas los siguientes términos.',
      usage: {
        title: 'Uso de la aplicación',
        description:
          'La aplicación se proporciona “tal cual” sin garantías. Eres responsable de tus datos.',
      },
      privacy: {
        title: 'Privacidad',
        description:
          'Para obtener información sobre el tratamiento de datos, consulta nuestra',
      },
      liability: {
        title: 'Limitación de responsabilidad',
        description:
          'No somos responsables de ningún daño o pérdida de datos resultante del uso de la aplicación.',
      },
      changes: {
        title: 'Cambios en estos términos',
        description:
          'Podemos actualizar estos términos en cualquier momento. El uso continuado de la aplicación implica la aceptación de los nuevos términos.',
      },
      contact: {
        title: 'Contacto',
        description:
          'Si tienes preguntas, contáctanos mediante las issues de GitHub.',
      },
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
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lang');
      if (stored === 'en' || stored === 'es') {
        return stored;
      }
      const browser = navigator.language.split('-')[0];
      return browser === 'es' ? 'es' : 'en';
    }
    return 'en';
  });

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
