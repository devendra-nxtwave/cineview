import { z } from 'zod'

export const preferencesSchema = z.object({
  version: z.literal(1),
  language: z.enum(['en', 'hi', 'te']),
  theme: z.enum(['light', 'dark']),
  region: z.string().length(2),
})

export type ValidatedPreferences = z.infer<typeof preferencesSchema>