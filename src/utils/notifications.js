/**
 * Request notification permission
 * @returns {Promise<boolean>} True if permission was granted
 */
export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }
    
    if (Notification.permission === 'granted') {
      return true;
    }
    
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    
    return false;
  };
  
  /**
   * Check if notifications are supported and permission is granted
   * @returns {boolean} True if notifications are supported and permission is granted
   */
  export const areNotificationsEnabled = () => {
    return 'Notification' in window && Notification.permission === 'granted';
  };
  
  /**
   * Show a notification
   * @param {string} title - The notification title
   * @param {Object} options - The notification options
   * @returns {Notification|null} The notification object or null if not supported/permitted
   */
  export const showNotification = (title, options = {}) => {
    if (!areNotificationsEnabled()) {
      console.log('Notifications are not enabled');
      return null;
    }
    
    const defaultOptions = {
      icon: '/logo192.png',
      badge: '/logo192.png',
      silent: false,
    };
    
    const notification = new Notification(title, { ...defaultOptions, ...options });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
      
      if (options.onClick) {
        options.onClick();
      }
    };
    
    return notification;
  };
  
  /**
   * Schedule a notification for a due task
   * @param {Object} task - The task object
   * @param {number} minutesBefore - Minutes before the due time to show the notification
   * @returns {number|null} The timeout ID or null if notifications are not enabled
   */
  export const scheduleDueTaskNotification = (task, minutesBefore = 30) => {
    if (!areNotificationsEnabled() || !task.due_date) {
      return null;
    }
    
    const dueDate = new Date(task.due_date);
    const notificationTime = new Date(dueDate.getTime() - minutesBefore * 60 * 1000);
    const now = new Date();
    
    if (notificationTime <= now) {
      return null;
    }
    
    const timeUntilNotification = notificationTime.getTime() - now.getTime();
    
    const timeoutId = setTimeout(() => {
      showNotification(`Task Due Soon: ${task.title}`, {
        body: `Your task "${task.title}" is due in ${minutesBefore} minutes.`,
        onClick: () => {
          window.location.href = `/todo/${task.id}`;
        }
      });
    }, timeUntilNotification);
    
    return timeoutId;
  };
  
  /**
   * Cancel a scheduled notification
   * @param {number} timeoutId - The timeout ID returned by scheduleDueTaskNotification
   */
  export const cancelScheduledNotification = (timeoutId) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
  