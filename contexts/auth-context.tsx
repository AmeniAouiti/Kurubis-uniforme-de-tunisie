"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type UserRole = "admin" | "user";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; role?: UserRole }>;
  signup: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  showPasswordAlert: boolean;
  dismissPasswordAlert: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchProfile(supabaseUser: SupabaseUser): Promise<User | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", supabaseUser.id)
    .single();

  if (!data) {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      firstName: supabaseUser.user_metadata?.first_name || "",
      lastName: supabaseUser.user_metadata?.last_name || "",
      role: "user",
    };
  }

  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name || "",
    lastName: data.last_name || "",
    company: data.company || undefined,
    role: data.role as UserRole,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);
  const supabase = createClient();

  const refreshProfile = useCallback(async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    if (authUser) {
      const profile = await fetchProfile(authUser);
      setUser(profile);
    } else {
      setUser(null);
    }
  }, [supabase]);

  useEffect(() => {
    refreshProfile().finally(() => setLoading(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase, refreshProfile]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { ok: false, error: error.message };

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) return { ok: false, error: "Session introuvable" };

      const profile = await fetchProfile(authUser);
      setUser(profile);

      await supabase
        .from("profiles")
        .update({ last_login_at: new Date().toISOString() })
        .eq("id", authUser.id);

      return { ok: true, role: profile?.role };
    },
    [supabase]
  );

  const signup = useCallback(
    async (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
    }) => {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
          },
        },
      });
      if (error) return { ok: false, error: error.message };
      setShowPasswordAlert(true);
      return { ok: true };
    },
    [supabase]
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowPasswordAlert(false);
  }, [supabase]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        loading,
        login,
        signup,
        logout,
        refreshProfile,
        showPasswordAlert,
        dismissPasswordAlert: () => setShowPasswordAlert(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
