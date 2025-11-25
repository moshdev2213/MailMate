"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import EmailList from "@/components/email/email-list"
import SearchBar from "@/components/email/search-bar"
import Header from "@/components/layout/header"
import ErrorAlert from "@/components/layout/error-alert"
import { getCurrentUser, logout } from "@/lib/api/auth"
import type { User } from "@/types"

export default function DashboardClient({ token }: { token: string }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const userData = await getCurrentUser(token)
        setUser(userData)
      } catch (err) {
        setError("Failed to load user information")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [token])

  const handleLogout = useCallback(async () => {
    try {
      await logout(token)
      document.cookie = "authToken=; max-age=0; path=/;"
      router.push("/")
    } catch (err) {
      console.error("Logout error:", err)
      setError("Failed to logout")
    }
  }, [token, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center">
            <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
          <p className="text-slate-600">Loading your inbox...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-100">
      <Header user={user} onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

        <div className="space-y-6">
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} onPage={() => setCurrentPage(1)} />

          <EmailList
            token={token}
            searchQuery={searchQuery}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onError={setError}
          />
        </div>
      </main>
    </div>
  )
}

