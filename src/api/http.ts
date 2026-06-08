import tokenManager from './token';
import { refreshApi } from './auth';

type RequestInitMaybe = RequestInit & { retry?: boolean };

export async function httpFetch(input: RequestInfo, init?: RequestInitMaybe): Promise<Response> {
  const token = tokenManager.getToken();
  const headers = new Headers(init?.headers as HeadersInit);
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(input, { ...init, headers });

  // If unauthorized and we haven't retried yet, try refresh and retry once
  if (res.status === 401 && !init?.retry) {
    const currentToken = tokenManager.getToken();
    if (!currentToken) return res;
    const refresh = await refreshApi(currentToken);
    if (refresh.ok) {
      tokenManager.saveToken(refresh.token, refresh.expiresIn);
      tokenManager.scheduleRefresh(() => {});
      // retry original request with new token
      const newHeaders = new Headers(init?.headers as HeadersInit);
      newHeaders.set('Authorization', `Bearer ${refresh.token}`);
      return fetch(input, { ...init, headers: newHeaders, retry: true } as RequestInit);
    }
  }

  return res;
}

export default httpFetch;
