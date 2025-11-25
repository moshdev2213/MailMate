export interface Email {
  id?: number;
  userId: number;
  gmailUid: string;
  from: string | null;
  subject: string | null;
  messageId: string | null;
  date: string | null;
}

export interface EmailPagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface EmailResponse {
  emails: Email[];
  pagination: EmailPagination;
}

export interface EmailState {
  emails: Email[];
  pagination: EmailPagination | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  searchQuery: string;
}

