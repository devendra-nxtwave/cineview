import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { collectionStore } from '../../../data/stores/CollectionStore'

type EpisodeCheckboxProps = {
  showId: number
  episodeId: number
}

export const EpisodeCheckbox = observer(function EpisodeCheckbox({
  showId,
  episodeId,
}: EpisodeCheckboxProps) {
  const { t } = useTranslation('tvShows')
  const checked = collectionStore.isEpisodeWatched(showId, episodeId)

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={() => collectionStore.toggleEpisode(showId, episodeId)}
      aria-label={t('markWatchedAria')}
    />
  )
})