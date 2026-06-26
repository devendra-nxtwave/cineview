import axios from 'axios'
import { DEFAULT_LANGUAGE } from '../../core/constants'
import {
  movieListSchema,
  genreListSchema,
  movieDetailSchema,
  videosSchema,
  creditsSchema,
} from '../../core/schemas/movieSchemas'
import { searchMultiSchema } from '../../core/schemas/searchSchemas'
import {
  tvShowDetailSchema,
  seasonDetailSchema,
} from '../../core/schemas/tvSchemas'
import { tmdbClient } from './tmdbClient'
import type {
  Movie,
  Genre,
  MovieDetail,
  CastMember,
  Video,
  SearchResult,
  TVShowDetail,
  Episode,
} from '../../core/types'

function parse<T>(
  schema: { safeParse: (data: unknown) => { success: boolean; data?: T } },
  data: unknown,
): T {
  const result = schema.safeParse(data)
  if (!result.success || result.data === undefined) {
    throw new Error('Invalid TMDB response')
  }
  return result.data
}

export function getYouTubeTrailerKey(videos: Video[]): string | null {
  const trailer = videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer')
  return trailer?.key ?? null
}

export const tmdbService = {
  async getTrendingMovies(): Promise<Movie[]> {
    const { data } = await tmdbClient.get('/trending/movie/day', {
      params: { language: DEFAULT_LANGUAGE },
    })
    return parse(movieListSchema, data).results
  },

  async getPopularMovies(): Promise<Movie[]> {
    const { data } = await tmdbClient.get('/movie/popular', {
      params: { language: DEFAULT_LANGUAGE },
    })
    return parse(movieListSchema, data).results
  },

  async getTopRatedMovies(): Promise<Movie[]> {
    const { data } = await tmdbClient.get('/movie/top_rated', {
      params: { language: DEFAULT_LANGUAGE },
    })
    return parse(movieListSchema, data).results
  },

  async getUpcomingMovies(): Promise<Movie[]> {
    const { data } = await tmdbClient.get('/movie/upcoming', {
      params: { language: DEFAULT_LANGUAGE },
    })
    return parse(movieListSchema, data).results
  },

  async getMovieGenres(): Promise<Genre[]> {
    const { data } = await tmdbClient.get('/genre/movie/list', {
      params: { language: DEFAULT_LANGUAGE },
    })
    return parse(genreListSchema, data).genres
  },

  async getMovieDetails(movieId: number): Promise<MovieDetail> {
    try {
      const { data } = await tmdbClient.get(`/movie/${movieId}`, {
        params: { language: DEFAULT_LANGUAGE },
      })
      return parse(movieDetailSchema, data)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('NOT_FOUND')
      }
      throw error
    }
  },

  async getMovieVideos(movieId: number): Promise<Video[]> {
    const { data } = await tmdbClient.get(`/movie/${movieId}/videos`)
    return parse(videosSchema, data).results
  },

  async getMovieCredits(movieId: number): Promise<CastMember[]> {
    const { data } = await tmdbClient.get(`/movie/${movieId}/credits`)
    return parse(creditsSchema, data).cast
  },

  async getSimilarMovies(movieId: number): Promise<Movie[]> {
    const { data } = await tmdbClient.get(`/movie/${movieId}/similar`, {
      params: { language: DEFAULT_LANGUAGE },
    })
    return parse(movieListSchema, data).results
  },

  async getRecommendedMovies(movieId: number): Promise<Movie[]> {
    const { data } = await tmdbClient.get(`/movie/${movieId}/recommendations`, {
      params: { language: DEFAULT_LANGUAGE },
    })
    return parse(movieListSchema, data).results
  },

  async searchMulti(query: string): Promise<SearchResult[]> {
    const { data } = await tmdbClient.get('/search/multi', {
      params: { query, language: DEFAULT_LANGUAGE },
    })
    return parse(searchMultiSchema, data).results
  },

  async getTVShowDetails(showId: number): Promise<TVShowDetail> {
    try {
      const { data } = await tmdbClient.get(`/tv/${showId}`, {
        params: { language: DEFAULT_LANGUAGE },
      })
      return parse(tvShowDetailSchema, data)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('NOT_FOUND')
      }
      throw error
    }
  },

  async getSeasonDetails(showId: number, seasonNumber: number): Promise<Episode[]> {
    const { data } = await tmdbClient.get(`/tv/${showId}/season/${seasonNumber}`, {
      params: { language: DEFAULT_LANGUAGE },
    })
    return parse(seasonDetailSchema, data).episodes
  },
}