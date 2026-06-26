import { z } from 'zod'
import { SESSION_STORAGE_KEY } from '../../core/constants'
import type { Session } from '../../core/types'

const sessionSchema = z.object({
  username: z.string(),
  token: z.string(),
})

export const sessionService = {
  getSession(): Session | null {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null

    try {
      const parsed = sessionSchema.safeParse(JSON.parse(raw))
      return parsed.success ? parsed.data : null
    } catch {
      return null
    }
  },

  setSession(session: Session): void {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  },

  clearSession(): void {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
  },

  isAuthenticated(): boolean {
    return this.getSession() !== null
  },
}