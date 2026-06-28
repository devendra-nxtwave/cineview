import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PosterImage } from '../../../../Common'
import type { CustomList } from '../../../core/types'

type ListCardProps = {
  list: CustomList
}

export function ListCard({ list }: ListCardProps) {
  const { t } = useTranslation('collection')
  const previews = list.items.slice(0, 4)

  return (
    <Link to={`/lists/${list.id}`} className="list-card">
      <div className="list-card-previews">
        {previews.length === 0 ? (
          <div className="list-card-empty-preview">{t('lists.noItems')}</div>
        ) : (
          previews.map((item) => (
            <PosterImage
              key={`${item.mediaType}-${item.mediaId}`}
              path={item.snapshot.posterPath}
              alt={item.snapshot.title}
            />
          ))
        )}
      </div>
      <h3>{list.name}</h3>
      <p>{t('lists.itemCount', { count: list.items.length })}</p>
    </Link>
  )
}