/**
 * Token storage abstraction.
 *
 * Trade-offs:
 *  - localStorage: survives reload, vulnerable to XSS
 *  - sessionStorage: cleared on tab close
 *  - httpOnly cookie: ideal vs XSS, but requires backend cookie support
 *
 * We use localStorage for an MVP CRM. Migrating to httpOnly cookies later
 * means swapping ONLY this module — nothing else touches storage directly.
 */
const TOKEN_KEY = 'smartlib.accessToken';

export const tokenStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* quota / SSR — silently ignore */
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* noop */
    }
  },
};
