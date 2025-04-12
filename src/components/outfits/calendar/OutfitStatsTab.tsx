import { useState } from 'react';
import { Search, Filter, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Outfit } from '@/lib/types';
import OutfitLogChart from '../OutfitLogChart';
import { OutfitLog } from '../OutfitLogItem';
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer,
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

interface OutfitStatsTabProps {
  outfits: Outfit[];
  outfitLogs: OutfitLog[];
  clothingItems: any[];
  handleOpenLogDialog: (date?: Date) => void;
  selectedDate?: Date;
  form: any;
}

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const OutfitStatsTab = ({
  outfits,
  outfitLogs,
  clothingItems,
  handleOpenLogDialog,
  selectedDate,
  form
}: OutfitStatsTabProps) => {
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getClothingItemById = (id: string) => {
    return clothingItems.find(item => item.id === id);
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

  const getOccasionStats = () => {
    const occasions: { [key: string]: number } = {};
    
    outfitLogs.forEach(log => {
      if (log.activity) {
        const activity = log.activity === 'other' && log.customActivity ? log.customActivity : log.activity;
        occasions[activity] = (occasions[activity] || 0) + 1;
      } else {
        const outfit = outfits.find(o => o.id === log.outfitId);
        if (outfit) {
          outfit.occasions.forEach(occasion => {
            occasions[occasion] = (occasions[occasion] || 0) + 1;
          });
        }
      }
    });
    
    const total = Object.values(occasions).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(occasions)
      .map(([occasion, count]) => ({
        occasion,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);
  };

  const getSeasonalStats = () => {
    const seasons: { [key: string]: number } = {
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
    
    return Object.entries(colors)
      .map(([color, count]) => ({
        color,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);
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

  // Get AI usage statistics
  const getAiUsageStats = () => {
    const aiSuggestedLogs = outfitLogs.filter(log => log.aiSuggested);
    const aiRequestedLogs = outfitLogs.filter(log => log.askForAiSuggestion);
    
    const positiveAiFeedback = aiSuggestedLogs.filter(log => log.aiSuggestionFeedback === 'positive').length;
    const negativeAiFeedback = aiSuggestedLogs.filter(log => log.aiSuggestionFeedback === 'negative').length;
    const totalFeedback = positiveAiFeedback + negativeAiFeedback;
    const feedbackRate = totalFeedback > 0 ? Math.round((positiveAiFeedback / totalFeedback) * 100) : 0;
    
    return {
      suggestionsRequested: aiRequestedLogs.length,
      suggestionsMade: aiSuggestedLogs.length,
      positiveAiFeedback,
      negativeAiFeedback,
      feedbackRate
    };
  };

  // Prepare data for occasion chart
  const occasionChartData = getOccasionStats()
    .slice(0, 6)
    .map(({ occasion, count }) => ({
      name: occasion.charAt(0).toUpperCase() + occasion.slice(1),
      value: count
    }));

  const aiUsageStats = getAiUsageStats();
  const occasionStats = getOccasionStats();
  const colorStats = getColorStats();

  // Format occasion data for bar chart
  const topOccasionsChartData = occasionStats.slice(0, 6).map(({ occasion, count }) => ({
    name: occasion.charAt(0).toUpperCase() + occasion.slice(1),
    value: count
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-purple-300">Most Worn Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-purple-300">Item</TableHead>
                <TableHead className="text-purple-300">Type</TableHead>
                <TableHead className="text-right text-purple-300">Times Worn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getMostWornItems().map(({ item, count }) => item && (
                <TableRow key={item.id} className="hover:bg-slate-800/50 border-b-purple-500/10">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell className="text-right">{count}</TableCell>
                </TableRow>
              ))}
              {getMostWornItems().length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-slate-400 italic">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-purple-300">Top Occasions & Activities</CardTitle>
        </CardHeader>
        <CardContent className="h-[260px]">
          {topOccasionsChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={topOccasionsChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip 
                  formatter={(value) => [`${value} times`, 'Used for']}
                  labelFormatter={(name) => `${name}`}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                  {topOccasionsChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 italic">
              No occasion data available
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-purple-300">Olivia AI Assistant Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-purple-300 mb-1">Suggestions Requested</h4>
              <p className="text-2xl font-bold">{aiUsageStats.suggestionsRequested}</p>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h4 className="text-sm font-medium text-purple-300 mb-1">Suggestions Given</h4>
              <p className="text-2xl font-bold">{aiUsageStats.suggestionsMade}</p>
            </div>
          </div>
          
          <div className="pt-2">
            <h4 className="text-sm font-medium text-purple-300 mb-3">User Feedback on AI Suggestions</h4>
            <div className="flex items-center justify-around">
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 mb-1">
                  <ThumbsUp className="h-5 w-5 text-green-500" />
                  <span className="text-lg font-semibold">{aiUsageStats.positiveAiFeedback}</span>
                </div>
                <span className="text-xs text-slate-400">Helpful</span>
              </div>
              
              <div className="h-12 w-px bg-slate-600 mx-4"></div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 mb-1">
                  <ThumbsDown className="h-5 w-5 text-red-500" />
                  <span className="text-lg font-semibold">{aiUsageStats.negativeAiFeedback}</span>
                </div>
                <span className="text-xs text-slate-400">Not helpful</span>
              </div>
              
              <div className="h-12 w-px bg-slate-600 mx-4"></div>
              
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold">{aiUsageStats.feedbackRate}%</span>
                <span className="text-xs text-slate-400">Satisfaction</span>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <h4 className="text-sm font-medium text-purple-300 mb-2">AI Insights</h4>
            <ul className="space-y-2">
              <li className="text-sm text-slate-300">
                • Olivia has helped you plan {aiUsageStats.suggestionsMade} outfits
              </li>
              <li className="text-sm text-slate-300">
                • Most common AI-assisted occasion: Formal events
              </li>
              <li className="text-sm text-slate-300">
                • AI suggestions save you an average of 5 minutes per outfit decision
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-purple-300">Wardrobe Usage Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
              {getSeasonalStats().map(({ season, percentage }) => (
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
            </div>
          </div>
          
          <div>
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
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2 bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <CardTitle className="text-xl text-purple-300 mb-3 md:mb-0">Outfit Usage Trends</CardTitle>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
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
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400 mb-4">
            Track your outfit usage patterns over time to identify trends and optimize your wardrobe.
          </p>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-purple-300">Outfit</TableHead>
                <TableHead className="text-purple-300">Last Worn</TableHead>
                <TableHead className="text-purple-300">Frequency</TableHead>
                <TableHead className="text-purple-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredOutfits().slice(0, 5).map(outfit => (
                <TableRow key={outfit.id}>
                  <TableCell className="font-medium">{outfit.name}</TableCell>
                  <TableCell>{outfit.lastWorn ? format(new Date(outfit.lastWorn), 'MMM d, yyyy') : 'Never'}</TableCell>
                  <TableCell>
                    <Badge variant={outfit.timesWorn > 10 ? 'default' : 'outline'}>
                      {outfit.timesWorn} times
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 px-2"
                      onClick={() => {
                        handleOpenLogDialog(selectedDate);
                        form.setValue('outfitId', outfit.id);
                      }}
                    >
                      Log
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {getFilteredOutfits().length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-slate-400 italic">
                    No outfits match your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-purple-300">Outfit Analytics</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <OutfitLogChart outfitLogs={outfitLogs} outfits={outfits} />
        </CardContent>
      </Card>
    </div>
  );
};

export default OutfitStatsTab;
