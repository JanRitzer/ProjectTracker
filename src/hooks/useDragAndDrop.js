import { useState } from 'react';

/**
 * Custom hook to manage drag and drop functionality
 * @returns {Object} Drag and drop handlers and state
 */
export function useDragAndDrop() {
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);

  /**
   * Handle drag start
   */
  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  /**
   * Handle drag over (needed to allow drop)
   */
  const handleDragOver = (e, columnStatus) => {
    e.preventDefault();
    setDraggedOver(columnStatus);
  };

  /**
   * Handle drag leave
   */
  const handleDragLeave = () => {
    setDraggedOver(null);
  };

  /**
   * Handle drop
   */
  const handleDrop = (e, columnStatus, onTaskMove) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== columnStatus) {
      onTaskMove(draggedTask.id, columnStatus);
    }
    setDraggedTask(null);
    setDraggedOver(null);
  };

  /**
   * Handle drag end
   */
  const handleDragEnd = () => {
    setDraggedTask(null);
    setDraggedOver(null);
  };

  return {
    draggedTask,
    draggedOver,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  };
}
