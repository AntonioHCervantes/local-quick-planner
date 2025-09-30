import { PersistedState, List, Tag, Task } from './types';

type DemoTemplateRoleKey = 'techLead';

export type DemoTemplate = {
  id: string;
  roleKey: DemoTemplateRoleKey;
  createState: () => PersistedState;
};

const DEFAULT_LISTS: List[] = [
  { id: 'ideas', title: 'Ideas', order: 0 },
  { id: 'backlog', title: 'Backlog', order: 1 },
  { id: 'inprogress', title: 'In Progress', order: 2 },
  { id: 'done', title: 'Done', order: 3 },
];

const createEmptyWorkSchedule = () => ({
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
});

const createTechLeadTemplateState = (): PersistedState => {
  const todayKey = new Date().toISOString().slice(0, 10);
  const baseTasks: Task[] = [
    {
      id: 'tech-lead-task-001',
      title:
        'Draft async API gateway migration plan https://confluence.example.com/display/PLAT/Async-Gateway-Migration-Outline',
      createdAt: '2024-05-01T09:00:00.000Z',
      priority: 'medium',
      tags: ['Analysis'],
      listId: 'ideas',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'tech-lead-task-002',
      title: 'Document incident response playbook for database failover',
      createdAt: '2024-05-02T10:30:00.000Z',
      priority: 'high',
      tags: ['Task', 'Analysis'],
      listId: 'ideas',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'tech-lead-task-003',
      title: 'Triage overnight incidents backlog',
      createdAt: '2024-05-06T07:30:00.000Z',
      priority: 'high',
      tags: ['Task', 'Monitor'],
      listId: 'backlog',
      plannedFor: todayKey,
      dayStatus: 'todo',
      repeat: null,
    },
    {
      id: 'tech-lead-task-004',
      title: 'Prepare architecture review session with data science team',
      createdAt: '2024-05-06T12:15:00.000Z',
      priority: 'medium',
      tags: ['Task'],
      listId: 'backlog',
      plannedFor: todayKey,
      dayStatus: 'todo',
      repeat: null,
    },
    {
      id: 'tech-lead-task-005',
      title:
        'Review outstanding PRs from platform squad https://github.com/example/organization/repo/pull/482',
      createdAt: '2024-05-07T08:20:00.000Z',
      priority: 'high',
      tags: ['Review PR'],
      listId: 'backlog',
      plannedFor: todayKey,
      dayStatus: 'todo',
      repeat: null,
    },
    {
      id: 'tech-lead-task-006',
      title: 'Debug flaky integration test suite for payments service',
      createdAt: '2024-05-08T14:45:00.000Z',
      priority: 'high',
      tags: ['Task', 'Analysis'],
      listId: 'inprogress',
      plannedFor: todayKey,
      dayStatus: 'doing',
      repeat: null,
    },
    {
      id: 'tech-lead-task-007',
      title: 'Sync with product lead on roadmap adjustments',
      createdAt: '2024-05-09T11:10:00.000Z',
      priority: 'medium',
      tags: ['Task'],
      listId: 'inprogress',
      plannedFor: todayKey,
      dayStatus: 'done',
      repeat: null,
    },
    {
      id: 'tech-lead-task-008',
      title: 'Plan load testing scenario for messaging layer',
      createdAt: '2024-05-10T09:50:00.000Z',
      priority: 'medium',
      tags: ['Analysis'],
      listId: 'backlog',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'tech-lead-task-009',
      title:
        'Run monitoring health check on staging observability dashboard https://status.example.io/dashboards/platform/infra/overview',
      createdAt: '2024-05-11T16:05:00.000Z',
      priority: 'medium',
      tags: ['Monitor'],
      listId: 'inprogress',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'tech-lead-task-010',
      title: 'Write weekly leadership update for stakeholders',
      createdAt: '2024-05-12T08:35:00.000Z',
      priority: 'low',
      tags: ['Task'],
      listId: 'backlog',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'tech-lead-task-011',
      title: 'Organize knowledge-sharing session on distributed tracing',
      createdAt: '2024-05-13T13:00:00.000Z',
      priority: 'medium',
      tags: ['Task', 'Analysis'],
      listId: 'backlog',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'tech-lead-task-012',
      title: 'Refactor onboarding documentation for new engineers',
      createdAt: '2024-05-14T09:40:00.000Z',
      priority: 'low',
      tags: ['Task'],
      listId: 'done',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'tech-lead-task-013',
      title: 'Review planning priorities for the coming week',
      createdAt: '2024-05-12T07:00:00.000Z',
      priority: 'medium',
      tags: ['Task'],
      listId: 'backlog',
      plannedFor: null,
      repeat: {
        frequency: 'weekly',
        days: ['monday'],
        autoAddToMyDay: true,
        lastOccurrenceDate: null,
      },
    },
    {
      id: 'tech-lead-task-014',
      title: 'Refine next sprint backlog with staff engineers',
      createdAt: '2024-05-12T07:30:00.000Z',
      priority: 'medium',
      tags: ['Review PR', 'Task'],
      listId: 'backlog',
      plannedFor: null,
      repeat: {
        frequency: 'weekly',
        days: ['thursday'],
        autoAddToMyDay: true,
        lastOccurrenceDate: null,
      },
    },
    {
      id: 'tech-lead-task-015',
      title: 'Evaluate vendor proposal for error tracking upgrade',
      createdAt: '2024-05-15T10:25:00.000Z',
      priority: 'medium',
      tags: ['Analysis'],
      listId: 'ideas',
      plannedFor: null,
      repeat: null,
    },
  ];

  const tasks: Task[] = baseTasks.map(task => ({ ...task }));

  const tags: Tag[] = [
    {
      id: 'tag-task',
      label: 'Task',
      color: '#4CAF50',
      favorite: true,
    },
    {
      id: 'tag-analysis',
      label: 'Analysis',
      color: '#2196F3',
      favorite: false,
    },
    {
      id: 'tag-review-pr',
      label: 'Review PR',
      color: '#FF6F00',
      favorite: false,
    },
    {
      id: 'tag-monitor',
      label: 'Monitor',
      color: '#9C27B0',
      favorite: false,
    },
  ];

  const orderKeys = [
    'priority-high',
    'priority-medium',
    'priority-low',
    'list-ideas',
    'list-backlog',
    'list-inprogress',
    'list-done',
    'day-todo',
    'day-doing',
    'day-done',
  ];

  const order = orderKeys.reduce<Record<string, string[]>>((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

  tasks.forEach(task => {
    order[`priority-${task.priority}`].push(task.id);
    order[`list-${task.listId}`].push(task.id);
    if (task.plannedFor) {
      const dayKey = `day-${task.dayStatus ?? 'todo'}`;
      order[dayKey]?.push(task.id);
    }
  });

  return {
    tasks,
    lists: DEFAULT_LISTS.map(list => ({ ...list })),
    tags,
    order,
    notifications: [],
    timers: {},
    mainMyDayTaskId: null,
    workSchedule: createEmptyWorkSchedule(),
    workPreferences: {
      planningReminder: {
        enabled: false,
        minutesBefore: 15,
        lastNotifiedDate: null,
      },
    },
    version: 10,
  };
};

export const DEMO_TEMPLATES: DemoTemplate[] = [
  {
    id: 'tech-lead-demo-template',
    roleKey: 'techLead',
    createState: createTechLeadTemplateState,
  },
];
