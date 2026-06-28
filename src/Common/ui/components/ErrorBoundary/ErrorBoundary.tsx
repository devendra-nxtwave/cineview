import { Component, type ErrorInfo, type ReactNode } from 'react'
import i18n from '../../../../Preferences/data/i18n/i18n'

type Props = {
  children: ReactNode
  fallback?: ReactNode
}

type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Section error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <p>{i18n.t('async.sectionFailed', { ns: 'common' })}</p>
        )
      )
    }
    return this.props.children
  }
}