import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { PageShell } from '../../../../Common'
import { collectionStore } from '../../../data/stores/CollectionStore'
import type { WatchlistFilterStatus, WatchlistSortOption } from '../../../core/types'
import { EmptyWatchlist } from '../../components/EmptyWatchlist/EmptyWatchlist'
import { StatusFilterTabs } from '../../components/StatusFilterTabs/StatusFilterTabs'
import { WatchlistSortSelect } from '../../components/WatchlistSortSelect/WatchlistSortSelect'
import { WatchlistCard } from '../../components/WatchlistCard/WatchlistCard'

export const WatchlistPage = observer(function WatchlistPage() {
  const { t } = useTranslation('collection')
  const { t: tCommon } = useTranslation('common')
  const [activeStatus, setActiveStatus] = useState<WatchlistFilterStatus>('all')
  const [sort, setSort] = useState<WatchlistSortOption>('dateAdded')

  let entries = collectionStore.entries

  if (activeStatus !== 'all') {
    entries = entries.filter((entry) => entry.status === activeStatus)
  }

  const displayedEntries = [...entries]

  if (sort === 'dateAdded') {
    displayedEntries.sort((a, b) => b.addedAt.localeCompare(a.addedAt))
  } else if (sort === 'rating') {
    displayedEntries.sort((a, b) => b.snapshot.voteAverage - a.snapshot.voteAverage)
  } else {
    displayedEntries.sort((a, b) => a.snapshot.title.localeCompare(b.snapshot.title))
  }

  if (!collectionStore.isHydrated) {
    return (
      <PageShell title={t('watchlistTitle')}>
        <p>{tCommon('loading')}</p>
      </PageShell>
    )
  }

  return (
    <PageShell title={t('watchlistTitle')}>
      <div className="watchlist-toolbar">
        <StatusFilterTabs
          activeStatus={activeStatus}
          counts={collectionStore.getStatusCounts()}
          onSelect={setActiveStatus}
        />

        {collectionStore.totalCount > 0 && (
          <WatchlistSortSelect value={sort} onChange={setSort} />
        )}
      </div>

      {displayedEntries.length === 0 ? (
        <EmptyWatchlist filteredStatus={activeStatus} />
      ) : (
        <div className="watchlist-grid">
          {displayedEntries.map((entry) => (
            <WatchlistCard
              key={entry.id}
              entry={entry}
              onStatusChange={(status) =>
                collectionStore.updateStatus(entry.mediaType, entry.mediaId, status)
              }
              onNoteSave={(note) =>
                collectionStore.updateNote(entry.mediaType, entry.mediaId, note)
              }
              onNoteClear={() =>
                collectionStore.updateNote(entry.mediaType, entry.mediaId, '')
              }
              onRemove={() =>
                collectionStore.remove(entry.mediaType, entry.mediaId)
              }
            />
          ))}
        </div>
      )}
    </PageShell>
  )
})