import { useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { AsyncSection, PosterImage } from '../../../../Common'
import { formatDate } from '../../../../Common/core/dateUtils'
import { preferencesStore } from '../../../../Preferences/data/stores/PreferencesStore'
import { useSeasonDetail } from '../../../data/hooks/useSeasonDetail'

export const SeasonDetailPage = observer(function SeasonDetailPage() {
  const { t } = useTranslation('tvShows')
  const { showId, seasonNumber } = useParams()

  const { episodes, isLoading, error } = useSeasonDetail(
    Number(showId),
    Number(seasonNumber),
  )

  const status = isLoading
    ? 'loading'
    : error
      ? 'error'
      : episodes.length === 0
        ? 'empty'
        : 'success'

  return (
    <section className="season-detail">
      <h2>{t('seasonTitle', { number: seasonNumber })}</h2>
      <AsyncSection status={status} error={error} emptyMessage={t('noEpisodes')}>
        <ul className="episode-list">
          {episodes.map((episode) => (
            <li key={episode.id} className="episode-card">
              <PosterImage path={episode.still_path} alt={episode.name} size="still" />
              <div>
                <h3>
                  {episode.episode_number}. {episode.name}
                </h3>
                {episode.air_date && (
                  <p>{formatDate(episode.air_date, preferencesStore.language)}</p>
                )}
                <p>{episode.overview || t('noOverview')}</p>
              </div>
              <input type="checkbox" disabled aria-label={t('markWatchedAria')} />
            </li>
          ))}
        </ul>
      </AsyncSection>
    </section>
  )
})