import axios from 'axios'
import { preferencesStore } from '../../../Preferences/data/stores/PreferencesStore'
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

function tmdbParams(extra: Record<string, string | number> = {}) {
  return {
    language: preferencesStore.tmdbLanguage,
    region: preferencesStore.region,
    ...extra,
  }
}

import { z } from 'zod'

function parse<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    console.error('TMDB Zod validation failed:', result.error.flatten())
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
      params: tmdbParams(),
    })
    return parse(movieListSchema, data).results
  },

  async getPopularMovies(): Promise<Movie[]> {
    const { data } = await tmdbClient.get('/movie/popular', {
      params: tmdbParams(),
    })
    return parse(movieListSchema, data).results
  },

  async getTopRatedMovies(): Promise<Movie[]> {
    const { data } = await tmdbClient.get('/movie/top_rated', {
      params: tmdbParams(),
    })
    return parse(movieListSchema, data).results
  },

  async getUpcomingMovies(): Promise<Movie[]> {
    const { data } = await tmdbClient.get('/movie/upcoming', {
      params: tmdbParams(),
    })
    return parse(movieListSchema, data).results
  },

  async getMovieGenres(): Promise<Genre[]> {
    const { data } = await tmdbClient.get('/genre/movie/list', {
      params: { language: 'en-US' },
    })
    return parse(genreListSchema, data).genres
  },

  async getMovieDetails(movieId: number): Promise<MovieDetail> {
    try {
      const { data } = await tmdbClient.get(`/movie/${movieId}`, {
        params: tmdbParams(),
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
    const { data } = await tmdbClient.get(`/movie/${movieId}/videos`, {
      params: tmdbParams(),
    })
    return parse(videosSchema, data).results
  },

  async getMovieCredits(movieId: number): Promise<CastMember[]> {
    const { data } = await tmdbClient.get(`/movie/${movieId}/credits`)
    return parse(creditsSchema, data).cast
  },

  async getSimilarMovies(movieId: number): Promise<Movie[]> {
    const { data } = await tmdbClient.get(`/movie/${movieId}/similar`, {
      params: tmdbParams(),
    })
    return parse(movieListSchema, data).results
  },

  async getRecommendedMovies(movieId: number): Promise<Movie[]> {
    const { data } = await tmdbClient.get(`/movie/${movieId}/recommendations`, {
      params: tmdbParams(),
    })
    return parse(movieListSchema, data).results
  },

  async searchMulti(query: string): Promise<SearchResult[]> {
    const { data } = await tmdbClient.get('/search/multi', {
      params: tmdbParams({ query }),
    })
    return parse(searchMultiSchema, data).results
  },

  async getTVShowDetails(showId: number): Promise<TVShowDetail> {
    try {
      const { data } = await tmdbClient.get(`/tv/${showId}`, {
        params: tmdbParams(),
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
      params: tmdbParams(),
    })
    return parse(seasonDetailSchema, data).episodes
  },
} 