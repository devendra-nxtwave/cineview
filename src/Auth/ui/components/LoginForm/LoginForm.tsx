import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

const loginFormSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

type LoginFormProps = {
  onSubmit: (username: string, password: string) => void
  errorMessage: string | null
  isSubmitting?: boolean
}

export function LoginForm({
  onSubmit,
  errorMessage,
  isSubmitting = false,
}: LoginFormProps) {
  const { t } = useTranslation('auth')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationError(null)

    const result = loginFormSchema.safeParse({ username, password })
    if (!result.success) {
      const field = result.error.issues[0]?.path[0]
      const message =
        field === 'username'
          ? t('usernameRequired')
          : field === 'password'
            ? t('passwordRequired')
            : t('invalidInput')
      setValidationError(message)
      return
    }

    onSubmit(username, password)
  }

  const displayError = validationError ?? errorMessage

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1>CineView</h1>
      <p className="login-subtitle">{t('subtitle')}</p>

      {displayError && (
        <p className="login-error" role="alert">
          {displayError}
        </p>
      )}

      <label htmlFor="username">{t('username')}</label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
        disabled={isSubmitting}
      />

      <label htmlFor="password">{t('password')}</label>
      <div className="password-field">
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          disabled={isSubmitting}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? t('hidePasswordAria') : t('showPasswordAria')}
        >
          {showPassword ? t('hidePassword') : t('showPassword')}
        </button>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('signingIn') : t('signIn')}
      </button>
    </form>
  )
}