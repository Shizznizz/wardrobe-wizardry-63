
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { isSameDay, format, endOfMonth, startOfMonth, addMonths, subMonths } from 'date-fns';
import { Plus } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Outfit, ClothingItem } from '@/lib/types';
import { OutfitLog } from './OutfitLogItem';
import DateSelector from './calendar/DateSelector';
import OutfitLogsList from './calendar/OutfitLogsList';
import WardrobeRecommendations from './calendar/WardrobeRecommendations';
import MonthlyCalendarView from './calendar/MonthlyCalendarView';
import OutfitLogForm from './calendar/OutfitLogForm';
import OutfitStatsTab from './calendar/OutfitStatsTab';
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTab, setSelectedTab] = useState('calendar');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [outfitLogs, setOutfitLogs] = useState<OutfitLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<OutfitLog | null>(null);

  const form = useForm<z.infer<typeof OutfitLogSchema>>({
    resolver: zodResolver(OutfitLogSchema),
    defaultValues: {
      date: selectedDate,
      notes: "",
    },
  });

  const onSubmitLog = (values: Omit<OutfitLog, 'id'>) => {
    const newLog: OutfitLog = {
      id: Date.now().toString(),
      ...values
    };
    
    setOutfitLogs((prev) => [...prev, newLog]);
    
    if (onAddLog) {
      onAddLog(values);
    }
    
    setIsLogDialogOpen(false);
  };

  const outfitLogsOnDate = outfitLogs.filter(
    log => log.date && selectedDate && isSameDay(new Date(log.date), selectedDate)
  );

  const rarelyWornOutfits = outfits.filter(outfit => {
    const logs = outfitLogs.filter(log => log.outfitId === outfit.id);
    if (logs.length === 0) return true;
    
    const lastWornLog = logs.reduce((latest, current) => 
      new Date(latest.date) > new Date(current.date) ? latest : current
    );
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(lastWornLog.date) < thirtyDaysAgo;
  });

  const frequentlyWornOutfits = outfits.filter(outfit => {
    const logs = outfitLogs.filter(log => log.outfitId === outfit.id);
    return logs.length > 5;
  });

  const getDatesWithOutfits = () => {
    if (!currentMonth) return [];
    
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = Array.from(
      { length: monthEnd.getDate() },
      (_, i) => new Date(monthStart.getFullYear(), monthStart.getMonth(), i + 1)
    );
    
    return daysInMonth.map(day => {
      const logsOnDay = outfitLogs.filter(
        log => log.date && isSameDay(new Date(log.date), day)
      );
      
      return {
        date: day,
        logs: logsOnDay,
        hasLogs: logsOnDay.length > 0
      };
    }).filter(day => day.hasLogs);
  };

  const datesWithOutfits = getDatesWithOutfits();

  const getClothingItemById = (id: string) => {
    return clothingItems.find(item => item.id === id);
  };

  const getOutfitById = (id: string) => {
    return outfits.find(outfit => outfit.id === id);
  };

  const handleOpenLogDialog = (date?: Date) => {
    if (date) {
      form.setValue('date', date);
    }
    setIsLogDialogOpen(true);
  };

  const handleViewLog = (log: OutfitLog) => {
    setSelectedLog(log);
  };

  const getLogsForDay = (day: Date) => {
    return outfitLogs.filter(log => 
      log.date && isSameDay(new Date(log.date), day)
    );
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

  const handleSelectOutfit = (outfitId: string) => {
    handleOpenLogDialog(selectedDate);
    form.setValue('outfitId', outfitId);
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
              />
              
              <WardrobeRecommendations
                rarelyWornOutfits={rarelyWornOutfits}
                frequentlyWornOutfits={frequentlyWornOutfits}
                handleSelectOutfit={handleSelectOutfit}
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
        onClose={() => setIsLogDialogOpen(false)}
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
