import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  TrashIcon,
  PencilIcon,
  ClockIcon,
  TagIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import useTodoStore from '../../store/todoStore';
import SubtaskItem from './SubtaskItem';
import TodoForm from './TodoForm';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Loader from '../ui/Loader';

const TodoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [todo, setTodo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [addingSubtask, setAddingSubtask] = useState(false);
  
  const { 
    todos, 
    fetchTodos, 
    toggleTodoComplete, 
    deleteTodo, 
    addSubtask, 
    loading 
  } = useTodoStore();
  
  useEffect(() => {
    if (todos.length === 0) {
      fetchTodos();
    } else {
      const foundTodo = todos.find(t => t.id === parseInt(id) || t.id === id);
      setTodo(foundTodo);
      
      if (!foundTodo) {
        // Todo not found, redirect to dashboard
        toast.error('Task not found');
        navigate('/dashboard');
      }
    }
  }, [id, todos, fetchTodos, navigate]);
  
  const handleToggleComplete = async () => {
    if (!todo) return;
    
    const { success, error } = await toggleTodoComplete(todo.id, todo.is_completed);
    
    if (!success) {
      toast.error(error || 'Failed to update task status');
    }
  };
  
  const handleDelete = async () => {
    if (!todo) return;
    
    const { success, error } = await deleteTodo(todo.id);
    
    if (success) {
      toast.success('Task deleted successfully');
      navigate('/dashboard');
    } else {
      toast.error(error || 'Failed to delete task');
      setIsDeleting(false);
    }
  };
  
  const handleAddSubtask = async (e) => {
    e.preventDefault();
    
    if (!newSubtask.trim()) {
      toast.error('Subtask cannot be empty');
      return;
    }
    
    const { success, error } = await addSubtask(todo.id, newSubtask.trim());
    
    if (success) {
      setNewSubtask('');
      setAddingSubtask(false);
    } else {
      toast.error(error || 'Failed to add subtask');
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  };
  
  if (!todo) {
    return <Loader />;
  }
  
  const completedSubtasks = todo.subtasks?.filter(s => s.is_completed).length || 0;
  const totalSubtasks = todo.subtasks?.length || 0;
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-card"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
        
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Task Details</h1>
        
        <div className="ml-auto flex space-x-2">
          <Button
            onClick={() => setIsEditing(true)}
            variant="secondary"
            icon={<PencilIcon className="h-5 w-5" />}
          >
            Edit
          </Button>
          
          <Button
            onClick={() => setIsDeleting(true)}
            variant="danger"
            icon={<TrashIcon className="h-5 w-5" />}
          >
            Delete
          </Button>
        </div>
      </div>
      
      <div className="card">
        <div className="flex items-start space-x-4 mb-6">
          <button
            onClick={handleToggleComplete}
            disabled={loading}
            className={`flex-shrink-0 h-6 w-6 mt-1 rounded-full ${
              todo.is_completed
                ? 'text-green-500 hover:text-green-600'
                : 'text-gray-400 hover:text-gray-500'
            }`}
          >
            {todo.is_completed ? (
              <CheckCircleSolidIcon className="h-6 w-6" />
            ) : (
              <CheckCircleIcon className="h-6 w-6" />
            )}
          </button>
          
          <div className="flex-1">
            <h2 className={`text-xl font-semibold ${
              todo.is_completed
                ? 'text-gray-500 dark:text-gray-400 line-through'
                : 'text-gray-800 dark:text-white'
            }`}>
              {todo.title}
            </h2>
            
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <ClockIcon className="mr-1 h-4 w-4" />
                {formatDate(todo.due_date)}
              </div>
              
              {todo.category && (
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <TagIcon className="mr-1 h-4 w-4" />
                  {todo.category.name}
                </div>
              )}
              
              {totalSubtasks > 0 && (
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <span className="font-medium">{completedSubtasks}/{totalSubtasks}</span>
                  <span className="ml-1">subtasks completed</span>
                </div>
              )}
            </div>
            
            {todo.description && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-dark-input rounded-md">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {todo.description}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-dark-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Subtasks</h3>
            
            <Button
              onClick={() => setAddingSubtask(true)}
              size="sm"
              variant="secondary"
              icon={<PlusIcon className="h-4 w-4" />}
            >
              Add Subtask
            </Button>
          </div>
          
          {addingSubtask && (
            <form onSubmit={handleAddSubtask} className="mb-4">
              <div className="flex items-center">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Enter subtask..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-input dark:border-dark-border dark:text-white"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-r-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
                  disabled={loading}
                >
                  Add
                </button>
              </div>
            </form>
          )}
          
          <div className="space-y-1">
            {todo.subtasks && todo.subtasks.length > 0 ? (
              todo.subtasks.map(subtask => (
                <SubtaskItem
                  key={subtask.id}
                  subtask={subtask}
                  todoId={todo.id}
                />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm py-2">
                No subtasks yet. Add one to break down this task.
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Edit Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Task"
      >
        <TodoForm
          initialData={todo}
          onSuccess={() => setIsEditing(false)}
          onCancel={() => setIsEditing(false)}
        />
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="Delete Task"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsDeleting(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            
            <button
              onClick={handleDelete}
              className="btn-danger"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TodoDetails;
