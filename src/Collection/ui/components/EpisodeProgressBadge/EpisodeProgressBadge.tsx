import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { collectionStore } from '../../../data/stores/CollectionStore'

type EpisodeProgressBadgeProps = {
  showId: number
}

export const EpisodeProgressBadge = observer(function EpisodeProgressBadge({
  showId,
}: EpisodeProgressBadgeProps) {
  const { t } = useTranslation('collection')
  const { watched, total } = collectionStore.getShowProgress(showId)

  if (watched === 0) return null

  return (
    <span className="episode-progress-badge">
      {total > 0
        ? t('episodes.cardBadge', { watched, total })
        : t('episodes.watchedCount', { count: watched })}
    </span>
  )
})