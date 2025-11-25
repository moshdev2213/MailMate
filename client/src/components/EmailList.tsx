import { useAppSelector } from '../store/hooks';
import type { Email } from '../types/email.types';

interface EmailListProps {
  emails: Email[];
  onEmailClick?: (email: Email) => void;
}

export const EmailList = ({ emails, onEmailClick }: EmailListProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatFrom = (from: string | null) => {
    if (!from) return 'Unknown sender';
    // Extract name from "Name <email@example.com>" or just return email
    const match = from.match(/^(.+?)\s*<(.+)>$/);
    return match ? match[1].trim() : from;
  };

  if (emails.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No emails found</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {emails.map((email) => (
        <div
          key={email.gmailUid}
          onClick={() => onEmailClick?.(email)}
          className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors ${
            onEmailClick ? 'cursor-pointer' : ''
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-gray-900 truncate">
                  {formatFrom(email.from)}
                </p>
              </div>
              <p className="text-gray-900 font-medium truncate mb-1">
                {email.subject || '(No subject)'}
              </p>
              {email.messageId && (
                <p className="text-xs text-gray-500 truncate">
                  {email.messageId}
                </p>
              )}
            </div>
            <div className="flex-shrink-0">
              <p className="text-sm text-gray-500 whitespace-nowrap">
                {formatDate(email.date)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

