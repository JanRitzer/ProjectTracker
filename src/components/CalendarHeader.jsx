import { getMonthName } from '../utils/calendarHelpers';
import styles from './CalendarHeader.module.css';

export function CalendarHeader({ currentDate, onPrevMonth, onNextMonth, onToday }) {
  const monthName = getMonthName(currentDate.getMonth());
  const year = currentDate.getFullYear();

  return (
    <div className={styles.header}>
      <div className={styles.navigation}>
        <button
          onClick={onPrevMonth}
          className={styles.navButton}
          aria-label="Previous month"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h2 className={styles.monthYear}>
          {monthName} {year}
        </h2>
        <button
          onClick={onNextMonth}
          className={styles.navButton}
          aria-label="Next month"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M7.5 5L12.5 10L7.5 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <button onClick={onToday} className={styles.todayButton}>
        Today
      </button>
    </div>
  );
}
