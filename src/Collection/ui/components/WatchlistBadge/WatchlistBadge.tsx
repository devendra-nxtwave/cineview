import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { collectionStore } from '../../../data/stores/CollectionStore'

export const WatchlistBadge = observer(function WatchlistBadge() {
  const { t } = useTranslation('collection')
  const count = collectionStore.totalCount

  if (count === 0) return null

  return (
    <span className="watchlist-badge" aria-label={t('badgeAria', { count })}>
      {count}
    </span>
  )
})