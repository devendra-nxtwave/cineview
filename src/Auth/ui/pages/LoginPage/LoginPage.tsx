import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../../../data/services/authService'
import { sessionService } from '../../../data/services/sessionService'
import { LoginForm } from '../../components/LoginForm/LoginForm'

export function LoginPage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (sessionService.isAuthenticated()) {
      navigate('/', { replace: true })
    }
  }, [navigate])

  function handleLogin(username: string, password: string) {
    setIsSubmitting(true)
    setErrorMessage(null)

    const isValid = authService.validateCredentials(username, password)

    if (!isValid) {
      setErrorMessage(t('invalidCredentials'))
      setIsSubmitting(false)
      return
    }

    sessionService.setSession({
      username,
      token: crypto.randomUUID(),
    })

    const redirectPath = searchParams.get('redirect') ?? '/'
    navigate(redirectPath, { replace: true })
  }

  return (
    <div className="login-shell">
      <LoginForm
        onSubmit={handleLogin}
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}