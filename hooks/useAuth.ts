import { useState, useCallback } from 'react';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(async (email: string, password: string, cpf: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('cpf', cpf)
        .single();

      if (!existingUser) {
        throw new Error('CPF não encontrado');
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      router.replace('/(tabs)');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocorreu um erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocorreu um erro ao fazer login com Google');
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      router.replace('/(auth)/login');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocorreu um erro ao fazer logout');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    signIn,
    signInWithGoogle,
    signOut,
    loading,
    error,
  };
}