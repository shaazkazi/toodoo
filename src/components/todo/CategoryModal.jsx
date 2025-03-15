import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import useCategoryStore from '../../store/categoryStore';

const CategoryModal = ({ onClose, onCategoryAdded }) => {
  const [categoryName, setCategoryName] = useState('');
  const { addCategory, loading } = useCategoryStore();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event propagation
    
    if (!categoryName.trim()) return;
    
    const { success, data, error } = await addCategory({ name: categoryName.trim() });
    
    if (success && data) {
      toast.success('Category added successfully!');
      if (onCategoryAdded) {
        onCategoryAdded(data);
      }
      onClose();
    } else {
      toast.error(error || 'Failed to add category. Please try again.');
    }
  };
  
  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e) => {
    e.stopPropagation();
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 m-4" 
        onClick={handleModalClick} // Stop propagation for the modal content
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Add New Category</h2>
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Stop propagation
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form 
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()} // Stop propagation for the form
        >
          <Input
            label="Category Name"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => {
              e.stopPropagation(); // Stop propagation
              setCategoryName(e.target.value);
            }}
            required
            autoFocus
          />
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation(); // Stop propagation
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!categoryName.trim() || loading}
              isLoading={loading}
              onClick={(e) => e.stopPropagation()} // Stop propagation
            >
              Add Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
