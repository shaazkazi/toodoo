import React, { useState, useEffect, useCallback } from 'react';
import TodoFilter from '../components/todo/TodoFilter';
import TodoList from '../components/todo/TodoList';
import TodoForm from '../components/todo/TodoForm';
import useTodoStore from '../store/todoStore';
import useCategoryStore from '../store/categoryStore';
import toast from '../utils/toast';

const Dashboard = () => {
  const { todos = [], fetchTodos, loading: todoLoading } = useTodoStore();
  const { categories = [], fetchCategories, loading: categoryLoading } = useCategoryStore();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use useCallback to prevent the function from being recreated on each render
  const loadData = useCallback(async () => {
    if (isInitialized) return; // Prevent multiple fetches
    
    try {
      setIsInitialized(true);
      
      if (fetchTodos) {
        await fetchTodos();
      }
      
      if (fetchCategories) {
        await fetchCategories();
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load data. Please refresh the page.');
      toast.error('Failed to load data. Please refresh the page.');
    }
  }, [fetchTodos, fetchCategories, isInitialized]);
  
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // Handle category change
  const handleCategoryChange = (value) => {
    console.log('Changing category to:', value);
    setSelectedCategory(value);
  };
  
  // Handle status change
  const handleStatusChange = (value) => {
    console.log('Changing status to:', value);
    setStatusFilter(value);
  };
  
  // Handle sort change
  const handleSortChange = (value) => {
    console.log('Changing sort to:', value);
    setSortBy(value);
  };
  
  // Filter todos
  const filteredTodos = React.useMemo(() => {
    console.log('Filtering todos with category:', selectedCategory);
    console.log('Filtering todos with status:', statusFilter);
    
    if (!Array.isArray(todos)) return [];
    
    return todos.filter(todo => {
      // Category filter
      const categoryMatch = selectedCategory === 'all' || 
                           String(todo.category_id) === String(selectedCategory);
      
      // Status filter
      const statusMatch = 
        statusFilter === 'all' || 
        (statusFilter === 'active' && !todo.is_completed) ||
        (statusFilter === 'completed' && todo.is_completed);
      
      console.log(`Todo ${todo.id}: Category Match: ${categoryMatch}, Status Match: ${statusMatch}`);
      
      return categoryMatch && statusMatch;
    });
  }, [todos, selectedCategory, statusFilter]);
  
  // Sort todos
  const sortedTodos = React.useMemo(() => {
    console.log('Sorting todos by:', sortBy);
    console.log('Filtered todos count:', filteredTodos.length);
    
    return [...filteredTodos].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          // Handle null due dates
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date) - new Date(b.due_date);
        
        case 'priority':
          const priorityValues = { high: 3, medium: 2, low: 1 };
          return priorityValues[b.priority || 'medium'] - priorityValues[a.priority || 'medium'];
        
        case 'createdAt':
          return new Date(b.created_at) - new Date(a.created_at);
        
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        
        default:
          return 0;
      }
    });
  }, [filteredTodos, sortBy]);
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Dashboard</h1>
      
      <TodoFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />
      
      <TodoForm categories={categories} />
      
      <TodoList 
        todos={sortedTodos} 
        loading={todoLoading && !todos.length}
        error={error}
      />
    </div>
  );
};

export default Dashboard;
