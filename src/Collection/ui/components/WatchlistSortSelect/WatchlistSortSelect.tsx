import { useTranslation } from 'react-i18next'
import type { WatchlistSortOption } from '../../../core/types'

type WatchlistSortSelectProps = {
  value: WatchlistSortOption
  onChange: (value: WatchlistSortOption) => void
}

export function WatchlistSortSelect({ value, onChange }: WatchlistSortSelectProps) {
  const { t } = useTranslation('collection')

  return (
    <label className="watchlist-sort">
      <span>{t('sort.label')}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as WatchlistSortOption)}
        aria-label={t('sort.label')}
      >
        <option value="dateAdded">{t('sort.dateAdded')}</option>
        <option value="rating">{t('sort.rating')}</option>
        <option value="title">{t('sort.title')}</option>
      </select>
    </label>
  )
}