import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { collectionStore } from '../../../data/stores/CollectionStore'
import type { MediaType } from '../../../core/types'

type AddToListPopoverProps = {
  mediaType: MediaType
  mediaId: number
  title: string
  posterPath?: string | null
  voteAverage: number
  variant?: 'icon' | 'button'
}

const MENU_WIDTH = 220
const VIEWPORT_MARGIN = 8

export const AddToListPopover = observer(function AddToListPopover({
  mediaType,
  mediaId,
  title,
  posterPath,
  voteAverage,
  variant = 'icon',
}: AddToListPopoverProps) {
  const { t } = useTranslation('collection')
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const snapshot = {
    title,
    posterPath: posterPath ?? null,
    voteAverage,
  }

  function updateMenuPosition() {
    const trigger = triggerRef.current
    if (!trigger) return

    const rect = trigger.getBoundingClientRect()
    let left = rect.left

    if (left + MENU_WIDTH > window.innerWidth - VIEWPORT_MARGIN) {
      left = window.innerWidth - MENU_WIDTH - VIEWPORT_MARGIN
    }

    if (left < VIEWPORT_MARGIN) {
      left = VIEWPORT_MARGIN
    }

    setMenuPosition({
      top: rect.bottom + 4,
      left,
    })
  }

  useEffect(() => {
    if (!isOpen) return

    updateMenuPosition()

    function handleScrollOrResize() {
      updateMenuPosition()
    }

    window.addEventListener('resize', handleScrollOrResize)
    window.addEventListener('scroll', handleScrollOrResize, true)

    return () => {
      window.removeEventListener('resize', handleScrollOrResize)
      window.removeEventListener('scroll', handleScrollOrResize, true)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        !triggerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const menu = isOpen ? (
    <div
      ref={menuRef}
      className="add-to-list-menu add-to-list-menu--portal"
      role="menu"
      style={{
        top: menuPosition.top,
        left: menuPosition.left,
        width: MENU_WIDTH,
      }}
    >
      <p className="add-to-list-menu-title">{t('lists.addToList')}</p>
      {collectionStore.customLists.length === 0 ? (
        <p className="add-to-list-empty">{t('lists.noListsYet')}</p>
      ) : (
        <ul>
          {collectionStore.customLists.map((list) => (
            <li key={list.id}>
              <label>
                <input
                  type="checkbox"
                  checked={collectionStore.isInList(list.id, mediaType, mediaId)}
                  onChange={() =>
                    collectionStore.toggleListItem(list.id, mediaType, mediaId, snapshot)
                  }
                />
                {list.name}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  ) : null

  return (
    <div className="add-to-list-popover">
      <button
        ref={triggerRef}
        type="button"
        className={`add-to-list-trigger add-to-list-trigger--${variant}`}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen((open) => !open)
        }}
        aria-expanded={isOpen}
        aria-label={t('lists.addToListAria')}
      >
        {variant === 'button' ? t('lists.addToList') : '⊞'}
      </button>

      {menu && createPortal(menu, document.body)}
    </div>
  )
})