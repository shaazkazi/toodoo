import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Input from '../ui/Input';
import Button from '../ui/Button';
import useAuthStore from '../../store/authStore';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  const { updatePassword, loading } = useAuthStore();
  const navigate = useNavigate();
  
  const validateForm = () => {
    const newErrors = {};
    
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
    
    const { success, error } = await updatePassword(password);
    
    if (success) {
      toast.success('Password updated successfully!');
      navigate('/login');
    } else {
      toast.error(error || 'Failed to update password. Please try again.');
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md"
    >
      <div className="card">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-white">
          Set new password
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Enter your new password below.
        </p>
        
        <form onSubmit={handleSubmit}>
          <Input
            label="New Password"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.password}
            required
          />
          
          <Input
            label="Confirm New Password"
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.confirmPassword}
            required
          />
          
          <Button
            type="submit"
            className="w-full"
            isLoading={loading}
            disabled={loading}
          >
            Reset Password
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default ResetPasswordForm;
