// Authentication API calls

import { apiUrl, getAuthHeaders } from "./client"
import { fetchWithAuth } from "./fetchWithAuth"
import type { User, ApiResponse } from "@/types"
import { getRefreshTokenFromCookie, setTokenInCookie, getTokenFromCookie } from "./token"

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshTokenFromCookie()
  
  if (!refreshToken) {
    throw new Error("No refresh token available")
  }

  const response = await fetch(`${apiUrl}/api/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error?.message || "Failed to refresh token")
  }

  const data: ApiResponse<{ accessToken: string }> = await response.json()

  if (!data.success || !data.data?.accessToken) {
    throw new Error("Invalid refresh response format")
  }

  // Update the token in cookie
  setTokenInCookie(data.data.accessToken)
  
  return data.data.accessToken
}

export async function getCurrentUser(token?: string): Promise<User> {
  const accessToken = token || getTokenFromCookie()
  
  if (!accessToken) {
    throw new Error("No access token available")
  }

  const response = await fetchWithAuth(`${apiUrl}/api/auth/me`, {
    token: accessToken,
  })

  if (!response.ok) {
    throw new Error("Failed to fetch user")
  }

  const data: ApiResponse<{ user: User }> = await response.json()

  if (!data.success || !data.data?.user) {
    throw new Error("Invalid response format")
  }

  const userData = data.data.user
  return {
    id: userData.id?.toString() || "",
    email: userData.email || "",
    name: userData.name || "User",
  }
}

export async function logout(token?: string): Promise<void> {
  const accessToken = token || getTokenFromCookie()
  
  if (!accessToken) {
    return // Already logged out
  }

  const response = await fetchWithAuth(`${apiUrl}/api/auth/logout`, {
    token: accessToken,
    method: "POST",
  })

  if (!response.ok) {
    throw new Error("Failed to logout")
  }
}


