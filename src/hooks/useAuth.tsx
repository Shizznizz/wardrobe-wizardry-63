
import { useState, useEffect, createContext, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isPremiumUser: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
        
        // Handle premium status - Daniel should be treated as normal user
        // All other authenticated users get premium features
        if (session?.user) {
          const isDanielDeurloo = session.user.email === 'danieldeurloo@hotmail.com';
          setIsPremiumUser(!isDanielDeurloo);
        } else {
          setIsPremiumUser(false);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Session exists" : "No session");
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      
      // Set premium status based on email for existing session
      if (session?.user) {
        const isDanielDeurloo = session.user.email === 'danieldeurloo@hotmail.com';
        setIsPremiumUser(!isDanielDeurloo);
      }
      
      setLoading(false);
    }).catch(error => {
      console.error("Error getting session:", error);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
      throw error; // Rethrow to handle in the component
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signOut, 
      isAuthenticated,
      isPremiumUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
