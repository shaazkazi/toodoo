import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  CalendarIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  XMarkIcon,
  Bars3Icon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../../store/authStore';
import useSidebarStore from '../../store/sidebarStore';

const Sidebar = () => {
  const { user, signOut } = useAuthStore();
  const { isOpen, toggle, close } = useSidebarStore();
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    { name: 'Statistics', href: '/statistics', icon: ChartBarIcon },
    { name: 'Profile', href: '/profile', icon: UserCircleIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];
  
  const sidebarVariants = {
    open: { 
      x: 0,
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: { 
      x: '-100%',
      transition: { 
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };
  
  const overlayVariants = {
    open: { opacity: 1, display: 'block' },
    closed: { 
      opacity: 0, 
      transitionEnd: { 
        display: 'none' 
      }
    }
  };
  
  // Get user initial for avatar
  const getUserInitial = () => {
    if (!user) return 'U';
    
    // Try to get initial from name if available
    if (user.name) return user.name.charAt(0).toUpperCase();
    if (user.displayName) return user.displayName.charAt(0).toUpperCase();
    
    // Try to get initial from email if available
    if (user.email) {
      // Get first character of email, but skip if it's not a letter
      const initial = user.email.charAt(0);
      if (/[a-zA-Z]/.test(initial)) {
        return initial.toUpperCase();
      }
    }
    
    // Fallback to 'U' for User
    return 'U';
  };
  
  return (
    <>

{/* Mobile menu button */}
<button
  className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
  onClick={toggle}
>
  <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
</button>

      
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={overlayVariants}
        onClick={close}
      />
      
      {/* Sidebar - Fixed for desktop, animated for mobile */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-50 w-64">
        <div className="h-full bg-white dark:bg-gray-800 shadow-lg flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">Toodoo</span>
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive
                          ? 'text-primary-500 dark:text-primary-400'
                          : 'text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold">
                {getUserInitial()}
              </div>
              <div className="ml-3 truncate">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                  {user?.displayName || user?.email || 'User'}
                </p>
              </div>
            </div>
            
            <button
              onClick={signOut}
              className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-3 h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar - Animated */}
      <motion.aside
        className="md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col"
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <Link to="/dashboard" className="flex items-center">
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">Toodoo</span>
          </Link>
          <button
            className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={close}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => close()}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive
                        ? 'text-primary-500 dark:text-primary-400'
                        : 'text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold">
              {getUserInitial()}
            </div>
            <div className="ml-3 truncate">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                {user?.displayName || user?.email || 'User'}
              </p>
            </div>
          </div>
          
          <button
            onClick={signOut}
            className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-3 h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
            Sign Out
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
