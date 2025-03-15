import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import useAuthStore from '../store/authStore';

const Settings = () => {
  const { user, updateProfile, updateEmail, updatePassword, loading } = useAuthStore();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState({});
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    const { success, error } = await updateProfile({ displayName });
    
    if (success) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error(error || 'Failed to update profile. Please try again.');
    }
  };
  
  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Email is invalid' }));
      return;
    }
    
    const { success, error } = await updateEmail(email, currentPassword);
    
    if (success) {
      toast.success('Email updated successfully!');
      setCurrentPassword('');
    } else {
      toast.error(error || 'Failed to update email. Please try again.');
    }
  };
  
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!newPassword) newErrors.newPassword = 'New password is required';
    else if (newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }
    
    const { success, error } = await updatePassword(newPassword, currentPassword);
    
    if (success) {
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast.error(error || 'Failed to update password. Please try again.');
    }
  };
  
  return (
    <div className="container mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Settings</h1>
      
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Profile Settings</h2>
          
          <form onSubmit={handleProfileUpdate}>
            <Input
              label="Display Name"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
            />
            
            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={loading}
                disabled={loading || !displayName.trim()}
              >
                Update Profile
              </Button>
            </div>
          </form>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Email Settings</h2>
          
          <form onSubmit={handleEmailUpdate}>
            <Input
              label="Email Address"
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors(prev => ({ ...prev, email: null }));
              }}
              placeholder="Enter your email address"
              error={errors.email}
              required
            />
            
            <Input
              label="Current Password"
              id="currentPasswordForEmail"
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setErrors(prev => ({ ...prev, currentPassword: null }));
              }}
              placeholder="Enter your current password"
              error={errors.currentPassword}
              required
            />
            
            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={loading}
                disabled={loading || !email.trim() || !currentPassword.trim()}
              >
                Update Email
              </Button>
            </div>
          </form>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Password Settings</h2>
          
          <form onSubmit={handlePasswordUpdate}>
            <Input
              label="Current Password"
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setErrors(prev => ({ ...prev, currentPassword: null }));
              }}
              placeholder="Enter your current password"
              error={errors.currentPassword}
              required
            />
            
            <Input
              label="New Password"
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrors(prev => ({ ...prev, newPassword: null }));
              }}
              placeholder="Enter your new password"
              error={errors.newPassword}
              required
            />
            
            <Input
              label="Confirm New Password"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors(prev => ({ ...prev, confirmPassword: null }));
              }}
              placeholder="Confirm your new password"
              error={errors.confirmPassword}
              required
            />
            
            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={loading}
                disabled={loading || !currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()}
              >
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
