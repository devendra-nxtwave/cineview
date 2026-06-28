import { makeAutoObservable, runInAction } from 'mobx'
import {
  COLLECTION_STORAGE_KEY,
  DEFAULT_WATCHLIST_STATUS,
  MAX_LIST_NAME_LENGTH,
  MAX_NOTE_LENGTH,
} from '../../core/constants'
import { collectionStorageSchema } from '../../core/schemas/collectionSchema'
import { watchlistEntrySchema } from '../../core/schemas/collectionSchema'
import { customListSchema } from '../../core/schemas/collectionSchema'
import { migrateWatchlistStorage } from '../utils/migrateWatchlistStorage'
import type {
  CustomList,
  EpisodeProgressEntry,
  MediaSnapshot,
  MediaType,
  WatchlistEntry,
  WatchlistStatus,
} from '../../core/types'
import { getMediaKey } from '../../core/types'

class CollectionStore {
  watchlistEntries: WatchlistEntry[] = []
  customLists: CustomList[] = []
  episodeProgress: EpisodeProgressEntry[] = []
  isHydrated = false

  constructor() {
    makeAutoObservable(this)
  }

  // --- computed (watchlist) ---

  get entries(): WatchlistEntry[] {
    return this.watchlistEntries
  }

  get totalCount(): number {
    return this.watchlistEntries.length
  }

  get countByStatus() {
    return {
      want_to_watch: this.watchlistEntries.filter((e) => e.status === 'want_to_watch').length,
      watching: this.watchlistEntries.filter((e) => e.status === 'watching').length,
      completed: this.watchlistEntries.filter((e) => e.status === 'completed').length,
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
    return this.watchlistEntries.some(
      (entry) => entry.mediaType === mediaType && entry.mediaId === mediaId,
    )
  }

  getEntry(mediaType: MediaType, mediaId: number): WatchlistEntry | undefined {
    return this.watchlistEntries.find(
      (entry) => entry.mediaType === mediaType && entry.mediaId === mediaId,
    )
  }

  getList(listId: string): CustomList | undefined {
    return this.customLists.find((list) => list.id === listId)
  }

  isInList(listId: string, mediaType: MediaType, mediaId: number): boolean {
    const list = this.getList(listId)
    if (!list) return false
    return list.items.some(
      (item) => item.mediaType === mediaType && item.mediaId === mediaId,
    )
  }

  isInAnyList(mediaType: MediaType, mediaId: number): boolean {
    return this.customLists.some((list) =>
      list.items.some(
        (item) => item.mediaType === mediaType && item.mediaId === mediaId,
      ),
    )
  }

  getListsContaining(mediaType: MediaType, mediaId: number): CustomList[] {
    return this.customLists.filter((list) =>
      list.items.some(
        (item) => item.mediaType === mediaType && item.mediaId === mediaId,
      ),
    )
  }

  // --- episode progress ---

  private getProgressEntry(showId: number): EpisodeProgressEntry | undefined {
    return this.episodeProgress.find((entry) => entry.showId === showId)
  }

  isEpisodeWatched(showId: number, episodeId: number): boolean {
    const entry = this.getProgressEntry(showId)
    return entry?.watchedEpisodeIds.includes(episodeId) ?? false
  }

  getWatchedCount(showId: number): number {
    return this.getProgressEntry(showId)?.watchedEpisodeIds.length ?? 0
  }

  getSeasonProgress(showId: number, episodeIds: number[]) {
    const watched = episodeIds.filter((id) => this.isEpisodeWatched(showId, id)).length
    return { watched, total: episodeIds.length }
  }

  getShowProgress(showId: number) {
    const entry = this.getProgressEntry(showId)
    const watched = entry?.watchedEpisodeIds.length ?? 0
    const total = entry?.totalEpisodes ?? 0
    return { watched, total }
  }

  // --- init / persist ---

  init() {
    const raw = localStorage.getItem(COLLECTION_STORAGE_KEY)

    if (!raw) {
      const migrated = migrateWatchlistStorage()
      if (migrated) {
        runInAction(() => {
          this.watchlistEntries = migrated.watchlist
          this.customLists = migrated.customLists
          this.episodeProgress = migrated.episodeProgress
        })
        this.persist()
      }
      this.isHydrated = true
      return
    }

    try {
      const parsed = collectionStorageSchema.parse(JSON.parse(raw))
      runInAction(() => {
        this.watchlistEntries = parsed.watchlist
        this.customLists = parsed.customLists
        this.episodeProgress = parsed.episodeProgress
      })
    } catch {
      const migrated = migrateWatchlistStorage()
      runInAction(() => {
        if (migrated) {
          this.watchlistEntries = migrated.watchlist
          this.customLists = migrated.customLists
          this.episodeProgress = migrated.episodeProgress
        } else {
          this.watchlistEntries = []
          this.customLists = []
          this.episodeProgress = []
        }
      })
    }

    this.isHydrated = true
  }

  private persist() {
    const data = {
      version: 2 as const,
      watchlist: this.watchlistEntries,
      customLists: this.customLists,
      episodeProgress: this.episodeProgress,
    }
    collectionStorageSchema.parse(data)
    localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(data))
  }

  // --- watchlist actions ---

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
    this.watchlistEntries = [...this.watchlistEntries, entry]
    this.persist()
  }

  remove(mediaType: MediaType, mediaId: number) {
    this.watchlistEntries = this.watchlistEntries.filter(
      (entry) => !(entry.mediaType === mediaType && entry.mediaId === mediaId),
    )

    if (mediaType === 'tv') {
      this.episodeProgress = this.episodeProgress.filter(
        (entry) => entry.showId !== mediaId,
      )
    }

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
    const index = this.watchlistEntries.findIndex(
      (entry) => entry.mediaType === mediaType && entry.mediaId === mediaId,
    )
    if (index === -1) return

    const updated: WatchlistEntry = {
      ...this.watchlistEntries[index],
      status,
      updatedAt: new Date().toISOString(),
    }

    watchlistEntrySchema.parse(updated)
    this.watchlistEntries = this.watchlistEntries.map((entry, i) =>
      i === index ? updated : entry,
    )
    this.persist()
  }

  updateNote(mediaType: MediaType, mediaId: number, note: string) {
    const index = this.watchlistEntries.findIndex(
      (entry) => entry.mediaType === mediaType && entry.mediaId === mediaId,
    )
    if (index === -1) return

    const trimmed = note.trim().slice(0, MAX_NOTE_LENGTH)
    const current = this.watchlistEntries[index]
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
    this.watchlistEntries = this.watchlistEntries.map((entry, i) =>
      i === index ? updated : entry,
    )
    this.persist()
  }

  // --- custom list actions ---

  createList(name: string, description?: string): string | null {
    const trimmedName = name.trim().slice(0, MAX_LIST_NAME_LENGTH)
    if (!trimmedName) return null

    const trimmedDescription = description?.trim()
    const now = new Date().toISOString()
    const list: CustomList = {
      id: crypto.randomUUID(),
      name: trimmedName,
      items: [],
      createdAt: now,
      updatedAt: now,
    }

    if (trimmedDescription) {
      list.description = trimmedDescription
    }

    customListSchema.parse(list)
    this.customLists = [...this.customLists, list]
    this.persist()
    return list.id
  }

  renameList(listId: string, name: string) {
    const index = this.customLists.findIndex((list) => list.id === listId)
    if (index === -1) return

    const trimmedName = name.trim().slice(0, MAX_LIST_NAME_LENGTH)
    if (!trimmedName) return

    const updated: CustomList = {
      ...this.customLists[index],
      name: trimmedName,
      updatedAt: new Date().toISOString(),
    }

    customListSchema.parse(updated)
    this.customLists = this.customLists.map((list, i) => (i === index ? updated : list))
    this.persist()
  }

  deleteList(listId: string) {
    this.customLists = this.customLists.filter((list) => list.id !== listId)
    this.persist()
  }

  addToList(
    listId: string,
    mediaType: MediaType,
    mediaId: number,
    snapshot: MediaSnapshot,
  ) {
    const index = this.customLists.findIndex((list) => list.id === listId)
    if (index === -1) return

    const list = this.customLists[index]
    if (list.items.some((item) => getMediaKey(item.mediaType, item.mediaId) === getMediaKey(mediaType, mediaId))) {
      return
    }

    const updated: CustomList = {
      ...list,
      items: [
        ...list.items,
        {
          mediaType,
          mediaId,
          snapshot,
          addedAt: new Date().toISOString(),
        },
      ],
      updatedAt: new Date().toISOString(),
    }

    customListSchema.parse(updated)
    this.customLists = this.customLists.map((l, i) => (i === index ? updated : l))
    this.persist()
  }

  removeFromList(listId: string, mediaType: MediaType, mediaId: number) {
    const index = this.customLists.findIndex((list) => list.id === listId)
    if (index === -1) return

    const list = this.customLists[index]
    const updated: CustomList = {
      ...list,
      items: list.items.filter(
        (item) => !(item.mediaType === mediaType && item.mediaId === mediaId),
      ),
      updatedAt: new Date().toISOString(),
    }

    customListSchema.parse(updated)
    this.customLists = this.customLists.map((l, i) => (i === index ? updated : l))
    this.persist()
  }

  toggleListItem(
    listId: string,
    mediaType: MediaType,
    mediaId: number,
    snapshot: MediaSnapshot,
  ) {
    if (this.isInList(listId, mediaType, mediaId)) {
      this.removeFromList(listId, mediaType, mediaId)
    } else {
      this.addToList(listId, mediaType, mediaId, snapshot)
    }
  }

  // --- episode actions ---

  setShowEpisodeTotal(showId: number, totalEpisodes: number) {
    const index = this.episodeProgress.findIndex((entry) => entry.showId === showId)
    if (index === -1) {
      this.episodeProgress = [
        ...this.episodeProgress,
        { showId, watchedEpisodeIds: [], totalEpisodes },
      ]
    } else {
      this.episodeProgress = this.episodeProgress.map((entry, i) =>
        i === index ? { ...entry, totalEpisodes } : entry,
      )
    }
    this.persist()
  }

  toggleEpisode(showId: number, episodeId: number) {
    const index = this.episodeProgress.findIndex((entry) => entry.showId === showId)

    if (index === -1) {
      this.episodeProgress = [
        ...this.episodeProgress,
        { showId, watchedEpisodeIds: [episodeId] },
      ]
    } else {
      const entry = this.episodeProgress[index]
      const watched = entry.watchedEpisodeIds.includes(episodeId)
        ? entry.watchedEpisodeIds.filter((id) => id !== episodeId)
        : [...entry.watchedEpisodeIds, episodeId]

      this.episodeProgress = this.episodeProgress.map((e, i) =>
        i === index ? { ...e, watchedEpisodeIds: watched } : e,
      )
    }

    this.persist()
  }

  markSeason(showId: number, episodeIds: number[]) {
    const index = this.episodeProgress.findIndex((entry) => entry.showId === showId)
    const merged = new Set([
      ...(index === -1 ? [] : this.episodeProgress[index].watchedEpisodeIds),
      ...episodeIds,
    ])

    if (index === -1) {
      this.episodeProgress = [
        ...this.episodeProgress,
        { showId, watchedEpisodeIds: [...merged] },
      ]
    } else {
      this.episodeProgress = this.episodeProgress.map((entry, i) =>
        i === index ? { ...entry, watchedEpisodeIds: [...merged] } : entry,
      )
    }

    this.persist()
  }

  unmarkSeason(showId: number, episodeIds: number[]) {
    const index = this.episodeProgress.findIndex((entry) => entry.showId === showId)
    if (index === -1) return

    const removeSet = new Set(episodeIds)
    const watched = this.episodeProgress[index].watchedEpisodeIds.filter(
      (id) => !removeSet.has(id),
    )

    this.episodeProgress = this.episodeProgress.map((entry, i) =>
      i === index ? { ...entry, watchedEpisodeIds: watched } : entry,
    )
    this.persist()
  }
}

export const collectionStore = new CollectionStore()