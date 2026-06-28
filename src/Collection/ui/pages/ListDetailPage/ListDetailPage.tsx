import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageShell } from '../../../../Common'

export function ListDetailPage() {
  const { t } = useTranslation('collection')
  const { listId } = useParams()

  return (
    <PageShell title={t('listDetailTitle')}>
      <p>{t('listDetailPlaceholder')}</p>
      <p>{listId}</p>
    </PageShell>
  )
}