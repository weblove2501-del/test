export const API_BASE = import.meta.env.VITE_API_BASE || ''

/**
 * Build an API URL. Developers can change VITE_API_BASE in .env to point to backend.
 * Example: apiUrl('/mock/employees.json') -> '/mock/employees.json' or 'https://api.example.com/mock/employees.json'
 */
export function apiUrl(path: string) {
  if (!path) return API_BASE
  // ensure leading slash
  const p = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE}${p}`
}
