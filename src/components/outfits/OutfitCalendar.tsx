
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Outfit, ClothingItem, TimeOfDay } from '@/lib/types';
import { OutfitLog } from '@/lib/types';
import { useCalendarState } from '@/hooks/useCalendarState';
import CalendarTabs from './calendar/CalendarTabs';
import ViewToggle from './calendar/ViewToggle';
import MonthView from './calendar/MonthView';
import WeekViewContainer from './calendar/WeekViewContainer';
import OutfitLogForm from './calendar/OutfitLogForm';
import OutfitStatsTab from './calendar/OutfitStatsTab';
import DayDetailView from './calendar/DayDetailView';
import DailyView from './calendar/DailyView';

interface OutfitCalendarProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
  onAddLog?: (log: Omit<OutfitLog, 'id'>) => void;
  location?: { city: string; country: string };
}

const OutfitLogSchema = z.object({
  outfitId: z.string({
    required_error: "Please select an outfit",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  timeOfDay: z.string({
    required_error: "Please select a time of day",
  }),
  notes: z.string().optional(),
  weatherCondition: z.string().optional(),
  temperature: z.string().optional(),
});

const OutfitCalendar = ({ outfits, clothingItems, onAddLog, location }: OutfitCalendarProps) => {
  const isMobile = useIsMobile();
  const [selectedTab, setSelectedTab] = useState('calendar');
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>(
    'month'  // Default to month view for all devices
  );
  const { isAuthenticated, user } = useAuth();
  
  const {
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
  } = useCalendarState(outfits, clothingItems);

  const form = useForm<z.infer<typeof OutfitLogSchema>>({
    resolver: zodResolver(OutfitLogSchema),
    defaultValues: {
      date: selectedDate,
      notes: "",
    },
  });

  // Reset the form when the dialog is opened or closed
  useEffect(() => {
    if (isLogDialogOpen) {
      form.reset({
        date: selectedDate,
        outfitId: selectedLog?.outfitId || '',
        timeOfDay: selectedLog?.timeOfDay || 'all-day',
        notes: selectedLog?.notes || '',
        weatherCondition: selectedLog?.weatherCondition || '',
        temperature: selectedLog?.temperature || '',
      });
    }
  }, [isLogDialogOpen, selectedDate, selectedLog, form]);

  const onSubmitLog = async (values: Omit<OutfitLog, 'id'>) => {
    if (!values.outfitId) {
      toast.error("Please select an outfit");
      return;
    }
    
    let result;
    try {
      if (selectedLog) {
        result = await updateOutfitLog(selectedLog.id, values);
        if (result && onAddLog) {
          onAddLog({...values, id: selectedLog.id} as any);
        }
        toast.success("Outfit log updated successfully");
      } else {
        result = await addOutfitLog(values);
        if (result && onAddLog) {
          onAddLog(values);
        }
        toast.success("Outfit log added successfully");
      }
      handleCloseLogDialog();
    } catch (error) {
      console.error("Error saving outfit log", error);
      toast.error("Failed to save outfit log. Please try again.");
    }
  };

  const outfitLogsOnDate = outfitLogs.filter(
    log => log.date && selectedDate && format(new Date(log.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const rarelyWornOutfits = getRarelyWornOutfits(outfits);
  const frequentlyWornOutfits = getFrequentlyWornOutfits(outfits);

  const getOutfitById = (id: string) => {
    return outfits.find(outfit => outfit.id === id);
  };

  const handleSelectOutfit = (outfitId: string) => {
    handleOpenLogDialog(selectedDate);
    form.setValue('outfitId', outfitId);
  };

  const handleAddOutfit = async (outfitId: string) => {
    if (!selectedDate) return;
    
    const newLog = {
      outfitId,
      date: selectedDate,
      timeOfDay: 'all-day' as TimeOfDay,
      user_id: user?.id || ''
    };
    
    try {
      await addOutfitLog(newLog);
      if (onAddLog) {
        onAddLog(newLog);
      }
      toast.success(`Outfit added for ${format(selectedDate, 'MMMM d')}`);
    } catch (error) {
      console.error("Error adding outfit", error);
      toast.error("Failed to add outfit. Please try again.");
    }
  };

  const handleAddActivity = async (activity: string) => {
    if (!selectedDate || !activity.trim()) return;
    
    const newLog = {
      outfitId: 'activity',
      date: selectedDate,
      timeOfDay: 'all-day' as TimeOfDay,
      customActivity: activity,
      user_id: user?.id || ''
    };
    
    try {
      await addOutfitLog(newLog);
      if (onAddLog) {
        onAddLog(newLog);
      }
      toast.success(`Activity added for ${format(selectedDate, 'MMMM d')}`);
    } catch (error) {
      console.error("Error adding activity", error);
      toast.error("Failed to add activity. Please try again.");
    }
  };

  const renderCalendarView = () => {
    return (
      <div className="space-y-6">
        <ViewToggle 
          view={calendarView} 
          onViewChange={(value) => setCalendarView(value)} 
        />
        
        <AnimatePresence mode="wait">
          {calendarView === 'month' ? (
            <>
              <MonthView
                currentDate={currentMonth}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                outfits={outfits}
                outfitLogs={outfitLogs}
                getOutfitById={getOutfitById}
                handleViewLog={handleViewLog}
                handleOpenLogDialog={handleOpenLogDialog}
                handleDeleteLog={deleteOutfitLog}
                isMobile={isMobile}
              />
              
              {selectedDate && (
                <DayDetailView
                  selectedDate={selectedDate}
                  outfits={outfits}
                  outfitLogs={outfitLogsOnDate}
                  onAddOutfit={handleAddOutfit}
                  onAddActivity={handleAddActivity}
                  weatherLocation={location}
                  onDeleteLog={deleteOutfitLog}
                />
              )}
            </>
          ) : calendarView === 'week' ? (
            <WeekViewContainer
              currentDate={currentMonth}
              selectedDate={selectedDate}
              outfits={outfits}
              clothingItems={clothingItems}
              outfitLogs={outfitLogs}
              onDateClick={setSelectedDate}
              onLogDelete={deleteOutfitLog}
              setSelectedDate={setSelectedDate}
              onAddOutfit={handleAddOutfit}
              onAddActivity={handleAddActivity}
              weatherLocation={location}
            />
          ) : (
            <DailyView
              currentDate={currentMonth}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              outfits={outfits}
              clothingItems={clothingItems}
              outfitLogs={outfitLogs}
              onLogDelete={deleteOutfitLog}
              onAddOutfit={handleAddOutfit}
              onAddActivity={handleAddActivity}
              weatherLocation={location}
            />
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 relative"
    >
      <div className="mb-8">
        <CalendarTabs
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          calendarContent={renderCalendarView()}
          statsContent={
            <OutfitStatsTab 
              outfits={outfits}
              outfitLogs={outfitLogs}
              clothingItems={clothingItems}
              handleOpenLogDialog={handleOpenLogDialog}
              selectedDate={selectedDate}
              form={form}
            />
          }
        />
      </div>

      <OutfitLogForm
        isOpen={isLogDialogOpen}
        onClose={handleCloseLogDialog}
        outfits={outfits}
        selectedDate={selectedDate}
        onSubmit={onSubmitLog}
        editMode={!!selectedLog}
        initialData={selectedLog}
      />
    </motion.section>
  );
};

export default OutfitCalendar;
