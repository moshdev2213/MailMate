// API client configuration and utilities

const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL
}

export const apiUrl = getApiUrl()

export const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
})


