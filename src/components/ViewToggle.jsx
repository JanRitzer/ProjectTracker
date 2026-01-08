import { useState } from 'react';
import styles from './ViewToggle.module.css';

export function ViewToggle({ currentView, onViewChange }) {
  return (
    <div className={styles.viewToggle}>
      <button
        className={`${styles.toggleButton} ${currentView === 'board' ? styles.active : ''}`}
        onClick={() => onViewChange('board')}
      >
        <span className={styles.icon}>📋</span>
        Board
      </button>
      <button
        className={`${styles.toggleButton} ${currentView === 'calendar' ? styles.active : ''}`}
        onClick={() => onViewChange('calendar')}
      >
        <span className={styles.icon}>📅</span>
        Calendar
      </button>
      <div
        className={styles.slider}
        style={{ transform: currentView === 'calendar' ? 'translateX(100%)' : 'translateX(0)' }}
      />
    </div>
  );
}
