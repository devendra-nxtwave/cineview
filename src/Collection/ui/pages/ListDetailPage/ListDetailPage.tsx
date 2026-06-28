import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { PageShell } from '../../../../Common'
import { collectionStore } from '../../../data/stores/CollectionStore'
import { DeleteListDialog } from '../../components/DeleteListDialog/DeleteListDialog'
import { ListItemCard } from '../../components/ListItemCard/ListItemCard'
import { RenameListInline } from '../../components/RenameListInline/RenameListInline'

export const ListDetailPage = observer(function ListDetailPage() {
  const { t } = useTranslation('collection')
  const { t: tCommon } = useTranslation('common')
  const { listId } = useParams()
  const navigate = useNavigate()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  if (!collectionStore.isHydrated) {
    return (
      <PageShell title={t('listDetailTitle')}>
        <p>{tCommon('loading')}</p>
      </PageShell>
    )
  }

  const list = listId ? collectionStore.getList(listId) : undefined

  if (!list) {
    return (
      <PageShell title={t('lists.notFoundTitle')}>
        <p>{t('lists.notFoundDescription')}</p>
        <Link to="/lists">{t('lists.backToLists')}</Link>
      </PageShell>
    )
  }

  return (
    <PageShell title={list.name}>
      <RenameListInline
        name={list.name}
        onSave={(name) => collectionStore.renameList(list.id, name)}
      />

      {list.description && <p className="list-description">{list.description}</p>}

      <div className="list-detail-actions">
        <button type="button" className="danger" onClick={() => setIsDeleteOpen(true)}>
          {t('lists.delete')}
        </button>
      </div>

      {list.items.length === 0 ? (
        <p>{t('lists.noItems')}</p>
      ) : (
        <div className="list-items-grid">
          {list.items.map((item) => (
            <ListItemCard
              key={`${item.mediaType}-${item.mediaId}`}
              item={item}
              onRemove={() =>
                collectionStore.removeFromList(list.id, item.mediaType, item.mediaId)
              }
            />
          ))}
        </div>
      )}

      <DeleteListDialog
        isOpen={isDeleteOpen}
        listName={list.name}
        onConfirm={() => {
          collectionStore.deleteList(list.id)
          navigate('/lists')
        }}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </PageShell>
  )
})