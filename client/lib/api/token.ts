// Token management utilities

export function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'authToken') {
      return decodeURIComponent(value)
    }
  }
  return null
}

export function getRefreshTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'refreshToken') {
      return decodeURIComponent(value)
    }
  }
  return null
}

export function setTokenInCookie(token: string): void {
  if (typeof document === 'undefined') return
  
  const maxAge = 86400 // 24 hours
  const secure = window.location.protocol === 'https:' ? '; secure' : ''
  document.cookie = `authToken=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; samesite=lax${secure}`
}

export function clearTokens(): void {
  if (typeof document === 'undefined') return
  
  document.cookie = 'authToken=; path=/; max-age=0'
  document.cookie = 'refreshToken=; path=/; max-age=0'
}

