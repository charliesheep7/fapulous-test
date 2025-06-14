import { supabase } from '@/lib/supabase';

import type { TokenType, UserType } from './utils';

export type SignInData = {
  email: string;
  password: string;
};

export type SignUpData = {
  email: string;
  password: string;
  name?: string;
};

export type AuthResponse = {
  success: boolean;
  data?: {
    token: TokenType;
    user: UserType;
  };
  error?: string;
};

// Sign in with email and password
export async function signInWithEmailPassword(
  data: SignInData
): Promise<AuthResponse> {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!authData.session || !authData.user) {
      return {
        success: false,
        error: 'No session or user data received',
      };
    }

    const token: TokenType = {
      access: authData.session.access_token,
      refresh: authData.session.refresh_token,
      expires_at: authData.session.expires_at,
    };

    const user: UserType = {
      id: authData.user.id,
      email: authData.user.email,
      name: authData.user.user_metadata?.name,
      avatar_url: authData.user.user_metadata?.avatar_url,
    };

    return {
      success: true,
      data: { token, user },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Sign up with email and password
export async function signUpWithEmailPassword(
  data: SignUpData
): Promise<AuthResponse> {
  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: data.name
        ? {
            data: {
              name: data.name,
            },
          }
        : undefined,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!authData.session || !authData.user) {
      return {
        success: false,
        error: 'Account created but no session. Please check your email.',
      };
    }

    const token: TokenType = {
      access: authData.session.access_token,
      refresh: authData.session.refresh_token,
      expires_at: authData.session.expires_at,
    };

    const user: UserType = {
      id: authData.user.id,
      email: authData.user.email,
      name: authData.user.user_metadata?.name,
      avatar_url: authData.user.user_metadata?.avatar_url,
    };

    return {
      success: true,
      data: { token, user },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Sign out
export async function signOutSupabase(): Promise<void> {
  await supabase.auth.signOut();
}

// Refresh token
export async function refreshToken(): Promise<AuthResponse> {
  try {
    const { data: authData, error } = await supabase.auth.refreshSession();

    if (error || !authData.session) {
      return {
        success: false,
        error: error?.message ?? 'Failed to refresh session',
      };
    }

    const token: TokenType = {
      access: authData.session.access_token,
      refresh: authData.session.refresh_token,
      expires_at: authData.session.expires_at,
    };

    const refreshUser = authData.user;
    if (!refreshUser) {
      return {
        success: false,
        error: 'No user data in refresh response',
      };
    }

    const user: UserType = {
      id: refreshUser.id,
      email: refreshUser.email,
      name: refreshUser.user_metadata?.name,
      avatar_url: refreshUser.user_metadata?.avatar_url,
    };

    return {
      success: true,
      data: { token, user },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Get current session
export async function getCurrentSession(): Promise<AuthResponse> {
  try {
    const { data: sessionData, error } = await supabase.auth.getSession();

    if (error || !sessionData.session) {
      return {
        success: false,
        error: error?.message ?? 'No active session',
      };
    }

    const token: TokenType = {
      access: sessionData.session.access_token,
      refresh: sessionData.session.refresh_token,
      expires_at: sessionData.session.expires_at,
    };

    const sessionUser = sessionData.session.user;
    if (!sessionUser) {
      return {
        success: false,
        error: 'No user data in session',
      };
    }

    const user: UserType = {
      id: sessionUser.id,
      email: sessionUser.email,
      name: sessionUser.user_metadata?.name,
      avatar_url: sessionUser.user_metadata?.avatar_url,
    };

    return {
      success: true,
      data: { token, user },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
