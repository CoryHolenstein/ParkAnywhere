import { createContext, useMemo, useState } from 'react'
import {
  buildHostedUiLoginUrl,
  buildHostedUiLogoutUrl,
  clearAuthSession,
  isCognitoConfigured,
  loadAuthSession,
} from './cognito'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadAuthSession())
  const [authError, setAuthError] = useState('')

  const value = useMemo(() => {
    const email = session?.claims?.email || session?.claims?.['cognito:username'] || null
    const groups = session?.claims?.['cognito:groups'] || []

    return {
      isAuthenticated: Boolean(session?.idToken),
      token: session?.idToken || null,
      email,
      groups,
      authError,
      canLogin: isCognitoConfigured(),
      login() {
        try {
          setAuthError('')
          window.location.assign(buildHostedUiLoginUrl())
        } catch (error) {
          setAuthError(error.message || 'Cognito is not configured for local login.')
        }
      },
      logout() {
        clearAuthSession()
        setSession(null)
        setAuthError('')
        try {
          window.location.assign(buildHostedUiLogoutUrl())
        } catch {
          window.location.reload()
        }
      },
      refreshFromStorage() {
        setAuthError('')
        setSession(loadAuthSession())
      },
    }
  }, [authError, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }
