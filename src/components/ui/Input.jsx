import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  id,
  type = 'text',
  error,
  className = '',
  containerClassName = '',
  labelClassName = '',
  required = false,
  rightElement, // Add support for a right element (like a button)
  ...props 
}, ref) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={id} 
          className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative flex">
        <input
          ref={ref}
          id={id}
          type={type}
          className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''} ${rightElement ? 'rounded-r-none' : ''} ${className}`}
          required={required}
          {...props}
        />
        
        {rightElement && (
          <div className="flex-shrink-0">
            {rightElement}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
