import { makeAutoObservable, runInAction } from 'mobx'
import i18n from '../i18n/i18n'
import {
  DEFAULT_PREFERENCES,
  LOCALE_TO_TMDB,
  PREFERENCES_STORAGE_KEY,
} from '../../core/constants'
import { preferencesSchema } from '../../core/schemas/preferencesSchema'
import type { Theme } from '../../core/types'

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

class PreferencesStore {
  language = DEFAULT_PREFERENCES.language
  theme: Theme = DEFAULT_PREFERENCES.theme
  region = DEFAULT_PREFERENCES.region
  isHydrated = false

  constructor() {
    makeAutoObservable(this)
  }

  get tmdbLanguage(): string {
    return LOCALE_TO_TMDB[this.language] ?? 'en-US'
  }

  init() {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY)

    if (!raw) {
      this.theme = getSystemTheme()
      this.applySideEffects()
      this.isHydrated = true
      return
    }

    try {
      const parsed = preferencesSchema.parse(JSON.parse(raw))
      runInAction(() => {
        this.language = parsed.language
        this.theme = parsed.theme
        this.region = parsed.region
      })
    } catch {
      runInAction(() => {
        this.language = DEFAULT_PREFERENCES.language
        this.theme = getSystemTheme()
        this.region = DEFAULT_PREFERENCES.region
      })
    }

    this.applySideEffects()
    this.isHydrated = true
  }

  private persist() {
    const data = {
      version: 1 as const,
      language: this.language,
      theme: this.theme,
      region: this.region,
    }
    preferencesSchema.parse(data)
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(data))
  }

  private applySideEffects() {
    document.documentElement.dataset.theme = this.theme
    void i18n.changeLanguage(this.language)
  }

  setLanguage(language: string) {
    this.language = language
    this.persist()
    void i18n.changeLanguage(language)
  }

  setTheme(theme: Theme) {
    this.theme = theme
    this.persist()
    document.documentElement.dataset.theme = theme
  }

  setRegion(region: string) {
    this.region = region
    this.persist()
  }
}

export const preferencesStore = new PreferencesStore()