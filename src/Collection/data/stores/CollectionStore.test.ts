import { beforeEach, describe, expect, it } from 'vitest'
import { COLLECTION_STORAGE_KEY } from '../../core/constants'
import { collectionStore } from './CollectionStore'

const movieSnapshot = {
  title: 'Inception',
  posterPath: null,
  voteAverage: 8.8,
}

const tvSnapshot = {
  title: 'Breaking Bad',
  posterPath: null,
  voteAverage: 9.5,
}

function resetStore() {
  localStorage.clear()
  collectionStore.watchlistEntries = []
  collectionStore.customLists = []
  collectionStore.episodeProgress = []
  collectionStore.isHydrated = true
}

describe('CollectionStore', () => {
  beforeEach(() => {
    resetStore()
  })

  it('adds and removes watchlist entries', () => {
    collectionStore.add('movie', 27205, movieSnapshot)

    expect(collectionStore.isInWatchlist('movie', 27205)).toBe(true)
    expect(collectionStore.totalCount).toBe(1)

    collectionStore.remove('movie', 27205)

    expect(collectionStore.isInWatchlist('movie', 27205)).toBe(false)
    expect(collectionStore.totalCount).toBe(0)
  })

  it('creates a custom list and adds items to it', () => {
    const listId = collectionStore.createList('Must Watch', 'Top picks')

    expect(listId).toBeTruthy()
    expect(collectionStore.customLists).toHaveLength(1)

    collectionStore.addToList(listId!, 'movie', 27205, movieSnapshot)

    expect(collectionStore.isInList(listId!, 'movie', 27205)).toBe(true)
    expect(collectionStore.getList(listId!)?.items).toHaveLength(1)
  })

  it('tracks episode progress and supports mark season', () => {
    collectionStore.toggleEpisode(1399, 63056)
    collectionStore.toggleEpisode(1399, 63057)

    expect(collectionStore.isEpisodeWatched(1399, 63056)).toBe(true)
    expect(collectionStore.getWatchedCount(1399)).toBe(2)

    collectionStore.markSeason(1399, [63058, 63059])

    expect(collectionStore.getSeasonProgress(1399, [63056, 63057, 63058, 63059])).toEqual({
      watched: 4,
      total: 4,
    })
  })

  it('removing a TV show from watchlist clears episode progress', () => {
    collectionStore.add('tv', 1399, tvSnapshot)
    collectionStore.toggleEpisode(1399, 63056)
    collectionStore.setShowEpisodeTotal(1399, 62)

    expect(collectionStore.getWatchedCount(1399)).toBe(1)

    collectionStore.remove('tv', 1399)

    expect(collectionStore.isInWatchlist('tv', 1399)).toBe(false)
    expect(collectionStore.getWatchedCount(1399)).toBe(0)
    expect(collectionStore.getShowProgress(1399)).toEqual({ watched: 0, total: 0 })
  })

  it('persists data to localStorage', () => {
    collectionStore.add('movie', 27205, movieSnapshot)

    const raw = localStorage.getItem(COLLECTION_STORAGE_KEY)
    expect(raw).toBeTruthy()

    const parsed = JSON.parse(raw!)
    expect(parsed.version).toBe(2)
    expect(parsed.watchlist).toHaveLength(1)
  })
})