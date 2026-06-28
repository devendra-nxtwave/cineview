import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { PageShell } from '../../../../Common'
import { watchlistStore } from '../../../data/stores/WatchlistStore'
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

  let entries = watchlistStore.entries

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

  if (!watchlistStore.isHydrated) {
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
          counts={watchlistStore.getStatusCounts()}
          onSelect={setActiveStatus}
        />

        {watchlistStore.totalCount > 0 && (
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
                watchlistStore.updateStatus(entry.mediaType, entry.mediaId, status)
              }
              onNoteSave={(note) =>
                watchlistStore.updateNote(entry.mediaType, entry.mediaId, note)
              }
              onNoteClear={() =>
                watchlistStore.updateNote(entry.mediaType, entry.mediaId, '')
              }
              onRemove={() =>
                watchlistStore.remove(entry.mediaType, entry.mediaId)
              }
            />
          ))}
        </div>
      )}
    </PageShell>
  )
})