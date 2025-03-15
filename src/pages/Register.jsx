import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import useAuthStore from '../store/authStore';

const Register = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  const { signUp, loading } = useAuthStore();
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!displayName.trim()) newErrors.displayName = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const { success, error } = await signUp(email, password, displayName);
    
    if (!success) {
      toast.error(error || 'Failed to create account. Please try again.');
    }
  };
  
  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700 transition-colors">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Create Account</h2>
        
        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            id="displayName"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              setErrors(prev => ({ ...prev, displayName: null }));
            }}
            placeholder="Enter your full name"
            error={errors.displayName}
            required
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            labelClassName="text-gray-700 dark:text-gray-300"
          />
          
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
            placeholder="Create a password"
            error={errors.password}
            required
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            labelClassName="text-gray-700 dark:text-gray-300"
          />
          
          <Input
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors(prev => ({ ...prev, confirmPassword: null }));
            }}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            required
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            labelClassName="text-gray-700 dark:text-gray-300"
          />
          
          <Button
                        type="submit"
                        className="w-full mt-6"
                        isLoading={loading}
                        disabled={loading}
                      >
                        Create Account
                      </Button>
                    </form>
                    
                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                          Sign in
                        </Link>
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      By creating an account, you agree to our{' '}
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
            
            export default Register;
            