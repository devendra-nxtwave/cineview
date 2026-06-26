import { createPortal } from 'react-dom'

type TrailerModalProps = {
  isOpen: boolean
  videoKey: string | null
  title: string
  onClose: () => void
}

export function TrailerModal({ isOpen, videoKey, title, onClose }: TrailerModalProps) {
  if (!isOpen || !videoKey) return null

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose}>Close</button>
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