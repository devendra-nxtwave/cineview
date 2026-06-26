import type { ReactNode } from 'react'

type PageShellProps = {
  title: string
  children?: ReactNode
}

export function PageShell({ title, children }: PageShellProps) {
  return (
    <main className="page-shell">
      <h1>{title}</h1>
      {children}
    </main>
  )
}