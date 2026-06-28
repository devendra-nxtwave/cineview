export const PREFERENCES_STORAGE_KEY = 'cineview-preferences'

export const SUPPORTED_LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'te', label: 'తెలుగు' },
] as const

export const SUPPORTED_REGIONS = [
  { code: 'IN', label: 'India' },
  { code: 'US', label: 'United States' },
  { code: 'GB', label: 'United Kingdom' },
] as const

export const LOCALE_TO_TMDB: Record<string, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  te: 'te-IN',
}

export const DEFAULT_PREFERENCES = {
  version: 1 as const,
  language: 'en',
  theme: 'dark' as 'light' | 'dark',
  region: 'IN',
}