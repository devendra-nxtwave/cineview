import { describe, expect, it } from 'vitest'
import { collectionStorageSchema } from './collectionSchema'

const validStorage = {
  version: 2 as const,
  watchlist: [
    {
      id: 'entry-1',
      mediaType: 'movie' as const,
      mediaId: 550,
      status: 'want_to_watch' as const,
      snapshot: {
        title: 'Fight Club',
        posterPath: '/poster.jpg',
        voteAverage: 8.4,
      },
      addedAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  customLists: [
    {
      id: 'list-1',
      name: 'Favorites',
      items: [],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  episodeProgress: [
    {
      showId: 1399,
      watchedEpisodeIds: [63056],
      totalEpisodes: 73,
    },
  ],
}

describe('collectionStorageSchema', () => {
  it('parses valid collection storage', () => {
    const result = collectionStorageSchema.parse(validStorage)
    expect(result.version).toBe(2)
    expect(result.watchlist).toHaveLength(1)
    expect(result.customLists[0].name).toBe('Favorites')
  })

  it('rejects invalid version', () => {
    expect(() =>
      collectionStorageSchema.parse({ ...validStorage, version: 1 }),
    ).toThrow()
  })

  it('rejects watchlist notes over 300 characters', () => {
    expect(() =>
      collectionStorageSchema.parse({
        ...validStorage,
        watchlist: [
          {
            ...validStorage.watchlist[0],
            note: 'a'.repeat(301),
          },
        ],
      }),
    ).toThrow()
  })

  it('rejects custom list names over 60 characters', () => {
    expect(() =>
      collectionStorageSchema.parse({
        ...validStorage,
        customLists: [
          {
            ...validStorage.customLists[0],
            name: 'x'.repeat(61),
          },
        ],
      }),
    ).toThrow()
  })
})