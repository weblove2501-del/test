import type { User } from '../types'

export type LoginResult =
  | { ok: true; user: User; token: string }
  | { ok: false; message: string }

export async function loginApi(email: string, password: string): Promise<LoginResult> {
  // Try calling a real backend endpoint. If not available, return a failure
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText || 'Login failed')
      return { ok: false, message: text }
    }

    const data = await res.json()
    // Expecting { user, token }
    if (!data || !data.user || !data.token) {
      return { ok: false, message: 'Invalid response from auth server' }
    }

    return { ok: true, user: data.user as User, token: String(data.token) }
  } catch (err) {
    return { ok: false, message: 'Network error or auth endpoint not available' }
  }
}
