export type Theme = 'light' | 'dark'

export type PreferencesState = {
  version: 1
  language: string
  theme: Theme
  region: string
}