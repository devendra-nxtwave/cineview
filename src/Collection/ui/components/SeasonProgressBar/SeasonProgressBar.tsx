import { useTranslation } from 'react-i18next'

type SeasonProgressBarProps = {
  watched: number
  total: number
}

export function SeasonProgressBar({ watched, total }: SeasonProgressBarProps) {
  const { t } = useTranslation('collection')
  const percent = total > 0 ? Math.round((watched / total) * 100) : 0

  return (
    <div className="season-progress-bar">
      <div className="season-progress-label">
        {t('episodes.seasonProgress', { watched, total })}
      </div>
      <div className="season-progress-track" aria-hidden="true">
        <div className="season-progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}