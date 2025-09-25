jest.mock('../../../lib/sounds', () => ({
  playReminderSound: jest.fn(),
}));

import { act } from '@testing-library/react';
import { render } from '../../../test/test-utils';
import WorkScheduleManager from '../WorkScheduleManager';
import { useStore } from '../../../lib/store';
import { playReminderSound } from '../../../lib/sounds';

describe('WorkScheduleManager', () => {
  const initialState = useStore.getState();
  const mockedPlayReminderSound = playReminderSound as jest.MockedFunction<
    typeof playReminderSound
  >;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-05-01T16:29:30.000Z'));
    useStore.setState({
      notifications: [],
      workSchedule: {
        ...initialState.workSchedule,
        wednesday: [30, 31, 32, 33],
      },
      workPreferences: {
        planningReminder: {
          enabled: true,
          minutesBefore: 30,
          lastNotifiedDate: null,
        },
      },
    });
    mockedPlayReminderSound.mockClear();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.clearAllTimers();
    jest.useRealTimers();
    useStore.setState(initialState, true);
  });

  it('creates an unread notification when the reminder window starts', () => {
    render(<WorkScheduleManager />);

    act(() => {
      jest.advanceTimersByTime(30_000);
    });

    const state = useStore.getState();
    expect(state.workPreferences.planningReminder.lastNotifiedDate).toBe(
      '2024-05-01'
    );
    expect(state.notifications[0]).toMatchObject({
      type: 'tip',
      read: false,
      titleKey: 'notifications.workReminder.title',
      descriptionKey: 'notifications.workReminder.description',
    });
    expect(state.notifications).toHaveLength(1);
    expect(mockedPlayReminderSound).toHaveBeenCalled();
  });

  it('honors the configured minutesBefore offset', () => {
    jest.setSystemTime(new Date('2024-05-01T16:44:45.000Z'));
    useStore.setState({
      notifications: [],
      workSchedule: {
        ...initialState.workSchedule,
        wednesday: [30, 31, 32, 33],
      },
      workPreferences: {
        planningReminder: {
          enabled: true,
          minutesBefore: 15,
          lastNotifiedDate: null,
        },
      },
    });

    render(<WorkScheduleManager />);

    expect(useStore.getState().notifications).toHaveLength(0);
    expect(mockedPlayReminderSound).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(15_000);
    });

    expect(useStore.getState().workPreferences.planningReminder).toMatchObject({
      lastNotifiedDate: '2024-05-01',
    });
    expect(useStore.getState().notifications).toHaveLength(1);
    expect(mockedPlayReminderSound).toHaveBeenCalledTimes(1);
  });

  it('handles reminder offsets that are persisted as strings', () => {
    jest.setSystemTime(new Date('2024-05-01T16:29:30.000Z'));
    useStore.setState({
      notifications: [],
      workSchedule: {
        ...initialState.workSchedule,
        wednesday: [30, 31, 32, 33],
      },
      workPreferences: {
        planningReminder: {
          enabled: true,
          minutesBefore: '30' as unknown as number,
          lastNotifiedDate: null,
        },
      },
    });

    render(<WorkScheduleManager />);

    act(() => {
      jest.advanceTimersByTime(30_000);
    });

    expect(
      useStore.getState().workPreferences.planningReminder.lastNotifiedDate
    ).toBe('2024-05-01');
    expect(useStore.getState().notifications).toHaveLength(1);
    expect(mockedPlayReminderSound).toHaveBeenCalledTimes(1);
  });

  it('fires immediately when already within the reminder window', () => {
    jest.setSystemTime(new Date('2024-05-01T16:45:10.000Z'));
    useStore.setState({
      notifications: [],
      workSchedule: {
        ...initialState.workSchedule,
        wednesday: [30, 31, 32, 33],
      },
      workPreferences: {
        planningReminder: {
          enabled: true,
          minutesBefore: 15,
          lastNotifiedDate: null,
        },
      },
    });

    render(<WorkScheduleManager />);

    expect(useStore.getState().notifications).toHaveLength(1);
    expect(mockedPlayReminderSound).toHaveBeenCalledTimes(1);
  });

  it('emits once when the reminder is enabled during the window', () => {
    jest.setSystemTime(new Date('2024-05-01T16:45:10.000Z'));
    useStore.setState({
      notifications: [],
      workSchedule: {
        ...initialState.workSchedule,
        wednesday: [30, 31, 32, 33],
      },
      workPreferences: {
        planningReminder: {
          enabled: false,
          minutesBefore: 15,
          lastNotifiedDate: null,
        },
      },
    });

    render(<WorkScheduleManager />);

    expect(useStore.getState().notifications).toHaveLength(0);
    expect(mockedPlayReminderSound).not.toHaveBeenCalled();

    act(() => {
      useStore.getState().setPlanningReminderEnabled(true);
    });

    expect(useStore.getState().notifications).toHaveLength(1);
    expect(mockedPlayReminderSound).toHaveBeenCalledTimes(1);
  });

  it('does not emit reminders once the workday has ended', () => {
    jest.setSystemTime(new Date('2024-05-01T17:00:10.000Z'));
    useStore.setState({
      notifications: [],
      workSchedule: {
        ...initialState.workSchedule,
        wednesday: [30, 31, 32, 33],
      },
      workPreferences: {
        planningReminder: {
          enabled: true,
          minutesBefore: 30,
          lastNotifiedDate: null,
        },
      },
    });

    render(<WorkScheduleManager />);

    act(() => {
      jest.advanceTimersByTime(30_000);
    });

    expect(mockedPlayReminderSound).not.toHaveBeenCalled();
    expect(
      useStore.getState().workPreferences.planningReminder.lastNotifiedDate
    ).toBeNull();
    expect(useStore.getState().notifications).toHaveLength(0);
  });
});
