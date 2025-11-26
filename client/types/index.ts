// Shared types across the application

export interface User {
  id: string
  email: string
  name: string
}

export interface Email {
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

export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: {
    message: string
    code: string
  } | null
  timestamp: string
}

export interface PaginationData {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export interface EmailListResponse {
  emails: Email[]
  pagination: PaginationData
}


