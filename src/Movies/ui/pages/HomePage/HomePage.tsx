import { useMemo, useState } from 'react'
import { ErrorBoundary, type Movie } from '../../../../Common'
import { useHomePageData } from '../../../data/hooks/useHomePageData'
import { HeroBanner } from '../../components/HeroBanner/HeroBanner'
import { GenreFilter } from '../../components/GenreFilter/GenreFilter'
import { ContentRow } from '../../components/ContentRow/ContentRow'

function filterByGenre(movies: Movie[], genreId: number | null): Movie[] {
  if (genreId === null) return movies
  return movies.filter((movie) => movie.genre_ids?.includes(genreId))
}

export function HomePage() {
  const { trending, popular, topRated, upcoming, genres, isLoading, error } =
    useHomePageData()
  const [activeGenreId, setActiveGenreId] = useState<number | null>(null)

  const heroMovie = trending[0] ?? null

  const filteredTrending = useMemo(
    () => filterByGenre(trending, activeGenreId),
    [trending, activeGenreId],
  )
  const filteredPopular = useMemo(
    () => filterByGenre(popular, activeGenreId),
    [popular, activeGenreId],
  )
  const filteredTopRated = useMemo(
    () => filterByGenre(topRated, activeGenreId),
    [topRated, activeGenreId],
  )
  const filteredUpcoming = useMemo(
    () => filterByGenre(upcoming, activeGenreId),
    [upcoming, activeGenreId],
  )

  return (
    <main className="home-page">
      <ErrorBoundary>
        {heroMovie && <HeroBanner movie={heroMovie} />}
      </ErrorBoundary>

      <GenreFilter
        genres={genres}
        activeGenreId={activeGenreId}
        onSelect={setActiveGenreId}
      />

      <ErrorBoundary>
        <ContentRow title="Trending" movies={filteredTrending} isLoading={isLoading} error={error} />
      </ErrorBoundary>
      <ErrorBoundary>
        <ContentRow title="Popular" movies={filteredPopular} isLoading={isLoading} error={error} />
      </ErrorBoundary>
      <ErrorBoundary>
        <ContentRow title="Top Rated" movies={filteredTopRated} isLoading={isLoading} error={error} />
      </ErrorBoundary>
      <ErrorBoundary>
        <ContentRow title="Upcoming" movies={filteredUpcoming} isLoading={isLoading} error={error} />
      </ErrorBoundary>
    </main>
  )
}