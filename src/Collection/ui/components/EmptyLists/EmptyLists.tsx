import { useTranslation } from 'react-i18next'

type EmptyListsProps = {
  onCreateClick: () => void
}

export function EmptyLists({ onCreateClick }: EmptyListsProps) {
  const { t } = useTranslation('collection')

  return (
    <div className="empty-lists">
      <p>{t('lists.empty')}</p>
      <button type="button" onClick={onCreateClick}>
        {t('lists.create')}
      </button>
    </div>
  )
}