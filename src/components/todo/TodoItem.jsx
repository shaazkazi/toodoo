import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import useCategoryStore from '../../store/categoryStore';
import useTodoStore from '../../store/todoStore';

const TodoItem = ({ todo }) => {
  const { toggleTodoCompletion } = useTodoStore();
  const { categories } = useCategoryStore();
  
  if (!todo) {
    return null; // Return early if todo is undefined
  }
  
  // Format the due date if it exists
  const formattedDueDate = todo.due_date 
    ? format(new Date(todo.due_date), 'MMM d, yyyy')
    : null;
  
  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };
  
  // Find the category safely - this is line 36 where the error occurs
  // Add null check to prevent "Cannot read properties of undefined (reading 'find')"
  const category = Array.isArray(categories) 
    ? categories.find(cat => cat.id === todo.category_id) 
    : null;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-all hover:shadow-md">
      <div className="flex items-start gap-3">
        <button
          onClick={() => toggleTodoCompletion(todo.id)}
          className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full border ${
            todo.is_completed 
              ? 'bg-primary-500 border-primary-500' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
          aria-label={todo.is_completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {todo.is_completed && (
            <CheckCircleIcon className="h-5 w-5 text-white" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <Link to={`/todo/${todo.id}`} className="block">
            <h3 className={`text-lg font-medium ${
              todo.is_completed 
                ? 'text-gray-500 dark:text-gray-400 line-through' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {todo.title}
            </h3>
            
            {todo.description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {todo.description}
              </p>
            )}
            
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              {category && (
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: category.color + '20', // Add transparency
                    color: category.color 
                  }}
                >
                  {category.name}
                </span>
              )}
              
              {todo.priority && (
                <span className={`flex items-center ${getPriorityColor(todo.priority)}`}>
                  <TagIcon className="h-3 w-3 mr-1" />
                  {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
                </span>
              )}
              
              {formattedDueDate && (
                <span className="flex items-center text-gray-500 dark:text-gray-400">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  Due {formattedDueDate}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
