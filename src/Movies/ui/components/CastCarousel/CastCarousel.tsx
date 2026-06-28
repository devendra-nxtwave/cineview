import { useTranslation } from 'react-i18next'
import { PosterImage } from '../../../../Common'
import type { CastMember } from '../../../../Common'

type CastCarouselProps = {
  cast: CastMember[]
}

export function CastCarousel({ cast }: CastCarouselProps) {
  const { t } = useTranslation('movies')

  if (cast.length === 0) return <p>{t('castEmpty')}</p>

  return (
    <div className="cast-carousel">
      {cast.slice(0, 12).map((member) => (
        <div key={member.id} className="cast-card">
          <PosterImage path={member.profile_path} alt={member.name} size="profile" />
          <p className="cast-name">{member.name}</p>
          <p className="cast-character">{member.character}</p>
        </div>
      ))}
    </div>
  )
}