import { isOverdue, isDueSoon } from './helpers';

/**
 * Filter tasks by search query (title, description, tags)
 * @param {Array} tasks - Array of tasks
 * @param {string} query - Search query
 * @returns {Array} Filtered tasks
 */
export function filterTasksBySearch(tasks, query) {
  if (!query || !query.trim()) return tasks;

  const lowerQuery = query.toLowerCase().trim();

  return tasks.filter(task =>
    task.title.toLowerCase().includes(lowerQuery) ||
    task.description.toLowerCase().includes(lowerQuery) ||
    (task.tags && task.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
  );
}

/**
 * Filter tasks by advanced filters (priority, tags, due date)
 * @param {Array} tasks - Array of tasks
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered tasks
 */
export function filterTasksByFilters(tasks, filters) {
  return tasks.filter(task => {
    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      if (!filters.priority.includes(task.priority)) {
        return false;
      }
    }

    // Tag filter (task must have at least one selected tag)
    if (filters.tags && filters.tags.length > 0) {
      const hasSelectedTag = filters.tags.some(filterTag =>
        task.tags && task.tags.includes(filterTag)
      );
      if (!hasSelectedTag) {
        return false;
      }
    }

    // Due date filter
    if (filters.dueDate && filters.dueDate.length > 0) {
      let matchesDueDateFilter = false;

      if (filters.dueDate.includes('overdue')) {
        if (task.dueDate && isOverdue(task.dueDate)) {
          matchesDueDateFilter = true;
        }
      }

      if (filters.dueDate.includes('dueSoon')) {
        if (task.dueDate && isDueSoon(task.dueDate) && !isOverdue(task.dueDate)) {
          matchesDueDateFilter = true;
        }
      }

      if (filters.dueDate.includes('noDueDate')) {
        if (!task.dueDate) {
          matchesDueDateFilter = true;
        }
      }

      if (!matchesDueDateFilter) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get all unique tags from tasks
 * @param {Array} tasks - Array of tasks
 * @returns {Array} Unique tags sorted alphabetically
 */
export function getUniqueTags(tasks) {
  const tagSet = new Set();

  tasks.forEach(task => {
    if (task.tags && Array.isArray(task.tags)) {
      task.tags.forEach(tag => tagSet.add(tag));
    }
  });

  return Array.from(tagSet).sort();
}

/**
 * Count active filters
 * @param {Object} filters - Filter object
 * @returns {number} Number of active filters
 */
export function countActiveFilters(filters) {
  let count = 0;

  if (filters.priority && filters.priority.length > 0) {
    count += filters.priority.length;
  }

  if (filters.tags && filters.tags.length > 0) {
    count += filters.tags.length;
  }

  if (filters.dueDate && filters.dueDate.length > 0) {
    count += filters.dueDate.length;
  }

  return count;
}
