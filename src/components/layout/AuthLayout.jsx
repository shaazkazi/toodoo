import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
import Loader from '../ui/Loader';
import ThemeToggle from '../ui/ThemeToggle';

const AuthLayout = () => {
  const { user, loading, initialized } = useAuthStore();
  const { theme } = useThemeStore();
 
  if (loading || !initialized) {
    return <Loader fullScreen />;
  }
 
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
 
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
     
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400">Toodoo</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Your simple and effective task manager</p>
        </div>
       
        <Outlet />
      </div>
     
      <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Toodoo. All rights reserved.
      </footer>
     
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
            color: theme === 'dark' ? '#F9FAFB' : '#111827',
            border: theme === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB',
          },
          success: {
            iconTheme: {
              primary: theme === 'dark' ? '#10B981' : '#059669',
              secondary: theme === 'dark' ? '#1F2937' : 'white',
            },
          },
          error: {
            iconTheme: {
              primary: theme === 'dark' ? '#EF4444' : '#DC2626',
              secondary: theme === 'dark' ? '#1F2937' : 'white',
            },
          },
        }}
      />
    </div>
  );
};

export default AuthLayout;
