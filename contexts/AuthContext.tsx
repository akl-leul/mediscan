import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { User } from '@/types';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, metadata?: { name: string; phoneNumber: string; country: string; gender: string }) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Handle protected route navigation
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inTabsGroup = segments[0] === '(tabs)';
    const inOnboardingGroup = segments[0] === 'onboarding';

    if (!user && (inTabsGroup)) {
      // User is not logged in but trying to access tabs
      router.replace('/auth/login');
    } else if (user && (inAuthGroup || inOnboardingGroup)) {
      // User is logged in but trying to access auth/onboarding
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user as User || null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setUser(session?.user as User || null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting sign in for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error: error.message };
      }

      console.log('Sign in successful:', data.user?.id);
      return { error: null };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error: 'An unexpected error occurred. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: { name: string; phoneNumber: string; country: string; gender: string }) => {
    try {
      setIsLoading(true);
      console.log('Attempting sign up for:', email);

      // Most basic signup possible - no metadata, no profile creation
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password
      });

      if (error) {
        console.error('Sign up error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return { error: error.message };
      }

      console.log('Sign up successful:', data.user?.id);

      // Skip profile creation for now to isolate the issue
      // TODO: Re-enable profile creation once basic auth works
      console.log('Profile creation temporarily disabled for debugging');

      // For development, automatically sign in the user
      if (data.user && !data.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) {
          console.error('Auto sign in error:', signInError);
          return { error: 'Account created but failed to sign in automatically. Please try signing in manually.' };
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up exception:', error);
      return { error: 'An unexpected error occurred. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }

      // User state will be cleared by the onAuthStateChange listener
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if sign out fails, clear the user state for better UX
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
