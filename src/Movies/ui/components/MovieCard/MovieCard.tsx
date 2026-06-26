import { Link } from 'react-router-dom'
import { PosterImage } from '../../../../Common'
import type { Movie } from '../../../../Common/core/types'

type MovieCardProps = {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  function handleWatchlistClick() {
    // M5: connect to WatchlistStore
  }

  return (
    <article className="movie-card">
      <Link to={`/movies/${movie.id}`}>
        <PosterImage path={movie.poster_path} alt={movie.title} />
        <h3>{movie.title}</h3>
        <span>{movie.vote_average.toFixed(1)}</span>
      </Link>
      <button type="button" onClick={handleWatchlistClick} aria-label="Add to watchlist">
        +
      </button>
    </article>
  )
}