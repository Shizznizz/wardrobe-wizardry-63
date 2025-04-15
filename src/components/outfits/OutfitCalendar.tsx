
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Outfit, ClothingItem } from '@/lib/types';
import { OutfitLog } from './OutfitLogItem';
import { useCalendarState } from '@/hooks/useCalendarState';

// Import refactored components
import CalendarTabs from './calendar/CalendarTabs';
import ViewToggle from './calendar/ViewToggle';
import MonthView from './calendar/MonthView';
import WeekViewContainer from './calendar/WeekViewContainer';
import OutfitLogForm from './calendar/OutfitLogForm';
import OutfitStatsTab from './calendar/OutfitStatsTab';
import OliviaAssistantSection from './OliviaAssistantSection';
import DayDetailView from './calendar/DayDetailView';

interface OutfitCalendarProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
  onAddLog?: (log: Omit<OutfitLog, 'id'>) => void;
  location?: { city: string; country: string };
}

// Remove the LocationType import as it's not defined in EnhancedLocationSelector

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
  const [selectedTab, setSelectedTab] = useState('calendar');
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month');
  const isMobile = useIsMobile();
  const { isAuthenticated } = useAuth();
  
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

  useEffect(() => {
    if (isMobile) {
      setCalendarView('week');
    }
  }, [isMobile]);

  const onSubmitLog = async (values: Omit<OutfitLog, 'id'>) => {
    if (!values.outfitId) {
      toast.error("Please select an outfit");
      return;
    }
    
    let result;
    if (selectedLog) {
      // Update existing log
      result = await updateOutfitLog(selectedLog.id, values);
      if (result && onAddLog) {
        onAddLog({...values, id: selectedLog.id} as any);
      }
    } else {
      // Create new log
      result = await addOutfitLog(values);
      if (result && onAddLog) {
        onAddLog(values);
      }
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
      timeOfDay: 'all-day',
    };
    
    await addOutfitLog(newLog);
    if (onAddLog) {
      onAddLog(newLog);
    }
  };

  const handleAddActivity = async (activity: string) => {
    if (!selectedDate) return;
    
    const newLog = {
      outfitId: 'activity',
      date: selectedDate,
      timeOfDay: 'all-day',
      customActivity: activity,
    };
    
    await addOutfitLog(newLog);
    if (onAddLog) {
      onAddLog(newLog);
    }
  };

  const renderCalendarView = () => {
    return (
      <div className="space-y-6">
        <ViewToggle view={calendarView} onViewChange={(value) => setCalendarView(value)} />
        
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
                />
              )}
            </>
          ) : (
            <WeekViewContainer
              currentDate={currentMonth}
              selectedDate={selectedDate}
              outfits={outfits}
              clothingItems={clothingItems}
              outfitLogs={outfitLogs}
              onDateClick={setSelectedDate}
              onLogDelete={deleteOutfitLog}
              setSelectedDate={setSelectedDate}
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
      
      <OliviaAssistantSection onChatClick={() => console.log("Chat with Olivia clicked")} />
    </motion.section>
  );
};

export default OutfitCalendar;
