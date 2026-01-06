import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useSupabaseNotes(userId) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    if (!userId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform Supabase data to match our app format
      const transformedNotes = data.map((note) => ({
        id: note.id,
        content: note.content,
        createdAt: note.created_at,
      }));

      setNotes(transformedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch notes from Supabase
  useEffect(() => {
    fetchNotes();

    if (!userId) return;

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`notes_changes_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Real-time note update:', payload);
          fetchNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchNotes]);

  const addNote = async (noteData) => {
    // Optimistic update - add note immediately to UI
    const newNote = {
      id: noteData.id,
      content: noteData.content,
      createdAt: noteData.createdAt,
    };

    setNotes((prev) => [newNote, ...prev]);

    try {
      const { error } = await supabase.from('notes').insert([
        {
          id: noteData.id,
          user_id: userId,
          content: noteData.content,
          created_at: noteData.createdAt,
        },
      ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding note:', error);
      // Rollback optimistic update on error
      setNotes((prev) => prev.filter((n) => n.id !== noteData.id));
      throw error;
    }
  };

  const deleteNote = async (noteId) => {
    // Optimistic update - remove note immediately from UI
    const noteToDelete = notes.find((n) => n.id === noteId);
    setNotes((prev) => prev.filter((note) => note.id !== noteId));

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting note:', error);
      // Rollback optimistic update on error
      if (noteToDelete) {
        setNotes((prev) => [...prev, noteToDelete]);
      }
      throw error;
    }
  };

  return {
    notes,
    loading,
    addNote,
    deleteNote,
  };
}
