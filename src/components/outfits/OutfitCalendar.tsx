
import { useState } from 'react';
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
import MonthlyCalendarView from './calendar/MonthlyCalendarView';
import OutfitLogForm from './calendar/OutfitLogForm';
import OutfitStatsTab from './calendar/OutfitStatsTab';
import { useCalendarState } from '@/hooks/useCalendarState';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

  const getDatesWithOutfits = () => {
    return outfitLogs
      .filter(log => {
        const logMonth = new Date(log.date).getMonth();
        const logYear = new Date(log.date).getFullYear();
        return logMonth === currentMonth.getMonth() && logYear === currentMonth.getFullYear();
      })
      .map(log => {
        return {
          date: new Date(log.date),
          logs: [log],
          hasLogs: true
        };
      });
  };

  const datesWithOutfits = getDatesWithOutfits();

  const getClothingItemById = (id: string) => {
    return clothingItems.find(item => item.id === id);
  };

  const getOutfitById = (id: string) => {
    return outfits.find(outfit => outfit.id === id);
  };

  const handleSelectOutfit = (outfitId: string) => {
    handleOpenLogDialog(selectedDate);
    form.setValue('outfitId', outfitId);
  };

  const renderCalendarDay = (date: Date) => {
    const logs = getLogsForDay(date);
    if (logs.length === 0) return null;
    
    return (
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        {logs.length > 0 && (
          <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mb-1 mr-0.5" />
        )}
        {logs.length > 1 && (
          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mb-1 mr-0.5" />
        )}
        {logs.length > 2 && (
          <div className="h-1.5 w-1.5 rounded-full bg-pink-500 mb-1" />
        )}
      </div>
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="mb-8">
        <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full md:w-1/2 mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistics
            </TabsTrigger>
          </TabsList>
        
          <TabsContent value="calendar">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DateSelector 
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                datesWithOutfits={datesWithOutfits}
                onLogButtonClick={handleOpenLogDialog}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                renderCalendarDay={renderCalendarDay}
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
              
              <MonthlyCalendarView
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                getLogsForDay={getLogsForDay}
                getOutfitById={getOutfitById}
              />
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
    </motion.section>
  );
};

// Add missing imports
import { Calendar, BarChart3 } from 'lucide-react';

export default OutfitCalendar;
