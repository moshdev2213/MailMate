import { useEffect, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logoutUser, getCurrentUser } from '../store/slices/authSlice';
import { fetchEmails, refreshEmails, setSearchQuery } from '../store/slices/emailSlice';
import { useNavigate } from 'react-router-dom';
import { EmailList } from '../components/EmailList';
import { EmailSearch } from '../components/EmailSearch';
import { Pagination } from '../components/Pagination';
import type { Email } from '../types/email.types';

export const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const { emails, pagination, isLoading, isRefreshing, error, searchQuery } = useAppSelector(
    (state) => state.email
  );

  useEffect(() => {
    // Fetch current user if not already loaded
    if (!user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    // Fetch emails on component mount
    dispatch(fetchEmails({ limit: 20, offset: 0 }));
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const handleRefresh = async () => {
    await dispatch(refreshEmails(50));
  };

  const handleNextPage = () => {
    if (pagination && pagination.hasMore) {
      const newOffset = pagination.offset + pagination.limit;
      dispatch(fetchEmails({ limit: pagination.limit, offset: newOffset }));
    }
  };

  const handlePreviousPage = () => {
    if (pagination && pagination.offset > 0) {
      const newOffset = Math.max(0, pagination.offset - pagination.limit);
      dispatch(fetchEmails({ limit: pagination.limit, offset: newOffset }));
    }
  };

  const handlePageChange = (page: number) => {
    if (pagination) {
      const newOffset = (page - 1) * pagination.limit;
      dispatch(fetchEmails({ limit: pagination.limit, offset: newOffset }));
    }
  };

  // Filter emails based on search query
  const filteredEmails = useMemo(() => {
    if (!searchQuery.trim()) return emails;

    const query = searchQuery.toLowerCase();
    return emails.filter(
      (email) =>
        email.subject?.toLowerCase().includes(query) ||
        email.from?.toLowerCase().includes(query) ||
        email.messageId?.toLowerCase().includes(query)
    );
  }, [emails, searchQuery]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">MailMate</h1>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header with search and refresh */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Your Emails</h2>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isRefreshing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Refresh</span>
                  </>
                )}
              </button>
            </div>
            <EmailSearch />
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Email list */}
          <div className="divide-y divide-gray-200">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <EmailList emails={filteredEmails} />
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.total > 0 && (
            <Pagination
              onNext={handleNextPage}
              onPrevious={handlePreviousPage}
              onPageChange={handlePageChange}
            />
          )}

          {/* Stats */}
          {pagination && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {searchQuery
                  ? `Showing ${filteredEmails.length} of ${emails.length} emails matching "${searchQuery}"`
                  : `Total: ${pagination.total} emails`}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
