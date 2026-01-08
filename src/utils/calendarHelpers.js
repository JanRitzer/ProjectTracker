/**
 * Calendar utility functions for date manipulation and task grouping
 */

/**
 * Checks if two dates are on the same day
 */
export function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Formats a date as YYYY-MM-DD string
 */
export function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generates a 6-week calendar grid (42 days) for the given month
 * Includes padding days from previous and next months
 */
export function getMonthData(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];
  const today = new Date();

  // Previous month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
    });
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    days.push({
      date,
      isCurrentMonth: true,
      isToday: isSameDay(date, today),
    });
  }

  // Next month padding (fill to 42 = 6 weeks)
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
    });
  }

  return days;
}

/**
 * Groups tasks by their due date
 * Returns an object with date keys (YYYY-MM-DD) and arrays of tasks
 * Tasks without due dates are grouped under 'unscheduled'
 */
export function groupTasksByDate(tasks) {
  return tasks.reduce((acc, task) => {
    if (!task.dueDate) {
      acc.unscheduled = [...(acc.unscheduled || []), task];
    } else {
      const dateKey = task.dueDate.split('T')[0]; // YYYY-MM-DD
      acc[dateKey] = [...(acc[dateKey] || []), task];
    }
    return acc;
  }, {});
}

/**
 * Gets the name of a month
 */
export function getMonthName(month) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
}

/**
 * Checks if a date is overdue (in the past)
 */
export function isOverdue(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
}
