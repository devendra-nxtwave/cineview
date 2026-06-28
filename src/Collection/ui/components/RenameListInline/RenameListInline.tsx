import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MAX_LIST_NAME_LENGTH } from '../../../core/constants'

type RenameListInlineProps = {
  name: string
  onSave: (name: string) => void
}

export function RenameListInline({ name, onSave }: RenameListInlineProps) {
  const { t } = useTranslation('collection')
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(name)

  if (!isEditing) {
    return (
      <div className="rename-list-inline">
        <h1>{name}</h1>
        <button type="button" onClick={() => { setDraft(name); setIsEditing(true) }}>
          {t('lists.rename')}
        </button>
      </div>
    )
  }

  return (
    <form
      className="rename-list-inline rename-list-inline--editing"
      onSubmit={(e) => {
        e.preventDefault()
        const trimmed = draft.trim()
        if (!trimmed) return
        onSave(trimmed)
        setIsEditing(false)
      }}
    >
      <input
        value={draft}
        maxLength={MAX_LIST_NAME_LENGTH}
        onChange={(e) => setDraft(e.target.value)}
        aria-label={t('lists.nameLabel')}
      />
      <button type="submit">{t('note.save')}</button>
      <button type="button" onClick={() => { setDraft(name); setIsEditing(false) }}>
        {t('note.cancel')}
      </button>
    </form>
  )
}