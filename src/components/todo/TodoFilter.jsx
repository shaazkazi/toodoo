import React from 'react';
import Dropdown from '../ui/Dropdown';

const TodoFilter = ({ 
  categories = [], 
  selectedCategory, 
  onCategoryChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange
}) => {
  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' }
  ];
  
  // Sort options
  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'alphabetical', label: 'Alphabetical' }
  ];
  
  // Convert categories to dropdown options format
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...Array.isArray(categories) ? categories.map(cat => ({ 
      value: cat.id, 
      label: cat.name 
    })) : []
  ];
  
  const handleCategoryChange = (value) => {
    console.log('TodoFilter - Category changed to:', value);
    onCategoryChange(value);
  };
  
  const handleStatusChange = (value) => {
    console.log('TodoFilter - Status changed to:', value);
    onStatusChange(value);
  };
  
  const handleSortChange = (value) => {
    console.log('TodoFilter - Sort changed to:', value);
    onSortChange(value);
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <Dropdown
        label="Category"
        options={categoryOptions}
        value={selectedCategory}
        onChange={handleCategoryChange}
        placeholder="Filter by category"
        className="md:w-1/3"
      />
      
      <Dropdown
        label="Status"
        options={statusOptions}
        value={statusFilter}
        onChange={handleStatusChange}
        placeholder="Filter by status"
        className="md:w-1/3"
      />
      
      <Dropdown
        label="Sort By"
        options={sortOptions}
        value={sortBy}
        onChange={handleSortChange}
        placeholder="Sort by"
        className="md:w-1/3"
      />
    </div>
  );
};

export default TodoFilter;
