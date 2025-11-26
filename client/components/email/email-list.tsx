"use client"

import { useEffect, useState } from "react"
import EmailCard from "./email-card"
import PaginationControls from "./pagination-controls"
import { getEmails } from "@/lib/api/email"
import type { Email } from "@/types"

interface EmailListProps {
  token: string
  searchQuery: string
  currentPage: number
  onPageChange: (page: number) => void
  onError: (error: string) => void
}

export default function EmailList({ token, searchQuery, currentPage, onPageChange, onError }: EmailListProps) {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(0)
  const [totalEmails, setTotalEmails] = useState(0)

  const pageSize = 10

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true)
        const offset = (currentPage - 1) * pageSize

        const result = await getEmails({
          token,
          offset,
          limit: pageSize,
          search: searchQuery || undefined,
        })

        setEmails(result.emails)
        setTotalPages(Math.ceil(result.pagination.total / pageSize))
        setTotalEmails(result.pagination.total)
      } catch (err) {
        onError(err instanceof Error ? err.message : "Failed to load emails")
        setEmails([])
      } finally {
        setLoading(false)
      }
    }

    fetchEmails()
  }, [token, searchQuery, currentPage, onError])

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-3" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (emails.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
        <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {searchQuery ? "No emails found" : "Your inbox is empty"}
        </h3>
        <p className="text-slate-600">
          {searchQuery ? "Try a different search term" : "Check back soon for new emails"}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {emails.map((email) => (
          <EmailCard key={email.id} email={email} />
        ))}
      </div>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalEmails}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}


