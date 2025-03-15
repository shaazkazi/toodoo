import React, { useState, useEffect } from 'react';
// Remove the duplicate toast imports and use only the custom toast
import toast from '../../utils/toast';
import {
  CalendarIcon,
  TagIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useTodoStore from '../../store/todoStore';
import useCategoryStore from '../../store/categoryStore';
import Button from '../ui/Button';
import Modal from '../ui/Modal'; // Import from the correct path

const TodoForm = ({ initialData = null, onSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const { addTodo, updateTodo, loading: todoLoading } = useTodoStore();
  const { categories, addCategory, loading: categoryLoading } = useCategoryStore();

  const loading = todoLoading || categoryLoading;

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setDueDate(initialData.due_date ? new Date(initialData.due_date) : null);
      setCategoryId(initialData.category_id || null);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
     
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
     
    const todoData = {
      title: title.trim(),
      description: description.trim() || null,
      due_date: dueDate,
      category_id: categoryId,
    };
     
    console.log('Submitting todo data:', todoData);
     
    let result;
     
    if (initialData) {
      // Update existing todo
      console.log('Updating existing todo with ID:', initialData.id);
      result = await updateTodo(initialData.id, todoData);
    } else {
      // Create new todo
      console.log('Creating new todo');
      result = await addTodo(todoData);
    }
     
    console.log('Result from todo operation:', result);
     
    if (result.success) {
      toast.success(initialData ? 'Task updated successfully' : 'Task created successfully');
       
      // Reset form
      if (!initialData) {
        setTitle('');
        setDescription('');
        setDueDate(null);
        setCategoryId(null);
      }
       
      if (onSuccess) {
        onSuccess(result.data);
      }
    } else {
      toast.error(result.error || 'An error occurred');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event propagation
   
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }
   
    const result = await addCategory({ name: newCategoryName.trim() });
   
    if (result.success) {
      toast.success('Category added successfully');
      setCategoryId(result.data.id);
      setNewCategoryName('');
      setShowCategoryModal(false);
    } else {
      toast.error(result.error || 'Failed to add category');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            required
          />
        </div>
       
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
          />
        </div>
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <DatePicker
                selected={dueDate}
                onChange={setDueDate}
                dateFormat="MMMM d, yyyy"
                minDate={new Date()}
                placeholderText="Select due date"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              />
              {dueDate && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setDueDate(null)}
                    className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
         
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <TagIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={categoryId || ''}
                onChange={(e) => setCategoryId(e.target.value === '' ? null : e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              >
                <option value="">No Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    e.stopPropagation(); // Stop event propagation
                    setShowCategoryModal(true);
                  }}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
       
        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="secondary"
            >
              Cancel
            </Button>
          )}
         
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
     
      {/* Add Category Modal */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title="Add Category"
        size="sm"
      >
        <form onSubmit={handleAddCategory} className="space-y-4" onClick={(e) => e.stopPropagation()}>
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              value={newCategoryName}
              onChange={(e) => {
                e.stopPropagation(); // Stop propagation
                setNewCategoryName(e.target.value);
              }}
              placeholder="Enter category name"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              required
              autoFocus
            />
          </div>
         
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Stop propagation
                setShowCategoryModal(false);
              }}
              variant="secondary"
            >
              Cancel
            </Button>
           
            <Button
              type="submit"
              disabled={categoryLoading}
              onClick={(e) => e.stopPropagation()} // Stop propagation
            >
              {categoryLoading ? 'Adding...' : 'Add Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default TodoForm;
