import type { ReactNode } from 'react'
import { Navbar } from '../PageShell/Navbar/Navbar'

type AppShellProps = {
  username: string
  onLogout: () => void
  children: ReactNode
}

export function AppShell({ username, onLogout, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <Navbar username={username} onLogout={onLogout} />
      <main className="app-main">{children}</main>
    </div>
  )
}