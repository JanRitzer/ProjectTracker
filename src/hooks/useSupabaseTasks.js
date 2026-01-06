import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSupabaseTasks(userId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from Supabase
  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    fetchTasks();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchTasks = async () => {
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
  };

  const addTask = async (taskData) => {
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
      throw error;
    }
  };

  const updateTask = async (taskId, updates) => {
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
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting task:', error);
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
