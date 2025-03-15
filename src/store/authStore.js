import { create } from 'zustand';
import supabase from '../lib/supabase';

const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  initialized: false,
  
  initialize: async () => {
    set({ loading: true });
    
    try {
      // Check if there's an active session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: { user } } = await supabase.auth.getUser();
        set({ user });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      set({ loading: false, initialized: true });
    }
  },
  
  signUp: async (email, password, displayName) => {
    set({ loading: true });
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });
      
      if (error) throw error;
      
      // Update user metadata with display name
      if (data.user) {
        await supabase.auth.updateUser({
          data: { display_name: displayName },
        });
        
        set({ user: data.user });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error signing up:', error);
      return { success: false, error: error.message };
    } finally {
      set({ loading: false });
    }
  },
  
  signIn: async (email, password) => {
    set({ loading: true });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      set({ user: data.user });
      return { success: true };
    } catch (error) {
      console.error('Error signing in:', error);
      return { success: false, error: error.message };
    } finally {
      set({ loading: false });
    }
  },
  
  signOut: async () => {
    set({ loading: true });
    
    try {
      await supabase.auth.signOut();
      set({ user: null });
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      set({ loading: false });
    }
  },
  
  resetPassword: async (email) => {
    set({ loading: true });
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { success: false, error: error.message };
    } finally {
      set({ loading: false });
    }
  },
  
  updateProfile: async ({ displayName }) => {
    set({ loading: true });
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { display_name: displayName },
      });
      
      if (error) throw error;
      
      set({ user: data.user });
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    } finally {
      set({ loading: false });
    }
  },
  
  updateEmail: async (email, password) => {
    set({ loading: true });
    
    try {
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: get().user.email,
        password,
      });
      
      if (signInError) throw signInError;
      
      // Then update the email
      const { data, error } = await supabase.auth.updateUser({ email });
      
      if (error) throw error;
      
      set({ user: data.user });
      return { success: true };
    } catch (error) {
      console.error('Error updating email:', error);
      return { success: false, error: error.message };
    } finally {
      set({ loading: false });
    }
  },
  
  updatePassword: async (newPassword, currentPassword) => {
    set({ loading: true });
    
    try {
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: get().user.email,
        password: currentPassword,
      });
      
      if (signInError) throw signInError;
      
      // Then update the password
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error updating password:', error);
      return { success: false, error: error.message };
    } finally {
      set({ loading: false });
    }
  },
}));

// Initialize auth state when the store is first used
if (typeof window !== 'undefined') {
  useAuthStore.getState().initialize();
  
  // Set up auth state change listener
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      useAuthStore.setState({ user: session.user });
    } else if (event === 'SIGNED_OUT') {
      useAuthStore.setState({ user: null });
    }
  });
}

export default useAuthStore;
