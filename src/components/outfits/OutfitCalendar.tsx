import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isSameDay, endOfMonth, startOfMonth, eachDayOfInterval, isToday, addMonths, subMonths } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  BarChart3, 
  Calendar, 
  Plus, 
  Info, 
  Clock, 
  Thermometer, 
  Cloud, 
  Droplets,
  Tag
} from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Outfit, ClothingItem, ClothingSeason } from '@/lib/types';
import OutfitLogChart from './OutfitLogChart';
import OutfitLogItem from './OutfitLogItem';

interface OutfitCalendarProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
}

// Schema for outfit logging form
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

type OutfitLog = {
  id: string;
  outfitId: string;
  date: Date;
  timeOfDay: string;
  notes?: string;
  weatherCondition?: string;
  temperature?: string;
};

const OutfitCalendar = ({ outfits, clothingItems }: OutfitCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTab, setSelectedTab] = useState('calendar');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [outfitLogs, setOutfitLogs] = useState<OutfitLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<OutfitLog | null>(null);
  
  // Initialize form with useForm hook
  const form = useForm<z.infer<typeof OutfitLogSchema>>({
    resolver: zodResolver(OutfitLogSchema),
    defaultValues: {
      date: selectedDate,
      notes: "",
    },
  });

  // Function to log a new outfit
  const onSubmitLog = (values: z.infer<typeof OutfitLogSchema>) => {
    // Create a new log with required fields ensuring they're not undefined
    const newLog: OutfitLog = {
      id: Date.now().toString(),
      outfitId: values.outfitId,
      date: values.date,
      timeOfDay: values.timeOfDay,
      notes: values.notes,
      weatherCondition: values.weatherCondition,
      temperature: values.temperature,
    };
    
    setOutfitLogs((prev) => [...prev, newLog]);
    setIsLogDialogOpen(false);
    form.reset();
  };
  
  // Get outfits worn on the selected date
  const outfitLogsOnDate = outfitLogs.filter(
    log => log.date && selectedDate && isSameDay(log.date, selectedDate)
  );
  
  // Calculate rarely worn outfits (not logged in the last 30 days)
  const rarelyWornOutfits = outfits.filter(outfit => {
    const logs = outfitLogs.filter(log => log.outfitId === outfit.id);
    if (logs.length === 0) return true;
    
    const lastWornLog = logs.reduce((latest, current) => 
      latest.date > current.date ? latest : current
    );
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastWornLog.date < thirtyDaysAgo;
  });
  
  // Calculate frequently worn outfits (logged more than 5 times)
  const frequentlyWornOutfits = outfits.filter(outfit => {
    const logs = outfitLogs.filter(log => log.outfitId === outfit.id);
    return logs.length > 5;
  });
  
  // Generate dates with outfits for calendar highlighting
  const getDatesWithOutfits = () => {
    if (!currentMonth) return [];
    
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return daysInMonth.map(day => {
      const logsOnDay = outfitLogs.filter(
        log => log.date && isSameDay(log.date, day)
      );
      
      return {
        date: day,
        logs: logsOnDay,
        hasLogs: logsOnDay.length > 0
      };
    }).filter(day => day.hasLogs);
  };
  
  const datesWithOutfits = getDatesWithOutfits();
  
  // Get clothing item details by ID
  const getClothingItemById = (id: string) => {
    return clothingItems.find(item => item.id === id);
  };
  
  // Get outfit details by ID
  const getOutfitById = (id: string) => {
    return outfits.find(outfit => outfit.id === id);
  };
  
  // Get most worn clothing items
  const getMostWornItems = () => {
    // Create a map to count item occurrences in logs
    const itemCounts: { [key: string]: number } = {};
    
    outfitLogs.forEach(log => {
      const outfit = outfits.find(o => o.id === log.outfitId);
      if (outfit) {
        outfit.items.forEach(itemId => {
          itemCounts[itemId] = (itemCounts[itemId] || 0) + 1;
        });
      }
    });
    
    // Convert to array and sort by count
    return Object.entries(itemCounts)
      .map(([itemId, count]) => ({
        item: getClothingItemById(itemId),
        count
      }))
      .filter(entry => entry.item) // Filter out any undefined items
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 most worn items
  };
  
  const mostWornItems = getMostWornItems();
  
  // Get seasonal stats
  const getSeasonalStats = () => {
    const seasons: { [key in ClothingSeason]: number } = {
      spring: 0,
      summer: 0,
      autumn: 0,
      winter: 0,
      all: 0
    };
    
    outfitLogs.forEach(log => {
      const outfit = outfits.find(o => o.id === log.outfitId);
      if (outfit) {
        outfit.seasons.forEach(season => {
          seasons[season] = (seasons[season] || 0) + 1;
        });
      }
    });
    
    const total = Object.values(seasons).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(seasons).map(([season, count]) => ({
      season,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }));
  };
  
  const seasonalStats = getSeasonalStats();
  
  // Navigate to previous month
  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };
  
  // Navigate to next month
  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };
  
  // Open log dialog with a specific date
  const handleOpenLogDialog = (date?: Date) => {
    if (date) {
      form.setValue('date', date);
    }
    setIsLogDialogOpen(true);
  };
  
  // View log details
  const handleViewLog = (log: OutfitLog) => {
    setSelectedLog(log);
  };
  
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900/60 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Outfit Calendar & Stats
        </h2>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
              <div className="col-span-1">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
                  <div className="flex justify-between items-center mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-500/30 bg-slate-800/70"
                      onClick={handlePreviousMonth}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <span className="font-medium text-purple-200">
                      {format(currentMonth, 'MMMM yyyy')}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-500/30 bg-slate-800/70"
                      onClick={handleNextMonth}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal border-purple-500/30 bg-slate-800/70"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-slate-900 border border-purple-500/30" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                        modifiers={{
                          highlighted: datesWithOutfits.map(d => d.date)
                        }}
                        modifiersClassNames={{
                          highlighted: "bg-purple-700/30 text-white rounded-md"
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <div className="flex justify-between items-center mt-4 mb-3">
                    <h3 className="text-lg font-medium text-purple-300">Logged outfits</h3>
                    <Button 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => handleOpenLogDialog(selectedDate)}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Log Outfit
                    </Button>
                  </div>
                  
                  {outfitLogsOnDate.length > 0 ? (
                    <div className="space-y-3">
                      {outfitLogsOnDate.map(log => {
                        const outfit = getOutfitById(log.outfitId);
                        if (!outfit) return null;
                        
                        return (
                          <OutfitLogItem 
                            key={log.id}
                            log={log}
                            outfit={outfit}
                            onClick={() => handleViewLog(log)}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic mt-2">No outfits logged on this date</p>
                  )}
                </div>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20 h-full">
                  <h3 className="text-lg font-medium mb-3 text-purple-300">Wardrobe Recommendations</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-purple-900/30 p-3 rounded-md border border-purple-500/30">
                      <h4 className="font-medium text-purple-200 mb-2">Rarely Worn Items</h4>
                      <p className="text-sm text-slate-300 mb-3">
                        Consider wearing these outfits that haven't been worn in the last 30 days:
                      </p>
                      {rarelyWornOutfits.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {rarelyWornOutfits.slice(0, 3).map(outfit => (
                            <Badge 
                              key={outfit.id} 
                              className="bg-purple-800/50 hover:bg-purple-700/70 cursor-pointer transition-colors"
                            >
                              {outfit.name}
                            </Badge>
                          ))}
                          {rarelyWornOutfits.length > 3 && (
                            <Badge className="bg-slate-700/70">+{rarelyWornOutfits.length - 3} more</Badge>
                          )}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">All outfits have been worn recently</p>
                      )}
                    </div>
                    
                    <div className="bg-amber-900/20 p-3 rounded-md border border-amber-500/30">
                      <h4 className="font-medium text-amber-200 mb-2">Frequently Worn Items</h4>
                      <p className="text-sm text-slate-300 mb-3">
                        Consider giving these frequently worn outfits a break:
                      </p>
                      {frequentlyWornOutfits.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {frequentlyWornOutfits.slice(0, 3).map(outfit => (
                            <Badge 
                              key={outfit.id} 
                              className="bg-amber-800/50 hover:bg-amber-700/70 cursor-pointer transition-colors"
                            >
                              {outfit.name} (worn {outfit.timesWorn} times)
                            </Badge>
                          ))}
                          {frequentlyWornOutfits.length > 3 && (
                            <Badge className="bg-slate-700/70">+{frequentlyWornOutfits.length - 3} more</Badge>
                          )}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">No outfits have been worn frequently</p>
                      )}
                    </div>
                    
                    <div className="bg-blue-900/20 p-3 rounded-md border border-blue-500/30">
                      <h4 className="font-medium text-blue-200 mb-2">Seasonal Suggestions</h4>
                      <p className="text-sm text-slate-300">
                        Based on the current season and your wardrobe history, consider trying these combinations:
                      </p>
                      <ul className="mt-2 space-y-1 text-sm text-slate-300">
                        <li>• Mix your rarely worn blue jeans with your favorite white top</li>
                        <li>• Try pairing your black dress with a colorful accessory for variation</li>
                        <li>• Your summer collection hasn't been used much - perfect time to try it</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
                <h3 className="text-lg font-medium mb-3 text-purple-300">Most Worn Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-purple-300">Item</TableHead>
                      <TableHead className="text-purple-300">Type</TableHead>
                      <TableHead className="text-right text-purple-300">Times Worn</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mostWornItems.map(({ item, count }) => item && (
                      <TableRow key={item.id} className="hover:bg-slate-800/50 border-b-purple-500/10">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell className="text-right">{count}</TableCell>
                      </TableRow>
                    ))}
                    {mostWornItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-slate-400 italic">
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
                <h3 className="text-lg font-medium mb-3 text-purple-300">Wardrobe Usage Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Occasion Distribution</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-blue-600/40 hover:bg-blue-600/50">Casual: 45%</Badge>
                      <Badge className="bg-purple-600/40 hover:bg-purple-600/50">Work: 30%</Badge>
                      <Badge className="bg-pink-600/40 hover:bg-pink-600/50">Party: 15%</Badge>
                      <Badge className="bg-amber-600/40 hover:bg-amber-600/50">Formal: 10%</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Seasonal Wear</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      {seasonalStats.map(({ season, percentage }) => (
                        percentage > 0 && season !== 'all' && (
                          <Badge 
                            key={season} 
                            className={`bg-${
                              season === 'spring' ? 'green' : 
                              season === 'summer' ? 'amber' : 
                              season === 'autumn' ? 'orange' : 'blue'
                            }-600/40 hover:bg-${
                              season === 'spring' ? 'green' : 
                              season === 'summer' ? 'amber' : 
                              season === 'autumn' ? 'orange' : 'blue'
                            }-600/50`}
                          >
                            {season.charAt(0).toUpperCase() + season.slice(1)}: {percentage}%
                          </Badge>
                        )
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Color Preferences</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="bg-slate-700 hover:bg-slate-600">Black: 30%</Badge>
                      <Badge className="bg-white text-slate-900 hover:bg-slate-100">White: 20%</Badge>
                      <Badge className="bg-blue-600 hover:bg-blue-500">Blue: 15%</Badge>
                      <Badge className="bg-red-600 hover:bg-red-500">Red: 10%</Badge>
                      <Badge className="bg-green-600 hover:bg-green-500">Green: 5%</Badge>
                      <Badge className="bg-slate-500 hover:bg-slate-400">Others: 20%</Badge>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Outfit Insights</h4>
                    <ul className="space-y-2">
                      <li className="text-sm text-slate-300">
                        • You tend to wear the same 5 outfits 60% of the time
                      </li>
                      <li className="text-sm text-slate-300">
                        • 30% of your wardrobe hasn't been worn in the last 3 months
                      </li>
                      <li className="text-sm text-slate-300">
                        • Your most active outfit day is Wednesday
                      </li>
                      <li className="text-sm text-slate-300">
                        • You have a strong preference for casual outfits during weekends
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
                <h3 className="text-lg font-medium mb-3 text-purple-300">Outfit Usage Trends</h3>
                <div className="h-64">
                  <OutfitLogChart outfitLogs={outfitLogs} outfits={outfits} />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Outfit Logging Dialog */}
      <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
        <DialogContent className="bg-slate-900 border border-purple-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-purple-300">Log Your Outfit</DialogTitle>
            <DialogDescription className="text-slate-400">
              Record what you wore today to track your wardrobe usage.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitLog)} className="space-y-4">
              <FormField
                control={form.control}
                name="outfitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Select Outfit</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-purple-500/30 bg-slate-800">
                          <SelectValue placeholder="Select an outfit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-purple-500/30">
                        {outfits.map(outfit => (
                          <SelectItem key={outfit.id} value={outfit.id}>
                            {outfit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="timeOfDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Time of Day</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-purple-500/30 bg-slate-800">
                          <SelectValue placeholder="When did you wear it?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-purple-500/30">
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                        <SelectItem value="night">Night</SelectItem>
                        <SelectItem value="allDay">All Day</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weatherCondition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Weather Condition (Optional)</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-purple-500/30 bg-slate-800">
                          <SelectValue placeholder="Weather conditions?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-purple-500/30">
                        <SelectItem value="sunny">Sunny</SelectItem>
                        <SelectItem value="cloudy">Cloudy</SelectItem>
                        <SelectItem value="rainy">Rainy</SelectItem>
                        <SelectItem value="snowy">Snowy</SelectItem>
                        <SelectItem value="windy">Windy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Temperature (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. 20°C" 
                        {...field} 
                        className="border-purple-500/30 bg-slate-800"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="How did you feel wearing this outfit?" 
                        {...field} 
                        className="border-purple-500/30 bg-slate-800 min-h-[80px]"
                      />
                    </FormControl>
                    <FormDescription className="text-slate-400">
                      Add any comments about fit, comfort, or occasions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsLogDialogOpen(false)}
                  className="mr-2 border-purple-500/30"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Save Outfit Log
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Outfit Log Details Dialog */}
      {selectedLog && (
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="bg-slate-900 border border-purple-500/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl text-purple-300">
                {getOutfitById(selectedLog.outfitId)?.name || "Outfit Details"}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Logged on {format(selectedLog.date, "PPP")}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-slate-800/70 rounded-md p-3">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-900/30 p-2 rounded-md">
                    <Clock className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-200">Time of Day</h4>
                    <p className="text-slate-400">
                      {selectedLog.timeOfDay.charAt(0).toUpperCase() + selectedLog.timeOfDay.slice(1)}
                    </p>
                  </div>
                </div>
              </div>
              
              {(selectedLog.weatherCondition || selectedLog.temperature) && (
                <div className="bg-slate-800/70 rounded-md p-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-900/30 p-2 rounded-md">
                      {selectedLog.weatherCondition === 'sunny' ? (
                        <Cloud className="h-5 w-5 text-blue-400" />
                      ) : selectedLog.weatherCondition === 'rainy' ? (
                        <Droplets className="h-5 w-5 text-blue-400" />
                      ) : (
                        <Thermometer className="h-5 w-5 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-200">Weather Conditions</h4>
                      <p className="text-slate-400">
                        {selectedLog.weatherCondition && (
                          <span className="capitalize">{selectedLog.weatherCondition}</span>
                        )}
                        {selectedLog.weatherCondition && selectedLog.temperature && (
                          <span> • </span>
                        )}
                        {selectedLog.temperature && (
                          <span>{selectedLog.temperature}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedLog.notes && (
                <div className="bg-slate-800/70 rounded-md p-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-900/30 p-2 rounded-md">
                      <Info className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-200">Notes</h4>
                      <p className="text-slate-400">{selectedLog.notes}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Outfit items */}
              <div className="bg-slate-800/70 rounded-md p-3">
                <div className="flex items-start gap-3">
                  <div className="bg-green-900/30 p-2 rounded-md">
                    <Tag className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="w-full">
                    <h4 className="font-medium text-slate-200 mb-2">Items in this outfit</h4>
                    <div className="flex flex-wrap gap-2">
                      {getOutfitById(selectedLog.outfitId)?.items.map(itemId => {
                        const item = getClothingItemById(itemId);
                        return item ? (
                          <Badge key={item.id} className="bg-slate-700 hover:bg-slate-600">
                            {item.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.section>
  );
};

export default OutfitCalendar;
