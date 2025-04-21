
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, TrendingUp, Shirt } from 'lucide-react';
import { ClothingItem, ClothingSeason } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { differenceInMonths, differenceInDays, format } from 'date-fns';
import { cn } from '@/lib/utils';

interface WardrobeInsightsProps {
  items: ClothingItem[];
}

const WardrobeInsights = ({ items }: WardrobeInsightsProps) => {
  const [insights, setInsights] = useState<{
    unwornPercentage: number;
    mostWornCategory: string;
    mostWornItem: ClothingItem | null;
    lowUsageItems: number;
    seasonalMismatch: number;
  }>({
    unwornPercentage: 0,
    mostWornCategory: '',
    mostWornItem: null,
    lowUsageItems: 0,
    seasonalMismatch: 0,
  });
  
  useEffect(() => {
    if (!items.length) return;
    
    // Calculate unworn percentage (items not worn in last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const unwornItems = items.filter(item => {
      if (!item.lastWorn) return true;
      return new Date(item.lastWorn) < sixMonthsAgo;
    });
    
    const unwornPercentage = Math.round((unwornItems.length / items.length) * 100);
    
    // Find most worn category
    const categoryCount: Record<string, number> = {};
    items.forEach(item => {
      const category = item.category || 'uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + (item.timesWorn || 0);
    });
    
    const mostWornCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    
    // Find most worn item
    const sortedByWear = [...items].sort((a, b) => (b.timesWorn || 0) - (a.timesWorn || 0));
    const mostWornItem = sortedByWear[0] || null;
    
    // Low usage items (worn less than 3 times)
    const lowUsageItems = items.filter(item => (item.timesWorn || 0) <= 3).length;
    
    // Current season
    const currentMonth = new Date().getMonth();
    let currentSeason: ClothingSeason;
    
    if (currentMonth >= 2 && currentMonth <= 4) currentSeason = 'spring';
    else if (currentMonth >= 5 && currentMonth <= 7) currentSeason = 'summer';
    else if (currentMonth >= 8 && currentMonth <= 10) currentSeason = 'autumn';
    else currentSeason = 'winter';
    
    // Items not matching current season
    const seasonalMismatchItems = items.filter(item => {
      if (!item.season || !Array.isArray(item.season)) return false;
      return !item.season.includes(currentSeason) && !item.season.includes('all');
    });
    
    setInsights({
      unwornPercentage,
      mostWornCategory,
      mostWornItem,
      lowUsageItems,
      seasonalMismatch: seasonalMismatchItems.length,
    });
  }, [items]);

  if (!items.length) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
        Wardrobe Insights
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={cn(
            "overflow-hidden h-full border-white/10 hover:border-purple-500/30 transition-all", 
            "bg-gradient-to-br from-slate-900/90 to-purple-900/40 backdrop-blur-sm"
          )}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 rounded-full bg-amber-500/20">
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Unworn Items</h4>
                  <p className="text-sm text-white/70 mt-1">
                    {insights.unwornPercentage}% of your wardrobe hasn't been worn in the last 6 months
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={cn(
            "overflow-hidden h-full border-white/10 hover:border-purple-500/30 transition-all", 
            "bg-gradient-to-br from-slate-900/90 to-purple-900/40 backdrop-blur-sm"
          )}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 rounded-full bg-blue-500/20">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Most Worn</h4>
                  <p className="text-sm text-white/70 mt-1">
                    Your "{insights.mostWornCategory}" items get the most use
                    {insights.mostWornItem && (
                      <span> and <span className="text-blue-300">{insights.mostWornItem.name}</span> is your favorite piece</span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className={cn(
            "overflow-hidden h-full border-white/10 hover:border-purple-500/30 transition-all", 
            "bg-gradient-to-br from-slate-900/90 to-purple-900/40 backdrop-blur-sm"
          )}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 rounded-full bg-purple-500/20">
                  <Shirt className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Low Usage</h4>
                  <p className="text-sm text-white/70 mt-1">
                    {insights.lowUsageItems} {insights.lowUsageItems === 1 ? 'item has' : 'items have'} been worn less than 3 times
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className={cn(
            "overflow-hidden h-full border-white/10 hover:border-purple-500/30 transition-all", 
            "bg-gradient-to-br from-slate-900/90 to-purple-900/40 backdrop-blur-sm"
          )}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 rounded-full bg-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Seasonal Mismatch</h4>
                  <p className="text-sm text-white/70 mt-1">
                    {insights.seasonalMismatch} {insights.seasonalMismatch === 1 ? 'item is' : 'items are'} not ideal for the current season
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default WardrobeInsights;
