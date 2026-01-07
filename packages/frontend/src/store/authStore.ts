import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User, UserRole } from '../../../shared/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: { email: string; password: string; name: string; role: UserRole }) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!,
            role: (session.user.user_metadata?.role as UserRole) || 'STUDENT',
            createdAt: new Date(session.user.created_at),
            updatedAt: new Date(),
          },
          loading: false,
        });
      } else {
        set({ user: null, loading: false });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ user: null, loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      set({
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || data.user.email!,
          role: (data.user.user_metadata?.role as UserRole) || 'STUDENT',
          createdAt: new Date(data.user.created_at),
          updatedAt: new Date(),
        },
      });
    }
  },

  signUp: async ({ email, password, name, role }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      set({
        user: {
          id: data.user.id,
          email: data.user.email!,
          name,
          role,
          createdAt: new Date(data.user.created_at),
          updatedAt: new Date(),
        },
      });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
