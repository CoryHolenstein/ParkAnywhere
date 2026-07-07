const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !API_BASE_URL

export const apiConfig = {
  baseUrl: API_BASE_URL,
  useMock: USE_MOCK,
}

export const requestJson = async (path, options = {}) => {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not configured.')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers || {}),
    },
    method: options.method || 'GET',
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const text = await response.text()
  const payload = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(payload?.message || 'API request failed.')
  }

  return payload
}
