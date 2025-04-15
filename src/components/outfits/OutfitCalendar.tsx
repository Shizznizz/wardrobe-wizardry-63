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

interface OutfitCalendarProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
  onAddLog?: (log: Omit<OutfitLog, 'id'>) => void;
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

const OutfitCalendar = ({ outfits, clothingItems, onAddLog }: OutfitCalendarProps) => {
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
      result = await updateOutfitLog(selectedLog.id, values);
      if (result && onAddLog) {
        onAddLog({...values, id: selectedLog.id} as any);
      }
    } else {
      result = await addOutfitLog(values);
      if (result && onAddLog) {
        onAddLog(values);
      }
    }
  };

  const renderCalendarView = () => {
    return (
      <>
        <ViewToggle view={calendarView} onViewChange={(value) => setCalendarView(value)} />
        
        <AnimatePresence mode="wait">
          {calendarView === 'month' ? (
            <MonthView
              currentDate={currentMonth}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              outfits={outfits}
              outfitLogs={outfitLogs}
              outfitLogsOnDate={outfitLogs.filter(log => 
                log.date && selectedDate && 
                format(new Date(log.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
              )}
              rarelyWornOutfits={getRarelyWornOutfits(outfits)}
              frequentlyWornOutfits={getFrequentlyWornOutfits(outfits)}
              getOutfitById={outfit => outfits.find(o => o.id === outfit.id)}
              handleViewLog={handleViewLog}
              handleOpenLogDialog={handleOpenLogDialog}
              handleDeleteLog={deleteOutfitLog}
              handleSelectOutfit={outfitId => {
                handleOpenLogDialog(selectedDate);
                form.setValue('outfitId', outfitId);
              }}
              getSeasonalSuggestions={getSeasonalSuggestions}
              clothingItems={clothingItems}
              isMobile={isMobile}
            />
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
      </>
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
