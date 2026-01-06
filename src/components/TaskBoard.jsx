import { useMemo } from 'react';
import { TaskColumn } from './TaskColumn';
import { AddTaskForm } from './AddTaskForm';
import { SearchBar } from './SearchBar';
import { FilterPanel } from './FilterPanel';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useDebounce } from '../hooks/useDebounce';
import { filterTasksBySearch, filterTasksByFilters, getUniqueTags } from '../utils/filterHelpers';
import styles from './TaskBoard.module.css';

export function TaskBoard({
  tasks,
  onAddTask,
  onDeleteTask,
  onEditTask,
  onMoveTask,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange
}) {
  const {
    draggedOver,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  } = useDragAndDrop();

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Get available tags for filter
  const availableTags = useMemo(() => getUniqueTags(tasks), [tasks]);

  // Apply search and filters
  const filteredTasks = useMemo(() => {
    let result = tasks;
    result = filterTasksBySearch(result, debouncedSearch);
    result = filterTasksByFilters(result, filters);
    return result;
  }, [tasks, debouncedSearch, filters]);

  const todoTasks = filteredTasks.filter((task) => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter((task) => task.status === 'in-progress');
  const doneTasks = filteredTasks.filter((task) => task.status === 'done');

  const hasNoResults = tasks.length > 0 && filteredTasks.length === 0;

  return (
    <div className={styles.board}>
      <div className={styles.header}>
        <h1 className={styles.title}>Project Tracker</h1>
        <AddTaskForm onAddTask={onAddTask} />
      </div>

      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search tasks by title, description, or tags..."
      />

      <FilterPanel
        filters={filters}
        onChange={onFiltersChange}
        availableTags={availableTags}
      />

      {hasNoResults && (
        <div className={styles.noResults}>
          <p>No tasks match your search or filters.</p>
          <button onClick={() => {
            onSearchChange('');
            onFiltersChange({ priority: [], tags: [], dueDate: [] });
          }} className={styles.clearFiltersBtn}>
            Clear Search & Filters
          </button>
        </div>
      )}

      <div className={styles.columns}>
        <TaskColumn
          title="To Do"
          status="todo"
          tasks={todoTasks}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e, status) => handleDrop(e, status, onMoveTask)}
          isDraggedOver={draggedOver === 'todo'}
        />
        <TaskColumn
          title="In Progress"
          status="in-progress"
          tasks={inProgressTasks}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e, status) => handleDrop(e, status, onMoveTask)}
          isDraggedOver={draggedOver === 'in-progress'}
        />
        <TaskColumn
          title="Done"
          status="done"
          tasks={doneTasks}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e, status) => handleDrop(e, status, onMoveTask)}
          isDraggedOver={draggedOver === 'done'}
        />
      </div>
    </div>
  );
}
