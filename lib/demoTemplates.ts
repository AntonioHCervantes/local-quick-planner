import { PersistedState, List, Tag, Task } from './types';

type DemoTemplateRoleKey =
  | 'techLead'
  | 'architect'
  | 'graphicDesigner'
  | 'marketingDirector'
  | 'productManager';

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

const DEFAULT_ORDER_KEYS = [
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

const createTemplateState = (
  baseTasks: Task[],
  baseTags: Tag[]
): PersistedState => {
  const tasks: Task[] = baseTasks.map(task => ({ ...task }));
  const tags: Tag[] = baseTags.map(tag => ({ ...tag }));

  const order = DEFAULT_ORDER_KEYS.reduce<Record<string, string[]>>(
    (acc, key) => {
      acc[key] = [];
      return acc;
    },
    {}
  );

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
  return createTemplateState(baseTasks, tags);
};

const createArchitectTemplateState = (): PersistedState => {
  const todayKey = new Date().toISOString().slice(0, 10);
  const baseTasks: Task[] = [
    {
      id: 'architect-task-001',
      title: 'Sketch massing study for civic center competition',
      createdAt: '2024-05-03T08:00:00.000Z',
      priority: 'medium',
      tags: ['Design'],
      listId: 'ideas',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'architect-task-002',
      title: 'Coordinate structural consultant kickoff',
      createdAt: '2024-05-06T09:15:00.000Z',
      priority: 'high',
      tags: ['Coordination'],
      listId: 'backlog',
      plannedFor: todayKey,
      dayStatus: 'todo',
      repeat: null,
    },
    {
      id: 'architect-task-003',
      title: 'Site visit: document existing facade conditions',
      createdAt: '2024-05-07T07:45:00.000Z',
      priority: 'medium',
      tags: ['Site Visit'],
      listId: 'backlog',
      plannedFor: todayKey,
      dayStatus: 'doing',
      repeat: null,
    },
    {
      id: 'architect-task-004',
      title: 'Review BIM model clash report with project engineer',
      createdAt: '2024-05-07T12:00:00.000Z',
      priority: 'medium',
      tags: ['Review'],
      listId: 'inprogress',
      plannedFor: todayKey,
      dayStatus: 'doing',
      repeat: null,
    },
    {
      id: 'architect-task-005',
      title: 'Finalize interior materials palette for lobby spaces',
      createdAt: '2024-05-08T10:30:00.000Z',
      priority: 'medium',
      tags: ['Design'],
      listId: 'inprogress',
      plannedFor: todayKey,
      dayStatus: 'done',
      repeat: null,
    },
    {
      id: 'architect-task-006',
      title: 'Prepare zoning variance submission package',
      createdAt: '2024-05-09T08:20:00.000Z',
      priority: 'high',
      tags: ['Documentation'],
      listId: 'backlog',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'architect-task-007',
      title: 'Call with client about sustainability targets',
      createdAt: '2024-05-09T14:05:00.000Z',
      priority: 'medium',
      tags: ['Coordination'],
      listId: 'backlog',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'architect-task-008',
      title: 'Update Revit families for accessibility compliance',
      createdAt: '2024-05-10T09:10:00.000Z',
      priority: 'medium',
      tags: ['Compliance'],
      listId: 'backlog',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'architect-task-009',
      title: 'Weekly coordination with MEP consultants',
      createdAt: '2024-05-10T11:45:00.000Z',
      priority: 'medium',
      tags: ['Coordination'],
      listId: 'backlog',
      plannedFor: null,
      repeat: {
        frequency: 'weekly',
        days: ['wednesday'],
        autoAddToMyDay: true,
        lastOccurrenceDate: null,
      },
    },
    {
      id: 'architect-task-010',
      title: 'Check permit application status via city portal',
      createdAt: '2024-05-11T16:25:00.000Z',
      priority: 'low',
      tags: ['Documentation'],
      listId: 'backlog',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'architect-task-011',
      title: 'Archive issued construction drawing set',
      createdAt: '2024-05-12T07:30:00.000Z',
      priority: 'low',
      tags: ['Documentation'],
      listId: 'done',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'architect-task-012',
      title: 'Capture site progress photos for weekly report',
      createdAt: '2024-05-12T15:20:00.000Z',
      priority: 'medium',
      tags: ['Site Visit'],
      listId: 'ideas',
      plannedFor: null,
      repeat: null,
    },
  ];

  const tags: Tag[] = [
    {
      id: 'tag-design',
      label: 'Design',
      color: '#4CAF50',
      favorite: true,
    },
    {
      id: 'tag-coordination',
      label: 'Coordination',
      color: '#FF9800',
      favorite: false,
    },
    {
      id: 'tag-site-visit',
      label: 'Site Visit',
      color: '#795548',
      favorite: false,
    },
    {
      id: 'tag-documentation',
      label: 'Documentation',
      color: '#2196F3',
      favorite: false,
    },
    {
      id: 'tag-compliance',
      label: 'Compliance',
      color: '#9C27B0',
      favorite: false,
    },
    {
      id: 'tag-review',
      label: 'Review',
      color: '#607D8B',
      favorite: false,
    },
  ];

  return createTemplateState(baseTasks, tags);
};

const createGraphicDesignerTemplateState = (): PersistedState => {
  const todayKey = new Date().toISOString().slice(0, 10);
  const baseTasks: Task[] = [
    {
      id: 'graphic-designer-task-001',
      title: 'Collect inspiration for seasonal social campaign',
      createdAt: '2024-05-02T08:45:00.000Z',
      priority: 'medium',
      tags: ['Inspiration'],
      listId: 'ideas',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'graphic-designer-task-002',
      title: 'Design hero banner concepts for product launch',
      createdAt: '2024-05-03T10:00:00.000Z',
      priority: 'high',
      tags: ['Concept'],
      listId: 'backlog',
      plannedFor: todayKey,
      dayStatus: 'todo',
      repeat: null,
    },
    {
      id: 'graphic-designer-task-003',
      title: 'Illustrate icon set for onboarding flow',
      createdAt: '2024-05-03T13:20:00.000Z',
      priority: 'medium',
      tags: ['Production'],
      listId: 'inprogress',
      plannedFor: todayKey,
      dayStatus: 'doing',
      repeat: null,
    },
    {
      id: 'graphic-designer-task-004',
      title: 'Review typography guidelines with brand manager',
      createdAt: '2024-05-04T09:10:00.000Z',
      priority: 'medium',
      tags: ['Brand'],
      listId: 'backlog',
      plannedFor: todayKey,
      dayStatus: 'done',
      repeat: null,
    },
    {
      id: 'graphic-designer-task-005',
      title: 'Prepare print-ready files for trade show booth',
      createdAt: '2024-05-05T11:05:00.000Z',
      priority: 'high',
      tags: ['Production'],
      listId: 'backlog',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'graphic-designer-task-006',
      title: 'Incorporate client feedback on brochure layout',
      createdAt: '2024-05-06T14:50:00.000Z',
      priority: 'medium',
      tags: ['Client Feedback'],
      listId: 'inprogress',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'graphic-designer-task-007',
      title: 'Animate teaser motion graphic in After Effects',
      createdAt: '2024-05-07T09:40:00.000Z',
      priority: 'medium',
      tags: ['Production'],
      listId: 'backlog',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'graphic-designer-task-008',
      title: 'Audit asset library naming conventions',
      createdAt: '2024-05-07T16:30:00.000Z',
      priority: 'low',
      tags: ['Brand'],
      listId: 'backlog',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'graphic-designer-task-009',
      title: 'Weekly sync with copywriter on campaign visuals',
      createdAt: '2024-05-08T08:15:00.000Z',
      priority: 'medium',
      tags: ['Team'],
      listId: 'backlog',
      plannedFor: null,
      repeat: {
        frequency: 'weekly',
        days: ['tuesday'],
        autoAddToMyDay: true,
        lastOccurrenceDate: null,
      },
    },
    {
      id: 'graphic-designer-task-010',
      title: 'Publish updated brand assets to DAM system',
      createdAt: '2024-05-08T15:55:00.000Z',
      priority: 'low',
      tags: ['Brand'],
      listId: 'done',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'graphic-designer-task-011',
      title: 'Schedule color proofing session with print vendor',
      createdAt: '2024-05-09T10:35:00.000Z',
      priority: 'medium',
      tags: ['Client Feedback'],
      listId: 'ideas',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'graphic-designer-task-012',
      title: 'Share inspiration moodboard with wider team',
      createdAt: '2024-05-10T07:25:00.000Z',
      priority: 'medium',
      tags: ['Inspiration'],
      listId: 'ideas',
      plannedFor: null,
      repeat: {
        frequency: 'weekly',
        days: ['monday'],
        autoAddToMyDay: false,
        lastOccurrenceDate: null,
      },
    },
  ];

  const tags: Tag[] = [
    {
      id: 'tag-concept',
      label: 'Concept',
      color: '#E91E63',
      favorite: true,
    },
    {
      id: 'tag-client-feedback',
      label: 'Client Feedback',
      color: '#9C27B0',
      favorite: false,
    },
    {
      id: 'tag-production',
      label: 'Production',
      color: '#3F51B5',
      favorite: false,
    },
    {
      id: 'tag-brand',
      label: 'Brand',
      color: '#009688',
      favorite: false,
    },
    {
      id: 'tag-inspiration',
      label: 'Inspiration',
      color: '#FFC107',
      favorite: false,
    },
    {
      id: 'tag-team',
      label: 'Team',
      color: '#607D8B',
      favorite: false,
    },
  ];

  return createTemplateState(baseTasks, tags);
};

const createMarketingDirectorTemplateState = (): PersistedState => {
  const todayKey = new Date().toISOString().slice(0, 10);
  const baseTasks: Task[] = [
    {
      id: 'marketing-director-task-001',
      title: 'Outline Q3 integrated campaign strategy',
      createdAt: '2024-05-01T09:00:00.000Z',
      priority: 'high',
      tags: ['Campaign'],
      listId: 'ideas',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'marketing-director-task-002',
      title: 'Review budget allocations with finance partner',
      createdAt: '2024-05-02T11:30:00.000Z',
      priority: 'medium',
      tags: ['Budget'],
      listId: 'backlog',
      plannedFor: todayKey,
      dayStatus: 'todo',
      repeat: null,
    },
    {
      id: 'marketing-director-task-003',
      title: 'Sync with sales director on campaign enablement needs',
      createdAt: '2024-05-02T15:40:00.000Z',
      priority: 'medium',
      tags: ['Team'],
      listId: 'backlog',
      plannedFor: todayKey,
      dayStatus: 'doing',
      repeat: null,
    },
    {
      id: 'marketing-director-task-004',
      title: 'Finalize media plan with agency partners',
      createdAt: '2024-05-03T10:45:00.000Z',
      priority: 'high',
      tags: ['Campaign'],
      listId: 'inprogress',
      plannedFor: todayKey,
      dayStatus: 'doing',
      repeat: null,
    },
    {
      id: 'marketing-director-task-005',
      title: 'Publish monthly marketing performance newsletter',
      createdAt: '2024-05-04T09:20:00.000Z',
      priority: 'medium',
      tags: ['Content'],
      listId: 'inprogress',
      plannedFor: todayKey,
      dayStatus: 'done',
      repeat: null,
    },
    {
      id: 'marketing-director-task-006',
      title: 'Approve creative brief for webinar series',
      createdAt: '2024-05-04T13:15:00.000Z',
      priority: 'medium',
      tags: ['Campaign'],
      listId: 'backlog',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'marketing-director-task-007',
      title: 'Analyze paid media performance dashboards',
      createdAt: '2024-05-05T08:40:00.000Z',
      priority: 'medium',
      tags: ['Analytics'],
      listId: 'backlog',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'marketing-director-task-008',
      title: 'Draft executive update for leadership meeting',
      createdAt: '2024-05-05T12:50:00.000Z',
      priority: 'medium',
      tags: ['Content'],
      listId: 'backlog',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'marketing-director-task-009',
      title: 'Weekly alignment with demand gen manager',
      createdAt: '2024-05-06T09:05:00.000Z',
      priority: 'medium',
      tags: ['Team'],
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
      id: 'marketing-director-task-010',
      title: 'Assess lead nurturing journey drop-off points',
      createdAt: '2024-05-06T16:10:00.000Z',
      priority: 'medium',
      tags: ['Analytics'],
      listId: 'ideas',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'marketing-director-task-011',
      title: 'Update brand messaging guidelines repository',
      createdAt: '2024-05-07T14:00:00.000Z',
      priority: 'low',
      tags: ['Content'],
      listId: 'done',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'marketing-director-task-012',
      title: 'Monitor community responses post-campaign launch',
      createdAt: '2024-05-07T18:30:00.000Z',
      priority: 'medium',
      tags: ['Analytics'],
      listId: 'inprogress',
      plannedFor: null,
      repeat: null,
    },
  ];

  const tags: Tag[] = [
    {
      id: 'tag-campaign',
      label: 'Campaign',
      color: '#FF5722',
      favorite: true,
    },
    {
      id: 'tag-analytics',
      label: 'Analytics',
      color: '#3F51B5',
      favorite: false,
    },
    {
      id: 'tag-team',
      label: 'Team',
      color: '#8BC34A',
      favorite: false,
    },
    {
      id: 'tag-budget',
      label: 'Budget',
      color: '#795548',
      favorite: false,
    },
    {
      id: 'tag-content',
      label: 'Content',
      color: '#009688',
      favorite: false,
    },
  ];

  return createTemplateState(baseTasks, tags);
};

const createProductManagerTemplateState = (): PersistedState => {
  const todayKey = new Date().toISOString().slice(0, 10);
  const baseTasks: Task[] = [
    {
      id: 'product-manager-task-001',
      title: 'Synthesize interview notes into opportunity themes',
      createdAt: '2024-05-01T08:30:00.000Z',
      priority: 'medium',
      tags: ['Discovery'],
      listId: 'ideas',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'product-manager-task-002',
      title: 'Prepare roadmap briefing for leadership',
      createdAt: '2024-05-01T13:20:00.000Z',
      priority: 'high',
      tags: ['Roadmap'],
      listId: 'backlog',
      plannedFor: todayKey,
      dayStatus: 'todo',
      repeat: null,
    },
    {
      id: 'product-manager-task-003',
      title: 'Run refinement session with engineering team',
      createdAt: '2024-05-02T09:10:00.000Z',
      priority: 'medium',
      tags: ['Delivery'],
      listId: 'backlog',
      plannedFor: todayKey,
      dayStatus: 'doing',
      repeat: null,
    },
    {
      id: 'product-manager-task-004',
      title: 'Review experimentation backlog prioritization',
      createdAt: '2024-05-02T15:45:00.000Z',
      priority: 'medium',
      tags: ['Metrics'],
      listId: 'inprogress',
      plannedFor: todayKey,
      dayStatus: 'doing',
      repeat: null,
    },
    {
      id: 'product-manager-task-005',
      title: 'Follow up on critical bug triage outcomes',
      createdAt: '2024-05-03T07:50:00.000Z',
      priority: 'high',
      tags: ['Delivery'],
      listId: 'inprogress',
      plannedFor: todayKey,
      dayStatus: 'done',
      repeat: null,
    },
    {
      id: 'product-manager-task-006',
      title: 'Draft product brief for mobile onboarding revamp',
      createdAt: '2024-05-03T12:35:00.000Z',
      priority: 'medium',
      tags: ['Roadmap'],
      listId: 'backlog',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'product-manager-task-007',
      title: 'Customer call: validate dashboard concept',
      createdAt: '2024-05-04T09:25:00.000Z',
      priority: 'medium',
      tags: ['Stakeholder'],
      listId: 'backlog',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'product-manager-task-008',
      title: 'Analyze retention metrics by cohort',
      createdAt: '2024-05-04T14:15:00.000Z',
      priority: 'medium',
      tags: ['Metrics'],
      listId: 'backlog',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'product-manager-task-009',
      title: 'Weekly sync with design lead',
      createdAt: '2024-05-05T11:00:00.000Z',
      priority: 'medium',
      tags: ['Stakeholder'],
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
      id: 'product-manager-task-010',
      title: 'Document sprint goal recap for stakeholders',
      createdAt: '2024-05-05T17:10:00.000Z',
      priority: 'low',
      tags: ['Delivery'],
      listId: 'done',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'product-manager-task-011',
      title: 'Evaluate roadmap risks and mitigation options',
      createdAt: '2024-05-06T08:55:00.000Z',
      priority: 'medium',
      tags: ['Roadmap'],
      listId: 'ideas',
      plannedFor: null,
      repeat: null,
    },
    {
      id: 'product-manager-task-012',
      title: 'Plan quarterly OKR review workshop',
      createdAt: '2024-05-06T13:35:00.000Z',
      priority: 'medium',
      tags: ['Stakeholder'],
      listId: 'ideas',
      plannedFor: null,
      repeat: null,
    },
  ];

  const tags: Tag[] = [
    {
      id: 'tag-discovery',
      label: 'Discovery',
      color: '#03A9F4',
      favorite: true,
    },
    {
      id: 'tag-stakeholder',
      label: 'Stakeholder',
      color: '#8BC34A',
      favorite: false,
    },
    {
      id: 'tag-roadmap',
      label: 'Roadmap',
      color: '#673AB7',
      favorite: false,
    },
    {
      id: 'tag-delivery',
      label: 'Delivery',
      color: '#FF9800',
      favorite: false,
    },
    {
      id: 'tag-metrics',
      label: 'Metrics',
      color: '#009688',
      favorite: false,
    },
  ];

  return createTemplateState(baseTasks, tags);
};

export const DEMO_TEMPLATES: DemoTemplate[] = [
  {
    id: 'tech-lead-demo-template',
    roleKey: 'techLead',
    createState: createTechLeadTemplateState,
  },
  {
    id: 'architect-demo-template',
    roleKey: 'architect',
    createState: createArchitectTemplateState,
  },
  {
    id: 'graphic-designer-demo-template',
    roleKey: 'graphicDesigner',
    createState: createGraphicDesignerTemplateState,
  },
  {
    id: 'marketing-director-demo-template',
    roleKey: 'marketingDirector',
    createState: createMarketingDirectorTemplateState,
  },
  {
    id: 'product-manager-demo-template',
    roleKey: 'productManager',
    createState: createProductManagerTemplateState,
  },
];
