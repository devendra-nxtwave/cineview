import { useEffect, useState } from 'react'
import { tmdbService, type TVShowDetail } from '../../../Common'
import { preferencesStore } from '../../../Preferences/data/stores/PreferencesStore'

export function useTVShowDetail(showId: number) {
  const language = preferencesStore.language
  const region = preferencesStore.region

  const [show, setShow] = useState<TVShowDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!showId || Number.isNaN(showId)) {
        setNotFound(true)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const data = await tmdbService.getTVShowDetails(showId)
        if (!cancelled) setShow(data)
      } catch (err) {
        if (cancelled) return
        if (err instanceof Error && err.message === 'NOT_FOUND') {
          setNotFound(true)
        } else {
          setError('Failed to load TV show')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [showId, language, region])

  return { show, isLoading, notFound, error }
}