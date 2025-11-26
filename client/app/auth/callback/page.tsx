"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = () => {
      try {
        const error = searchParams.get("error")
        const accessToken = searchParams.get("accessToken")
        const refreshToken = searchParams.get("refreshToken")

        if (error) {
          console.error("OAuth error:", error)
          router.push("/login?error=" + encodeURIComponent(error))
          return
        }

        if (!accessToken) {
          router.push("/login?error=no_token")
          return
        }

        // Store tokens in cookies
        // Set access token
        document.cookie = `authToken=${accessToken}; path=/; max-age=86400; samesite=lax${window.location.protocol === 'https:' ? '; secure' : ''}`
        
        // Store refresh token if provided
        if (refreshToken) {
          document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; samesite=lax${window.location.protocol === 'https:' ? '; secure' : ''}`
        }

        // Redirect to dashboard
        router.push("/dashboard")
      } catch (err) {
        console.error("Callback error:", err)
        router.push("/login?error=callback_failed")
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-100 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center">
          <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
        <p className="text-slate-600 font-medium">Authenticating with Google...</p>
        <p className="text-sm text-slate-500">Please wait while we verify your account</p>
      </div>
    </div>
  )
}
