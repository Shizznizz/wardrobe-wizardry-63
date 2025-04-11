
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import SummonOliviaButton from './SummonOliviaButton';
import AIStylistChat from '@/components/shop-try/AIStylistChat';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar as CalendarIcon, CalendarDays } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [showOliviaChat, setShowOliviaChat] = useState(false);
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

  // Set default view to week on mobile devices
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

  const handleToggleOliviaChat = () => {
    setShowOliviaChat(!showOliviaChat);
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
            
            <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-3 gap-6'}`}>
              {/* Grid area 1: Only show date selector and outfit logs list in month view or on desktop */}
              {(!isMobile || calendarView === 'month') && (
                <>
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
                </>
              )}
              
              {/* Only show recommendations in month view or on desktop */}
              {(!isMobile || calendarView === 'month') && (
                <WardrobeRecommendations
                  rarelyWornOutfits={rarelyWornOutfits}
                  frequentlyWornOutfits={frequentlyWornOutfits}
                  handleSelectOutfit={handleSelectOutfit}
                  seasonalSuggestions={getSeasonalSuggestions(outfits, clothingItems)}
                />
              )}
              
              {/* Week view is always full width and takes priority on mobile */}
              {calendarView === 'week' && (
                <WeekView
                  currentDate={selectedDate || new Date()}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  getLogsForDay={getLogsForDay}
                  getOutfitById={getOutfitById}
                  handleOpenLogDialog={handleOpenLogDialog}
                />
              )}
              
              {/* Removed the duplicate MonthlyCalendarView */}
            </div>
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
      
      <div className="fixed bottom-6 left-6 z-40 flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mr-4 hidden md:block"
        >
          <img 
            src="/lovable-uploads/e29a1d16-e806-4664-a744-c1f7b25262ed.png" 
            alt="Olivia" 
            className="w-14 h-14 rounded-full object-cover border-2 border-purple-500 shadow-lg"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-purple-500/30 shadow-lg max-w-xs"
        >
          <p className="text-sm text-white mb-2">Not sure what to wear? Don't panic – I'm here to help!</p>
          <button 
            onClick={handleToggleOliviaChat}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity"
          >
            Chat with Olivia
          </button>
        </motion.div>
      </div>
      
      {showOliviaChat && (
        <AIStylistChat
          isPremiumUser={true}
          onUpgradeToPremium={() => {}}
          onClose={() => setShowOliviaChat(false)}
        />
      )}
    </motion.section>
  );
};

// Add missing imports
import { Calendar as BarChart3 } from 'lucide-react';

export default OutfitCalendar;
