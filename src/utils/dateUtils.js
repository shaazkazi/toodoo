import { format, formatDistanceToNow, isToday, isTomorrow, addDays, isAfter, isBefore, parseISO } from 'date-fns';

/**
 * Format a date for display
 * @param {Date|string} date - The date to format
 * @param {string} formatString - The format string
 * @returns {string} The formatted date
 */
export const formatDate = (date, formatString = 'MMM d, yyyy') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatString);
};

/**
 * Format a date as a relative time (e.g., "2 days ago")
 * @param {Date|string} date - The date to format
 * @returns {string} The relative time
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

/**
 * Format a due date for display in the UI
 * @param {Date|string} date - The due date
 * @returns {string} The formatted due date
 */
export const formatDueDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(dateObj)) {
    return 'Today';
  } else if (isTomorrow(dateObj)) {
    return 'Tomorrow';
  } else {
    return format(dateObj, 'MMM d, yyyy');
  }
};

/**
 * Check if a date is overdue
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if the date is overdue
 */
export const isOverdue = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return isBefore(dateObj, today);
};

/**
 * Check if a date is upcoming (within the next 7 days)
 * @param {Date|string} date - The date to check
 * @returns {boolean} True if the date is upcoming
 */
export const isUpcoming = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const nextWeek = addDays(today, 7);
  
  return isAfter(dateObj, today) && isBefore(dateObj, nextWeek);
};

/**
 * Parse an ISO date string to a Date object
 * @param {string} dateString - The ISO date string
 * @returns {Date} The parsed Date object
 */
export const parseISODate = (dateString) => {
  if (!dateString) return null;
  return parseISO(dateString);
};

/**
 * Format a date for input fields (YYYY-MM-DD)
 * @param {Date|string} date - The date to format
 * @returns {string} The formatted date
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};
