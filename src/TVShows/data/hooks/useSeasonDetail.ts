import { useEffect, useState } from 'react'
import { tmdbService, type Episode } from '../../../Common'

export function useSeasonDetail(showId: number, seasonNumber: number) {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await tmdbService.getSeasonDetails(showId, seasonNumber)
        if (!cancelled) setEpisodes(data)
      } catch {
        if (!cancelled) setError('Failed to load season')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [showId, seasonNumber])

  return { episodes, isLoading, error }
}