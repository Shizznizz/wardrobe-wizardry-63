import React from 'react';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import { Outfit, ClothingItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Shirt, Calendar, BarChart } from 'lucide-react';

interface OutfitStatsTabProps {
  outfits: Outfit[];
  outfitLogs: OutfitLog[];
  clothingItems: ClothingItem[];
  handleOpenLogDialog: (date: Date) => void;
  selectedDate: Date;
  form: any;
}

const OutfitStatsTab = ({ 
  outfits, 
  outfitLogs, 
  clothingItems,
  handleOpenLogDialog,
  selectedDate
}: OutfitStatsTabProps) => {
  // Calculate some basic statistics
  const totalOutfits = outfits.length;
  const totalLogs = outfitLogs.length;
  const mostWornOutfit = outfits.sort((a, b) => b.timesWorn - a.timesWorn)[0];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Total Outfits Card */}
      <Card className="bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Shirt className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-lg text-purple-200">Your Wardrobe</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">{totalOutfits}</div>
          <p className="text-sm text-white/70">Total outfits in your collection</p>
        </CardContent>
      </Card>
      
      {/* Total Logs Card */}
      <Card className="bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-lg text-purple-200">Outfit Logs</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">{totalLogs}</div>
          <p className="text-sm text-white/70">Times you've logged outfits</p>
        </CardContent>
      </Card>
      
      {/* Most Worn Outfit */}
      <Card className="bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-lg text-purple-200">Most Worn</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {mostWornOutfit ? (
            <>
              <div className="text-xl font-bold mb-2">{mostWornOutfit.name}</div>
              <p className="text-sm text-white/70">Worn {mostWornOutfit.timesWorn} times</p>
            </>
          ) : (
            <p className="text-sm text-white/70">No outfit logs yet</p>
          )}
        </CardContent>
      </Card>
      
      {/* You can add more stat cards here */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-purple-400" />
            <CardTitle className="text-lg text-purple-200">Outfit Trends</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-center py-6 text-white/70">
            {outfitLogs.length > 0 ? (
              "Your outfit trends will appear here as you log more outfits"
            ) : (
              "Start logging outfits to see your personal style trends"
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OutfitStatsTab;
