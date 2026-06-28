import { useEffect, useState } from 'react'
import { tmdbService } from '../../../Common'
import type { Genre, Movie } from '../../../Common/core/types'
import { preferencesStore } from '../../../Preferences/data/stores/PreferencesStore'
import i18n from '../../../Preferences/data/i18n/i18n'

type HomePageData = {
  trending: Movie[]
  popular: Movie[]
  topRated: Movie[]
  upcoming: Movie[]
  genres: Genre[]
  isLoading: boolean
  error: string | null
}

export function useHomePageData(): HomePageData {
  const language = preferencesStore.language
  const region = preferencesStore.region

  const [trending, setTrending] = useState<Movie[]>([])
  const [popular, setPopular] = useState<Movie[]>([])
  const [topRated, setTopRated] = useState<Movie[]>([])
  const [upcoming, setUpcoming] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      setTrending([])
      setPopular([])
      setTopRated([])
      setUpcoming([])
      setGenres([])

      const tasks = [
        { label: 'trending', run: () => tmdbService.getTrendingMovies(), set: setTrending },
        { label: 'popular', run: () => tmdbService.getPopularMovies(), set: setPopular },
        { label: 'topRated', run: () => tmdbService.getTopRatedMovies(), set: setTopRated },
        { label: 'upcoming', run: () => tmdbService.getUpcomingMovies(), set: setUpcoming },
        { label: 'genres', run: () => tmdbService.getMovieGenres(), set: setGenres },
      ] as const

      const results = await Promise.allSettled(tasks.map((task) => task.run()))

      if (cancelled) return

      let successCount = 0

      results.forEach((result, index) => {
        const task = tasks[index]
        if (result.status === 'fulfilled') {
          successCount += 1
          task.set(result.value as Movie[] & Genre[])
        } else {
          console.error(`Home page ${task.label} failed:`, result.reason)
        }
      })

      if (successCount === 0) {
        setError(i18n.t('homeLoadFailed', { ns: 'movies' }))
      }

      setIsLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [language, region])

  return { trending, popular, topRated, upcoming, genres, isLoading, error }
}