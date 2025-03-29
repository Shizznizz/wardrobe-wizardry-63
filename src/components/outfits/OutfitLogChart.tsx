
import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Outfit } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OutfitLog = {
  id: string;
  outfitId: string;
  date: Date;
  timeOfDay: string;
  notes?: string;
  weatherCondition?: string;
  temperature?: string;
};

interface OutfitLogChartProps {
  outfitLogs: OutfitLog[];
  outfits: Outfit[];
}

const OutfitLogChart = ({ outfitLogs, outfits }: OutfitLogChartProps) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
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
  
  // Count logs for each date in the selected range
  const getChartData = () => {
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
      
      const work = logsOnDate.filter(log => {
        const outfit = outfits.find(o => o.id === log.outfitId);
        return outfit?.occasions.includes('business');
      }).length;
      
      const other = logsOnDate.length - casual - formal - work;
      
      return {
        date: dateString,
        casual,
        formal,
        work,
        other: other > 0 ? other : 0
      };
    });
  };
  
  const data = getChartData();
  const isMostlyEmpty = data.every(item => 
    item.casual === 0 && item.formal === 0 && item.work === 0 && item.other === 0
  );
  
  return (
    <div className="h-full">
      <div className="flex justify-end mb-3">
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
      
      {isMostlyEmpty ? (
        <div className="h-48 flex items-center justify-center text-slate-400 italic">
          No outfit data available for the selected time period. Start logging outfits to see statistics.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
            <Bar dataKey="casual" name="Casual" stackId="a" fill="#7284ff" />
            <Bar dataKey="work" name="Work" stackId="a" fill="#a78bfa" />
            <Bar dataKey="formal" name="Formal" stackId="a" fill="#f472b6" />
            <Bar dataKey="other" name="Other" stackId="a" fill="#6ee7b7" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default OutfitLogChart;
