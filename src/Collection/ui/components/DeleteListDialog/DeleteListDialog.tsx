import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

type DeleteListDialogProps = {
  isOpen: boolean
  listName: string
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteListDialog({
  isOpen,
  listName,
  onConfirm,
  onCancel,
}: DeleteListDialogProps) {
  const { t } = useTranslation('collection')

  if (!isOpen) return null

  return createPortal(
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content delete-list-dialog" onClick={(e) => e.stopPropagation()}>
        <h2>{t('lists.deleteTitle')}</h2>
        <p>{t('lists.deleteMessage', { name: listName })}</p>
        <div className="modal-actions">
          <button type="button" className="danger" onClick={onConfirm}>
            {t('lists.deleteConfirm')}
          </button>
          <button type="button" onClick={onCancel}>
            {t('note.cancel')}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}