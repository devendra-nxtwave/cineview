import { WATCHLIST_STORAGE_KEY } from '../../core/constants'
import { watchlistStorageSchema } from '../../core/schemas/watchlistSchema'
import type { ValidatedCollectionStorage } from '../../core/schemas/collectionSchema'

export function migrateWatchlistStorage(): ValidatedCollectionStorage | null {
  const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = watchlistStorageSchema.parse(JSON.parse(raw))
    localStorage.removeItem(WATCHLIST_STORAGE_KEY)
    return {
      version: 2,
      watchlist: parsed.entries,
      customLists: [],
      episodeProgress: [],
    }
  } catch {
    localStorage.removeItem(WATCHLIST_STORAGE_KEY)
    return null
  }
}