import { makeAutoObservable, runInAction } from 'mobx'
import {
  DEFAULT_WATCHLIST_STATUS,
  MAX_NOTE_LENGTH,
  WATCHLIST_STORAGE_KEY,
} from '../../core/constants'
import {
  watchlistEntrySchema,
  watchlistStorageSchema,
} from '../../core/schemas/watchlistSchema'
import type {
  MediaSnapshot,
  MediaType,
  WatchlistEntry,
  WatchlistStatus,
} from '../../core/types'

class WatchlistStore {
  entries: WatchlistEntry[] = []
  isHydrated = false

  constructor() {
    makeAutoObservable(this)
  }

  get totalCount(): number {
    return this.entries.length
  }

  get countByStatus() {
    return {
      want_to_watch: this.entries.filter((e) => e.status === 'want_to_watch').length,
      watching: this.entries.filter((e) => e.status === 'watching').length,
      completed: this.entries.filter((e) => e.status === 'completed').length,
    }
  }

  getStatusCounts() {
    const counts = this.countByStatus
    return {
      all: this.totalCount,
      want_to_watch: counts.want_to_watch,
      watching: counts.watching,
      completed: counts.completed,
    }
  }

  isInWatchlist(mediaType: MediaType, mediaId: number): boolean {
    return this.entries.some(
      (entry) => entry.mediaType === mediaType && entry.mediaId === mediaId,
    )
  }

  getEntry(mediaType: MediaType, mediaId: number): WatchlistEntry | undefined {
    return this.entries.find(
      (entry) => entry.mediaType === mediaType && entry.mediaId === mediaId,
    )
  }

  init() {
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY)

    if (!raw) {
      this.isHydrated = true
      return
    }

    try {
      const parsed = watchlistStorageSchema.parse(JSON.parse(raw))
      runInAction(() => {
        this.entries = parsed.entries
      })
    } catch {
      runInAction(() => {
        this.entries = []
      })
    }

    this.isHydrated = true
  }

  private persist() {
    const data = {
      version: 1 as const,
      entries: this.entries,
    }
    watchlistStorageSchema.parse(data)
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(data))
  }

  add(mediaType: MediaType, mediaId: number, snapshot: MediaSnapshot) {
    if (this.isInWatchlist(mediaType, mediaId)) return

    const now = new Date().toISOString()
    const entry: WatchlistEntry = {
      id: crypto.randomUUID(),
      mediaType,
      mediaId,
      status: DEFAULT_WATCHLIST_STATUS,
      snapshot,
      addedAt: now,
      updatedAt: now,
    }

    watchlistEntrySchema.parse(entry)
    this.entries = [...this.entries, entry]
    this.persist()
  }

  remove(mediaType: MediaType, mediaId: number) {
    this.entries = this.entries.filter(
      (entry) => !(entry.mediaType === mediaType && entry.mediaId === mediaId),
    )
    this.persist()
  }

  toggle(mediaType: MediaType, mediaId: number, snapshot: MediaSnapshot) {
    if (this.isInWatchlist(mediaType, mediaId)) {
      this.remove(mediaType, mediaId)
    } else {
      this.add(mediaType, mediaId, snapshot)
    }
  }

  updateStatus(mediaType: MediaType, mediaId: number, status: WatchlistStatus) {
    const index = this.entries.findIndex(
      (entry) => entry.mediaType === mediaType && entry.mediaId === mediaId,
    )
    if (index === -1) return

    const updated: WatchlistEntry = {
      ...this.entries[index],
      status,
      updatedAt: new Date().toISOString(),
    }

    watchlistEntrySchema.parse(updated)
    this.entries = this.entries.map((entry, i) => (i === index ? updated : entry))
    this.persist()
  }

  updateNote(mediaType: MediaType, mediaId: number, note: string) {
    const index = this.entries.findIndex(
      (entry) => entry.mediaType === mediaType && entry.mediaId === mediaId,
    )
    if (index === -1) return

    const trimmed = note.trim().slice(0, MAX_NOTE_LENGTH)
    const current = this.entries[index]
    const updated: WatchlistEntry = {
      ...current,
      updatedAt: new Date().toISOString(),
    }

    if (trimmed) {
      updated.note = trimmed
    } else {
      delete updated.note
    }

    watchlistEntrySchema.parse(updated)
    this.entries = this.entries.map((entry, i) => (i === index ? updated : entry))
    this.persist()
  }
}

export const watchlistStore = new WatchlistStore()