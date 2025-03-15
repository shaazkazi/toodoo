import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  
  // Fetch all categories for the current user
  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        set({ loading: false, error: 'User not authenticated' });
        return { success: false, error: 'User not authenticated' };
      }
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name');
        
      if (error) {
        set({ loading: false, error: error.message });
        return { success: false, error: error.message };
      }
      
      set({ categories: data || [], loading: false, error: null });
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ loading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },
  
  // Add a new category
  addCategory: async (categoryData) => {
    try {
      set({ loading: true, error: null });
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        set({ loading: false, error: 'User not authenticated' });
        return { success: false, error: 'User not authenticated' };
      }
      
      // Ensure we have a name property
      if (!categoryData || !categoryData.name || !categoryData.name.trim()) {
        set({ loading: false, error: 'Category name is required' });
        return { success: false, error: 'Category name is required' };
      }
      
      const { data, error } = await supabase
        .from('categories')
        .insert([
          { 
            name: categoryData.name.trim(), 
            color: categoryData.color || '#3B82F6', 
            user_id: user.id 
          }
        ])
        .select();
        
      if (error) {
        set({ loading: false, error: error.message });
        return { success: false, error: error.message };
      }
      
      // Make sure data is an array and has at least one item
      if (!data || data.length === 0) {
        set({ loading: false, error: 'No data returned from insert operation' });
        return { success: false, error: 'No data returned from insert operation' };
      }
      
      const newCategory = data[0];
      
      set(state => ({ 
        categories: [...state.categories, newCategory],
        loading: false,
        error: null
      }));
      
      return { success: true, data: newCategory };
    } catch (error) {
      console.error('Error adding category:', error);
      set({ loading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },
  
  // Update an existing category
  updateCategory: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      
      if (!id) {
        set({ loading: false, error: 'Category ID is required' });
        return { success: false, error: 'Category ID is required' };
      }
      
      if (!updates || (updates.name && !updates.name.trim())) {
        set({ loading: false, error: 'Valid updates are required' });
        return { success: false, error: 'Valid updates are required' };
      }
      
      const { data, error } = await supabase
        .from('categories')
        .update(updates.name ? { ...updates, name: updates.name.trim() } : updates)
        .eq('id', id)
        .select();
        
      if (error) {
        set({ loading: false, error: error.message });
        return { success: false, error: error.message };
      }
      
      // Make sure data is an array and has at least one item
      if (!data || data.length === 0) {
        set({ loading: false, error: 'No data returned from update operation' });
        return { success: false, error: 'No data returned from update operation' };
      }
      
      const updatedCategory = data[0];
      
      set(state => ({
        categories: state.categories.map(category => 
          category.id === id ? updatedCategory : category
        ),
        loading: false,
        error: null
      }));
      
      return { success: true, data: updatedCategory };
    } catch (error) {
      console.error('Error updating category:', error);
      set({ loading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },
  
  // Delete a category
  deleteCategory: async (id) => {
    try {
      set({ loading: true, error: null });
      
      if (!id) {
        set({ loading: false, error: 'Category ID is required' });
        return { success: false, error: 'Category ID is required' };
      }
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
        
      if (error) {
        set({ loading: false, error: error.message });
        return { success: false, error: error.message };
      }
      
      set(state => ({
        categories: state.categories.filter(category => category.id !== id),
        loading: false,
        error: null
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting category:', error);
      set({ loading: false, error: error.message });
      return { success: false, error: error.message };
    }
  },
  
  // Get a category by ID
  getCategoryById: (id) => {
    return get().categories.find(category => category.id === id) || null;
  },
  
  // Clear all categories (useful for logout)
  clearCategories: () => {
    set({ categories: [], loading: false, error: null });
  }
}));

export default useCategoryStore;
