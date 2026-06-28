import { Link } from 'react-router-dom'
import { PosterImage } from '../../../../Common'
import { WatchlistToggle } from '../../../../Collection'
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

      <WatchlistToggle
        mediaType="movie"
        mediaId={movie.id}
        title={movie.title}
        posterPath={movie.poster_path}
        voteAverage={movie.vote_average}
        variant="icon"
      />
    </article>
  )
}