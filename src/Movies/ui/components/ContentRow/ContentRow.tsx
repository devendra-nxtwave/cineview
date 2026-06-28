import { useTranslation } from 'react-i18next'
import { AsyncSection } from '../../../../Common'
import { MovieCard } from '../MovieCard/MovieCard'
import type { Movie } from '../../../../Common/core/types'

type ContentRowProps = {
  title: string
  movies: Movie[]
  isLoading: boolean
  error: string | null
}

export function ContentRow({ title, movies, isLoading, error }: ContentRowProps) {
  const { t } = useTranslation('movies')
  const status = isLoading ? 'loading' : error ? 'error' : movies.length === 0 ? 'empty' : 'success'

  return (
    <section className="content-row">
      <h2>{title}</h2>
      <AsyncSection status={status} error={error} emptyMessage={t('contentRowEmpty')}>
        <div className="content-row-scroll">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </AsyncSection>
    </section>
  )
}