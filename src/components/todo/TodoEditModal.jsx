import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import useTodoStore from '../../store/todoStore';
import SubtaskList from './SubtaskList';

const TodoEditModal = ({ todo, categories, onClose }) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [dueDate, setDueDate] = useState(todo.due_date ? new Date(todo.due_date).toISOString().split('T')[0] : '');
  const [categoryId, setCategoryId] = useState(todo.category_id || '');
  const [newSubtask, setNewSubtask] = useState('');
  const [errors, setErrors] = useState({});
  
  const { updateTodo, addSubtask, loading, uploadAttachment } = useTodoStore();
  
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
    };
    
    const { success, error } = await updateTodo(todo.id, todoData);
    
    if (success) {
      toast.success('Task updated successfully!');
      onClose();
    } else {
      toast.error(error || 'Failed to update task. Please try again.');
    }
  };
  
  const handleAddSubtask = async (e) => {
    e.preventDefault();
    
    if (!newSubtask.trim()) return;
    
    const { success, error } = await addSubtask(todo.id, newSubtask);
    
    if (success) {
      setNewSubtask('');
    } else {
      toast.error(error || 'Failed to add subtask. Please try again.');
    }
  };
  
  const handleFileUpload = async (file) => {
    if (!file) return;
    
    const { success, error } = await uploadAttachment(todo.id, file);
    
    if (!success) {
      toast.error(error || 'Failed to upload file. Please try again.');
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
      title="Edit Task"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
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
            />
            
            <Dropdown
              label="Category"
              value={categoryId}
              onChange={setCategoryId}
              options={categoryOptions}
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subtasks</h3>
              
              <div className="flex mb-2">
                <Input
                  id="newSubtask"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add a subtask"
                  containerClassName="flex-1 mb-0"
                />
                <Button
                  type="button"
                  onClick={handleAddSubtask}
                  className="ml-2"
                >
                  Add
                </Button>
              </div>
              
              <div className="max-h-40 overflow-y-auto">
                <SubtaskList todoId={todo.id} subtasks={todo.subtasks || []} />
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attachments</h3>
              <FileUpload onFileSelect={handleFileUpload} />
              
              {todo.attachments && todo.attachments.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto">
                  {todo.attachments.map(attachment => (
                    <div key={attachment.id} className="flex items-center py-2">
                      <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">
                        {attachment.file_name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
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
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TodoEditModal;
