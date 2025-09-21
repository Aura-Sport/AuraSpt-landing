import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

type AppUser = {
  id: string;
  email: string | null;
  name: string | null;
  role: 'user' | 'trainer' | null;
  avatar?: string | null;
} | null;

type TrainerProfile = {
  user_id: string;
  gym_name: string | null;
  certificate_url?: string | null;
  experience_years?: number | null;
  specialties?: string[] | null;
  biography?: string | null;
  social_links?: Record<string, unknown> | null;
} | null;

type AuthContextValue = {
  user: AppUser;
  trainer: TrainerProfile;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerTrainer: (args: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    gymName?: string;
    experienceYears?: number;
    specialties?: string[];
    biography?: string;
    socialLinks?: Record<string, unknown>;
    certificateUrl?: string;
  }) => Promise<{ needsVerification: boolean; userId?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser>(null);
  const [trainer, setTrainer] = useState<TrainerProfile>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadSessionAndProfile = async () => {
    setLoading(true);
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (session?.user) {
      const u = session.user;
      const appUser: AppUser = {
        id: u.id,
        email: u.email ?? null,
        name: (u.user_metadata?.name as string | null) ?? null,
        role: (u.user_metadata?.role as 'user' | 'trainer' | null) ?? null,
      };
      setUser(appUser);
      // Cargar fila en public.users y perfil de trainer
      const { data: userRow } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, role, avatar')
        .eq('id', u.id)
        .maybeSingle();

      if (userRow) {
        setUser({
          id: userRow.id,
          email: userRow.email ?? appUser.email,
          name: (userRow.first_name && userRow.last_name) ? `${userRow.first_name} ${userRow.last_name}` : appUser.name,
          role: userRow.role as 'user' | 'trainer' | null,
          avatar: (userRow as any).avatar ?? null,
        });
      }

      const { data: trainerRow } = await supabase
        .from('trainers')
        .select('*')
        .eq('user_id', u.id)
        .maybeSingle();
      setTrainer(trainerRow ?? null);
    } else {
      setUser(null);
      setTrainer(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSessionAndProfile();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      loadSessionAndProfile();
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      throw error;
    }
    await loadSessionAndProfile();
  };

  const registerTrainer: AuthContextValue['registerTrainer'] = async ({ email, password, firstName, lastName, gymName, experienceYears, specialties, biography, socialLinks, certificateUrl }) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role: 'trainer', first_name: firstName, last_name: lastName },
      },
    });
    if (error) {
      setLoading(false);
      throw error;
    }
    if (!data.session || !data.user) {
      // Verificación por email activada
      setLoading(false);
      return { needsVerification: true };
    }
    const userId = data.user.id;
    // Crear/actualizar fila en public.users con role trainer
    await supabase.from('users').upsert({
      id: userId,
      email,
      first_name: firstName ?? null,
      last_name: lastName ?? null,
      role: 'trainer',
    });
    // Crear perfil de trainer
    await supabase.from('trainers').upsert({
      user_id: userId,
      gym_name: gymName ?? null,
      experience_years: experienceYears ?? null,
      specialties: specialties ?? null,
      biography: biography ?? null,
      social_links: socialLinks ?? null,
      certificate_url: certificateUrl ?? null,
    });
    await loadSessionAndProfile();
    return { needsVerification: false, userId };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTrainer(null);
  };

  const value: AuthContextValue = { user, trainer, loading, login, registerTrainer, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};


