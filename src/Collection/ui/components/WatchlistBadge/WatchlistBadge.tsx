import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { watchlistStore } from '../../../data/stores/WatchlistStore'

export const WatchlistBadge = observer(function WatchlistBadge() {
  const { t } = useTranslation('collection')
  const count = watchlistStore.totalCount

  if (count === 0) return null

  return (
    <span className="watchlist-badge" aria-label={t('badgeAria', { count })}>
      {count}
    </span>
  )
})