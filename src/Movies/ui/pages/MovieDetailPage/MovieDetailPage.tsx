import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  
  ErrorBoundary,
  PosterImage,
  TrailerModal,
  getYouTubeTrailerKey,
} from '../../../../Common'
import { useMovieDetail } from '../../../data/hooks/useMovieDetail'
import { ContentRow } from '../../components/ContentRow/ContentRow'
import { CastCarousel } from '../../components/CastCarousel/CastCarousel'

export function MovieDetailPage() {
  const { movieId } = useParams()
  const id = Number(movieId)
  const { movie, videos, cast, similar, recommended, isLoading, notFound, error } =
    useMovieDetail(id)

  const [isTrailerOpen, setIsTrailerOpen] = useState(false)
  const trailerKey = getYouTubeTrailerKey(videos)

  if (notFound) {
    return (
      <main className="page-shell">
        <h1>Movie not found</h1>
        <p>The movie you are looking for does not exist.</p>
      </main>
    )
  }

  if (isLoading) return <main className="page-shell"><p>Loading…</p></main>
  if (error || !movie) return <main className="page-shell"><p>{error}</p></main>

  return (
    <main className="movie-detail-page">
      <ErrorBoundary>
        <section className="movie-hero">
          <PosterImage path={movie.backdrop_path} alt={movie.title} size="backdrop" className="movie-hero-backdrop" />
          <div className="movie-hero-content">
            <h1>{movie.title}</h1>
            <p>★ {movie.vote_average.toFixed(1)}</p>
            {movie.runtime && <p>{movie.runtime} min</p>}
            {movie.genres && <p>{movie.genres.map((g) => g.name).join(', ')}</p>}
            <p>{movie.overview}</p>
            <div className="movie-actions">
              {trailerKey && (
                <button type="button" onClick={() => setIsTrailerOpen(true)}>
                  Play Trailer
                </button>
              )}
              <button type="button" aria-label="Add to watchlist">+ Watchlist</button>
            </div>
          </div>
        </section>
      </ErrorBoundary>

      <ErrorBoundary>
        <section>
          <h2>Cast</h2>
          <CastCarousel cast={cast} />
        </section>
      </ErrorBoundary>

      <ErrorBoundary>
        <ContentRow title="Similar" movies={similar} isLoading={false} error={null} />
      </ErrorBoundary>

      <ErrorBoundary>
        <ContentRow title="Recommended" movies={recommended} isLoading={false} error={null} />
      </ErrorBoundary>

      <TrailerModal
        isOpen={isTrailerOpen}
        videoKey={trailerKey}
        title={movie.title}
        onClose={() => setIsTrailerOpen(false)}
      />
    </main>
  )
}