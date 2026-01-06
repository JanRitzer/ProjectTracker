import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useUserProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If profile doesn't exist, create it with a default username
        if (error.code === 'PGRST116') {
          await createProfile(userId);
          return;
        }
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (userId) => {
    try {
      const defaultUsername = `user_${userId.substring(0, 8)}`;
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: userId,
            username: defaultUsername,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  return { profile, loading };
}
