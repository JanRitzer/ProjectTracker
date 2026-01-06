import { TaskCard } from './TaskCard';
import styles from './TaskColumn.module.css';

export function TaskColumn({
  title,
  status,
  tasks,
  onDeleteTask,
  onEditTask,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  isDraggedOver
}) {
  const taskCount = tasks.length;

  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.count}>{taskCount}</span>
      </div>

      <div
        className={`${styles.taskList} ${isDraggedOver ? styles.dragOver : ''}`}
        onDragOver={(e) => onDragOver(e, status)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, status)}
      >
        {tasks.length === 0 ? (
          <div className={styles.emptyState}>
            {status === 'todo' && 'No tasks to do'}
            {status === 'in-progress' && 'No tasks in progress'}
            {status === 'done' && 'No completed tasks'}
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
    </div>
  );
}
