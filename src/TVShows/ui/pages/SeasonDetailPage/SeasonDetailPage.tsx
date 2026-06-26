import { useParams } from 'react-router-dom'
import { AsyncSection, PosterImage } from '../../../../Common'
import { useSeasonDetail } from '../../../data/hooks/useSeasonDetail'

export function SeasonDetailPage() {
  const { showId, seasonNumber } = useParams()
  const { episodes, isLoading, error } = useSeasonDetail(
    Number(showId),
    Number(seasonNumber),
  )

  const status = isLoading ? 'loading' : error ? 'error' : episodes.length === 0 ? 'empty' : 'success'

  return (
    <section className="season-detail">
      <h2>Season {seasonNumber}</h2>
      <AsyncSection status={status} error={error} emptyMessage="No episodes">
        <ul className="episode-list">
          {episodes.map((episode) => (
            <li key={episode.id} className="episode-card">
              <PosterImage path={episode.still_path} alt={episode.name} size="still" />
              <div>
                <h3>
                  {episode.episode_number}. {episode.name}
                </h3>
                {episode.air_date && <p>{episode.air_date}</p>}
                <p>{episode.overview || 'No overview.'}</p>
              </div>
              <input type="checkbox" disabled aria-label="Mark episode watched" />
            </li>
          ))}
        </ul>
      </AsyncSection>
    </section>
  )
}