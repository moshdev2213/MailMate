import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setAuth } from '../store/slices/authSlice';

export const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const error = searchParams.get('error');
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const name = searchParams.get('name');

    if (error) {
      // Redirect to login with error
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    if (accessToken && refreshToken && userId && email) {
      // Set auth state
      dispatch(
        setAuth({
          user: {
            id: userId,
            email,
            name: name || null,
          },
          accessToken,
          refreshToken,
        })
      );

      // Redirect to dashboard/home
      navigate('/dashboard', { replace: true });
    } else {
      // Missing required params, redirect to login
      navigate('/login?error=Authentication failed', { replace: true });
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

