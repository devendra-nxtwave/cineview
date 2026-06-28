import { Link } from 'react-router-dom'
import { PosterImage } from '../../../../Common'
import { WatchlistToggle, AddToListPopover } from '../../../../Collection'
import type { Movie } from '../../../../Common/core/types'

type MovieCardProps = {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="movie-card">
      <Link to={`/movies/${movie.id}`}>
        <PosterImage path={movie.poster_path} alt={movie.title} />
        <h3>{movie.title}</h3>
        <span>{movie.vote_average.toFixed(1)}</span>
      </Link>

      <div className="media-card-actions">
        <WatchlistToggle
          mediaType="movie"
          mediaId={movie.id}
          title={movie.title}
          posterPath={movie.poster_path}
          voteAverage={movie.vote_average}
          variant="icon"
        />
        <AddToListPopover
          mediaType="movie"
          mediaId={movie.id}
          title={movie.title}
          posterPath={movie.poster_path}
          voteAverage={movie.vote_average}
          variant="icon"
        />
      </div>
    </article>
  )
}