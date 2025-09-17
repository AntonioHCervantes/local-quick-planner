import { useStore } from '../store';

describe('work schedule store', () => {
  const initialState = useStore.getState();

  beforeEach(() => {
    useStore.setState(initialState, true);
    localStorage.clear();
  });

  afterAll(() => {
    useStore.setState(initialState, true);
    localStorage.clear();
  });

  it('adds and removes slots when toggling', () => {
    const addMode = useStore.getState().toggleWorkScheduleSlot('monday', 10);
    expect(addMode).toBe('add');
    expect(useStore.getState().workSchedule.monday).toContain(10);

    const removeMode = useStore.getState().toggleWorkScheduleSlot('monday', 10);
    expect(removeMode).toBe('remove');
    expect(useStore.getState().workSchedule.monday).not.toContain(10);
  });

  it('respects explicit mode when dragging', () => {
    useStore.getState().toggleWorkScheduleSlot('tuesday', 5, 'add');
    useStore.getState().toggleWorkScheduleSlot('tuesday', 5, 'add');
    expect(useStore.getState().workSchedule.tuesday).toEqual([5]);

    useStore.getState().toggleWorkScheduleSlot('tuesday', 5, 'remove');
    expect(useStore.getState().workSchedule.tuesday).toEqual([]);
  });

  it('updates reminder preferences', () => {
    useStore.getState().setPlanningReminderMinutes(30);
    expect(
      useStore.getState().workPreferences.planningReminder.minutesBefore
    ).toBe(30);

    useStore.getState().setPlanningReminderEnabled(true);
    expect(useStore.getState().workPreferences.planningReminder.enabled).toBe(
      true
    );

    useStore.getState().setPlanningReminderLastNotified('2024-05-20');
    expect(
      useStore.getState().workPreferences.planningReminder.lastNotifiedDate
    ).toBe('2024-05-20');
  });
});
