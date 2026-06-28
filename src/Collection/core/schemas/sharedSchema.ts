import { z } from 'zod'

export const mediaTypeSchema = z.enum(['movie', 'tv'])

export const watchlistStatusSchema = z.enum(['want_to_watch', 'watching', 'completed'])

export const mediaSnapshotSchema = z.object({
  title: z.string().min(1),
  posterPath: z.string().nullable(),
  voteAverage: z.number(),
})