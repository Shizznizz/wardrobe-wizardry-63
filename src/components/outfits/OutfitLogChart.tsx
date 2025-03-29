
import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Outfit } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { OutfitLog } from './OutfitLogItem';

interface OutfitLogChartProps {
  outfitLogs: OutfitLog[];
  outfits: Outfit[];
}

const OCCASION_COLORS = {
  casual: "#7284ff",
  business: "#a78bfa", 
  formal: "#f472b6",
  party: "#fb923c",
  sporty: "#4ade80",
  vacation: "#38bdf8",
  date: "#fb7185",
  other: "#6ee7b7"
};

const SEASON_COLORS = {
  spring: "#4ade80",
  summer: "#fb923c",
  autumn: "#f97316",
  winter: "#38bdf8",
  all: "#a78bfa"
};

const OutfitLogChart = ({ outfitLogs, outfits }: OutfitLogChartProps) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [chartType, setChartType] = useState<'usage' | 'occasion' | 'season'>('usage');
  
  // Generate dates for the selected time range
  const getDates = () => {
    const today = new Date();
    const dates: Date[] = [];
    
    if (timeRange === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        dates.push(date);
      }
    } else if (timeRange === 'month') {
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        dates.push(date);
      }
    } else if (timeRange === 'year') {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(today.getMonth() - i);
        date.setDate(1);
        dates.push(date);
      }
    }
    
    return dates;
  };
  
  // Count logs for each date in the selected range - Usage chart
  const getUsageChartData = () => {
    const dates = getDates();
    
    return dates.map(date => {
      let dateString;
      if (timeRange === 'year') {
        dateString = date.toLocaleDateString('en-US', { month: 'short' });
      } else {
        dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      
      // Count logs for this date
      const logsOnDate = outfitLogs.filter(log => {
        const logDate = new Date(log.date);
        if (timeRange === 'year') {
          return logDate.getMonth() === date.getMonth() && 
                 logDate.getFullYear() === date.getFullYear();
        } else {
          return logDate.getDate() === date.getDate() && 
                 logDate.getMonth() === date.getMonth() && 
                 logDate.getFullYear() === date.getFullYear();
        }
      });
      
      // Generate outfit type counts
      const casual = logsOnDate.filter(log => {
        const outfit = outfits.find(o => o.id === log.outfitId);
        return outfit?.occasions.includes('casual');
      }).length;
      
      const formal = logsOnDate.filter(log => {
        const outfit = outfits.find(o => o.id === log.outfitId);
        return outfit?.occasions.includes('formal');
      }).length;
      
      const business = logsOnDate.filter(log => {
        const outfit = outfits.find(o => o.id === log.outfitId);
        return outfit?.occasions.includes('business');
      }).length;
      
      const party = logsOnDate.filter(log => {
        const outfit = outfits.find(o => o.id === log.outfitId);
        return outfit?.occasions.includes('party');
      }).length;
      
      const other = logsOnDate.length - casual - formal - business - party;
      
      return {
        date: dateString,
        casual,
        formal,
        business,
        party,
        other: other > 0 ? other : 0
      };
    });
  };
  
  // Get occasion distribution data for pie chart
  const getOccasionChartData = () => {
    const occasionCounts: { [key: string]: number } = {};
    
    outfitLogs.forEach(log => {
      const outfit = outfits.find(o => o.id === log.outfitId);
      if (outfit) {
        outfit.occasions.forEach(occasion => {
          occasionCounts[occasion] = (occasionCounts[occasion] || 0) + 1;
        });
      }
    });
    
    return Object.entries(occasionCounts).map(([name, value]) => ({
      name,
      value,
    }));
  };
  
  // Get seasonal data for pie chart
  const getSeasonChartData = () => {
    const seasonCounts: { [key: string]: number } = {
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
          seasonCounts[season] = (seasonCounts[season] || 0) + 1;
        });
      }
    });
    
    return Object.entries(seasonCounts)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value,
      }));
  };
  
  const usageData = getUsageChartData();
  const occasionData = getOccasionChartData();
  const seasonData = getSeasonChartData();
  
  const isDataEmpty = () => {
    if (chartType === 'usage') {
      return usageData.every(item => 
        item.casual === 0 && item.formal === 0 && item.business === 0 && item.party === 0 && item.other === 0
      );
    } else if (chartType === 'occasion') {
      return occasionData.length === 0;
    } else {
      return seasonData.length === 0;
    }
  };
  
  return (
    <div className="h-full">
      <div className="flex justify-between mb-3">
        <Tabs value={chartType} onValueChange={(value: 'usage' | 'occasion' | 'season') => setChartType(value)}>
          <TabsList>
            <TabsTrigger value="usage">Usage Trends</TabsTrigger>
            <TabsTrigger value="occasion">Occasions</TabsTrigger>
            <TabsTrigger value="season">Seasons</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Select 
          value={timeRange} 
          onValueChange={(value: 'week' | 'month' | 'year') => setTimeRange(value)}
        >
          <SelectTrigger className="w-[150px] border-purple-500/30 bg-slate-800">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-purple-500/30">
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
            <SelectItem value="year">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isDataEmpty() ? (
        <div className="h-48 flex items-center justify-center text-slate-400 italic">
          No outfit data available for the selected time period. Start logging outfits to see statistics.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'usage' ? (
            <BarChart
              data={usageData}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#aaa' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fill: '#aaa' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1c1c2d', borderColor: '#675dcf', color: '#fff' }}
                cursor={{ fill: 'rgba(94, 83, 193, 0.1)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="casual" name="Casual" stackId="a" fill={OCCASION_COLORS.casual} />
              <Bar dataKey="business" name="Work" stackId="a" fill={OCCASION_COLORS.business} />
              <Bar dataKey="formal" name="Formal" stackId="a" fill={OCCASION_COLORS.formal} />
              <Bar dataKey="party" name="Party" stackId="a" fill={OCCASION_COLORS.party} />
              <Bar dataKey="other" name="Other" stackId="a" fill={OCCASION_COLORS.other} />
            </BarChart>
          ) : chartType === 'occasion' ? (
            <PieChart>
              <Pie
                data={occasionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {occasionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={OCCASION_COLORS[entry.name as keyof typeof OCCASION_COLORS] || OCCASION_COLORS.other} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1c1c2d', borderColor: '#675dcf', color: '#fff' }}
                formatter={(value) => [`${value} logs`, 'Count']}
              />
            </PieChart>
          ) : (
            <PieChart>
              <Pie
                data={seasonData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {seasonData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={SEASON_COLORS[entry.name as keyof typeof SEASON_COLORS] || SEASON_COLORS.all} 
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1c1c2d', borderColor: '#675dcf', color: '#fff' }}
                formatter={(value) => [`${value} logs`, 'Count']}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default OutfitLogChart;
