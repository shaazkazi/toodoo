import toast from 'react-hot-toast';
import useThemeStore from '../store/themeStore';

// Get the current theme from the store
const getTheme = () => {
  return useThemeStore.getState().theme;
};

// Custom toast functions that respect the theme
const customToast = {
  success: (message) => {
    const theme = getTheme();
    return toast.success(message, {
      style: {
        background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
        color: theme === 'dark' ? '#F9FAFB' : '#111827',
        border: theme === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB',
      },
      iconTheme: {
        primary: theme === 'dark' ? '#10B981' : '#059669',
        secondary: theme === 'dark' ? '#1F2937' : 'white',
      },
    });
  },
  
  error: (message) => {
    const theme = getTheme();
    return toast.error(message, {
      style: {
        background: theme === 'dark' ? '#1F2937' : '#FFFFFF',
        color: theme === 'dark' ? '#F9FAFB' : '#111827',
        border: theme === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB',
      },
      iconTheme: {
        primary: theme === 'dark' ? '#EF4444' : '#DC2626',
        secondary: theme === 'dark' ? '#1F2937' : 'white',
      },
    });
  },
  
  // You can add more toast types as needed (info, warning, etc.)
};

export default customToast;
