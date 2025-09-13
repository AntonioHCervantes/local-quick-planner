import { render, screen, fireEvent } from '../../../test/test-utils';
import AddTask from '../AddTask';
import useAddTask from '../useAddTask';

jest.mock('../useAddTask');

const mockUseAddTask = useAddTask as jest.MockedFunction<typeof useAddTask>;

describe('AddTask', () => {
  beforeEach(() => {
    mockUseAddTask.mockReturnValue({
      state: {
        title: 'Test task',
        tags: [],
        priority: 'medium',
        existingTags: [],
      },
      actions: {
        setTitle: jest.fn(),
        setPriority: jest.fn(),
        handleAdd: jest.fn(),
        handleTagInputChange: jest.fn(),
        handleExistingTagSelect: jest.fn(),
        handleTagInputBlur: jest.fn(),
        removeTag: jest.fn(),
      },
    });
  });

  it('calls handleAdd on submit', () => {
    render(
      <AddTask
        addTask={jest.fn()}
        tags={[]}
        addTag={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    const { handleAdd } = mockUseAddTask.mock.results[0].value.actions as any;
    expect(handleAdd).toHaveBeenCalled();
  });
});
