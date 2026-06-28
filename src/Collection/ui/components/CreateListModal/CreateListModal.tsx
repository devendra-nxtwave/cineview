import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { MAX_LIST_NAME_LENGTH } from '../../../core/constants'

type CreateListModalProps = {
  isOpen: boolean
  onClose: () => void
  onCreate: (name: string, description?: string) => void
}

export function CreateListModal({ isOpen, onClose, onCreate }: CreateListModalProps) {
  const { t } = useTranslation('collection')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  if (!isOpen) return null

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onCreate(trimmed, description.trim() || undefined)
    setName('')
    setDescription('')
    onClose()
  }

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content create-list-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{t('lists.createTitle')}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="list-name">{t('lists.nameLabel')}</label>
          <input
            id="list-name"
            value={name}
            maxLength={MAX_LIST_NAME_LENGTH}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="list-description">{t('lists.descriptionLabel')}</label>
          <textarea
            id="list-description"
            value={description}
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="modal-actions">
            <button type="submit">{t('lists.create')}</button>
            <button type="button" onClick={onClose}>
              {t('note.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}