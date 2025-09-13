import { render, screen } from '../../../test/test-utils';
import Board from '../Board';
import useBoard from '../useBoard';

jest.mock('../useBoard');
jest.mock('../../Column/Column', () => ({
  __esModule: true,
  default: ({ title }: any) => <div>{title}</div>,
}));

describe('Board', () => {
  it('renders columns', () => {
    (useBoard as jest.Mock).mockReturnValue({
      state: {
        sensors: [],
        activeTask: null,
        columns: [
          { id: 'c1', title: 'Col1' },
          { id: 'c2', title: 'Col2' },
        ],
      },
      actions: {
        getTasks: () => [],
        handleDragStart: jest.fn(),
        handleDragOver: jest.fn(),
        handleDragEnd: jest.fn(),
      },
      helpers: { closestCorners: jest.fn() },
    });

    render(<Board mode="my-day" />);

    expect(screen.getByText('Col1')).toBeInTheDocument();
    expect(screen.getByText('Col2')).toBeInTheDocument();
  });
});
