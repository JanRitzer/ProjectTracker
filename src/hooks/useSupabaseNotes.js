import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSupabaseNotes(userId) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notes from Supabase
  useEffect(() => {
    if (!userId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    fetchNotes();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('notes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchNotes = async () => {
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
  };

  const addNote = async (noteData) => {
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
      throw error;
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting note:', error);
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
