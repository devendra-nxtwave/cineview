import { useTranslation } from 'react-i18next'
import { PageShell } from '../../../../Common'

export function MyListsPage() {
  const { t } = useTranslation('collection')

  return (
    <PageShell title={t('listsTitle')}>
      <p>{t('listsPlaceholder')}</p>
    </PageShell>
  )
}