import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { saveToken, getToken, clearToken, stopRefresh } from '../../src/api/token';

describe('token manager basic', () => {
  beforeEach(() => {
    localStorage.clear();
    stopRefresh();
  });

  afterEach(() => {
    localStorage.clear();
    stopRefresh();
  });

  it('save/get/clear token', () => {
    saveToken('t-123', 60);
    const t = getToken();
    expect(t).toBe('t-123');
    clearToken();
    expect(getToken()).toBeNull();
  });
});
