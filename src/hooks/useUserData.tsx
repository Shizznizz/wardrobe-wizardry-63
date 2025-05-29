
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { userDataService, UserProfile, Activity, QuizResult } from '@/services/UserDataService';
import { toast } from 'sonner';

interface UserDataContextType {
  profile: UserProfile | null;
  activities: Activity[];
  quizResults: QuizResult[];
  completedQuizTypes: string[];
  isLoading: boolean;
  refreshUserData: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  saveActivity: (activity: Omit<Activity, 'user_id'>) => Promise<boolean>;
  updateActivity: (activityId: string, updates: Partial<Activity>) => Promise<boolean>;
  deleteActivity: (activityId: string) => Promise<boolean>;
  saveQuizResult: (quizResult: Omit<QuizResult, 'user_id'>) => Promise<boolean>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [completedQuizTypes, setCompletedQuizTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshUserData = async () => {
    if (!user || !isAuthenticated) {
      setProfile(null);
      setActivities([]);
      setQuizResults([]);
      setCompletedQuizTypes([]);
      return;
    }

    setIsLoading(true);
    try {
      const userData = await userDataService.hydrateUserData(user.id);
      
      setProfile(userData.profile);
      setActivities(userData.activities);
      setQuizResults(userData.quizResults);
      setCompletedQuizTypes(userData.completedQuizTypes);
    } catch (error) {
      console.error('Error refreshing user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;

    const result = await userDataService.updateUserProfile(user.id, updates);
    if (result.success) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return true;
    }
    return false;
  };

  const saveActivity = async (activity: Omit<Activity, 'user_id'>): Promise<boolean> => {
    if (!user) return false;

    const result = await userDataService.saveActivity({
      ...activity,
      user_id: user.id
    });

    if (result.success) {
      await refreshUserData();
      return true;
    }
    return false;
  };

  const updateActivity = async (activityId: string, updates: Partial<Activity>): Promise<boolean> => {
    const result = await userDataService.updateActivity(activityId, updates);
    if (result.success) {
      setActivities(prev => 
        prev.map(activity => 
          activity.id === activityId 
            ? { ...activity, ...updates }
            : activity
        )
      );
      return true;
    }
    return false;
  };

  const deleteActivity = async (activityId: string): Promise<boolean> => {
    const result = await userDataService.deleteActivity(activityId);
    if (result.success) {
      setActivities(prev => prev.filter(activity => activity.id !== activityId));
      return true;
    }
    return false;
  };

  const saveQuizResult = async (quizResult: Omit<QuizResult, 'user_id'>): Promise<boolean> => {
    if (!user) return false;

    const result = await userDataService.saveQuizResult({
      ...quizResult,
      user_id: user.id
    });

    if (result.success) {
      await refreshUserData();
      return true;
    }
    return false;
  };

  // Load user data when authentication state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshUserData();
    } else {
      setProfile(null);
      setActivities([]);
      setQuizResults([]);
      setCompletedQuizTypes([]);
    }
  }, [isAuthenticated, user]);

  const contextValue: UserDataContextType = {
    profile,
    activities,
    quizResults,
    completedQuizTypes,
    isLoading,
    refreshUserData,
    updateProfile,
    saveActivity,
    updateActivity,
    deleteActivity,
    saveQuizResult
  };

  return (
    <UserDataContext.Provider value={contextValue}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
