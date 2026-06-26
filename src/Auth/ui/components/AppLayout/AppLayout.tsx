import { Outlet, useNavigate } from 'react-router-dom'
import { AppShell } from '../../../../Common'
import { sessionService } from '../../../data/services/sessionService'

export function AppLayout() {
  const navigate = useNavigate()
  const session = sessionService.getSession()!

  function handleLogout() {
    sessionService.clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <AppShell username={session.username} onLogout={handleLogout}>
      <Outlet />
    </AppShell>
  )
}