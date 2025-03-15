import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import useCategoryStore from '../../store/categoryStore';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryManager = () => {
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  
  const { categories, addCategory, updateCategory, deleteCategory, loading } = useCategoryStore();
  
  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategory.trim()) return;
    
    const { success, error } = await addCategory({ name: newCategory.trim() });
    
    if (success) {
      setNewCategory('');
      toast.success('Category added successfully!');
    } else {
      toast.error(error || 'Failed to add category. Please try again.');
    }
  };
  
  const handleEditCategory = async (e) => {
    e.preventDefault();
    
    if (!editName.trim() || !editingCategory) return;
    
    const { success, error } = await updateCategory(editingCategory.id, { name: editName.trim() });
    
    if (success) {
      setEditingCategory(null);
      setEditName('');
      toast.success('Category updated successfully!');
    } else {
      toast.error(error || 'Failed to update category. Please try again.');
    }
  };
  
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? All associated tasks will be uncategorized.')) {
      const { success, error } = await deleteCategory(categoryId);
      
      if (!success) {
        toast.error(error || 'Failed to delete category. Please try again.');
      } else {
        toast.success('Category deleted successfully!');
      }
    }
  };
  
  const startEditing = (category) => {
    setEditingCategory(category);
    setEditName(category.name);
  };
  
  return (
    <div className="card bg-white dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Categories</h2>
      
      <form onSubmit={handleAddCategory} className="flex mb-4">
        <Input
          placeholder="Add new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          containerClassName="flex-1 mb-0"
        />
        <Button
          type="submit"
          className="ml-2"
          disabled={!newCategory.trim() || loading}
          isLoading={loading}
        >
          <PlusIcon className="h-5 w-5" />
        </Button>
      </form>
      
      <div className="space-y-2 max-h-80 overflow-y-auto">
        <AnimatePresence>
          {categories.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm py-2">
              No categories yet. Add one to organize your tasks.
            </p>
          ) : (
            categories.map(category => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
              >
                                {editingCategory && editingCategory.id === category.id ? (
                  <form onSubmit={handleEditCategory} className="flex flex-1">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      containerClassName="flex-1 mb-0"
                      autoFocus
                    />
                    <Button
                      type="submit"
                      className="ml-2"
                      disabled={!editName.trim() || loading}
                      isLoading={loading}
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="ml-2"
                      onClick={() => setEditingCategory(null)}
                    >
                      Cancel
                    </Button>
                  </form>
                ) : (
                  <>
                    <span className="text-gray-800 dark:text-gray-200">{category.name}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(category)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CategoryManager;
