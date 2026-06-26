import { PosterImage } from '../../../../Common'
import type { CastMember } from '../../../../Common'

type CastCarouselProps = {
  cast: CastMember[]
}

export function CastCarousel({ cast }: CastCarouselProps) {
  if (cast.length === 0) return <p>No cast information.</p>

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