export type MediaType = 'movie' | 'tv'

export type WatchlistStatus = 'want_to_watch' | 'watching' | 'completed'

export type WatchlistFilterStatus = WatchlistStatus | 'all'

export type WatchlistSortOption = 'dateAdded' | 'rating' | 'title'

export type MediaSnapshot = {
  title: string
  posterPath: string | null
  voteAverage: number
}

export type WatchlistEntry = {
  id: string
  mediaType: MediaType
  mediaId: number
  status: WatchlistStatus
  note?: string
  snapshot: MediaSnapshot
  addedAt: string
  updatedAt: string
}

export function getMediaKey(mediaType: MediaType, mediaId: number): string {
  return `${mediaType}:${mediaId}`
}