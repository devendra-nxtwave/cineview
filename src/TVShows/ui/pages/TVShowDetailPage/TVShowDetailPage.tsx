import { useTranslation } from 'react-i18next'

export function TVShowDetailPage() {
  const { t } = useTranslation('tvShows')

  return (
    <section className="tv-show-overview">
      <p>{t('selectSeason')}</p>
    </section>
  )
}