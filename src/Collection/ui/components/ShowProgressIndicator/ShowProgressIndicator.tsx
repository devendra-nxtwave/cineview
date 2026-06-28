import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { collectionStore } from '../../../data/stores/CollectionStore'

type ShowProgressIndicatorProps = {
  showId: number
}

export const ShowProgressIndicator = observer(function ShowProgressIndicator({
  showId,
}: ShowProgressIndicatorProps) {
  const { t } = useTranslation('collection')
  const { watched, total } = collectionStore.getShowProgress(showId)

  if (total === 0 && watched === 0) return null

  return (
    <p className="show-progress-indicator">
      {total > 0
        ? t('episodes.showProgress', { watched, total })
        : t('episodes.watchedCount', { count: watched })}
    </p>
  )
})