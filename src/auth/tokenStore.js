const STORAGE_KEY = 'parkanywhere.auth'

export const getAuthToken = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }

    const session = JSON.parse(raw)
    return session?.idToken || null
  } catch {
    return null
  }
}
