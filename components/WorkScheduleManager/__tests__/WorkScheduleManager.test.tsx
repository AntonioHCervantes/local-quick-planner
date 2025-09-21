jest.mock('react-hot-toast', () => ({
  toast: jest.fn(),
}));
jest.mock('../../../lib/sounds', () => ({
  playReminderSound: jest.fn(),
}));

import { act } from '@testing-library/react';
import { render } from '../../../test/test-utils';
import WorkScheduleManager from '../WorkScheduleManager';
import { useStore } from '../../../lib/store';
import { toast } from 'react-hot-toast';
import { playReminderSound } from '../../../lib/sounds';

describe('WorkScheduleManager', () => {
  const initialState = useStore.getState();
  const mockedToast = toast as jest.MockedFunction<typeof toast>;
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
    mockedToast.mockClear();
    mockedPlayReminderSound.mockClear();
  });

  afterEach(() => {
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
    expect(mockedToast).toHaveBeenCalledWith(
      'Your workday is about to end. Take a moment to plan tomorrow.',
      { duration: 8000 }
    );
    expect(mockedPlayReminderSound).toHaveBeenCalled();
  });
});
