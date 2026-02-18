import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  designation: string | null;
  avatar_url: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    // Set a timeout fallback to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.warn('[AuthProvider] Session check timed out, setting loading to false');
        setLoading(false);
      }
    }, 5000);

    // Listen for auth changes - this is the primary mechanism
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch to avoid blocking
          setTimeout(() => {
            if (mounted) fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Also check initial session (but don't rely solely on this)
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error('[AuthProvider] getSession error:', error);
        setLoading(false);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    }).catch((err) => {
      console.error('[AuthProvider] getSession exception:', err);
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      }) as any;

      if (error) return { error };

      const signedUpUser = (data as any)?.user;

      if (signedUpUser && signedUpUser.id) {
        // Create a profile row with approved=false by default
        try {
          const { error: insertErr } = await supabase
            .from('profiles')
            .insert({ user_id: signedUpUser.id, full_name: fullName, created_at: new Date().toISOString(), approved: false } as any);

          if (insertErr) {
            console.warn('Failed to create profile row:', insertErr);
          }
        } catch (e) {
          console.warn('Profile creation exception:', e);
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      const signedInUser = (data as any)?.user;

      if (signedInUser && signedInUser.id) {
        // Fetch profile and check approval flag. Use `any` casts because the generated types
        // may not include the `approved` column until DB is migrated.
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', signedInUser.id)
            .maybeSingle() as any;

          if (profileError) {
            // Can't verify approval; return sign-in success but warn caller via error
            return { error: profileError };
          }

          const approved = (profileData as any)?.approved;

          if (approved === false || approved === 0) {
            // Immediately sign out the newly authenticated user and return an error
            await supabase.auth.signOut();
            return { error: new Error('Account not approved by admin') };
          }
        } catch (inner) {
          // If profile check fails, sign out and return an error to be safe
          await supabase.auth.signOut();
          return { error: inner as Error };
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut }}>
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
