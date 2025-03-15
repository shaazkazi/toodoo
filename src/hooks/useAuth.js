import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export function useAuth(redirectTo = '/login') {
  const navigate = useNavigate();
  const { user, session, getSession } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      if (!user || !session) {
        const { success, session: newSession } = await getSession();
        if (!success || !newSession) {
          navigate(redirectTo);
        }
      }
    };

    checkAuth();
  }, [user, session, getSession, navigate, redirectTo]);

  return { user, session };
}

export function useRequireAuth(redirectTo = '/login') {
  const navigate = useNavigate();
  const { user, session, getSession, loading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      if (!user || !session) {
        const { success, session: newSession } = await getSession();
        if (!success || !newSession) {
          navigate(redirectTo);
        }
      }
    };

    checkAuth();
  }, [user, session, getSession, navigate, redirectTo]);

  return { user, session, loading };
}

export function useRedirectIfAuthenticated(redirectTo = '/dashboard') {
  const navigate = useNavigate();
  const { user, session, getSession } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      if (!user || !session) {
        const { success, session: newSession } = await getSession();
        if (success && newSession) {
          navigate(redirectTo);
        }
      } else {
        navigate(redirectTo);
      }
    };

    checkAuth();
  }, [user, session, getSession, navigate, redirectTo]);

  return { user, session };
}
