import { z } from 'zod'

export const searchResultSchema = z.object({
  id: z.number(),
  media_type: z.enum(['movie', 'tv', 'person']),
  title: z.string().optional(),
  name: z.string().optional(),
  poster_path: z.string().nullable().optional(),
  profile_path: z.string().nullable().optional(),
  release_date: z.string().optional(),
  first_air_date: z.string().optional(),
})

export const searchMultiSchema = z.object({
  results: z.array(searchResultSchema),
})