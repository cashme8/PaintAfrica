import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(undefined);

function getSupabaseSession() {
  if (!supabase || typeof supabase.auth?.getSession !== "function") {
    return Promise.resolve({ data: { session: null } });
  }

  return supabase.auth.getSession();
}

/**
 * Wraps Supabase auth session state and exposes it to the app.
 * `profile.role` (customer | business | designer | admin) drives
 * role-based UI and route protection — it comes from the `users`
 * table via `user_metadata.role` set at sign-up.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getSupabaseSession().then(({ data }) => {
      if (isMounted) {
        setSession(data.session);
        setLoading(false);
      }
    });

    if (!supabase || typeof supabase.auth?.onAuthStateChange !== "function") {
      if (isMounted) setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMounted) {
        setSession(newSession);
      }
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const user = session?.user ?? null;
  const role = user?.user_metadata?.role ?? null;

  async function register({ email, password, fullName, role }) {
    if (!supabase || typeof supabase.auth?.signUp !== "function") {
      throw new Error("Authentication is not configured yet.");
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });
    if (error) throw error;
    return data;
  }

  async function login({ email, password }) {
    if (!supabase || typeof supabase.auth?.signInWithPassword !== "function") {
      throw new Error("Authentication is not configured yet.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function logout() {
    if (!supabase || typeof supabase.auth?.signOut !== "function") {
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  const value = {
    session,
    user,
    role,
    loading,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
