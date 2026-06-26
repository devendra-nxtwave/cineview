import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from './constants'

export function getImageUrl(
  path: string | null | undefined,
  size: keyof typeof IMAGE_SIZES = 'poster',
): string | null {
  if (!path) return null
  return `${TMDB_IMAGE_BASE_URL}/${IMAGE_SIZES[size]}${path}`
}