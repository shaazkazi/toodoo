import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useAuthStore from '../../store/authStore';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { resetPassword, loading } = useAuthStore();
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const { success, error } = await resetPassword(email);
    
    if (success) {
      setSubmitted(true);
      toast.success('Password reset link sent to your email!');
    } else {
      toast.error(error || 'Failed to send reset link. Please try again.');
    }
  };
  
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="card">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h2 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              We've sent a password reset link to {email}
            </p>
            <div className="mt-6">
              <Button
                type="button"
                variant="secondary"
                className="mr-3"
                onClick={() => setSubmitted(false)}
              >
                Try another email
              </Button>
              <Link to="/login">
                <Button type="button">Back to login</Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md"
    >
      <div className="card">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-white">
          Reset your password
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>
        
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            error={errors.email}
            required
          />
          
          <Button
            type="submit"
            className="w-full mb-4"
            isLoading={loading}
            disabled={loading}
          >
            Send Reset Link
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordForm;
