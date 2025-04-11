
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Outfit, ClothingItem } from '@/lib/types';
import OutfitLogItem, { OutfitLog } from './OutfitLogItem';
import DateSelector from './calendar/DateSelector';
import OutfitLogsList from './calendar/OutfitLogsList';
import WardrobeRecommendations from './calendar/WardrobeRecommendations';
import WeekView from './calendar/WeekView';
import OutfitLogForm from './calendar/OutfitLogForm';
import OutfitStatsTab from './calendar/OutfitStatsTab';
import { useCalendarState } from '@/hooks/useCalendarState';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar as CalendarIcon, CalendarDays, BarChart3 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import OliviaAssistantSection from './OliviaAssistantSection';
import DayDetailView from './calendar/DayDetailView';

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
    addOutfitLog,
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
    const newLog = await addOutfitLog(values);
    
    if (newLog && onAddLog) {
      onAddLog(values);
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

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 relative"
    >
      <div className="mb-8">
        <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full md:w-1/2 mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistics
            </TabsTrigger>
          </TabsList>
        
          <TabsContent value="calendar">
            <div className="flex justify-center mb-4">
              <ToggleGroup type="single" value={calendarView} onValueChange={(value) => value && setCalendarView(value as 'month' | 'week')}>
                <ToggleGroupItem value="month" aria-label="Month view" className="px-3 py-1">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Month
                </ToggleGroupItem>
                <ToggleGroupItem value="week" aria-label="Week view" className="px-3 py-1">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Week
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <AnimatePresence mode="wait">
              {calendarView === 'month' ? (
                <motion.div 
                  key="month-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-3 gap-6'}`}
                >
                  <DateSelector 
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    outfitLogs={outfitLogs}
                    currentMonth={currentMonth}
                    onMonthChange={setCurrentMonth}
                  />
                  
                  <OutfitLogsList 
                    selectedDate={selectedDate}
                    outfitLogsOnDate={outfitLogsOnDate}
                    getOutfitById={getOutfitById}
                    handleViewLog={handleViewLog}
                    handleOpenLogDialog={handleOpenLogDialog}
                    handleDeleteLog={deleteOutfitLog}
                  />
                  
                  <WardrobeRecommendations
                    rarelyWornOutfits={rarelyWornOutfits}
                    frequentlyWornOutfits={frequentlyWornOutfits}
                    handleSelectOutfit={handleSelectOutfit}
                    seasonalSuggestions={getSeasonalSuggestions(outfits, clothingItems)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="week-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 gap-4"
                >
                  <WeekView
                    currentDate={selectedDate || new Date()}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    getLogsForDay={getLogsForDay}
                    getOutfitById={getOutfitById}
                    handleOpenLogDialog={handleOpenLogDialog}
                  />
                  
                  {selectedDate && (
                    <DayDetailView
                      selectedDate={selectedDate}
                      outfitLogs={outfitLogsOnDate}
                      getOutfitById={getOutfitById}
                      handleOpenLogDialog={handleOpenLogDialog}
                    />
                  )}
                  
                  <WardrobeRecommendations
                    rarelyWornOutfits={rarelyWornOutfits}
                    frequentlyWornOutfits={frequentlyWornOutfits}
                    handleSelectOutfit={handleSelectOutfit}
                    seasonalSuggestions={getSeasonalSuggestions(outfits, clothingItems)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
          
          <TabsContent value="stats">
            <OutfitStatsTab 
              outfits={outfits}
              outfitLogs={outfitLogs}
              clothingItems={clothingItems}
              handleOpenLogDialog={handleOpenLogDialog}
              selectedDate={selectedDate}
              form={form}
            />
          </TabsContent>
        </Tabs>
      </div>

      <OutfitLogForm
        isOpen={isLogDialogOpen}
        onClose={handleCloseLogDialog}
        outfits={outfits}
        selectedDate={selectedDate}
        onSubmit={onSubmitLog}
      />
      
      <OliviaAssistantSection onChatClick={() => console.log("Chat with Olivia clicked")} />
    </motion.section>
  );
};

export default OutfitCalendar;
