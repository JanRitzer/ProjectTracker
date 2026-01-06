import { useEffect, useState } from 'react';
import { TaskBoard } from './components/TaskBoard';
import { QuickNotes } from './components/QuickNotes';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateId, migrateTask } from './utils/helpers';
import styles from './App.module.css';

function App() {
  const [tasks, setTasks] = useLocalStorage('project-tracker-tasks', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ priority: [], tags: [], dueDate: [] });

  // Migrate tasks on mount to ensure backward compatibility
  useEffect(() => {
    if (tasks.length > 0) {
      const migratedTasks = tasks.map(migrateTask);
      // Only update if there are tasks without new fields
      const needsMigration = tasks.some(
        task => task.priority === undefined || task.tags === undefined || task.subtasks === undefined
      );
      if (needsMigration) {
        setTasks(migratedTasks);
      }
    }
  }, []); // Run only once on mount
  const [notes, setNotes] = useLocalStorage('project-tracker-notes', []);

  // Task operations
  const handleAddTask = (taskData) => {
    const newTask = {
      id: generateId(),
      ...taskData,
      status: 'todo',
      priority: taskData.priority || 'medium',
      tags: taskData.tags || [],
      subtasks: taskData.subtasks || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleEditTask = (taskId, updatedData) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, ...updatedData, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const handleMoveTask = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  // Note operations
  const handleAddNote = (content) => {
    const newNote = {
      id: generateId(),
      content,
      createdAt: new Date().toISOString()
    };
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  return (
    <div className={styles.app}>
      <TaskBoard
        tasks={tasks}
        onAddTask={handleAddTask}
        onDeleteTask={handleDeleteTask}
        onEditTask={handleEditTask}
        onMoveTask={handleMoveTask}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
      />
      <QuickNotes
        notes={notes}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  );
}

export default App;
