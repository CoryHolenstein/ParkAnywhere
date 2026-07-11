const STORAGE_KEY = 'parkanywhere.auth'

const parseJwtPayload = (token) => {
  try {
    const [, payload] = token.split('.')
    if (!payload) {
      return null
    }

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(''),
    )

    return JSON.parse(json)
  } catch {
    return null
  }
}

const readStoredSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }

    return JSON.parse(raw)
  } catch {
    return null
  }
}

const writeStoredSession = (session) => {
  if (!session) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

const parseHashTokens = (hash) => {
  if (!hash || !hash.includes('id_token=')) {
    return null
  }

  const params = new URLSearchParams(hash.replace(/^#/, ''))
  const idToken = params.get('id_token')
  const accessToken = params.get('access_token')

  if (!idToken) {
    return null
  }

  const claims = parseJwtPayload(idToken)

  return {
    idToken,
    accessToken,
    claims,
    storedAt: new Date().toISOString(),
  }
}

export const loadAuthSession = () => {
  const fromHash = parseHashTokens(window.location.hash)
  if (fromHash) {
    writeStoredSession(fromHash)
    window.history.replaceState({}, document.title, window.location.pathname + window.location.search)
    return fromHash
  }

  return readStoredSession()
}

export const clearAuthSession = () => {
  writeStoredSession(null)
}

const getRequiredEnv = (name) => {
  const value = import.meta.env[name]
  if (!value) {
    throw new Error(`${name} is not configured`) 
  }

  return value
}

const normalizeCognitoDomain = (rawDomain) => {
  return rawDomain
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '')
}

export const isCognitoConfigured = () => {
  return Boolean(import.meta.env.VITE_COGNITO_DOMAIN && import.meta.env.VITE_COGNITO_CLIENT_ID)
}

export const buildHostedUiLoginUrl = () => {
  const domain = normalizeCognitoDomain(getRequiredEnv('VITE_COGNITO_DOMAIN'))
  const clientId = getRequiredEnv('VITE_COGNITO_CLIENT_ID')
  const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI || window.location.origin

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'token',
    scope: 'openid email profile',
    redirect_uri: redirectUri,
  })

  return `https://${domain}/login?${params.toString()}`
}

export const buildHostedUiLogoutUrl = () => {
  const domain = normalizeCognitoDomain(getRequiredEnv('VITE_COGNITO_DOMAIN'))
  const clientId = getRequiredEnv('VITE_COGNITO_CLIENT_ID')
  const logoutUri = import.meta.env.VITE_COGNITO_LOGOUT_URI || window.location.origin

  const params = new URLSearchParams({
    client_id: clientId,
    logout_uri: logoutUri,
  })

  return `https://${domain}/logout?${params.toString()}`
}
