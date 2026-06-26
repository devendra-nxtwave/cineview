import { useParams } from 'react-router-dom'
import { PageShell } from '../../../../Common'

export function SeasonDetailPage() {
  const { showId, seasonNumber } = useParams()

  return (
    <PageShell title="Season Detail Page">
      <p>
        Show ID: {showId} · Season: {seasonNumber}
      </p>
    </PageShell>
  )
}