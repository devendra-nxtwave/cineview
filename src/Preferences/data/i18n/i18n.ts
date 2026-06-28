import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from './locales/en/common.json'
import enAuth from './locales/en/auth.json'
import enMovies from './locales/en/movies.json'
import enSearch from './locales/en/search.json'
import enTvShows from './locales/en/tvShows.json'
import enCollection from './locales/en/collection.json'
import enPreferences from './locales/en/preferences.json'

import hiCommon from './locales/hi/common.json'
import hiAuth from './locales/hi/auth.json'
import hiMovies from './locales/hi/movies.json'
import hiSearch from './locales/hi/search.json'
import hiTvShows from './locales/hi/tvShows.json'
import hiCollection from './locales/hi/collection.json'
import hiPreferences from './locales/hi/preferences.json'

import teCommon from './locales/te/common.json'
import teAuth from './locales/te/auth.json'
import teMovies from './locales/te/movies.json'
import teSearch from './locales/te/search.json'
import teTvShows from './locales/te/tvShows.json'
import teCollection from './locales/te/collection.json'
import tePreferences from './locales/te/preferences.json'

void i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      auth: enAuth,
      movies: enMovies,
      search: enSearch,
      tvShows: enTvShows,
      collection: enCollection,
      preferences: enPreferences,
    },
    hi: {
      common: hiCommon,
      auth: hiAuth,
      movies: hiMovies,
      search: hiSearch,
      tvShows: hiTvShows,
      collection: hiCollection,
      preferences: hiPreferences,
    },
    te: {
      common: teCommon,
      auth: teAuth,
      movies: teMovies,
      search: teSearch,
      tvShows: teTvShows,
      collection: teCollection,
      preferences: tePreferences,
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
})

export default i18n