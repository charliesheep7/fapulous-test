import type { StateCreator } from 'zustand';
import { create } from 'zustand';

import { createSelectors } from '../utils';
import type { SignInData } from './supabase-auth';
import {
  getCurrentSession,
  signInWithEmailPassword,
  signOutSupabase,
} from './supabase-auth';
import type { TokenType, UserType } from './utils';
import {
  getToken,
  getUser,
  removeToken,
  removeUser,
  setToken,
  setUser,
} from './utils';

interface AuthState {
  token: TokenType | null;
  user: UserType | null;
  status: 'idle' | 'signOut' | 'signIn';
  signIn: (data: SignInData) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  hydrate: () => Promise<void>;
}

// Helper function to safely update auth state
const updateAuthState = async (
  set: Parameters<StateCreator<AuthState>>[0],
  token: TokenType,
  user: UserType
) => {
  await setToken(token);
  await setUser(user);
  set({
    status: 'signIn',
    token,
    user,
  });
};

// Helper function to safely clear auth state
const clearAuthState = async (set: Parameters<StateCreator<AuthState>>[0]) => {
  await removeToken();
  await removeUser();
  set({ status: 'signOut', token: null, user: null });
};

const _useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  user: null,
  signIn: async (data: SignInData) => {
    try {
      const response = await signInWithEmailPassword(data);

      if (response.success && response.data) {
        await updateAuthState(set, response.data.token, response.data.user);
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || 'Unknown error occurred',
        };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      return { success: false, error: errorMessage };
    }
  },
  signOut: async () => {
    try {
      await signOutSupabase();
    } catch (error) {
      // Continue with local cleanup even if Supabase fails
      console.warn('Failed to sign out from Supabase:', error);
    }
    await clearAuthState(set);
  },
  hydrate: async () => {
    try {
      const userToken = getToken();
      const userData = getUser();

      if (userToken && userData) {
        // We have local data, verify it with Supabase
        const response = await getCurrentSession();

        if (response.success && response.data) {
          // Session is valid, use fresh data from Supabase
          await updateAuthState(set, response.data.token, response.data.user);
        } else {
          // Session invalid, but we have local data - sign out
          await get().signOut();
        }
      } else {
        // No local data, check if there's a Supabase session
        const response = await getCurrentSession();

        if (response.success && response.data) {
          // Found valid session, use it
          await updateAuthState(set, response.data.token, response.data.user);
        } else {
          // No session anywhere, ensure clean state
          await clearAuthState(set);
        }
      }
    } catch (error) {
      console.warn('Hydration failed:', error);
      // On any error, ensure clean state
      await clearAuthState(set);
    }
  },
}));

export const useAuth = createSelectors(_useAuth);

export const signOut = () => _useAuth.getState().signOut();
export const signIn = (data: SignInData) => _useAuth.getState().signIn(data);
export const hydrateAuth = () => _useAuth.getState().hydrate();
