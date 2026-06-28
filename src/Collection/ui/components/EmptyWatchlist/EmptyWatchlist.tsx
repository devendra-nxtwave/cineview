import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { WatchlistFilterStatus } from '../../../core/types'

type EmptyWatchlistProps = {
  filteredStatus: WatchlistFilterStatus
}

export function EmptyWatchlist({ filteredStatus }: EmptyWatchlistProps) {
  const { t } = useTranslation('collection')
  const message = filteredStatus === 'all' ? t('empty.all') : t('empty.filtered')

  return (
    <div className="empty-watchlist">
      <p>{message}</p>
      {filteredStatus === 'all' && (
        <Link to="/">{t('empty.browseHome')}</Link>
      )}
    </div>
  )
}