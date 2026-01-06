import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useSupabaseTasks(userId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform Supabase data to match our app format
      const transformedTasks = data.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        tags: task.tags || [],
        subtasks: task.subtasks || [],
        dueDate: task.due_date,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
      }));

      setTasks(transformedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch tasks from Supabase
  useEffect(() => {
    fetchTasks();

    if (!userId) return;

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`tasks_changes_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Real-time update:', payload);
          // Refetch to ensure consistency
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchTasks]);

  const addTask = async (taskData) => {
    // Optimistic update - add task immediately to UI
    const newTask = {
      id: taskData.id,
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      priority: taskData.priority,
      tags: taskData.tags || [],
      subtasks: taskData.subtasks || [],
      dueDate: taskData.dueDate,
      createdAt: taskData.createdAt,
      updatedAt: taskData.updatedAt,
    };

    setTasks((prev) => [newTask, ...prev]);

    try {
      const { error } = await supabase.from('tasks').insert([
        {
          id: taskData.id,
          user_id: userId,
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          tags: taskData.tags,
          subtasks: taskData.subtasks,
          due_date: taskData.dueDate,
          created_at: taskData.createdAt,
          updated_at: taskData.updatedAt,
        },
      ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding task:', error);
      // Rollback optimistic update on error
      setTasks((prev) => prev.filter((t) => t.id !== taskData.id));
      throw error;
    }
  };

  const updateTask = async (taskId, updates) => {
    // Optimistic update - update task immediately in UI
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: updates.title,
          description: updates.description,
          status: updates.status,
          priority: updates.priority,
          tags: updates.tags,
          subtasks: updates.subtasks,
          due_date: updates.dueDate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating task:', error);
      // Refetch on error to restore correct state
      fetchTasks();
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    // Optimistic update - remove task immediately from UI
    const taskToDelete = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting task:', error);
      // Rollback optimistic update on error
      if (taskToDelete) {
        setTasks((prev) => [...prev, taskToDelete]);
      }
      throw error;
    }
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
  };
}
