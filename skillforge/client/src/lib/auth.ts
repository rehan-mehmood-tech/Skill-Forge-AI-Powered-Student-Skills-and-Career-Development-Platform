import { supabase } from './supabaseClient';

export const signInWithGoogle = () => {
  return supabase.auth.signInWithOAuth({ provider: 'google' });
};

export const signInWithPassword = (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signUpWithPassword = (email: string, password: string, fullName: string) => {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });
};

export const signOut = () => {
  return supabase.auth.signOut();
};

export const getAuthToken = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return null;
  return data.session.access_token;
};
