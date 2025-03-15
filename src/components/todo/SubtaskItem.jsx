import React, { useState, useRef, useEffect } from 'react';
import { CheckIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Bars3Icon } from '@heroicons/react/24/solid'; // Changed from DragIcon to Bars3Icon

const SubtaskItem = ({ subtask, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(subtask.title);
  const inputRef = useRef(null);
  
  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  
  // Handle edit save
  const handleSave = () => {
    onUpdate(editValue);
    setIsEditing(false);
  };
  
  // Handle key press in edit mode
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(subtask.title);
      setIsEditing(false);
    }
  };
  
  return (
    <div className={`group flex items-center p-3 rounded-md ${
      isEditing 
        ? 'bg-gray-50 dark:bg-gray-700' 
        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
    }`}>
      <div className="flex-shrink-0 mr-3 text-gray-400 cursor-move">
        <Bars3Icon className="h-5 w-5" /> {/* Using Bars3Icon as drag handle */}
      </div>
      
      <button
        onClick={onToggle}
        className={`flex-shrink-0 h-5 w-5 rounded-full border mr-3 ${
          subtask.is_completed 
            ? 'bg-primary-500 border-primary-500 flex items-center justify-center' 
            : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        {subtask.is_completed && (
          <CheckIcon className="h-4 w-4 text-white" />
        )}
      </button>
      
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-gray-700 dark:text-gray-200"
        />
      ) : (
        <span 
          className={`flex-1 text-sm ${
            subtask.is_completed 
              ? 'text-gray-500 dark:text-gray-400 line-through' 
              : 'text-gray-700 dark:text-gray-200'
          }`}
        >
          {subtask.title}
        </span>
      )}
      
      {!isEditing && (
        <div className="flex-shrink-0 flex opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SubtaskItem;
