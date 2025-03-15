import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import Header from './Header';
import useAuthStore from '../../store/authStore';
import Loader from '../ui/Loader';

const DashboardLayout = () => {
  const { user, loading, initialized } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (initialized && !loading && !user) {
      navigate('/login');
    }
  }, [user, loading, initialized, navigate]);
  
  if (loading || !initialized) {
    return <Loader fullScreen />;
  }
  
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col w-full md:ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--color-toast-bg, #ffffff)',
            color: 'var(--color-toast-text, #111827)',
          },
        }}
      />
    </div>
  );
};

export default DashboardLayout;
