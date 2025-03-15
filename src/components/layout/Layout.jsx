import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Sidebar from './Sidebar';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';
import Loader from '../ui/Loader';

const Layout = () => {
  const { user, loading, initialized } = useAuthStore();
  const { theme } = useThemeStore();
  
  useEffect(() => {
    // You can add any layout-specific effects here
    document.body.classList.add('app-layout');
    
    return () => {
      document.body.classList.remove('app-layout');
    };
  }, []);
  
  if (loading || !initialized) {
    return <Loader fullScreen />;
  }
  
  if (!user) {
    // This should be handled by protected routes, but as a fallback
    window.location.href = '/login';
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg">
      <Sidebar />
      
      <div className="md:pl-64 flex flex-col flex-1">
        <Header />
        
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
        
        <footer className="py-4 px-4 sm:px-6 md:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Toodoo. All rights reserved.
        </footer>
      </div>
      
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

export default Layout;
