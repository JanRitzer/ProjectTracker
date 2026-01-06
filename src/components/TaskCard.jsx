import { useState } from 'react';
import { formatDate, isOverdue, isDueSoon } from '../utils/helpers';
import { PriorityBadge } from './PriorityBadge';
import { TagList } from './TagList';
import { TagInput } from './TagInput';
import { SubtaskList } from './SubtaskList';
import styles from './TaskCard.module.css';

export function TaskCard({ task, onDelete, onEdit, onDragStart, onDragEnd }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = () => {
    onEdit(task.id, editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const getDueDateClass = () => {
    if (!task.dueDate) return '';
    if (isOverdue(task.dueDate)) return styles.overdue;
    if (isDueSoon(task.dueDate)) return styles.dueSoon;
    return '';
  };

  const getPriorityBorderColor = (priority) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#3b82f6'
    };
    return colors[priority] || colors.medium;
  };

  if (isEditing) {
    return (
      <div className={styles.card} style={{ borderLeft: `4px solid ${getPriorityBorderColor(editedTask.priority)}` }}>
        <input
          type="text"
          className={styles.editInput}
          value={editedTask.title}
          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
          placeholder="Task title"
          autoFocus
        />
        <textarea
          className={styles.editTextarea}
          value={editedTask.description}
          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          placeholder="Task description"
          rows={3}
        />
        <div className={styles.editRow}>
          <label className={styles.editLabel}>Priority:</label>
          <div className={styles.prioritySelector}>
            <button
              type="button"
              className={`${styles.priorityBtn} ${editedTask.priority === 'high' ? styles.priorityBtnActive : ''}`}
              onClick={() => setEditedTask({ ...editedTask, priority: 'high' })}
            >
              High
            </button>
            <button
              type="button"
              className={`${styles.priorityBtn} ${editedTask.priority === 'medium' ? styles.priorityBtnActive : ''}`}
              onClick={() => setEditedTask({ ...editedTask, priority: 'medium' })}
            >
              Medium
            </button>
            <button
              type="button"
              className={`${styles.priorityBtn} ${editedTask.priority === 'low' ? styles.priorityBtnActive : ''}`}
              onClick={() => setEditedTask({ ...editedTask, priority: 'low' })}
            >
              Low
            </button>
          </div>
        </div>
        <input
          type="date"
          className={styles.editInput}
          value={editedTask.dueDate ? editedTask.dueDate.split('T')[0] : ''}
          onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
        />
        <div className={styles.editSection}>
          <label className={styles.editLabel}>Tags:</label>
          <TagInput
            tags={editedTask.tags || []}
            onChange={(tags) => setEditedTask({ ...editedTask, tags })}
          />
        </div>
        <div className={styles.editSection}>
          <label className={styles.editLabel}>Subtasks:</label>
          <SubtaskList
            subtasks={editedTask.subtasks || []}
            onChange={(subtasks) => setEditedTask({ ...editedTask, subtasks })}
            editable={true}
          />
        </div>
        <div className={styles.editActions}>
          <button onClick={handleSave} className={styles.saveBtn}>Save</button>
          <button onClick={handleCancel} className={styles.cancelBtn}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.card}
      style={{ borderLeft: `4px solid ${getPriorityBorderColor(task.priority)}` }}
      draggable
      onDragStart={() => onDragStart(task)}
      onDragEnd={onDragEnd}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className={styles.cardHeader}>
        <div className={styles.titleRow}>
          <PriorityBadge priority={task.priority} />
          <h3 className={styles.title}>{task.title}</h3>
        </div>
        <div className={styles.actions}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className={styles.editBtn}
            aria-label="Edit task"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Are you sure you want to delete this task?')) {
                onDelete(task.id);
              }
            }}
            className={styles.deleteBtn}
            aria-label="Delete task"
          >
            Delete
          </button>
        </div>
      </div>

      {task.description && (
        <p className={`${styles.description} ${isExpanded ? styles.expanded : ''}`}>
          {task.description}
        </p>
      )}

      <TagList tags={task.tags} maxVisible={isExpanded ? 100 : 3} />

      <SubtaskList
        subtasks={task.subtasks || []}
        onChange={(subtasks) => onEdit(task.id, { ...task, subtasks })}
        showCompact={!isExpanded}
      />

      {task.dueDate && (
        <div className={`${styles.dueDate} ${getDueDateClass()}`}>
          Due: {formatDate(task.dueDate)}
        </div>
      )}
    </div>
  );
}
