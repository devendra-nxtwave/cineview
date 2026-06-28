import { z } from 'zod'
import {
  mediaSnapshotSchema,
  mediaTypeSchema,
  watchlistStatusSchema,
} from './sharedSchema'

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

export const listItemSchema = z.object({
  mediaType: mediaTypeSchema,
  mediaId: z.number().int().positive(),
  snapshot: mediaSnapshotSchema,
  addedAt: z.string().min(1),
})

export const customListSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(60),
  description: z.string().max(200).optional(),
  items: z.array(listItemSchema),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
})

export const episodeProgressEntrySchema = z.object({
  showId: z.number().int().positive(),
  watchedEpisodeIds: z.array(z.number().int().positive()),
  totalEpisodes: z.number().int().nonnegative().optional(),
})

export const collectionStorageSchema = z.object({
  version: z.literal(2),
  watchlist: z.array(watchlistEntrySchema),
  customLists: z.array(customListSchema),
  episodeProgress: z.array(episodeProgressEntrySchema),
})

export type ValidatedCollectionStorage = z.infer<typeof collectionStorageSchema>