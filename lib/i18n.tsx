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
      workSchedule: 'Work schedule',
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
      setMainTask: 'Mark as main task',
      unsetMainTask: 'Remove main task status',
      mainTaskTooltip: 'Main task of the day',
    },
    taskItem: {
      removeMyDay: 'Remove from My Day',
      addMyDay: 'Add to My Day',
      deleteTask: 'Delete task',
      tagPlaceholder: 'Add tag',
      myDayHelp: 'Plan your daily work by adding tasks to My Day.',
      recurring: {
        button: 'Repeat every week',
        buttonWithDays: 'Repeats: {days}',
        description: 'Select the weekdays when this task should repeat.',
        limitedBySchedule:
          'Showing only the days configured in your work schedule.',
        autoAddHint:
          'On those days the task will be added to My Day automatically.',
        remove: 'Remove weekly repetition',
        weekdaysShort: {
          monday: 'Mon',
          tuesday: 'Tue',
          wednesday: 'Wed',
          thursday: 'Thu',
          friday: 'Fri',
          saturday: 'Sat',
          sunday: 'Sun',
        },
      },
    },
    myDayPage: {
      empty: 'No tasks added to My Day',
      goToMyTasks: 'Go to My Tasks',
      progress: {
        full: "Big day ahead—let's get started!",
        medium: "You're making progress—keep going!",
        low: 'Almost there—keep it up!',
        done: 'All tasks completed! Great job!',
        clearCompleted: 'Remove completed tasks',
      },
    },
    timer: {
      start: 'Start timer',
      pause: 'Pause timer',
      finished: 'Time for "{task}" finished',
    },
    priority: { low: 'Low', medium: 'Medium', high: 'High' },
    taskList: {
      noTasks: 'No tasks',
      noTasksIntro: 'Check your plan. Check your day.',
    },
    tasksView: {
      mobileAddTask: {
        show: 'Add task',
      },
    },
    tagFilter: {
      showAll: 'Show all',
      confirmDelete:
        'Some tasks are using this tag. If you remove it, those tasks will lose the tag. Continue?',
    },
    welcomeModal: {
      title: 'CheckPlanner',
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
      dismiss: 'Dismiss notification',
      welcome: {
        title: 'Welcome to CheckPlanner',
        description:
          'Use the "My Tasks" board to collect and prioritize everything you need to do. Move items into "My Day" when you are ready to focus on them. Open settings to switch theme, export your data and more.',
        installCta: 'Install app',
        installUnavailable:
          'Install is only available in supported browsers. Try using the browser menu to add CheckPlanner to your device.',
        installInstalled: 'App already installed',
        demoCta: 'Explore demo templates',
      },
      workReminder: {
        title: 'Plan tomorrow',
        description:
          'Your workday is about to finish. Review your progress and decide what comes next.',
      },
      timerFinished: {
        title: 'Planned time finished',
        description: 'A planned time has finished.',
        untitledTask: 'Untitled task',
      },
    },
    workSchedulePage: {
      title: 'Work schedule',
      intro:
        'Save your working hours so CheckPlanner can adapt to your workday.',
      calendar: {
        instructions:
          'Click and drag over the half-hour slots to mark when your workday starts and ends each day.',
        timeLabel: 'Time',
      },
      week: {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday',
      },
      actions: {
        title: 'Available actions',
        planningReminder: {
          title: 'Reminder to plan tomorrow',
          description:
            'Receive a reminder shortly before your workday ends so you can organize the next day.',
          selectLabel: 'Notify me',
          selectSuffix: 'before the end of my workday',
          selectHelper:
            'Select how long before finishing you want to receive the reminder.',
          minutes: {
            '5': '5m',
            '15': '15m',
            '30': '30m',
            '60': '1h',
          },
          switchLabel: 'Enable reminder',
          fillScheduleFirst:
            'Set your work schedule before activating this reminder.',
        },
      },
      reminder: {
        toast: 'Your workday is about to end. Take a moment to plan tomorrow.',
      },
    },
    footer: {
      about: 'About',
      openSource: 'Open Source',
      faqs: 'FAQs & Support',
      demoTemplates: 'Demo templates',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
    demoTemplatesPage: {
      title: 'Demo Templates',
      intro:
        'Import these incredible examples of how different professionals can use CheckPlanner.',
      confirmExisting:
        'You already have tasks or filters saved. Importing a demo template will replace your current data. Export a backup if you do not want to lose your progress. Continue?',
      successTitle: 'Demo template imported successfully',
      successDescription:
        'Your workspace has been populated with demo data. Explore the tasks to see how CheckPlanner supports this role.',
      successRoleLabel: 'Role demo:',
      viewDemoCta: 'View demo',
      roles: {
        techLead: {
          title: 'Technical Lead',
          description:
            'As a Technical Lead you coordinate incidents, code reviews, system monitoring, and long-term initiatives while keeping the team aligned.',
          importCta: 'Import demo template',
        },
      },
    },
    aboutPage: {
      title: 'About CheckPlanner',
      intro:
        'CheckPlanner is a free app built to boost your personal productivity at work.',
      features: {
        freeOpenSource: '100% free and open source.',
        privacy:
          'All information stays local; nothing is sent to servers or third parties. Use it only on your private devices.',
        fast: 'Fast and registration-free; everything is stored in your browser and no data is shared.',
        personal: 'Focused on personal use—no accounts or team features.',
        export:
          'Export and import your data to create backups or move to another device.',
        myTasks:
          'Add tasks in an organized way, tagging them as needed and assigning priorities.',
        myDay:
          'Plan your daily work by selecting which tasks you want to do each day.',
      },
      sourceCode: 'The source code is available on',
      learnMore: 'Learn more in our',
      and: 'and',
    },
    faqs: {
      title: 'Frequently Asked Questions',
      q1: {
        question: 'What is CheckPlanner?',
        answer:
          'CheckPlanner is a fast, free and open-source task manager that boosts your productivity by organizing tasks right in your browser.',
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
        'CheckPlanner is a client-side application. We respect your privacy and do not collect personal data.',
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
      intro: 'By using CheckPlanner, you agree to the following terms.',
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
      workSchedule: 'Jornada laboral',
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
      setMainTask: 'Marcar como tarea principal',
      unsetMainTask: 'Quitar tarea principal',
      mainTaskTooltip: 'Tarea principal del día',
    },
    taskItem: {
      removeMyDay: 'Quitar de Mi Día',
      addMyDay: 'Agregar a Mi Día',
      deleteTask: 'Eliminar tarea',
      tagPlaceholder: 'Añadir etiqueta',
      myDayHelp: 'Planifica tu trabajo diario añadiendo tareas a Mi Día.',
      recurring: {
        button: 'Repetir cada semana',
        buttonWithDays: 'Se repite: {days}',
        description:
          'Selecciona los días en los que quieres repetir esta tarea.',
        limitedBySchedule:
          'Mostramos solo los días incluidos en tu jornada laboral.',
        autoAddHint:
          'Los días seleccionados la tarea se añadirá a Mi Día automáticamente.',
        remove: 'Quitar repetición semanal',
        weekdaysShort: {
          monday: 'L',
          tuesday: 'M',
          wednesday: 'X',
          thursday: 'J',
          friday: 'V',
          saturday: 'S',
          sunday: 'D',
        },
      },
    },
    myDayPage: {
      empty: 'No hay tareas añadidas a Mi Día',
      goToMyTasks: 'Ir a Mis Tareas',
      progress: {
        full: '¡Qué gran día, a por ello!',
        medium: '¡Buen progreso, sigue así!',
        low: '¡Ánimo, ya falta poco!',
        done: '¡Todo hecho, gran trabajo!',
        clearCompleted: 'Eliminar tareas completadas',
      },
    },
    timer: {
      start: 'Iniciar temporizador',
      pause: 'Pausar temporizador',
      finished: 'Tiempo para "{task}" terminado',
    },
    priority: { low: 'Baja', medium: 'Media', high: 'Alta' },
    taskList: {
      noTasks: 'No hay tareas',
      noTasksIntro: 'Check your plan. Check your day.',
    },
    tasksView: {
      mobileAddTask: {
        show: 'Añadir tarea',
      },
    },
    tagFilter: {
      showAll: 'Mostrar todas',
      confirmDelete:
        'Algunas tareas usan esta etiqueta. Si la eliminas, esas tareas perderán la etiqueta. ¿Continuar?',
    },
    welcomeModal: {
      title: 'CheckPlanner',
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
      dismiss: 'Cerrar notificación',
      welcome: {
        title: '¡Hola! Te damos la bienvenida a CheckPlanner',
        description:
          'Usa el tablero "Mis Tareas" para reunir y priorizar todo lo que debes hacer. Pasa los elementos a "Mi Día" cuando quieras enfocarte en ellos. Abre los ajustes para cambiar el tema, exportar tus datos y más.',
        installCta: 'Instalar app',
        installUnavailable:
          'La instalación solo está disponible en navegadores compatibles. Usa el menú del navegador para añadir CheckPlanner a tu dispositivo.',
        installInstalled: 'La app ya está instalada',
        demoCta: 'Ver plantillas de demostración',
      },
      workReminder: {
        title: 'Planifica el mañana',
        description:
          'Tu jornada está a punto de terminar. Revisa tu progreso y decide los siguientes pasos.',
      },
      timerFinished: {
        title: 'Tiempo planificado finalizado',
        description: 'Un tiempo planificado ha finalizado.',
        untitledTask: 'Tarea sin título',
      },
    },
    workSchedulePage: {
      title: 'Jornada laboral',
      intro:
        'Guarda tu horario laboral para que CheckPlanner se adapte a tu jornada.',
      calendar: {
        instructions:
          'Haz clic y arrastra sobre los bloques de media hora para marcar cuándo empieza y termina tu jornada cada día.',
        timeLabel: 'Hora',
      },
      week: {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo',
      },
      actions: {
        title: 'Acciones disponibles',
        planningReminder: {
          title: 'Recordatorio para planificar el siguiente día',
          description:
            'Recibe un aviso poco antes de finalizar tu jornada para organizar el trabajo del día siguiente.',
          selectLabel: 'Avísame',
          selectSuffix: 'antes de que termine mi jornada',
          selectHelper:
            'Selecciona cuánto tiempo antes quieres recibir el aviso.',
          minutes: {
            '5': '5m',
            '15': '15m',
            '30': '30m',
            '60': '1h',
          },
          switchLabel: 'Activar recordatorio',
          fillScheduleFirst:
            'Rellena tu jornada laboral antes de activar este recordatorio.',
        },
      },
      reminder: {
        toast:
          'Tu jornada está a punto de terminar. Tómate un momento para planificar el próximo día.',
      },
    },
    footer: {
      about: 'Acerca de',
      openSource: 'Código abierto',
      faqs: 'Preguntas frecuentes y soporte',
      demoTemplates: 'Plantillas demo',
      privacy: 'Política de privacidad',
      terms: 'Términos del servicio',
    },
    demoTemplatesPage: {
      title: 'Plantillas demo',
      intro:
        'Importa estos ejemplos increíbles de cómo diferentes profesionales pueden usar CheckPlanner.',
      confirmExisting:
        'Ya tienes tareas o filtros guardados. Importar una plantilla demo reemplazará tus datos actuales. Exporta una copia de seguridad si no quieres perder tu progreso. ¿Quieres continuar?',
      successTitle: 'Plantilla demo importada correctamente',
      successDescription:
        'Hemos rellenado tu espacio de trabajo con datos demo. Explora las tareas para ver cómo CheckPlanner ayuda a este rol.',
      successRoleLabel: 'Rol de la demo:',
      viewDemoCta: 'Ver demo',
      roles: {
        techLead: {
          title: 'Líder Técnico',
          description:
            'Como Líder Técnico necesitas organizar incidencias, revisar código, monitorizar sistemas y coordinar iniciativas para mantener al equipo alineado.',
          importCta: 'Importar plantilla demo',
        },
      },
    },
    aboutPage: {
      title: 'Acerca de CheckPlanner',
      intro:
        'CheckPlanner es una aplicación gratuita creada para impulsar tu productividad personal en el trabajo.',
      features: {
        freeOpenSource: '100% gratuita y de código abierto.',
        privacy:
          'Toda la información se guarda localmente; no se envía nada a servidores ni terceros. Úsalo solo en tus dispositivos privados.',
        fast: 'Rápido y sin registros: todo se almacena en tu navegador y no se comparte ningún dato.',
        personal:
          'Enfocada en el uso personal, sin cuentas ni funciones para equipos.',
        export:
          'Exporta e importa tus datos para crear copias de seguridad o moverlos a otro dispositivo.',
        myTasks:
          'Añade tus tareas de forma organizada etiquetándolas como necesites y asignando una prioridad.',
        myDay:
          'Planifica tu trabajo diario seleccionando qué tareas quieres realizar cada día.',
      },
      sourceCode: 'El código fuente está disponible en',
      learnMore: 'Para conocer más, visita nuestras',
      and: 'y',
    },
    faqs: {
      title: 'Preguntas frecuentes',
      q1: {
        question: '¿Qué es CheckPlanner?',
        answer:
          'CheckPlanner es un gestor de tareas rápido, gratuito y de código abierto que mejora tu productividad gracias a la organización de tus tareas en el navegador.',
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
        'CheckPlanner es una aplicación que se ejecuta en tu dispositivo. Respetamos tu privacidad y no recopilamos datos personales.',
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
      intro: 'Al usar CheckPlanner, aceptas los siguientes términos.',
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
