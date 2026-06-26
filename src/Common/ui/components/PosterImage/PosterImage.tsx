import { getImageUrl } from '../../../core/imageUtils'

type PosterImageProps = {
  path: string | null | undefined
  alt: string
  size?: 'poster' | 'backdrop' | 'profile' | 'still'
  className?: string
}

export function PosterImage({ path, alt, size = 'poster', className = '' }: PosterImageProps) {
  const src = getImageUrl(path, size)

  if (!src) {
    return (
      <div className={`poster-placeholder ${className}`} aria-label={alt}>
        No image
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} loading="lazy" />
}