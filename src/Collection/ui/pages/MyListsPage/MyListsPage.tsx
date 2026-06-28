import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { PageShell } from '../../../../Common'
import { collectionStore } from '../../../data/stores/CollectionStore'
import { CreateListModal } from '../../components/CreateListModal/CreateListModal'
import { EmptyLists } from '../../components/EmptyLists/EmptyLists'
import { ListCard } from '../../components/ListCard/ListCard'

export const MyListsPage = observer(function MyListsPage() {
  const { t } = useTranslation('collection')
  const { t: tCommon } = useTranslation('common')
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  if (!collectionStore.isHydrated) {
    return (
      <PageShell title={t('listsTitle')}>
        <p>{tCommon('loading')}</p>
      </PageShell>
    )
  }

  return (
    <PageShell title={t('listsTitle')}>
      <div className="lists-toolbar">
        <button type="button" onClick={() => setIsCreateOpen(true)}>
          {t('lists.create')}
        </button>
      </div>

      {collectionStore.customLists.length === 0 ? (
        <EmptyLists onCreateClick={() => setIsCreateOpen(true)} />
      ) : (
        <div className="lists-grid">
          {collectionStore.customLists.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      )}

      <CreateListModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={(name, description) => collectionStore.createList(name, description)}
      />
    </PageShell>
  )
})