import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { PosterImage, tmdbService, type SearchResult } from '../../../../Common'
import { preferencesStore } from '../../../../Preferences/data/stores/PreferencesStore'
import { recentSearchService } from '../../../data/services/recentSearchService'
import { useDebounce } from '../../../data/hooks/useDebounce'

function getResultLink(item: SearchResult): string | null {
  if (item.media_type === 'movie') return `/movies/${item.id}`
  if (item.media_type === 'tv') return `/tv/${item.id}`
  return null
}

function groupResults(results: SearchResult[]) {
  return {
    movies: results.filter((r) => r.media_type === 'movie'),
    tv: results.filter((r) => r.media_type === 'tv'),
    people: results.filter((r) => r.media_type === 'person'),
  }
}

export const SearchPage = observer(function SearchPage() {
  const { t } = useTranslation('search')
  const language = preferencesStore.language
  const region = preferencesStore.region

  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const debouncedQuery = useDebounce(query, 300)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recent, setRecent] = useState<string[]>(recentSearchService.getAll())

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  useEffect(() => {
    let cancelled = false

    async function search() {
      const trimmed = debouncedQuery.trim()

      if (!trimmed) {
        setResults([])
        setError(null)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const data = await tmdbService.searchMulti(trimmed)
        if (cancelled) return
        setResults(data)
        recentSearchService.add(trimmed)
        setRecent(recentSearchService.getAll())
      } catch {
        if (!cancelled) setError(t('failed'))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    search()
    return () => { cancelled = true }
  }, [debouncedQuery, language, region, t])

  const isWaitingForDebounce = query.trim() !== debouncedQuery.trim()
  const isSearching = isLoading || isWaitingForDebounce
  const grouped = groupResults(results)
  const hasQuery = debouncedQuery.trim().length > 0
  const hasResults = results.length > 0

  return (
    <main className="page-shell search-page">
      <h1>{t('title')}</h1>

      <input
        className="search-input"
        type="search"
        placeholder={t('placeholder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {recent.length > 0 && !query && (
        <section className="recent-searches">
          <div className="recent-header">
            <h2>{t('recent')}</h2>
            <button
              type="button"
              onClick={() => {
                recentSearchService.clear()
                setRecent([])
              }}
            >
              {t('clear')}
            </button>
          </div>
          <div className="recent-chips">
            {recent.map((item) => (
              <button
                key={item}
                type="button"
                className="genre-chip"
                onClick={() => setQuery(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      )}

      {isSearching && <p className="search-status">{t('searching')}</p>}
      {error && <p className="search-error">{error}</p>}

      {!hasQuery && !isSearching && (
        <p className="search-hint">{t('hint')}</p>
      )}

      {hasQuery && !isSearching && !error && !hasResults && (
        <p className="search-hint">{t('noResults', { query: debouncedQuery })}</p>
      )}

      {hasResults && (
        <>
          <SearchGroup title={t('groups.movies')} items={grouped.movies} />
          <SearchGroup title={t('groups.tv')} items={grouped.tv} />
          <SearchGroup title={t('groups.people')} items={grouped.people} />
        </>
      )}
    </main>
  )
})

type SearchGroupProps = {
  title: string
  items: SearchResult[]
}

function SearchGroup({ title, items }: SearchGroupProps) {
  const { t } = useTranslation('search')

  if (items.length === 0) return null

  return (
    <section className="search-group">
      <h2>{title}</h2>
      <div className="search-results">
        {items.map((item) => {
          const link = getResultLink(item)
          const name = item.title ?? item.name ?? t('unknown')
          const imagePath = item.poster_path ?? item.profile_path
          const isPerson = item.media_type === 'person'

          const card = (
            <article className="search-result-card">
              <PosterImage
                path={imagePath}
                alt={name}
                size={isPerson ? 'profile' : 'poster'}
                className={isPerson ? 'search-result-profile' : 'search-result-poster'}
              />
              <span className="search-result-title">{name}</span>
            </article>
          )

          return link ? (
            <Link key={`${item.media_type}-${item.id}`} to={link}>
              {card}
            </Link>
          ) : (
            <div key={`${item.media_type}-${item.id}`}>{card}</div>
          )
        })}
      </div>
    </section>
  )
}