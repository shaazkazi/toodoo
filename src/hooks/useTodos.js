import { useEffect } from 'react';
import useTodoStore from '../store/todoStore';
import useAuthStore from '../store/authStore';

export function useTodos() {
  const { 
    todos, 
    categories, 
    loading, 
    error, 
    fetchTodos, 
    fetchCategories,
    currentFilter,
    searchQuery,
    getFilteredTodos
  } = useTodoStore();
  
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchTodos(user.id);
      fetchCategories(user.id);
    }
  }, [user, fetchTodos, fetchCategories]);

  // Create a local filtered todos function if getFilteredTodos is not available
  const filteredTodos = typeof getFilteredTodos === 'function' 
    ? getFilteredTodos() 
    : filterTodosLocally(todos, currentFilter, searchQuery);

  return { 
    todos, 
    filteredTodos,
    categories, 
    loading, 
    error,
    currentFilter,
    searchQuery
  };
}

// Local filtering function as a fallback
function filterTodosLocally(todos, currentFilter, searchQuery) {
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
}
