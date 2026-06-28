import { useEffect } from 'react'
import { NavLink, Outlet, useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { ErrorBoundary, PosterImage } from '../../../../Common'
import {
  WatchlistToggle,
  AddToListPopover,
  ShowProgressIndicator,
  collectionStore,
} from '../../../../Collection'
import { useTVShowDetail } from '../../../data/hooks/useTVShowDetail'

export const TVShowLayout = observer(function TVShowLayout() {
  const { t } = useTranslation('tvShows')
  const { t: tCommon } = useTranslation('common')

  const { showId } = useParams()
  const id = Number(showId)
  const { show, isLoading, notFound, error } = useTVShowDetail(id)

  const seasons = show?.seasons.filter((s) => s.season_number > 0) ?? []
  const totalEpisodes = seasons.reduce((sum, season) => sum + season.episode_count, 0)

  useEffect(() => {
    if (show) {
      collectionStore.setShowEpisodeTotal(id, totalEpisodes)
    }
  }, [id, show, totalEpisodes])

  if (notFound) {
    return (
      <main className="page-shell">
        <h1>{t('notFoundTitle')}</h1>
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

  if (error || !show) {
    return (
      <main className="page-shell">
        <p>{t('loadFailed')}</p>
      </main>
    )
  }

  return (
    <main className="tv-show-layout">
      <ErrorBoundary>
        <section className="show-hero">
          <PosterImage
            path={show.backdrop_path}
            alt={show.name}
            size="backdrop"
            className="movie-hero-backdrop"
          />
          <div className="movie-hero-content">
            <h1>{show.name}</h1>
            <p>★ {show.vote_average.toFixed(1)}</p>
            <p>{show.overview}</p>
            <ShowProgressIndicator showId={show.id} />
            <div className="movie-actions">
              <WatchlistToggle
                mediaType="tv"
                mediaId={show.id}
                title={show.name}
                posterPath={show.poster_path}
                voteAverage={show.vote_average}
                variant="button"
              />
              <AddToListPopover
                mediaType="tv"
                mediaId={show.id}
                title={show.name}
                posterPath={show.poster_path}
                voteAverage={show.vote_average}
                variant="button"
              />
            </div>
          </div>
        </section>
      </ErrorBoundary>

      <nav className="season-list">
        {seasons.map((season) => (
          <NavLink
            key={season.season_number}
            to={`/tv/${showId}/season/${season.season_number}`}
            className={({ isActive }) => `season-link ${isActive ? 'active' : ''}`}
          >
            {season.name}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </main>
  )
})