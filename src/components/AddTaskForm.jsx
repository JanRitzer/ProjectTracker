import { useState } from 'react';
import { TagInput } from './TagInput';
import { SubtaskList } from './SubtaskList';
import styles from './AddTaskForm.module.css';

export function AddTaskForm({ onAddTask }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [tags, setTags] = useState([]);
  const [subtasks, setSubtasks] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null,
      priority,
      tags,
      subtasks
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
    setTags([]);
    setSubtasks([]);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
    setTags([]);
    setSubtasks([]);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className={styles.openBtn}>
        + Add Task
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className={styles.input}
        autoFocus
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        className={styles.textarea}
        rows={3}
      />
      <div className={styles.formRow}>
        <label className={styles.formLabel}>Priority:</label>
        <div className={styles.prioritySelector}>
          <button
            type="button"
            className={`${styles.priorityBtn} ${priority === 'high' ? styles.priorityBtnActive : ''}`}
            onClick={() => setPriority('high')}
          >
            High
          </button>
          <button
            type="button"
            className={`${styles.priorityBtn} ${priority === 'medium' ? styles.priorityBtnActive : ''}`}
            onClick={() => setPriority('medium')}
          >
            Medium
          </button>
          <button
            type="button"
            className={`${styles.priorityBtn} ${priority === 'low' ? styles.priorityBtnActive : ''}`}
            onClick={() => setPriority('low')}
          >
            Low
          </button>
        </div>
      </div>
      <div className={styles.formSection}>
        <label className={styles.formSectionLabel}>Tags:</label>
        <TagInput tags={tags} onChange={setTags} />
      </div>
      <div className={styles.formSection}>
        <label className={styles.formSectionLabel}>Subtasks (optional):</label>
        <SubtaskList subtasks={subtasks} onChange={setSubtasks} editable={true} />
      </div>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className={styles.input}
        placeholder="Due date (optional)"
      />
      <div className={styles.actions}>
        <button type="submit" className={styles.addBtn}>
          Add Task
        </button>
        <button type="button" onClick={handleCancel} className={styles.cancelBtn}>
          Cancel
        </button>
      </div>
    </form>
  );
}
