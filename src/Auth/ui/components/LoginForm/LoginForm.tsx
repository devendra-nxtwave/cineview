import { useState, type FormEvent } from 'react'
import { z } from 'zod'

const loginFormSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
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
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationError(null)

    const result = loginFormSchema.safeParse({ username, password })
    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? 'Invalid input')
      return
    }

    onSubmit(username, password)
  }

  const displayError = validationError ?? errorMessage

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1>CineView</h1>
      <p className="login-subtitle">Sign in to continue</p>

      {displayError && (
        <p className="login-error" role="alert">
          {displayError}
        </p>
      )}

      <label htmlFor="username">Username</label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
        disabled={isSubmitting}
      />

      <label htmlFor="password">Password</label>
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
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}