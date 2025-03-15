import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const Dropdown = ({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder = 'Select an option',
  className = '',
  dropdownClassName = '',
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Find the selected option label
  // Convert values to strings for comparison to handle both string and number IDs
  const selectedOption = options.find(option => String(option.value) === String(value));
  
  const handleOptionClick = (optionValue) => {
    console.log('Dropdown - Option clicked:', optionValue);
    onChange(optionValue);
    setIsOpen(false);
  };
  
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          className={`input flex justify-between items-center w-full ${error ? 'border-red-500' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`${!selectedOption ? 'text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDownIcon className={`h-5 w-5 transition-transform text-gray-500 dark:text-gray-400 ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className={`absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none border border-gray-200 dark:border-gray-700 ${dropdownClassName}`}
            >
              <ul className="py-1">
                {options.map((option) => (
                  <li
                    key={String(option.value)}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      String(option.value) === String(value) 
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => handleOptionClick(option.value)}
                  >
                    {option.label}
                  </li>
                ))}
                
                {options.length === 0 && (
                  <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    No options available
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Dropdown;
