import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type Status = 'idle' | 'loading' | 'success' | 'error' | 'empty'

type AsyncSectionProps = {
  status: Status
  error?: string | null
  onRetry?: () => void
  emptyMessage?: string
  children: ReactNode
}

export function AsyncSection({
  status,
  error,
  onRetry,
  emptyMessage,
  children,
}: AsyncSectionProps) {
  const { t } = useTranslation('common')

  if (status === 'loading') return <p>{t('async.loading')}</p>
  if (status === 'error') {
    return (
      <div>
        <p>{error ?? t('async.error')}</p>
        {onRetry && (
          <button type="button" onClick={onRetry}>
            {t('retry')}
          </button>
        )}
      </div>
    )
  }
  if (status === 'empty') return <p>{emptyMessage ?? t('async.empty')}</p>
  if (status === 'idle') return null
  return <>{children}</>
}