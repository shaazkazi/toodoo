import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  const { signIn, loading } = useAuthStore();
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const { success, error } = await signIn(email, password);
    
    if (!success) {
      toast.error(error || 'Failed to sign in. Please check your credentials.');
    }
  };
  
  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700 transition-colors">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Sign In</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors(prev => ({ ...prev, email: null }));
            }}
            placeholder="Enter your email"
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
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors(prev => ({ ...prev, password: null }));
            }}
            placeholder="Enter your password"
            error={errors.password}
            required
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            labelClassName="text-gray-700 dark:text-gray-300"
          />
          
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
              Forgot password?
            </Link>
          </div>
          
          <Button
            type="submit"
            className="w-full mt-6"
            isLoading={loading}
            disabled={loading}
          >
            Sign In
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          By signing in, you agree to our{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
