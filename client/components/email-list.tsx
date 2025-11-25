"use client"

import { useEffect, useState } from "react"
import EmailCard from "@/components/email-card"
import PaginationControls from "@/components/pagination-controls"

interface Email {
  id: string
  messageId: string
  subject: string
  from: string
  to: string
  date: string
  preview: string
  hasAttachments: boolean
  isRead: boolean
}

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

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  const pageSize = 10

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true)
        // Convert page to offset (backend uses offset/limit, not page/limit)
        const offset = (currentPage - 1) * pageSize
        const params = new URLSearchParams({
          offset: offset.toString(),
          limit: pageSize.toString(),
          ...(searchQuery && { search: searchQuery }),
        })

        const response = await fetch(`${apiUrl}/api/email?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch emails")
        }

        const data = await response.json()
        
        // Backend returns { success: true, data: { emails: [...], pagination: {...} } }
        if (data.success && data.data) {
          const emails = data.data.emails || []
          const pagination = data.data.pagination || {}
          const total = pagination.total || 0
          
          // Map backend email structure to frontend structure
          const mappedEmails = emails.map((email: any) => ({
            id: email.id?.toString() || email.gmailUid || '',
            messageId: email.messageId || '',
            subject: email.subject || '(No subject)',
            from: email.from || 'Unknown sender',
            to: '', // Backend doesn't provide 'to' field, will need to fetch separately if needed
            date: email.date ? new Date(email.date).toISOString() : new Date().toISOString(),
            preview: email.subject || '', // Using subject as preview for now
            hasAttachments: false, // Backend doesn't provide this yet
            isRead: false, // Backend doesn't provide this yet
          }))
          
          setEmails(mappedEmails)
          // Calculate total pages from total count
          setTotalPages(Math.ceil(total / pageSize))
          setTotalEmails(total)
        } else {
          throw new Error("Invalid response format")
        }
      } catch (err) {
        onError(err instanceof Error ? err.message : "Failed to load emails")
        setEmails([])
      } finally {
        setLoading(false)
      }
    }

    fetchEmails()
  }, [token, searchQuery, currentPage, apiUrl, onError])

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
