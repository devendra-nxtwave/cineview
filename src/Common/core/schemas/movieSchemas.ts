import { z } from 'zod'

export const movieSchema = z.object({
  id: z.number(),
  title: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((val) => (typeof val === 'string' && val.trim() ? val.trim() : 'Unknown')),
  poster_path: z.union([z.string(), z.null(), z.undefined()]).optional(),
  backdrop_path: z.union([z.string(), z.null(), z.undefined()]).optional(),
  vote_average: z
    .union([z.number(), z.null(), z.undefined()])
    .transform((val) => (typeof val === 'number' && !Number.isNaN(val) ? val : 0)),
  genre_ids: z.array(z.number()).optional(),
  release_date: z.string().optional(),
  overview: z.string().optional(),
})

export const movieListSchema = z.object({
  results: z.array(movieSchema),
})

export const genreSchema = z.object({
  id: z.number(),
  name: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((val) => (typeof val === 'string' && val.trim() ? val.trim() : 'Unknown')),
})

export const genreListSchema = z.object({
  genres: z.array(genreSchema),
})

export const movieDetailSchema = movieSchema.extend({
  runtime: z.number().nullable().optional(),
  genres: z.array(genreSchema).optional(),
  tagline: z.string().optional(),
})

export const videoSchema = z.object({
  key: z.string(),
  site: z.string(),
  type: z.string(),
})

export const videosSchema = z.object({
  results: z.array(videoSchema),
})

export const castMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
})

export const creditsSchema = z.object({
  cast: z.array(castMemberSchema),
})