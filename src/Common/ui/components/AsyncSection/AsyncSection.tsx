import type { ReactNode } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error' | 'empty'

type AsyncSectionProps = {
  status: Status
  error?: string | null
  onRetry?: () => void
  emptyMessage?: string
  children: ReactNode
}

export function AsyncSection({
  status,
  error,
  onRetry,
  emptyMessage = 'Nothing to show',
  children,
}: AsyncSectionProps) {
  if (status === 'loading') return <p>Loading…</p>
  if (status === 'error') {
    return (
      <div>
        <p>{error ?? 'Something went wrong'}</p>
        {onRetry && <button type="button" onClick={onRetry}>Retry</button>}
      </div>
    )
  }
  if (status === 'empty') return <p>{emptyMessage}</p>
  if (status === 'idle') return null
  return <>{children}</>
}