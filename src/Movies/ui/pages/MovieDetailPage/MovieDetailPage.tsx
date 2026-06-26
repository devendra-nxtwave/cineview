import { useParams } from 'react-router-dom'
import { PageShell } from '../../../../Common'

export function MovieDetailPage() {
  const { movieId } = useParams()

  return (
    <PageShell title="Movie Detail Page">
      <p>Movie ID: {movieId}</p>
    </PageShell>
  )
}