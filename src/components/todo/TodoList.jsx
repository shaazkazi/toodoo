import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos = [], loading = false, error = null }) => {
  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }
  
  // Handle empty state
  if (!todos || todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p className="text-lg">No tasks found</p>
        <p className="text-sm mt-2">Add a new task to get started</p>
      </div>
    );
  }
  
  // Render todo list
  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Tasks</h2>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoList;
