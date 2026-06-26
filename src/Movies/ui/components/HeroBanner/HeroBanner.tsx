import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PosterImage, TrailerModal, tmdbService, getYouTubeTrailerKey } from '../../../../Common'
import type { Movie } from '../../../../Common'

type HeroBannerProps = {
  movie: Movie
}

export function HeroBanner({ movie }: HeroBannerProps) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)
  const [trailerKey, setTrailerKey] = useState<string | null>(null)

  async function handlePlayTrailer() {
    try {
      const videos = await tmdbService.getMovieVideos(movie.id)
      const key = getYouTubeTrailerKey(videos)
      if (key) {
        setTrailerKey(key)
        setIsTrailerOpen(true)
      }
    } catch {
      // no trailer available
    }
  }

  return (
    <section className="hero-banner">
      <PosterImage
        path={movie.backdrop_path}
        alt={movie.title}
        size="backdrop"
        className="hero-banner-backdrop"
      />
      <div className="hero-banner-content">
        <h1>{movie.title}</h1>
        <p className="hero-rating">★ {movie.vote_average.toFixed(1)}</p>
        {movie.overview && <p className="hero-overview">{movie.overview}</p>}
        <div className="hero-actions">
          <button type="button" onClick={handlePlayTrailer}>
            Play Trailer
          </button>
          <Link to={`/movies/${movie.id}`} className="hero-link">
            More Info
          </Link>
        </div>
      </div>

      <TrailerModal
        isOpen={isTrailerOpen}
        videoKey={trailerKey}
        title={movie.title}
        onClose={() => setIsTrailerOpen(false)}
      />
    </section>
  )
}