import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from '../utils/toast';

const useTodoStore = create((set, get) => ({
  todos: [],
  categories: [],
  loading: false,
  error: null,
  currentFilter: 'all', // 'all', 'active', 'completed'
  searchQuery: '',
 
  // Fetch todos from Supabase
  fetchTodos: async (userId) => {
    try {
      set({ loading: true, error: null });
     
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId || (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false });
       
      if (error) throw error;
     
      set({ todos: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching todos:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to load todos');
    }
  },
 
  // Fetch categories from Supabase
  fetchCategories: async (userId) => {
    try {
      set({ loading: true, error: null });
     
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId || (await supabase.auth.getUser()).data.user?.id)
        .order('name');
       
      if (error) throw error;
     
      set({ categories: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to load categories');
    }
  },
 
  // Add a new todo
  addTodo: async (todoData) => {
    try {
      console.log('Starting addTodo with data:', todoData);
      set({ loading: true, error: null });
     
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
     
      if (!user) {
        throw new Error('User not authenticated');
      }
     
      // Prepare the data with user_id
      const newTodo = {
        ...todoData,
        user_id: user.id,
        created_at: new Date().toISOString(),
        is_completed: false
      };
     
      console.log('Prepared todo data for insertion:', newTodo);
     
      const { data, error } = await supabase
        .from('todos')
        .insert([newTodo])
        .select('*')
        .single();
       
      console.log('Supabase response - data:', data, 'error:', error);
     
      if (error) throw error;
     
      console.log('Todo added successfully:', data);
     
      set(state => ({
        todos: [...state.todos, data],
        loading: false
      }));
     
      return { success: true, data };
    } catch (error) {
      console.error('Error adding todo:', error);
      set({ error: error.message, loading: false });
      return { success: false, error: error.message };
    }
  },
 
  // Update a todo
  updateTodo: async (id, updates) => {
    try {
      set({ loading: true, error: null });
     
      const { data, error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
       
      if (error) throw error;
     
      set(state => ({
        todos: state.todos.map(todo =>
          todo.id === id ? data : todo
        ),
        loading: false
      }));
     
      toast.success('Todo updated successfully');
      return { success: true, data };
    } catch (error) {
      console.error('Error updating todo:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to update todo');
      return { success: false, error: error.message };
    }
  },
 
  // Delete a todo
  deleteTodo: async (id) => {
    try {
      set({ loading: true, error: null });
     
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);
       
      if (error) throw error;
     
      set(state => ({
        todos: state.todos.filter(todo => todo.id !== id),
        loading: false
      }));
     
      toast.success('Todo deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Error deleting todo:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to delete todo');
      return { success: false, error: error.message };
    }
  },
 
  // Toggle todo completion status
  toggleTodoCompletion: async (id) => {
    try {
      const todo = get().todos.find(t => t.id === id);
      if (!todo) return { success: false, error: 'Todo not found' };
     
      const updates = {
        is_completed: !todo.is_completed,
        completed_at: !todo.is_completed ? new Date().toISOString() : null
      };
     
      return await get().updateTodo(id, updates);
    } catch (error) {
      console.error('Error toggling todo completion:', error);
      return { success: false, error: error.message };
    }
  },
 
  // Set current filter
  setFilter: (filter) => {
    set({ currentFilter: filter });
  },
 
  // Set search query
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
 
  // Get filtered todos based on current filter and search query
  getFilteredTodos: () => {
    const { todos, currentFilter, searchQuery } = get();
   
    if (!Array.isArray(todos)) return [];
   
    return todos.filter(todo => {
      // Filter by completion status
      const statusMatch =
        currentFilter === 'all' ||
        (currentFilter === 'active' && !todo.is_completed) ||
        (currentFilter === 'completed' && todo.is_completed);
     
      // Filter by search query
      const searchMatch = !searchQuery ||
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()));
     
      return statusMatch && searchMatch;
    });
  },
 
  // Clear all todos (useful for logout)
  clearTodos: () => {
    set({ todos: [], categories: [], loading: false, error: null });
  }
}));

export default useTodoStore;
