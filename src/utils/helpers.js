/**
 * Utility functions for the project tracker
 */

/**
 * Generate a unique ID using timestamp and random string
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a unique subtask ID
 */
export function generateSubtaskId() {
  return `subtask-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Reset time parts for comparison
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return 'Today';
  } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
    return 'Tomorrow';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
}

/**
 * Check if a date is overdue
 * @param {string} dateString - ISO date string
 * @returns {boolean}
 */
export function isOverdue(dateString) {
  if (!dateString) return false;

  const date = new Date(dateString);
  const today = new Date();

  // Reset time parts for comparison
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return dateOnly < todayOnly;
}

/**
 * Check if a date is due soon (within 3 days)
 * @param {string} dateString - ISO date string
 * @returns {boolean}
 */
export function isDueSoon(dateString) {
  if (!dateString) return false;

  const date = new Date(dateString);
  const today = new Date();
  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  // Reset time parts for comparison
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const threeDaysOnly = new Date(threeDaysFromNow.getFullYear(), threeDaysFromNow.getMonth(), threeDaysFromNow.getDate());

  return dateOnly >= todayOnly && dateOnly <= threeDaysOnly;
}

/**
 * Format timestamp for notes display
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Formatted timestamp
 */
export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();

  const isToday = date.toDateString() === today.toDateString();

  if (isToday) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Migrate task to include new fields with default values
 * Ensures backward compatibility with existing tasks
 * @param {Object} task - Task object
 * @returns {Object} Migrated task with new fields
 */
export function migrateTask(task) {
  return {
    ...task,
    priority: task.priority || 'medium',
    tags: task.tags || [],
    subtasks: task.subtasks || []
  };
}
