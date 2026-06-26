import { z } from 'zod'

const RECENT_SEARCHES_KEY = 'cineview_recent_searches'
const MAX_RECENT = 10

const recentSearchesSchema = z.array(z.string())

export const recentSearchService = {
  getAll(): string[] {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (!raw) return []
    try {
      const parsed = recentSearchesSchema.safeParse(JSON.parse(raw))
      return parsed.success ? parsed.data : []
    } catch {
      return []
    }
  },

  add(query: string): void {
    const trimmed = query.trim()
    if (!trimmed) return
    const current = this.getAll().filter((q) => q !== trimmed)
    const updated = [trimmed, ...current].slice(0, MAX_RECENT)
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  },

  clear(): void {
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  },
}