
import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isSameDay, endOfMonth, startOfMonth, eachDayOfInterval } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, BarChart3, Calendar } from 'lucide-react';
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
import { Outfit, ClothingItem } from '@/lib/types';

interface OutfitCalendarProps {
  outfits: Outfit[];
  clothingItems: ClothingItem[];
}

const OutfitCalendar = ({ outfits, clothingItems }: OutfitCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTab, setSelectedTab] = useState('calendar');
  
  // Simulated outfit usage history
  // In a real app, this would come from a database
  const outfitHistory = outfits
    .filter(outfit => outfit.lastWorn)
    .map(outfit => ({
      ...outfit,
      lastWorn: outfit.lastWorn ? new Date(outfit.lastWorn) : undefined
    }));
    
  // Get outfits worn on the selected date
  const outfitsOnDate = outfitHistory.filter(
    outfit => outfit.lastWorn && selectedDate && isSameDay(outfit.lastWorn, selectedDate)
  );
  
  // Calculate rarely worn outfits (not worn in the last 30 days)
  const rarelyWornOutfits = outfits.filter(outfit => {
    if (!outfit.lastWorn) return true;
    const lastWorn = new Date(outfit.lastWorn);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastWorn < thirtyDaysAgo;
  });
  
  // Calculate frequently worn outfits (worn more than 5 times)
  const frequentlyWornOutfits = outfits.filter(outfit => outfit.timesWorn > 5);
  
  // Generate dates with outfits for calendar highlighting
  const getDatesWithOutfits = () => {
    if (!selectedDate) return [];
    
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return daysInMonth.map(day => {
      const outfitsOnDay = outfitHistory.filter(
        outfit => outfit.lastWorn && isSameDay(outfit.lastWorn, day)
      );
      return {
        date: day,
        outfits: outfitsOnDay,
        hasOutfits: outfitsOnDay.length > 0
      };
    }).filter(day => day.hasOutfits);
  };
  
  const datesWithOutfits = getDatesWithOutfits();
  
  // Get clothing item details by ID
  const getClothingItemById = (id: string) => {
    return clothingItems.find(item => item.id === id);
  };
  
  // Get most worn clothing items
  const getMostWornItems = () => {
    // Create a map to count item occurrences
    const itemCounts: { [key: string]: number } = {};
    
    outfits.forEach(outfit => {
      outfit.items.forEach(itemId => {
        itemCounts[itemId] = (itemCounts[itemId] || 0) + outfit.timesWorn;
      });
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
        </Tabs>
      </div>
      
      <TabsContent value="calendar" className="mt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
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
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-3 text-purple-300">Outfits worn on this date</h3>
                {outfitsOnDate.length > 0 ? (
                  <div className="space-y-3">
                    {outfitsOnDate.map(outfit => (
                      <div key={outfit.id} className="bg-slate-800/80 p-3 rounded-md border border-purple-500/20">
                        <p className="font-medium text-white">{outfit.name}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {outfit.occasions.map(occasion => (
                            <Badge key={occasion} variant="outline" className="text-xs">
                              {occasion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">No outfits worn on this date</p>
                )}
              </div>
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
      
      <TabsContent value="stats" className="mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <Badge className="bg-green-600/40 hover:bg-green-600/50">Spring: 25%</Badge>
                  <Badge className="bg-amber-600/40 hover:bg-amber-600/50">Summer: 35%</Badge>
                  <Badge className="bg-orange-600/40 hover:bg-orange-600/50">Autumn: 25%</Badge>
                  <Badge className="bg-blue-600/40 hover:bg-blue-600/50">Winter: 15%</Badge>
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
        </div>
      </TabsContent>
    </motion.section>
  );
};

export default OutfitCalendar;
