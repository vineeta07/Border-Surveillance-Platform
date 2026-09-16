import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase, isSupabaseConfigured, DEMO_USER } from "../lib/supabase";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  enterDemo: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name,
          role: "OPERATOR",
        });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata?.full_name,
          role: "OPERATOR",
        });
        setIsDemo(false);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) return { error: "Supabase not configured. Use Demo Mode." };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message };
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!isSupabaseConfigured) return { error: "Supabase not configured. Use Demo Mode." };
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    return { error: error?.message };
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) return { error: "Supabase not configured. Use Demo Mode." };
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    return { error: error?.message };
  };

  const signOut = async () => {
    if (isDemo) {
      setUser(null);
      setIsDemo(false);
      return;
    }
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured) return { error: "Supabase not configured." };
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error: error?.message };
  };

  const enterDemo = () => {
    setUser(DEMO_USER);
    setIsDemo(true);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, signIn, signUp, signInWithGoogle, signOut, resetPassword, enterDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
