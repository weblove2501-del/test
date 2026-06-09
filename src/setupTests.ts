import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { beforeAll, afterEach, afterAll } from 'vitest';

const server = setupServer(
  rest.post('/api/login', async (req, res, ctx) => {
    const body = await req.json();
    const { email, password } = body as { email?: string; password?: string };
    if ((email === 'admin@example.com' || email === 'user@example.com') && password === 'password') {
      return res(
        ctx.status(200),
        ctx.json({
          token: 'mock-token-123',
          user: { id: 'u-1', name: '관리자', email },
          expiresIn: 60,
        }),
      );
    }
    return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }));
  }),

  rest.post('/api/refresh', async (req, res, ctx) => {
    const body = await req.json();
    if (body && body.token) {
      return res(ctx.status(200), ctx.json({ token: 'mock-token-456', expiresIn: 60 }));
    }
    return res(ctx.status(400), ctx.json({ message: 'Missing token' }));
  }),
);

// Start server before all tests and clean up after
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
