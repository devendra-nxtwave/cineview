import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

type TrailerModalProps = {
  isOpen: boolean
  videoKey: string | null
  title: string
  onClose: () => void
}

export function TrailerModal({ isOpen, videoKey, title, onClose }: TrailerModalProps) {
  const { t } = useTranslation('common')

  if (!isOpen || !videoKey) return null

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose}>
          {t('close')}
        </button>
        <iframe
          title={title}
          src={`https://www.youtube.com/embed/${videoKey}`}
          allowFullScreen
        />
      </div>
    </div>,
    document.body,
  )
}