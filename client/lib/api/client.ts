// API client configuration and utilities

const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
}

export const apiUrl = getApiUrl()

export const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
})


