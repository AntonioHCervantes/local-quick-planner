jest.mock('../../../lib/sounds', () => ({
  playReminderSound: jest.fn(),
}));

import { render } from '@testing-library/react';
import WorkScheduleManager from '../WorkScheduleManager';

describe('WorkScheduleManager', () => {
  it('renders without crashing', () => {
    render(<WorkScheduleManager />);
  });
});