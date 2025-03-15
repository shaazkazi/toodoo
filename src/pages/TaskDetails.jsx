import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  ArrowLeftIcon, 
  CalendarIcon, 
  TagIcon, 
  CheckCircleIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import useTodoStore from '../store/todoStore';
import useCategoryStore from '../store/categoryStore';
import SubtaskList from '../components/todo/SubtaskList';
import TodoEditForm from '../components/todo/TodoEditForm';
import toast from '../utils/toast';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Get todo store functions
  const { 
    todos, 
    fetchTodos, 
    updateTodo, 
    deleteTodo, 
    toggleTodoCompletion, 
    loading 
  } = useTodoStore();
  
  // Get categories
  const { categories, fetchCategories } = useCategoryStore();
  
  // Fetch data if needed
  useEffect(() => {
    if (!todos.length) fetchTodos();
    if (!categories.length) fetchCategories();
  }, [todos.length, categories.length, fetchTodos, fetchCategories]);
  
  // Find the todo by ID
  const todo = todos.find(t => t.id === parseInt(id) || t.id === id);
  
  // Handle loading state
  if (loading || !todo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }
  
  // Format the due date if it exists
  const formattedDueDate = todo.due_date 
    ? format(new Date(todo.due_date), 'MMMM d, yyyy')
    : null;
  
  // Find the category
  const category = categories.find(cat => cat.id === todo.category_id);
  
  // Handle delete
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await deleteTodo(todo.id);
      if (result.success) {
        toast.success('Task deleted successfully');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Failed to delete task');
      }
    }
  };
  
  // Handle toggle completion
  const handleToggleCompletion = async () => {
    const result = await toggleTodoCompletion(todo.id);
    if (!result.success) {
      toast.error(result.error || 'Failed to update task status');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 dark:text-gray-300 mb-6 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back
      </button>
      
      {isEditing ? (
        <TodoEditForm 
          todo={todo} 
          categories={categories} 
          onCancel={() => setIsEditing(false)} 
          onSave={() => setIsEditing(false)}
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{todo.title}</h1>
              
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {category && (
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: category.color + '20', // Add transparency
                      color: category.color 
                    }}
                  >
                    {category.name}
                  </span>
                )}
                
                {todo.priority && (
                  <span className={`flex items-center text-sm ${
                    todo.priority === 'high' ? 'text-red-500' : 
                    todo.priority === 'medium' ? 'text-yellow-500' : 
                    'text-green-500'
                  }`}>
                    <TagIcon className="h-4 w-4 mr-1" />
                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
                  </span>
                )}
                
                {formattedDueDate && (
                  <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Due {formattedDueDate}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleToggleCompletion}
                className={`p-2 rounded-full ${
                  todo.is_completed 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
                aria-label={todo.is_completed ? "Mark as incomplete" : "Mark as complete"}
              >
                <CheckCircleIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
                aria-label="Edit task"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              
              <button
                onClick={handleDelete}
                className="p-2 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                aria-label="Delete task"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {todo.description && (
            <div className="mt-4 mb-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{todo.description}</p>
            </div>
          )}
          
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Subtasks</h2>
            <SubtaskList todoId={todo.id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
