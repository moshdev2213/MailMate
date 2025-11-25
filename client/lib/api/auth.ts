// Authentication API calls

import { apiUrl, getAuthHeaders } from "./client"
import type { User, ApiResponse } from "@/types"

export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${apiUrl}/api/auth/me`, {
    headers: getAuthHeaders(token),
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

export async function logout(token: string): Promise<void> {
  const response = await fetch(`${apiUrl}/api/auth/logout`, {
    method: "POST",
    headers: getAuthHeaders(token),
  })

  if (!response.ok) {
    throw new Error("Failed to logout")
  }
}

