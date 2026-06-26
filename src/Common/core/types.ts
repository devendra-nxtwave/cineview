import type { z } from 'zod'
import type {
  movieSchema,
  genreSchema,
  movieDetailSchema,
  castMemberSchema,
  videoSchema,
} from './schemas/movieSchemas'
import type { searchResultSchema } from './schemas/searchSchemas'
import type {
  tvShowDetailSchema,
  seasonSummarySchema,
  episodeSchema,
} from './schemas/tvSchemas'

export type Movie = z.infer<typeof movieSchema>
export type Genre = z.infer<typeof genreSchema>
export type MovieDetail = z.infer<typeof movieDetailSchema>
export type CastMember = z.infer<typeof castMemberSchema>
export type Video = z.infer<typeof videoSchema>
export type SearchResult = z.infer<typeof searchResultSchema>
export type TVShowDetail = z.infer<typeof tvShowDetailSchema>
export type SeasonSummary = z.infer<typeof seasonSummarySchema>
export type Episode = z.infer<typeof episodeSchema>