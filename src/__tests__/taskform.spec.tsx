import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { AppProvider } from '../../src/context/AppContext';
import TaskForm from '../../src/components/TaskForm';

describe('TaskForm', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows validation errors for empty title, assignee and past due date', async () => {
    const onClose = vi.fn();
    render(
      <AppProvider>
        <TaskForm onClose={onClose} />
      </AppProvider>,
    );

    const user = userEvent.setup();
    const save = screen.getByRole('button', { name: /저장/ });

    // Clear title
    const title = screen.getByLabelText(/업무명/i);
    await user.clear(title);

    // Set due date to past
    const dueDate = screen.getByLabelText(/기한/i);
    await user.clear(dueDate);
    await user.type(dueDate, '2000-01-01');

    await user.click(save);

    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.getByRole('alert').textContent).toMatch(/업무명|기한|담당자/);
  });
});
