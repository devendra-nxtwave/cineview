import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PosterImage } from '../../../../Common'
import type { ListItem } from '../../../core/types'

type ListItemCardProps = {
  item: ListItem
  onRemove: () => void
}

export function ListItemCard({ item, onRemove }: ListItemCardProps) {
  const { t } = useTranslation('collection')
  const detailPath =
    item.mediaType === 'movie'
      ? `/movies/${item.mediaId}`
      : `/tv/${item.mediaId}`

  return (
    <article className="list-item-card">
      <Link to={detailPath}>
        <PosterImage path={item.snapshot.posterPath} alt={item.snapshot.title} />
      </Link>
      <div className="list-item-card-body">
        <Link to={detailPath}>
          <h3>{item.snapshot.title}</h3>
        </Link>
        <span>★ {item.snapshot.voteAverage.toFixed(1)}</span>
        <button type="button" onClick={onRemove} aria-label={t('lists.removeItemAria')}>
          {t('remove')}
        </button>
      </div>
    </article>
  )
}