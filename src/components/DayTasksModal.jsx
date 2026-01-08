import { TaskCard } from './TaskCard';
import styles from './DayTasksModal.module.css';

export function DayTasksModal({ date, tasks, onClose, onEditTask, onDeleteTask, onAddTask }) {
  if (!date) return null;

  const formatDateTitle = (dateString) => {
    const d = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('en-US', options);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddTask = () => {
    // This will be implemented to open add task form with pre-filled date
    // For now, just call the parent handler
    if (onAddTask) {
      onAddTask(date);
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {formatDateTitle(date)}
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {tasks.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📝</span>
              <p className={styles.emptyText}>No tasks for this day</p>
              <button className={styles.addButton} onClick={handleAddTask}>
                Add Task
              </button>
            </div>
          ) : (
            <>
              <div className={styles.taskCount}>
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              </div>
              <div className={styles.taskList}>
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </div>
              <button className={styles.addButton} onClick={handleAddTask}>
                Add Task
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
