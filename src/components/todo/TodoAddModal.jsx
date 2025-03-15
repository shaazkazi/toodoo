import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import useTodoStore from '../../store/todoStore';
import useAuthStore from '../../store/authStore';

const TodoAddModal = ({ categories, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [errors, setErrors] = useState({});
  
  const { addTodo, loading } = useTodoStore();
  const { user } = useAuthStore();
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const todoData = {
      title,
      description: description.trim() || null,
      due_date: dueDate || null,
      category_id: categoryId || null,
      user_id: user.id,
    };
    
    const { success, error } = await addTodo(todoData);
    
    if (success) {
      toast.success('Task added successfully!');
      onClose();
    } else {
      toast.error(error || 'Failed to add task. Please try again.');
    }
  };
  
    // Create category options for dropdown
    const categoryOptions = [
        { value: '', label: 'No Category' },
        ...categories.map(category => ({
          value: category.id,
          label: category.name
        }))
      ];
      
      return (
        <Modal
          isOpen={true}
          onClose={onClose}
          title="Add New Task"
        >
          <form onSubmit={handleSubmit}>
            <Input
              label="Title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              error={errors.title}
              required
            />
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows="3"
                className="input w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description (optional)"
              />
            </div>
            
            <Input
              label="Due Date"
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            
            <Dropdown
              label="Category"
              value={categoryId}
              onChange={setCategoryId}
              options={categoryOptions}
            />
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                isLoading={loading}
                disabled={loading}
              >
                Add Task
              </Button>
            </div>
          </form>
        </Modal>
      );
    };
    
    export default TodoAddModal;
    