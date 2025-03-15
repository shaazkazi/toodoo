import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useAuthStore from '../../store/authStore';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  const { signIn, signInWithGoogle, loading } = useAuthStore();
  const navigate = useNavigate();
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const { success, error } = await signIn(email, password);
    
    if (success) {
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } else {
      toast.error(error || 'Failed to login. Please check your credentials.');
    }
  };
  
  const handleGoogleSignIn = async () => {
    const { success, error } = await signInWithGoogle();
    
    if (!success) {
      toast.error(error || 'Failed to login with Google.');
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700 transition-colors">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Welcome back to Toodoo
        </h2>
        
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
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            labelClassName="text-gray-700 dark:text-gray-300"
          />
          
          <Input
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.password}
            required
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            labelClassName="text-gray-700 dark:text-gray-300"
          />
          
          <div className="flex justify-end mb-4">
            <Link
              to="/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          
          <Button
            type="submit"
            className="w-full mb-4"
            isLoading={loading}
            disabled={loading}
          >
            Sign In
          </Button>
          
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>
            <div className="px-3 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">or</div>
            <div className="border-t border-gray-300 dark:border-gray-600 w-full"></div>
          </div>
          
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            Sign in with Google
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginForm;
