import { NavLink, Outlet, useParams } from 'react-router-dom'
import { ErrorBoundary, PosterImage } from '../../../../Common'
import { useTVShowDetail } from '../../../data/hooks/useTVShowDetail'

export function TVShowLayout() {
  const { showId } = useParams()
  const id = Number(showId)
  const { show, isLoading, notFound, error } = useTVShowDetail(id)

  if (notFound) {
    return (
      <main className="page-shell">
        <h1>TV show not found</h1>
      </main>
    )
  }

  if (isLoading) return <main className="page-shell"><p>Loading…</p></main>
  if (error || !show) return <main className="page-shell"><p>{error}</p></main>

  const seasons = show.seasons.filter((s) => s.season_number > 0)

  return (
    <main className="tv-show-layout">
      <ErrorBoundary>
        <section className="show-hero">
          <PosterImage path={show.backdrop_path} alt={show.name} size="backdrop" className="movie-hero-backdrop" />
          <div className="movie-hero-content">
            <h1>{show.name}</h1>
            <p>★ {show.vote_average.toFixed(1)}</p>
            <p>{show.overview}</p>
            <button type="button" aria-label="Add to watchlist">+ Watchlist</button>
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
}