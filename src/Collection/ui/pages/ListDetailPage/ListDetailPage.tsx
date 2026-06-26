import { useParams } from 'react-router-dom'
import { PageShell } from '../../../../Common'

export function ListDetailPage() {
  const { listId } = useParams()

  return (
    <PageShell title="List Detail Page">
      <p>List ID: {listId}</p>
    </PageShell>
  )
}