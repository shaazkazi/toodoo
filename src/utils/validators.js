/**
 * Validate an email address
 * @param {string} email - The email to validate
 * @returns {boolean} True if the email is valid
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validate a password
   * @param {string} password - The password to validate
   * @returns {Object} Validation result with isValid and errors
   */
  export const validatePassword = (password) => {
    const errors = [];
    
    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    // Optional: Check for stronger password requirements
    // if (!/[A-Z]/.test(password)) {
    //   errors.push('Password must contain at least one uppercase letter');
    // }
    
    // if (!/[a-z]/.test(password)) {
    //   errors.push('Password must contain at least one lowercase letter');
    // }
    
    // if (!/[0-9]/.test(password)) {
    //   errors.push('Password must contain at least one number');
    // }
    
    // if (!/[^A-Za-z0-9]/.test(password)) {
    //   errors.push('Password must contain at least one special character');
    // }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Validate a task title
   * @param {string} title - The task title to validate
   * @returns {boolean} True if the title is valid
   */
  export const isValidTaskTitle = (title) => {
    return !!title && title.trim().length > 0;
  };
  
  /**
   * Validate a due date
   * @param {string|Date} dueDate - The due date to validate
   * @returns {boolean} True if the due date is valid
   */
  export const isValidDueDate = (dueDate) => {
    if (!dueDate) return true; // Due date is optional
    
    try {
      const date = new Date(dueDate);
      return !isNaN(date.getTime());
    } catch (error) {
      return false;
    }
  };
  
  /**
   * Validate a form field
   * @param {string} field - The field name
   * @param {any} value - The field value
   * @returns {string|null} Error message or null if valid
   */
  export const validateField = (field, value) => {
    switch (field) {
      case 'email':
        return isValidEmail(value) ? null : 'Please enter a valid email address';
        
      case 'password':
        const { isValid, errors } = validatePassword(value);
        return isValid ? null : errors[0];
        
      case 'name':
      case 'displayName':
        return value && value.trim() ? null : 'Please enter your name';
        
      case 'title':
        return isValidTaskTitle(value) ? null : 'Please enter a task title';
        
      case 'dueDate':
        return isValidDueDate(value) ? null : 'Please enter a valid date';
        
      default:
        return null;
    }
  };
  
  /**
   * Validate a form object
   * @param {Object} formData - The form data object
   * @param {Array} fields - The fields to validate
   * @returns {Object} Validation result with isValid and errors
   */
  export const validateForm = (formData, fields) => {
    const errors = {};
    let isValid = true;
    
    fields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });
    
    return { isValid, errors };
  };
  