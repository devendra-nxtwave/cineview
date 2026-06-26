import { useEffect, useState } from 'react'
import { tmdbService } from '../../../Common'
import type { Genre, Movie } from '../../../Common/core/types'

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
      try {
        setIsLoading(true)
        setError(null)

        const [trendingData, popularData, topRatedData, upcomingData, genreData] =
          await Promise.all([
            tmdbService.getTrendingMovies(),
            tmdbService.getPopularMovies(),
            tmdbService.getTopRatedMovies(),
            tmdbService.getUpcomingMovies(),
            tmdbService.getMovieGenres(),
          ])

        if (cancelled) return

        setTrending(trendingData)
        setPopular(popularData)
        setTopRated(topRatedData)
        setUpcoming(upcomingData)
        setGenres(genreData)
      } catch {
        if (!cancelled) setError('Failed to load home page content')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { trending, popular, topRated, upcoming, genres, isLoading, error }
}