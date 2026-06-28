import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { watchlistStore } from '../../../data/stores/WatchlistStore'
import type { MediaType } from '../../../core/types'

type WatchlistToggleProps = {
  mediaType: MediaType
  mediaId: number
  title: string
  posterPath?: string | null
  voteAverage: number
  variant?: 'icon' | 'button'
  className?: string
}

export const WatchlistToggle = observer(function WatchlistToggle({
  mediaType,
  mediaId,
  title,
  posterPath,
  voteAverage,
  variant = 'icon',
  className = '',
}: WatchlistToggleProps) {
  const { t } = useTranslation('collection')
  const isInWatchlist = watchlistStore.isInWatchlist(mediaType, mediaId)
  const entry = watchlistStore.getEntry(mediaType, mediaId)
  const hasNote = Boolean(entry?.note)

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    watchlistStore.toggle(mediaType, mediaId, {
      title,
      posterPath: posterPath ?? null,
      voteAverage,
    })
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        className={`watchlist-toggle watchlist-toggle--button ${isInWatchlist ? 'active' : ''} ${className}`}
        onClick={handleClick}
        aria-label={isInWatchlist ? t('removeWatchlistAria') : t('addWatchlistAria')}
        aria-pressed={isInWatchlist}
      >
        {isInWatchlist
          ? hasNote
            ? t('inWatchlistWithNote')
            : t('inWatchlist')
          : t('addWatchlist')}
      </button>
    )
  }

  return (
    <button
      type="button"
      className={`watchlist-toggle watchlist-toggle--icon ${isInWatchlist ? 'active' : ''} ${className}`}
      onClick={handleClick}
      aria-label={isInWatchlist ? t('removeWatchlistAria') : t('addWatchlistAria')}
      aria-pressed={isInWatchlist}
    >
      {isInWatchlist ? '✓' : '+'}
    </button>
  )
})