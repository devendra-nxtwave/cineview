import { useTranslation } from 'react-i18next'
import type { WatchlistFilterStatus } from '../../../core/types'

type StatusCounts = {
  all: number
  want_to_watch: number
  watching: number
  completed: number
}

type StatusFilterTabsProps = {
  activeStatus: WatchlistFilterStatus
  counts: StatusCounts
  onSelect: (status: WatchlistFilterStatus) => void
}

const TABS: { value: WatchlistFilterStatus; labelKey: string }[] = [
  { value: 'all', labelKey: 'filter.all' },
  { value: 'want_to_watch', labelKey: 'status.want_to_watch' },
  { value: 'watching', labelKey: 'status.watching' },
  { value: 'completed', labelKey: 'status.completed' },
]

export function StatusFilterTabs({
  activeStatus,
  counts,
  onSelect,
}: StatusFilterTabsProps) {
  const { t } = useTranslation('collection')

  return (
    <div className="watchlist-filter-tabs" role="tablist" aria-label={t('filterLabel')}>
      {TABS.map(({ value, labelKey }) => (
        <button
          key={value}
          type="button"
          role="tab"
          aria-selected={activeStatus === value}
          className={`genre-chip ${activeStatus === value ? 'active' : ''}`}
          onClick={() => onSelect(value)}
        >
          {t(labelKey)} ({counts[value]})
        </button>
      ))}
    </div>
  )
}