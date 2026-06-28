import { useTranslation } from 'react-i18next'
import { PageShell } from '../../../../Common'

export function WatchlistPage() {
  const { t } = useTranslation('collection')

  return (
    <PageShell title={t('watchlistTitle')}>
      <p>{t('watchlistPlaceholder')}</p>
    </PageShell>
  )
}