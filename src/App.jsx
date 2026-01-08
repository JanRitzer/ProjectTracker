import { useState } from 'react';
import { TaskBoard } from './components/TaskBoard';
import { CalendarView } from './components/CalendarView';
import { ViewToggle } from './components/ViewToggle';
import { QuickNotes } from './components/QuickNotes';
import { Auth } from './components/Auth';
import { useAuth } from './hooks/useAuth';
import { useUserProfile } from './hooks/useUserProfile';
import { useSupabaseTasks } from './hooks/useSupabaseTasks';
import { useSupabaseNotes } from './hooks/useSupabaseNotes';
import { generateId } from './utils/helpers';
import styles from './App.module.css';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile(user?.id);
  const [viewMode, setViewMode] = useState('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ priority: [], tags: [], dueDate: [] });

  const {
    tasks,
    loading: tasksLoading,
    addTask,
    updateTask,
    deleteTask,
  } = useSupabaseTasks(user?.id);

  const {
    notes,
    loading: notesLoading,
    addNote,
    deleteNote,
  } = useSupabaseNotes(user?.id);

  // Show auth screen if not logged in
  if (authLoading || (user && profileLoading)) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '☀️ Good morning';
    if (hour < 18) return '🌤️ Good afternoon';
    return '🌙 Good evening';
  };

  const displayName = profile?.username || user.user_metadata?.username || user.email.split('@')[0];

  // Task operations
  const handleAddTask = async (taskData) => {
    const newTask = {
      id: generateId(),
      ...taskData,
      status: 'todo',
      priority: taskData.priority || 'medium',
      tags: taskData.tags || [],
      subtasks: taskData.subtasks || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await addTask(newTask);
    } catch (error) {
      console.error('Failed to add task:', error);
      alert('Failed to add task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleEditTask = async (taskId, updatedData) => {
    try {
      await updateTask(taskId, {
        ...updatedData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleMoveTask = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to move task:', error);
      alert('Failed to move task. Please try again.');
    }
  };

  // Note operations
  const handleAddNote = async (content) => {
    const newNote = {
      id: generateId(),
      content,
      createdAt: new Date().toISOString(),
    };

    try {
      await addNote(newNote);
    } catch (error) {
      console.error('Failed to add note:', error);
      alert('Failed to add note. Please try again.');
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
  };

  return (
    <div className={styles.app}>
      <div className={styles.userHeader}>
        <div className={styles.userInfo}>
          <span className={styles.greeting}>{getGreeting()},</span>
          <span className={styles.username}>{displayName}</span>
        </div>
        <div className={styles.headerActions}>
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
          <button onClick={handleSignOut} className={styles.signOutBtn}>
            Sign Out
          </button>
        </div>
      </div>

      {viewMode === 'board' ? (
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
      ) : (
        <CalendarView
          tasks={tasks}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        />
      )}
      <QuickNotes
        notes={notes}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  );
}

export default App;
