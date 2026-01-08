import { useState, useMemo } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { DayTasksModal } from './DayTasksModal';
import { getMonthData, groupTasksByDate } from '../utils/calendarHelpers';
import styles from './CalendarView.module.css';

export function CalendarView({ tasks, onAddTask, onEditTask, onDeleteTask }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showUnscheduled, setShowUnscheduled] = useState(false);

  // Get month data (42 days for 6-week grid)
  const monthData = useMemo(() => {
    return getMonthData(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    return groupTasksByDate(tasks);
  }, [tasks]);

  // Unscheduled tasks
  const unscheduledTasks = tasksByDate.unscheduled || [];

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Day click handler
  const handleDayClick = (dateString, tasks, date) => {
    setSelectedDate(dateString);
    setSelectedTasks(tasks);
  };

  // Modal close handler
  const handleCloseModal = () => {
    setSelectedDate(null);
    setSelectedTasks([]);
  };

  // Task handlers
  const handleEditTask = (taskId, updatedData) => {
    onEditTask(taskId, updatedData);
  };

  const handleDeleteTask = (taskId) => {
    onDeleteTask(taskId);
    // Update selected tasks if modal is open
    setSelectedTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleAddTask = (date) => {
    // For now, just close the modal
    // In a full implementation, this would open the add task form with pre-filled date
    handleCloseModal();
  };

  return (
    <div className={styles.calendarView}>
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      <CalendarGrid
        monthData={monthData}
        tasksByDate={tasksByDate}
        onDayClick={handleDayClick}
      />

      {unscheduledTasks.length > 0 && (
        <div className={styles.unscheduledSection}>
          <button
            className={styles.unscheduledHeader}
            onClick={() => setShowUnscheduled(!showUnscheduled)}
          >
            <span className={styles.unscheduledTitle}>
              Unscheduled Tasks
              <span className={styles.unscheduledCount}>{unscheduledTasks.length}</span>
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className={`${styles.chevron} ${showUnscheduled ? styles.open : ''}`}
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {showUnscheduled && (
            <div className={styles.unscheduledContent}>
              <p className={styles.unscheduledHint}>
                Tasks without a due date. Click to edit and add a date.
              </p>
            </div>
          )}
        </div>
      )}

      {selectedDate && (
        <DayTasksModal
          date={selectedDate}
          tasks={selectedTasks}
          onClose={handleCloseModal}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onAddTask={handleAddTask}
        />
      )}
    </div>
  );
}
