import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import {
  ErrorBoundary,
  PosterImage,
  TrailerModal,
  getYouTubeTrailerKey,
} from '../../../../Common'
import { WatchlistToggle } from '../../../../Collection'
import { useMovieDetail } from '../../../data/hooks/useMovieDetail'
import { ContentRow } from '../../components/ContentRow/ContentRow'
import { CastCarousel } from '../../components/CastCarousel/CastCarousel'

export const MovieDetailPage = observer(function MovieDetailPage() {
  const { t } = useTranslation('movies')
  const { t: tCommon } = useTranslation('common')

  const { movieId } = useParams()
  const id = Number(movieId)
  const { movie, videos, cast, similar, recommended, isLoading, notFound, error } =
    useMovieDetail(id)

  const [isTrailerOpen, setIsTrailerOpen] = useState(false)
  const trailerKey = getYouTubeTrailerKey(videos)

  if (notFound) {
    return (
      <main className="page-shell">
        <h1>{t('detail.notFoundTitle')}</h1>
        <p>{t('detail.notFoundDescription')}</p>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="page-shell">
        <p>{tCommon('loading')}</p>
      </main>
    )
  }

  if (error || !movie) {
    return (
      <main className="page-shell">
        <p>{t('detail.loadFailed')}</p>
      </main>
    )
  }

  return (
    <main className="movie-detail-page">
      <ErrorBoundary>
        <section className="movie-hero">
          <PosterImage
            path={movie.backdrop_path}
            alt={movie.title}
            size="backdrop"
            className="movie-hero-backdrop"
          />
          <div className="movie-hero-content">
            <h1>{movie.title}</h1>
            <p>★ {movie.vote_average.toFixed(1)}</p>
            {movie.runtime && (
              <p>{t('detail.runtimeMinutes', { count: movie.runtime })}</p>
            )}
            {movie.genres && <p>{movie.genres.map((g) => g.name).join(', ')}</p>}
            <p>{movie.overview}</p>
            <div className="movie-actions">
              {trailerKey && (
                <button type="button" onClick={() => setIsTrailerOpen(true)}>
                  {t('detail.playTrailer')}
                </button>
              )}
              <WatchlistToggle
                mediaType="movie"
                mediaId={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                voteAverage={movie.vote_average}
                variant="button"
              />
            </div>
          </div>
        </section>
      </ErrorBoundary>

      <ErrorBoundary>
        <section>
          <h2>{t('detail.cast')}</h2>
          <CastCarousel cast={cast} />
        </section>
      </ErrorBoundary>

      <ErrorBoundary>
        <ContentRow title={t('rows.similar')} movies={similar} isLoading={false} error={null} />
      </ErrorBoundary>

      <ErrorBoundary>
        <ContentRow title={t('rows.recommended')} movies={recommended} isLoading={false} error={null} />
      </ErrorBoundary>

      <TrailerModal
        isOpen={isTrailerOpen}
        videoKey={trailerKey}
        title={movie.title}
        onClose={() => setIsTrailerOpen(false)}
      />
    </main>
  )
})