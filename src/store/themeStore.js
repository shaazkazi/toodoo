import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light', // 'light' or 'dark'
      
      // Initialize theme based on system preference or saved preference
      initialize: () => {
        const savedTheme = localStorage.getItem('theme-storage') 
          ? JSON.parse(localStorage.getItem('theme-storage')).state.theme
          : null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set theme based on saved preference or system preference
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        set({ theme: initialTheme });
        
        // Apply theme to document
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
      },
      
      // Toggle between light and dark themes
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'dark' ? 'light' : 'dark';
          
          // Apply theme to document
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
          
          return { theme: newTheme };
        });
      },
      
      // Set a specific theme
      setTheme: (newTheme) => {
        set({ theme: newTheme });
        
        // Apply theme to document
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      }
    }),
    {
      name: 'theme-storage',
    }
  )
);

export default useThemeStore;
