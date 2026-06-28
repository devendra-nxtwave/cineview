import { useTranslation } from 'react-i18next'
import { PageShell } from '../../components/PageShell/PageShell'

export function NotFoundPage() {
  const { t } = useTranslation('common')

  return (
    <PageShell title={t('notFound.title')}>
      <p>{t('notFound.description')}</p>
    </PageShell>
  )
}