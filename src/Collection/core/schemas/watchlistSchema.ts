import { z } from 'zod'

export const mediaTypeSchema = z.enum(['movie', 'tv'])

export const watchlistStatusSchema = z.enum(['want_to_watch', 'watching', 'completed'])

export const mediaSnapshotSchema = z.object({
  title: z.string().min(1),
  posterPath: z.string().nullable(),
  voteAverage: z.number(),
})

export const watchlistEntrySchema = z.object({
  id: z.string().min(1),
  mediaType: mediaTypeSchema,
  mediaId: z.number().int().positive(),
  status: watchlistStatusSchema,
  note: z.string().max(300).optional(),
  snapshot: mediaSnapshotSchema,
  addedAt: z.string().min(1),
  updatedAt: z.string().min(1),
})

export const watchlistStorageSchema = z.object({
  version: z.literal(1),
  entries: z.array(watchlistEntrySchema),
})

export type ValidatedWatchlistStorage = z.infer<typeof watchlistStorageSchema>