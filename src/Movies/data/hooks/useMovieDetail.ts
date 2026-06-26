import { useCallback, useEffect, useState } from 'react'
import { tmdbService } from '../../../Common'
import type { CastMember, Movie, MovieDetail, Video } from '../../../Common'

type MovieDetailState = {
  movie: MovieDetail | null
  videos: Video[]
  cast: CastMember[]
  similar: Movie[]
  recommended: Movie[]
  isLoading: boolean
  notFound: boolean
  error: string | null
  reload: () => void
}

export function useMovieDetail(movieId: number): MovieDetailState {
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [cast, setCast] = useState<CastMember[]>([])
  const [similar, setSimilar] = useState<Movie[]>([])
  const [recommended, setRecommended] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!movieId || Number.isNaN(movieId)) {
        setNotFound(true)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        setNotFound(false)

        const movieData = await tmdbService.getMovieDetails(movieId)
        if (cancelled) return
        setMovie(movieData)

        const [videosData, castData, similarData, recommendedData] = await Promise.all([
          tmdbService.getMovieVideos(movieId),
          tmdbService.getMovieCredits(movieId),
          tmdbService.getSimilarMovies(movieId),
          tmdbService.getRecommendedMovies(movieId),
        ])

        if (cancelled) return
        setVideos(videosData)
        setCast(castData)
        setSimilar(similarData)
        setRecommended(recommendedData)
      } catch (err) {
        if (cancelled) return
        if (err instanceof Error && err.message === 'NOT_FOUND') {
          setNotFound(true)
        } else {
          setError('Failed to load movie details')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [movieId, reloadKey])

  return { movie, videos, cast, similar, recommended, isLoading, notFound, error, reload }
}