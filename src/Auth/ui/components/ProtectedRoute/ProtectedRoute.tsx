import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { sessionService } from '../../../data/services/sessionService'

export function ProtectedRoute() {
  const location = useLocation()

  if (!sessionService.isAuthenticated()) {
    const redirectPath = encodeURIComponent(
      location.pathname + location.search,
    )
    return (
      <Navigate to={`/login?redirect=${redirectPath}`} replace />
    )
  }

  return <Outlet />
}