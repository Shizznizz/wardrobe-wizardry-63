
import { useState, useEffect } from 'react';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import { Outfit, ClothingItem } from '@/lib/types';
import { startOfMonth, endOfMonth, isSameDay, format } from 'date-fns';
import { supabase, getOutfitLogs, saveOutfitLog as saveSBOutfitLog, updateOutfitLog as updateSBOutfitLog, deleteOutfitLog as deleteSBOutfitLog } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function useCalendarState(initialOutfits: Outfit[], initialClothingItems: ClothingItem[]) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [outfitLogs, setOutfitLogs] = useState<OutfitLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<OutfitLog | null>(null);
  const { user } = useAuth();
  
  // Load outfit logs from Supabase on component mount
  useEffect(() => {
    loadOutfitLogs();
  }, [user]);
  
  const loadOutfitLogs = async () => {
    setIsLoading(true);
    
    try {
      // For logged-in users, fetch from Supabase
      if (user) {
        const { success, data, error } = await getOutfitLogs(user.id);
        
        if (success && data) {
          // Ensure all logs have a properly formatted date
          const formattedLogs = data.map((log: any) => ({
            ...log,
            date: new Date(log.date)
          }));
          setOutfitLogs(formattedLogs);
        } else if (error) {
          console.error('Error loading outfit logs:', error);
          // Fallback to localStorage
          loadFromLocalStorage();
        }
      } else {
        // For non-logged in users, use localStorage
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Failed to load outfit logs:', error);
      // Fallback to localStorage
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadFromLocalStorage = () => {
    try {
      const savedLogs = localStorage.getItem('outfitLogs');
      if (savedLogs) {
        const parsedLogs = JSON.parse(savedLogs);
        // Convert string dates back to Date objects
        const formattedLogs = parsedLogs.map((log: any) => ({
          ...log,
          date: new Date(log.date)
        }));
        setOutfitLogs(formattedLogs);
      }
    } catch (error) {
      console.error('Error loading outfit logs from localStorage:', error);
    }
  };
  
  // Add a new outfit log
  const addOutfitLog = async (log: Omit<OutfitLog, 'id'>) => {
    try {
      if (user) {
        // Add to Supabase
        const { success, data, error } = await saveSBOutfitLog(user.id, log);
        
        if (!success || error) {
          console.error('Error adding outfit log:', error);
          toast.error('Failed to save outfit log');
          return null;
        }
        
        if (data) {
          // Format the date if necessary
          const formattedData = {
            ...data,
            date: new Date(data.date)
          };
          
          // Add to state
          setOutfitLogs(prev => [...prev, formattedData]);
          toast.success(`Outfit logged for ${format(new Date(log.date), 'MMMM d, yyyy')}`);
          return formattedData;
        }
      } else {
        // For non-logged in users, save to localStorage
        const newLog: OutfitLog = {
          id: Date.now().toString(),
          ...log
        };
        
        const updatedLogs = [...outfitLogs, newLog];
        setOutfitLogs(updatedLogs);
        
        // Store the date as ISO string for localStorage
        const logsForStorage = updatedLogs.map(log => ({
          ...log,
          date: log.date instanceof Date ? log.date.toISOString() : log.date
        }));
        localStorage.setItem('outfitLogs', JSON.stringify(logsForStorage));
        
        toast.success(`Outfit logged for ${format(new Date(log.date), 'MMMM d, yyyy')}`);
        return newLog;
      }
    } catch (error) {
      console.error('Failed to add outfit log:', error);
      toast.error('Failed to save outfit log');
      return null;
    }
  };
  
  // Update an existing outfit log
  const updateOutfitLog = async (id: string, updates: Partial<OutfitLog>) => {
    try {
      if (user) {
        // Update in Supabase
        const { success, data, error } = await updateSBOutfitLog(user.id, id, updates);
        
        if (!success || error) {
          console.error('Error updating outfit log:', error);
          toast.error('Failed to update outfit log');
          return false;
        }
        
        if (data) {
          // Format the date if necessary
          const formattedData = {
            ...data,
            date: new Date(data.date)
          };
          
          // Update in state
          setOutfitLogs(prev => prev.map(log => log.id === id ? formattedData : log));
          toast.success('Outfit log updated successfully');
          return true;
        }
      } else {
        // For non-logged in users, update in localStorage
        const updatedLogs = outfitLogs.map(log => {
          if (log.id === id) {
            return { ...log, ...updates };
          }
          return log;
        });
        
        setOutfitLogs(updatedLogs);
        
        // Store the date as ISO string for localStorage
        const logsForStorage = updatedLogs.map(log => ({
          ...log,
          date: log.date instanceof Date ? log.date.toISOString() : log.date
        }));
        localStorage.setItem('outfitLogs', JSON.stringify(logsForStorage));
        
        toast.success('Outfit log updated successfully');
        return true;
      }
    } catch (error) {
      console.error('Failed to update outfit log:', error);
      toast.error('Failed to update outfit log');
      return false;
    }
  };
  
  // Delete an outfit log
  const deleteOutfitLog = async (id: string) => {
    try {
      if (user) {
        // Delete from Supabase
        const { success, error } = await deleteSBOutfitLog(user.id, id);
        
        if (!success || error) {
          console.error('Error deleting outfit log:', error);
          toast.error('Failed to delete outfit log');
          return false;
        }
      }
      
      // Update state
      setOutfitLogs(prev => prev.filter(log => log.id !== id));
      
      // Update localStorage for non-logged in users
      if (!user) {
        const updatedLogs = outfitLogs.filter(log => log.id !== id);
        
        // Store the date as ISO string for localStorage
        const logsForStorage = updatedLogs.map(log => ({
          ...log,
          date: log.date instanceof Date ? log.date.toISOString() : log.date
        }));
        localStorage.setItem('outfitLogs', JSON.stringify(logsForStorage));
      }
      
      toast.success('Outfit log deleted successfully');
      return true;
    } catch (error) {
      console.error('Failed to delete outfit log:', error);
      toast.error('Failed to delete outfit log');
      return false;
    }
  };
  
  // Get outfit logs for a specific date
  const getLogsForDay = (day: Date) => {
    return outfitLogs.filter(log => 
      log.date && isSameDay(new Date(log.date), day)
    );
  };
  
  // Handle opening the log dialog
  const handleOpenLogDialog = (date?: Date) => {
    setSelectedDate(date || selectedDate);
    setSelectedLog(null); // Reset selected log when opening dialog for a new entry
    setIsLogDialogOpen(true);
  };
  
  // Handle closing the log dialog
  const handleCloseLogDialog = () => {
    setIsLogDialogOpen(false);
    setSelectedLog(null);
  };
  
  // Handle viewing a log
  const handleViewLog = (log: OutfitLog) => {
    setSelectedLog(log);
  };
  
  // Handle editing a log
  const handleEditLog = (log: OutfitLog) => {
    setSelectedLog(log);
    setIsLogDialogOpen(true);
  };
  
  // Get rarely worn outfits (not worn in the past 30 days)
  const getRarelyWornOutfits = (outfits: Outfit[]) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return outfits.filter(outfit => {
      const logs = outfitLogs.filter(log => log.outfitId === outfit.id);
      
      if (logs.length === 0) return true;
      
      const lastWornLog = logs.reduce((latest, current) => 
        new Date(latest.date) > new Date(current.date) ? latest : current
      );
      
      return new Date(lastWornLog.date) < thirtyDaysAgo;
    });
  };
  
  // Get frequently worn outfits (worn 5+ times)
  const getFrequentlyWornOutfits = (outfits: Outfit[]) => {
    return outfits.filter(outfit => {
      const logs = outfitLogs.filter(log => log.outfitId === outfit.id);
      return logs.length >= 5;
    }).map(outfit => ({
      ...outfit,
      timesWorn: outfitLogs.filter(log => log.outfitId === outfit.id).length
    }));
  };
  
  // Get seasonal outfit suggestions based on location, date, and past logs
  const getSeasonalSuggestions = (outfits: Outfit[], clothingItems: ClothingItem[]) => {
    const currentDate = new Date();
    const month = currentDate.getMonth();
    
    // Determine current season (roughly)
    let currentSeason: 'winter' | 'spring' | 'summer' | 'autumn';
    
    if (month >= 2 && month <= 4) {
      currentSeason = 'spring';
    } else if (month >= 5 && month <= 7) {
      currentSeason = 'summer';
    } else if (month >= 8 && month <= 10) {
      currentSeason = 'autumn';
    } else {
      currentSeason = 'winter';
    }
    
    // Find outfits appropriate for the current season
    const seasonalOutfits = outfits.filter(outfit => 
      outfit.seasons && (outfit.seasons.includes(currentSeason) ||
      outfit.seasons.includes('all'))
    );
    
    // From the seasonal outfits, prioritize those that are rarely worn
    return getRarelyWornOutfits(seasonalOutfits).slice(0, 5);
  };
  
  return {
    selectedDate,
    setSelectedDate,
    currentMonth,
    setCurrentMonth,
    isLogDialogOpen,
    outfitLogs,
    isLoading,
    selectedLog,
    handleOpenLogDialog,
    handleCloseLogDialog,
    handleViewLog,
    handleEditLog,
    addOutfitLog,
    updateOutfitLog,
    deleteOutfitLog,
    getLogsForDay,
    getRarelyWornOutfits,
    getFrequentlyWornOutfits,
    getSeasonalSuggestions
  };
}
