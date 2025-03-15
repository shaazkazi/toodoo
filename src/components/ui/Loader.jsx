import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ size = 'md', className = '', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };
  
  const loader = (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`rounded-full border-t-2 border-b-2 border-primary-500 ${sizeClasses[size]}`}
      />
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 dark:bg-dark-bg dark:bg-opacity-75 z-50">
        {loader}
      </div>
    );
  }
  
  return loader;
};

export default Loader;
