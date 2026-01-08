import { CalendarDay } from './CalendarDay';
import { formatDateKey } from '../utils/calendarHelpers';
import styles from './CalendarGrid.module.css';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarGrid({ monthData, tasksByDate, onDayClick }) {
  const getTasksForDay = (day) => {
    const dateKey = formatDateKey(day.date);
    return tasksByDate[dateKey] || [];
  };

  return (
    <div className={styles.gridContainer}>
      <div className={styles.weekdayHeader}>
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className={styles.weekdayLabel}>
            {label}
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {monthData.map((day, index) => (
          <CalendarDay
            key={index}
            day={day}
            tasks={getTasksForDay(day)}
            onClick={onDayClick}
          />
        ))}
      </div>
    </div>
  );
}
