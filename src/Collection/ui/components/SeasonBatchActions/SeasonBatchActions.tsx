import { useTranslation } from 'react-i18next'

type SeasonBatchActionsProps = {
  onMarkAll: () => void
  onUnmarkAll: () => void
  disabled?: boolean
}

export function SeasonBatchActions({
  onMarkAll,
  onUnmarkAll,
  disabled = false,
}: SeasonBatchActionsProps) {
  const { t } = useTranslation('collection')

  return (
    <div className="season-batch-actions">
      <button type="button" onClick={onMarkAll} disabled={disabled}>
        {t('episodes.markAll')}
      </button>
      <button type="button" onClick={onUnmarkAll} disabled={disabled}>
        {t('episodes.unmarkAll')}
      </button>
    </div>
  )
}