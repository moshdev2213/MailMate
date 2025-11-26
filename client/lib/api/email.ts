// Email API calls

import { fetchWithAuth } from "./fetchWithAuth"
import { getTokenFromCookie } from "./token"
import type { Email, ApiResponse, PaginationData } from "@/types"

export interface GetEmailsParams {
  token?: string
  offset: number
  limit: number
  search?: string
  refresh?: boolean
  fetchLimit?: number
}

export interface GetEmailsResponse {
  emails: Email[]
  pagination: PaginationData
}

export async function getEmails({
  token,
  offset,
  limit,
  search,
  refresh,
  fetchLimit,
}: GetEmailsParams): Promise<GetEmailsResponse> {
  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(refresh !== undefined && { refresh: refresh.toString() }),
    ...(fetchLimit !== undefined && { fetchLimit: fetchLimit.toString() }),
  })

  const response = await fetchWithAuth(`/api/email?${params.toString()}`, {
    token,
    method: "GET",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch emails")
  }

  const data: ApiResponse<{
    emails: any[]
    pagination: PaginationData
  }> = await response.json()

  if (!data.success || !data.data) {
    throw new Error("Invalid response format")
  }

  // Map backend email structure to frontend structure
  const mappedEmails: Email[] = (data.data.emails || []).map((email: any) => ({
    id: email.id?.toString() || email.gmailUid || "",
    messageId: email.messageId || "",
    subject: email.subject || "(No subject)",
    from: email.from || "Unknown sender",
    to: "", // Backend doesn't provide 'to' field yet
    date: email.date ? new Date(email.date).toISOString() : new Date().toISOString(),
    preview: email.subject || "", // Using subject as preview for now
    hasAttachments: false, // Backend doesn't provide this yet
    isRead: false, // Backend doesn't provide this yet
  }))

  return {
    emails: mappedEmails,
    pagination: data.data.pagination || {
      total: 0,
      limit,
      offset,
      hasMore: false,
    },
  }
}


