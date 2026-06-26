import { useParams } from 'react-router-dom'
import { PageShell } from '../../../../Common'

export function TVShowDetailPage() {
  const { showId } = useParams()

  return (
    <PageShell title="TV Show Detail Page">
      <p>Show ID: {showId}</p>
    </PageShell>
  )
}