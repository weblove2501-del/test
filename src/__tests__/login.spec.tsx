import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { AppProvider } from '../../src/context/AppContext';
import LoginForm from '../../src/components/LoginForm';

describe('LoginForm integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('logs in successfully with test account and saves user', async () => {
    render(
      <AppProvider>
        <LoginForm />
      </AppProvider>,
    );

    const user = userEvent.setup();
    const email = screen.getByLabelText(/이메일/i);
    const password = screen.getByLabelText(/비밀번호/i);
    const button = screen.getByRole('button', { name: /로그인/i });

    await user.type(email, 'admin@example.com');
    await user.type(password, 'password');
    await user.click(button);

    await waitFor(() => expect(localStorage.getItem('admin-system-user')).not.toBeNull());
    const saved = JSON.parse(localStorage.getItem('admin-system-user') || 'null');
    expect(saved.email).toBe('admin@example.com');
  });
});
