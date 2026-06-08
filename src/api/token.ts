import { refreshApi } from './auth';

const TOKEN_KEY = 'admin-system-token';
const TOKEN_EXP_KEY = 'admin-system-token-exp';

export function saveToken(token: string, expiresIn?: number) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  if (expiresIn) {
    const exp = Date.now() + expiresIn * 1000;
    localStorage.setItem(TOKEN_EXP_KEY, String(exp));
  } else {
    localStorage.removeItem(TOKEN_EXP_KEY);
  }
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(TOKEN_KEY);
  const exp = localStorage.getItem(TOKEN_EXP_KEY);
  if (!token) return null;
  if (exp && Number(exp) <= Date.now()) {
    // expired
    clearToken();
    return null;
  }
  return token;
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXP_KEY);
}

let refreshTimer: number | null = null;

export function scheduleRefresh(callback?: (newToken: string) => void) {
  if (typeof window === 'undefined') return;
  const expStr = localStorage.getItem(TOKEN_EXP_KEY);
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token || !expStr) return;
  const exp = Number(expStr);
  const now = Date.now();
  const msUntilExp = exp - now;
  const msBefore = Math.max(5000, msUntilExp - 15000); // refresh 15s before expiry, at least 5s

  if (refreshTimer) {
    window.clearTimeout(refreshTimer);
  }

  refreshTimer = window.setTimeout(async () => {
    const res = await refreshApi(token);
    if (res.ok) {
      saveToken(res.token, res.expiresIn);
      if (callback) callback(res.token);
      scheduleRefresh(callback); // schedule next
    } else {
      // failed to refresh: clear
      clearToken();
      if (callback) callback('');
    }
  }, msBefore);
}

export function stopRefresh() {
  if (typeof window === 'undefined') return;
  if (refreshTimer) {
    window.clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

export default {
  saveToken,
  getToken,
  clearToken,
  scheduleRefresh,
  stopRefresh,
};
