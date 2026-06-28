import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MAX_NOTE_LENGTH } from '../../../core/constants'

type WatchlistNoteProps = {
  entryId: string
  note?: string
  onSave: (note: string) => void
  onClear: () => void
}

export function WatchlistNote({ entryId, note, onSave, onClear }: WatchlistNoteProps) {
  const { t } = useTranslation('collection')
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(note ?? '')

  const charCount = draft.length
  const isNearLimit = charCount >= MAX_NOTE_LENGTH - 20
  const isAtLimit = charCount >= MAX_NOTE_LENGTH
  const fieldId = `watchlist-note-${entryId}`

  function startEditing() {
    setDraft(note ?? '')
    setIsEditing(true)
  }

  function handleCancel() {
    setDraft(note ?? '')
    setIsEditing(false)
  }

  function handleSave() {
    onSave(draft.trim())
    setIsEditing(false)
  }

  function handleClear() {
    onClear()
    setDraft('')
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <div className="watchlist-note">
        {note ? (
          <p className="watchlist-note-text">{note}</p>
        ) : (
          <p className="watchlist-note-empty">{t('note.empty')}</p>
        )}
        <div className="watchlist-note-actions">
          <button type="button" onClick={startEditing}>
            {note ? t('note.edit') : t('note.add')}
          </button>
          {note && (
            <button type="button" onClick={handleClear}>
              {t('note.clear')}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="watchlist-note watchlist-note--editing">
      <label className="watchlist-note-label" htmlFor={fieldId}>
        {t('note.label')}
      </label>
      <textarea
        id={fieldId}
        className={`watchlist-note-input ${isNearLimit ? 'near-limit' : ''} ${isAtLimit ? 'at-limit' : ''}`}
        value={draft}
        maxLength={MAX_NOTE_LENGTH}
        rows={3}
        placeholder={t('note.placeholder')}
        onChange={(event) => setDraft(event.target.value)}
      />
      <span
        className={`watchlist-note-counter ${isNearLimit ? 'near-limit' : ''} ${isAtLimit ? 'at-limit' : ''}`}
      >
        {t('note.counter', { count: charCount, max: MAX_NOTE_LENGTH })}
      </span>
      <div className="watchlist-note-actions">
        <button type="button" onClick={handleSave}>
          {t('note.save')}
        </button>
        <button type="button" onClick={handleCancel}>
          {t('note.cancel')}
        </button>
      </div>
    </div>
  )
}