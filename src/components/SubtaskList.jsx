import { useState } from 'react';
import { generateSubtaskId } from '../utils/helpers';
import styles from './SubtaskList.module.css';

export function SubtaskList({ subtasks = [], onChange, editable = false, showCompact = false }) {
  const [newSubtaskText, setNewSubtaskText] = useState('');

  const completedCount = subtasks.filter(st => st.completed).length;
  const totalCount = subtasks.length;

  const handleToggleComplete = (subtaskId) => {
    const updated = subtasks.map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    onChange(updated);
  };

  const handleAddSubtask = () => {
    const text = newSubtaskText.trim();
    if (!text) return;

    if (subtasks.length >= 20) {
      alert('Maximum 20 subtasks allowed');
      return;
    }

    const newSubtask = {
      id: generateSubtaskId(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    };

    onChange([...subtasks, newSubtask]);
    setNewSubtaskText('');
  };

  const handleDeleteSubtask = (subtaskId) => {
    onChange(subtasks.filter(st => st.id !== subtaskId));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubtask();
    }
  };

  // Compact view - just show progress
  if (showCompact && subtasks.length > 0) {
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
      <div className={styles.compactView}>
        <div className={styles.progressDots}>
          {subtasks.slice(0, 5).map((st, index) => (
            <span
              key={index}
              className={`${styles.dot} ${st.completed ? styles.dotCompleted : ''}`}
            />
          ))}
          {subtasks.length > 5 && <span className={styles.dotMore}>...</span>}
        </div>
        <span className={styles.progressText}>
          {completedCount}/{totalCount} subtasks
        </span>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${percentage}%` }} />
        </div>
      </div>
    );
  }

  // Full view
  if (subtasks.length === 0 && !editable) {
    return null;
  }

  return (
    <div className={styles.subtaskList}>
      {subtasks.length > 0 && (
        <div className={styles.header}>
          <span className={styles.headerText}>Subtasks ({completedCount}/{totalCount})</span>
        </div>
      )}

      {subtasks.map((subtask) => (
        <div key={subtask.id} className={styles.subtask}>
          <input
            type="checkbox"
            checked={subtask.completed}
            onChange={() => handleToggleComplete(subtask.id)}
            className={styles.checkbox}
          />
          <span className={`${styles.subtaskText} ${subtask.completed ? styles.completed : ''}`}>
            {subtask.text}
          </span>
          {editable && (
            <button
              onClick={() => handleDeleteSubtask(subtask.id)}
              className={styles.deleteBtn}
              aria-label="Delete subtask"
            >
              ×
            </button>
          )}
        </div>
      ))}

      {editable && (
        <div className={styles.addSubtask}>
          <input
            type="text"
            value={newSubtaskText}
            onChange={(e) => setNewSubtaskText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a subtask..."
            className={styles.input}
          />
          <button
            onClick={handleAddSubtask}
            className={styles.addBtn}
            disabled={!newSubtaskText.trim()}
          >
            Add
          </button>
        </div>
      )}

      {subtasks.length >= 10 && subtasks.length < 20 && editable && (
        <div className={styles.warning}>
          Warning: {subtasks.length}/20 subtasks. Consider breaking into separate tasks.
        </div>
      )}
    </div>
  );
}
