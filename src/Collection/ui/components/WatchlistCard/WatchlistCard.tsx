import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PosterImage } from '../../../../Common'
import type { WatchlistEntry, WatchlistStatus } from '../../../core/types'
import { WatchlistNote } from '../WatchlistNote/WatchlistNote'

const STATUSES: WatchlistStatus[] = ['want_to_watch', 'watching', 'completed']

type WatchlistCardProps = {
  entry: WatchlistEntry
  onStatusChange: (status: WatchlistStatus) => void
  onNoteSave: (note: string) => void
  onNoteClear: () => void
  onRemove: () => void
}

export function WatchlistCard({
  entry,
  onStatusChange,
  onNoteSave,
  onNoteClear,
  onRemove,
}: WatchlistCardProps) {
  const { t } = useTranslation('collection')
  const detailPath =
    entry.mediaType === 'movie'
      ? `/movies/${entry.mediaId}`
      : `/tv/${entry.mediaId}`

  return (
    <article className="watchlist-card">
      <Link to={detailPath}>
        <PosterImage path={entry.snapshot.posterPath} alt={entry.snapshot.title} />
      </Link>

      <div className="watchlist-card-body">
        <Link to={detailPath} className="watchlist-card-title">
          <h3>{entry.snapshot.title}</h3>
        </Link>

        <span className="watchlist-card-rating">
          ★ {entry.snapshot.voteAverage.toFixed(1)}
        </span>

        <select
          value={entry.status}
          onChange={(event) => onStatusChange(event.target.value as WatchlistStatus)}
          aria-label={t('statusChangeAria')}
        >
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {t(`status.${status}`)}
            </option>
          ))}
        </select>

        <WatchlistNote
          entryId={entry.id}
          note={entry.note}
          onSave={onNoteSave}
          onClear={onNoteClear}
        />

        <button type="button" onClick={onRemove} aria-label={t('removeAria')}>
          {t('remove')}
        </button>
      </div>
    </article>
  )
}