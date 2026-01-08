import { formatDateKey, isOverdue } from '../utils/calendarHelpers';
import styles from './CalendarDay.module.css';

function getPriorityColor(priority) {
  return {
    high: '#ff4757',
    medium: '#ffa502',
    low: '#00d2d3'
  }[priority] || '#00d2d3';
}

export function CalendarDay({ day, tasks = [], onClick }) {
  const dateString = formatDateKey(day.date);
  const dayIsOverdue = day.isCurrentMonth && isOverdue(new Date(day.date));

  const taskDots = tasks.slice(0, 3);
  const extraCount = tasks.length > 3 ? tasks.length - 3 : 0;

  const handleClick = () => {
    if (tasks.length > 0 || day.isCurrentMonth) {
      onClick(dateString, tasks, day.date);
    }
  };

  return (
    <div
      className={`${styles.day}
        ${day.isToday ? styles.today : ''}
        ${!day.isCurrentMonth ? styles.otherMonth : ''}
        ${tasks.length > 0 || day.isCurrentMonth ? styles.clickable : ''}`}
      onClick={handleClick}
    >
      <span className={styles.dayNumber}>
        {day.date.getDate()}
      </span>

      {tasks.length > 0 && (
        <div className={styles.taskIndicators}>
          {taskDots.map((task, index) => (
            <span
              key={task.id}
              className={`${styles.taskDot} ${dayIsOverdue ? styles.overdue : ''}`}
              style={{
                backgroundColor: getPriorityColor(task.priority),
                animationDelay: `${index * 0.1}s`
              }}
              title={task.title}
            />
          ))}
          {extraCount > 0 && (
            <span className={styles.extraCount}>+{extraCount}</span>
          )}
        </div>
      )}
    </div>
  );
}
