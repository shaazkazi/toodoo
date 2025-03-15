import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon, HomeIcon } from '@heroicons/react/24/outline';
import useAuthStore from '../store/authStore';

const NotFound = () => {
  const { user } = useAuthStore();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-dark-bg">
      <div className="text-center">
        <ExclamationTriangleIcon className="h-16 w-16 mx-auto text-yellow-500" />
        
        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Page Not Found</h1>
        
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Sorry, we couldn't find the page you're looking for.
        </p>
        
        <div className="mt-6">
          <Link
            to={user ? "/dashboard" : "/login"}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-bg"
          >
            <HomeIcon className="mr-2 h-5 w-5" aria-hidden="true" />
            {user ? "Back to Dashboard" : "Go to Login"}
          </Link>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
      
      <footer className="mt-auto py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Toodoo. All rights reserved.
      </footer>
    </div>
  );
};

export default NotFound;
