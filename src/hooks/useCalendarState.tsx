import { useState, useEffect } from 'react';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import { Outfit, ClothingItem } from '@/lib/types';
import { startOfMonth, endOfMonth, isSameDay, format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
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
  
  // Load outfit logs from localStorage or Supabase on component mount
  useEffect(() => {
    loadOutfitLogs();
  }, [user]);
  
  // Load outfit logs for the current month whenever the month changes
  useEffect(() => {
    if (currentMonth) {
      loadOutfitLogsForMonth(currentMonth);
    }
  }, [currentMonth]);
  
  const loadOutfitLogs = async () => {
    setIsLoading(true);
    
    try {
      // For logged in users, fetch from Supabase
      if (user) {
        const { data, error } = await supabase
          .from('outfit_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
          
        if (!error && data) {
          // Convert string dates to Date objects
          const formattedLogs = data.map(log => ({
            ...log,
            date: new Date(log.date)
          })) as OutfitLog[];
          
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
  
  const loadOutfitLogsForMonth = async (month: Date) => {
    if (!user) return;
    
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('outfit_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', monthStart.toISOString())
        .lte('date', monthEnd.toISOString());
        
      if (!error && data) {
        // Process the data and merge with existing logs
        const newLogs = data.map(log => ({
          ...log,
          date: new Date(log.date)
        })) as OutfitLog[];
        
        // Update only the logs for this month, keep other months intact
        setOutfitLogs(prev => {
          const filteredPrev = prev.filter(log => {
            return log.date < monthStart || log.date > monthEnd;
          });
          return [...filteredPrev, ...newLogs];
        });
      }
    } catch (error) {
      console.error('Failed to load outfit logs for month:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add a new outfit log
  const addOutfitLog = async (log: Omit<OutfitLog, 'id'>) => {
    try {
      if (user) {
        // Add to Supabase
        const { data, error } = await supabase
          .from('outfit_logs')
          .insert({
            user_id: user.id,
            outfit_id: log.outfitId,
            date: log.date.toISOString(),
            time_of_day: log.timeOfDay,
            notes: log.notes || null,
            weather_condition: log.weatherCondition || null,
            temperature: log.temperature || null
          })
          .select()
          .single();
          
        if (error) {
          console.error('Error adding outfit log:', error);
          toast.error('Failed to save outfit log');
          return null;
        }
        
        // Format the log with a Date object
        const newLog: OutfitLog = {
          id: data.id,
          outfitId: data.outfit_id,
          date: new Date(data.date),
          timeOfDay: data.time_of_day,
          notes: data.notes,
          weatherCondition: data.weather_condition,
          temperature: data.temperature
        };
        
        // Add to state
        setOutfitLogs(prev => [...prev, newLog]);
        toast.success(`Outfit logged for ${format(log.date, 'MMMM d, yyyy')}`);
        return newLog;
      } else {
        // For non-logged in users, save to localStorage
        const newLog: OutfitLog = {
          id: Date.now().toString(),
          ...log
        };
        
        const updatedLogs = [...outfitLogs, newLog];
        setOutfitLogs(updatedLogs);
        localStorage.setItem('outfitLogs', JSON.stringify(updatedLogs));
        
        toast.success(`Outfit logged for ${format(log.date, 'MMMM d, yyyy')}`);
        return newLog;
      }
    } catch (error) {
      console.error('Failed to add outfit log:', error);
      toast.error('Failed to save outfit log');
      return null;
    }
  };
  
  // Delete an outfit log
  const deleteOutfitLog = async (id: string) => {
    try {
      if (user) {
        // Delete from Supabase
        const { error } = await supabase
          .from('outfit_logs')
          .delete()
          .eq('id', id);
          
        if (error) {
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
        localStorage.setItem('outfitLogs', JSON.stringify(updatedLogs));
      }
      
      toast.success('Outfit log deleted');
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
      outfit.seasons.includes(currentSeason) ||
      outfit.seasons.includes('all')
    );
    
    // From the seasonal outfits, prioritize those that are rarely worn
    return getRarelyWornOutfits(seasonalOutfits).slice(0, 5);
  };
  
  // Handle opening the log dialog
  const handleOpenLogDialog = (date?: Date) => {
    setSelectedDate(date || selectedDate);
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
    addOutfitLog,
    deleteOutfitLog,
    getLogsForDay,
    getRarelyWornOutfits,
    getFrequentlyWornOutfits,
    getSeasonalSuggestions
  };
}
