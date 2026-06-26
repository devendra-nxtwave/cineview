import { z } from 'zod'
import { genreSchema } from './movieSchemas'

export const seasonSummarySchema = z.object({
  season_number: z.number(),
  name: z.string(),
  episode_count: z.number(),
  poster_path: z.string().nullable(),
})

export const tvShowDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number(),
  genres: z.array(genreSchema).optional(),
  number_of_seasons: z.number().optional(),
  first_air_date: z.string().optional(),
  seasons: z.array(seasonSummarySchema),
})

export const episodeSchema = z.object({
  id: z.number(),
  episode_number: z.number(),
  name: z.string(),
  air_date: z.string().nullable().optional(),
  overview: z.string(),
  still_path: z.string().nullable(),
})

export const seasonDetailSchema = z.object({
  episodes: z.array(episodeSchema),
})