import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppProvider, useAppContext } from '../../src/context/AppContext';
import Layout from '../../src/components/Layout/Layout';

function NotificationTester() {
  const { notify } = useAppContext();
  return (
    <div>
      <button onClick={() => notify('테스트 알림')}>notify</button>
    </div>
  );
}

describe('Global notification live region', () => {
  it('announces notifications via live region', async () => {
    render(
      <AppProvider>
        <Layout />
        <NotificationTester />
      </AppProvider>,
    );

    const btn = screen.getByRole('button', { name: /notify/i });
    btn.click();

    // The live region is visually hidden; wait for it to receive the notification text
    const live = document.querySelector('[role="status"]');
    expect(live).toBeTruthy();
    await waitFor(() => {
      expect(live?.textContent).toContain('테스트 알림');
    });
  });
});
