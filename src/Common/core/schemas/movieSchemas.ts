import { z } from 'zod'

export const movieSchema = z.object({
  id: z.number(),
  title: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  vote_average: z.number(),
  genre_ids: z.array(z.number()).optional(),
  release_date: z.string().optional(),
  overview: z.string().optional(),
})

export const movieListSchema = z.object({
  results: z.array(movieSchema),
})

export const genreSchema = z.object({
  id: z.number(),
  name: z.string(),
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