// Fetch wrapper with automatic token refresh

import { apiUrl, getAuthHeaders } from "./client"
import { getTokenFromCookie, clearTokens } from "./token"
import { refreshAccessToken } from "./auth"

export interface FetchWithAuthOptions extends RequestInit {
  token?: string
  skipAuth?: boolean
}

let isRefreshing = false
let refreshPromise: Promise<string> | null = null

async function getValidToken(token?: string): Promise<string> {
  // Use provided token or get from cookie
  const accessToken = token || getTokenFromCookie()
  
  if (!accessToken) {
    throw new Error("No access token available")
  }
  
  return accessToken
}

export async function fetchWithAuth(
  url: string,
  options: FetchWithAuthOptions = {}
): Promise<Response> {
  const { token, skipAuth = false, ...fetchOptions } = options

  // If skipAuth is true, just do a regular fetch
  if (skipAuth) {
    const fullUrl = url.startsWith('http') ? url : `${apiUrl}${url}`
    return fetch(fullUrl, fetchOptions)
  }

  // Get valid token
  let accessToken = await getValidToken(token)

  // Construct full URL if it's a relative path
  const fullUrl = url.startsWith('http') ? url : `${apiUrl}${url}`

  // Make the request
  let response = await fetch(fullUrl, {
    ...fetchOptions,
    headers: {
      ...getAuthHeaders(accessToken),
      ...fetchOptions.headers,
    },
  })

  // If token expired, try to refresh
  if (response.status === 401) {
    // Clone response to read body without consuming it
    const clonedResponse = response.clone()
    const errorData = await clonedResponse.json().catch(() => ({}))
    
    // Check if it's a token expiration error
    if (errorData.error?.code === "TOKEN_EXPIRED" || errorData.error?.code === "UNAUTHORIZED") {
      // Prevent multiple simultaneous refresh attempts
      if (!isRefreshing) {
        isRefreshing = true
        refreshPromise = refreshAccessToken()
      }

      try {
        // Wait for token refresh
        accessToken = await refreshPromise!
        
        // Retry the original request with new token
        response = await fetch(fullUrl, {
          ...fetchOptions,
          headers: {
            ...getAuthHeaders(accessToken),
            ...fetchOptions.headers,
          },
        })
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        clearTokens()
        if (typeof window !== 'undefined') {
          window.location.href = "/login?error=session_expired"
        }
        throw new Error("Session expired. Please login again.")
      } finally {
        isRefreshing = false
        refreshPromise = null
      }
    }
  }

  return response
}

