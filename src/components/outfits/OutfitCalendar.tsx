import { useState, useEffect } from 'react';
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
  Tag,
  Filter,
  Search
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
import OutfitLogItem, { OutfitLog } from './OutfitLogItem';
import { useOutfitState } from '@/hooks/useOutfitState';

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
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<z.infer<typeof OutfitLogSchema>>({
    resolver: zodResolver(OutfitLogSchema),
    defaultValues: {
      date: selectedDate,
      notes: "",
    },
  });

  const onSubmitLog = (values: z.infer<typeof OutfitLogSchema>) => {
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
    
    if (onAddLog) {
      onAddLog({
        outfitId: values.outfitId,
        date: values.date,
        timeOfDay: values.timeOfDay,
        notes: values.notes,
        weatherCondition: values.weatherCondition,
        temperature: values.temperature,
      });
    }
    
    setIsLogDialogOpen(false);
    form.reset();
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
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
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

  const getMostWornItems = () => {
    const itemCounts: { [key: string]: number } = {};
    
    outfitLogs.forEach(log => {
      const outfit = outfits.find(o => o.id === log.outfitId);
      if (outfit) {
        outfit.items.forEach(itemId => {
          itemCounts[itemId] = (itemCounts[itemId] || 0) + 1;
        });
      }
    });
    
    return Object.entries(itemCounts)
      .map(([itemId, count]) => ({
        item: getClothingItemById(itemId),
        count
      }))
      .filter(entry => entry.item)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const mostWornItems = getMostWornItems();

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

  const getOccasionStats = () => {
    const occasions: { [key: string]: number } = {};
    
    outfitLogs.forEach(log => {
      const outfit = outfits.find(o => o.id === log.outfitId);
      if (outfit) {
        outfit.occasions.forEach(occasion => {
          occasions[occasion] = (occasions[occasion] || 0) + 1;
        });
      }
    });
    
    const total = Object.values(occasions).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(occasions).map(([occasion, count]) => ({
      occasion,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }).sort((a, b) => b.count - a.count));
  };

  const occasionStats = getOccasionStats();

  const getColorStats = () => {
    const colors: { [key: string]: number } = {};
    
    outfitLogs.forEach(log => {
      const outfit = outfits.find(o => o.id === log.outfitId);
      if (outfit) {
        outfit.items.forEach(itemId => {
          const item = getClothingItemById(itemId);
          if (item) {
            colors[item.color] = (colors[item.color] || 0) + 1;
          }
        });
      }
    });
    
    const total = Object.values(colors).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(colors).map(([color, count]) => ({
      color,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }).sort((a, b) => b.count - a.count));
  };

  const colorStats = getColorStats();

  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
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

  const getFilteredOutfits = () => {
    let filtered = outfits;
    
    if (searchTerm) {
      filtered = filtered.filter(outfit => 
        outfit.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterCategory) {
      filtered = filtered.filter(outfit => 
        outfit.occasions.includes(filterCategory)
      );
    }
    
    return filtered;
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
        
        <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-[400px]">
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
                        components={{
                          DayContent: (props) => (
                            <div className="relative w-full h-full flex items-center justify-center">
                              {props.date && renderCalendarDay(props.date)}
                            </div>
                          ),
                        }}
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
                              onClick={() => {
                                handleOpenLogDialog(selectedDate);
                                form.setValue('outfitId', outfit.id);
                              }}
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
                    
                    <div className="bg-green-900/20 p-3 rounded-md border border-green-500/30">
                      <h4 className="font-medium text-green-200 mb-2">Monthly Calendar View</h4>
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="text-xs font-medium text-slate-400 mb-1">{day}</div>
                        ))}
                        
                        {eachDayOfInterval({
                          start: startOfMonth(currentMonth),
                          end: endOfMonth(currentMonth)
                        }).map(day => {
                          const dayLogs = getLogsForDay(day);
                          const isSelected = selectedDate && isSameDay(day, selectedDate);
                          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                          
                          return (
                            <div 
                              key={day.toString()}
                              onClick={() => setSelectedDate(day)}
                              className={`
                                p-1 rounded-sm text-xs cursor-pointer relative
                                ${isCurrentMonth ? 'hover:bg-slate-700/50' : 'opacity-40'}
                                ${isSelected ? 'bg-purple-700/50 text-white' : ''}
                                ${isToday(day) ? 'border border-purple-500' : ''}
                                ${dayLogs.length > 0 ? 'bg-slate-800' : ''}
                              `}
                            >
                              <div className="mb-2">{format(day, 'd')}</div>
                              {dayLogs.length > 0 && (
                                <div className="flex justify-center gap-0.5">
                                  {dayLogs.slice(0, 3).map((log, i) => {
                                    const outfit = getOutfitById(log.outfitId);
                                    if (!outfit) return null;
                                    
                                    return (
                                      <div 
                                        key={log.id}
                                        className={`
                                          h-1 w-1 rounded-full
                                          ${i === 0 ? 'bg-purple-500' : i === 1 ? 'bg-blue-500' : 'bg-pink-500'}
                                        `}
                                        title={outfit.name}
                                      />
                                    );
                                  })}
                                  {dayLogs.length > 3 && (
                                    <div className="text-[8px] text-slate-400">+{dayLogs.length - 3}</div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
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
                      {occasionStats.map(({ occasion, percentage }) => (
                        percentage > 0 && (
                          <Badge
                            key={occasion}
                            className={`
                              ${occasion === 'casual' ? 'bg-blue-600/40 hover:bg-blue-600/50' : 
                                occasion === 'business' ? 'bg-purple-600/40 hover:bg-purple-600/50' : 
                                occasion === 'formal' ? 'bg-pink-600/40 hover:bg-pink-600/50' : 
                                occasion === 'party' ? 'bg-amber-600/40 hover:bg-amber-600/50' : 
                                'bg-emerald-600/40 hover:bg-emerald-600/50'
                              }
                            `}
                          >
                            {occasion.charAt(0).toUpperCase() + occasion.slice(1)}: {percentage}%
                          </Badge>
                        )
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Seasonal Wear</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      {seasonalStats.map(({ season, percentage }) => (
                        percentage > 0 && season !== 'all' && (
                          <Badge 
                            key={season} 
                            className={`
                              ${season === 'spring' ? 'bg-green-600/40 hover:bg-green-600/50' : 
                                season === 'summer' ? 'bg-amber-600/40 hover:bg-amber-600/50' : 
                                season === 'autumn' ? 'bg-orange-600/40 hover:bg-orange-600/50' : 
                                'bg-blue-600/40 hover:bg-blue-600/50'
                              }
                            `}
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
                      {colorStats.slice(0, 6).map(({ color, percentage }) => (
                        <Badge 
                          key={color} 
                          className={`
                            ${color === 'black' ? 'bg-slate-800 hover:bg-slate-700' : 
                              color === 'white' ? 'bg-white text-slate-900 hover:bg-slate-200' : 
                              color === 'blue' ? 'bg-blue-600 hover:bg-blue-500' : 
                              color === 'red' ? 'bg-red-600 hover:bg-red-500' : 
                              color === 'green' ? 'bg-green-600 hover:bg-green-500' : 
                              color === 'pink' ? 'bg-pink-600 hover:bg-pink-500' : 
                              color === 'purple' ? 'bg-purple-600 hover:bg-purple-500' : 
                              color === 'yellow' ? 'bg-yellow-600 hover:bg-yellow-500' : 
                              color === 'orange' ? 'bg-orange-600 hover:bg-orange-500' : 
                              color === 'brown' ? 'bg-amber-800 hover:bg-amber-700' : 
                              color === 'gray' ? 'bg-slate-500 hover:bg-slate-400' : 
                              'bg-violet-600 hover:bg-violet-500'
                            }
                          `}
                        >
                          {color.charAt(0).toUpperCase() + color.slice(1)}: {percentage}%
                        </Badge>
                      ))}
                      {colorStats.length > 6 && (
                        <Badge className="bg-slate-500 hover:bg-slate-400">
                          Others: {colorStats.slice(6).reduce((acc, { percentage }) => acc + percentage, 0)}%
                        </Badge>
                      )}
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
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-purple-300">Outfit Usage Trends</h3>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-slate-400" />
                      <Input 
                        placeholder="Search outfits..." 
                        className="pl-9 bg-slate-900/50 border-purple-500/30 h-9"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="h-9 border-purple-500/30 bg-slate-900/50">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                          {filterCategory && <Badge className="ml-2 bg-purple-600">{filterCategory}</Badge>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 bg-slate-900 border-purple-500/30">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Filter by occasion</h4>
                          <div className="flex flex-wrap gap-2">
                            {['casual', 'business', 'formal', 'party', 'sporty'].map(occasion => (
                              <Badge 
                                key={occasion}
                                onClick={() => setFilterCategory(filterCategory === occasion ? null : occasion)}
                                className={`cursor-pointer ${filterCategory === occasion ? 'bg-purple-600' : 'bg-slate-700'}`}
                              >
                                {occasion}
                              </Badge>
                            ))}
                          </div>
                          <Button 
                            variant="ghost" 
                            className="w-full mt-2 text-xs h-8"
                            onClick={() => setFilterCategory(null)}
                          >
                            Clear filter
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-slate-400 text-sm italic">Outfit usage chart will be displayed here</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
        <DialogContent className="bg-slate-900/60 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 shadow-xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitLog)}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-purple-300">Log Outfit</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 bg-slate-800/70"
                  onClick={() => setIsLogDialogOpen(false)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              
              <FormField
                control={form.control}
                name="outfitId"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="text-purple-300">Outfit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full justify-start text-left font-normal border-purple-500/30 bg-slate-800/70">
                        <SelectValue placeholder="Select an outfit" />
                      </SelectTrigger>
                      <SelectContent>
                        {getFilteredOutfits().map(outfit => (
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
                name="date"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="text-purple-300">Date</FormLabel>
                    <Input
                      type="date"
                      {...field}
                      className="w-full border border-purple-500/30 bg-slate-800/70"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="timeOfDay"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="text-purple-300">Time of Day</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full justify-start text-left font-normal border-purple-500/30 bg-slate-800/70">
                        <SelectValue placeholder="Select a time of day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="text-purple-300">Notes</FormLabel>
                    <Textarea
                      {...field}
                      className="w-full border border-purple-500/30 bg-slate-800/70"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weatherCondition"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="text-purple-300">Weather Condition</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full justify-start text-left font-normal border-purple-500/30 bg-slate-800/70">
                        <SelectValue placeholder="Select a weather condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunny">Sunny</SelectItem>
                        <SelectItem value="cloudy">Cloudy</SelectItem>
                        <SelectItem value="rainy">Rainy</SelectItem>
                        <SelectItem value="snowy">Snowy</SelectItem>
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
                  <FormItem className="mb-4">
                    <FormLabel className="text-purple-300">Temperature</FormLabel>
                    <Input
                      type="number"
                      {...field}
                      className="w-full border border-purple-500/30 bg-slate-800/70"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end mt-4">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  Log Outfit
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </motion.section>
  );
};

export default OutfitCalendar;
