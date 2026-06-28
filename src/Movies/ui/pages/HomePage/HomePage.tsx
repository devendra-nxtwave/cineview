import { useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { ErrorBoundary, type Movie } from '../../../../Common'
import { useHomePageData } from '../../../data/hooks/useHomePageData'
import { HeroBanner } from '../../components/HeroBanner/HeroBanner'
import { GenreFilter } from '../../components/GenreFilter/GenreFilter'
import { ContentRow } from '../../components/ContentRow/ContentRow'

function filterByGenre(movies: Movie[], genreId: number | null): Movie[] {
  if (genreId === null) return movies
  return movies.filter((movie) => movie.genre_ids?.includes(genreId))
}

export const HomePage = observer(function HomePage() {
  const { t } = useTranslation('movies')
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
        <ContentRow title={t('rows.trending')} movies={filteredTrending} isLoading={isLoading} error={error} />
      </ErrorBoundary>
      <ErrorBoundary>
        <ContentRow title={t('rows.popular')} movies={filteredPopular} isLoading={isLoading} error={error} />
      </ErrorBoundary>
      <ErrorBoundary>
        <ContentRow title={t('rows.topRated')} movies={filteredTopRated} isLoading={isLoading} error={error} />
      </ErrorBoundary>
      <ErrorBoundary>
        <ContentRow title={t('rows.upcoming')} movies={filteredUpcoming} isLoading={isLoading} error={error} />
      </ErrorBoundary>
    </main>
  )
})