import { AUTH_CREDENTIALS } from '../../core/constants'

export const authService = {
  validateCredentials(username: string, password: string): boolean {
    return (
      username === AUTH_CREDENTIALS.username &&
      password === AUTH_CREDENTIALS.password
    )
  },
}