"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import type { Email } from "@/types"

interface EmailCardProps {
  email: Email
}

export default function EmailCard({ email }: EmailCardProps) {
  const [expanded, setExpanded] = useState(false)

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return dateString
    }
  }

  const senderName = email.from.split("<")[0].trim() || email.from
  const senderEmail = email.from.match(/<(.+?)>/)?.[1] || email.from
  const senderInitial = senderName.charAt(0).toUpperCase()

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`bg-white border border-slate-200 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
        !email.isRead ? "bg-blue-50 border-blue-200" : ""
      }`}
    >
      <div className="flex gap-4">
        {/* Sender Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">
            {senderInitial}
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">{senderName}</h3>
              <p className="text-sm text-slate-600 truncate">{senderEmail}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {email.hasAttachments && (
                <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
              )}
              <span className="text-sm text-slate-500 whitespace-nowrap">{formatDate(email.date)}</span>
            </div>
          </div>

          <h4 className="font-medium text-slate-900 mb-2 truncate">{email.subject || "(No subject)"}</h4>

          <p className="text-sm text-slate-600 line-clamp-2 mb-3">{email.preview}</p>

          {expanded && (
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
              <div className="bg-slate-50 p-3 rounded text-sm text-slate-700 max-h-64 overflow-auto">
                {email.preview}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>To: {email.to}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs">
            {!email.isRead && (
              <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-700 font-medium">
                Unread
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setExpanded(!expanded)
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {expanded ? "Collapse" : "View"} →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

