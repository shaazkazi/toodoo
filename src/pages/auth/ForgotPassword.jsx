import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import useAuthStore from '../../store/authStore';
import Button from '../../components/ui/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { resetPassword, loading } = useAuthStore();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    
    const { success, error } = await resetPassword(email);
    
    if (success) {
      setIsSubmitted(true);
    } else {
      toast.error(error || 'Failed to send password reset email');
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="card max-w-md w-full mx-auto">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
            <EnvelopeIcon className="h-6 w-6 text-green-600 dark:text-green-400" aria-hidden="true" />
          </div>
          <h2 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">Check your email</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            We've sent a password reset link to <span className="font-medium text-gray-900 dark:text-white">{email}</span>.
            Please check your inbox and follow the instructions to reset your password.
          </p>
          <div className="mt-6">
            <Link
              to="/login"
              className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Return to login
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card max-w-md w-full mx-auto">
      <div className="mb-6">
        <Link to="/login" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Reset your password</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-input dark:border-dark-border dark:text-white sm:text-sm"
              placeholder="Enter your email address"
            />
          </div>
        </div>
        
        <div>
          <Button
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
