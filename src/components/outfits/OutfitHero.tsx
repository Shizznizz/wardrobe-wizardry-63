
import React from 'react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WeatherIcon } from '@/components/ui/weather-icon';

const OutfitHero = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-indigo-950/40 to-purple-950/40 rounded-xl border border-white/10 p-6 w-full lg:w-2/5 shadow-lg backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
          Outfit Explorer
        </h2>
        
        <Select defaultValue="recent">
          <SelectTrigger className="w-[140px] text-xs h-8 bg-slate-800/50 border-slate-700/50">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-700/50">
            <SelectItem value="recent">Recent First</SelectItem>
            <SelectItem value="favorite">Favorites</SelectItem>
            <SelectItem value="seasonal">Seasonal</SelectItem>
            <SelectItem value="occasions">By Occasion</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-indigo-500/20 p-1.5">
              <WeatherIcon condition="partly-cloudy" className="h-6 w-6 text-blue-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">18°C Mostly Cloudy</p>
              <p className="text-xs text-white/60">San Francisco, CA</p>
            </div>
          </div>
          
          <Select defaultValue="today">
            <SelectTrigger className="w-[120px] text-xs h-7 bg-slate-800/50 border-slate-700/50">
              <SelectValue placeholder="Time frame" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700/50">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-base font-medium text-white/90 mb-3">Suggested For Today</h3>
        <p className="text-sm text-white/70">
          A light jacket and comfortable layers would be perfect for today's weather. 
          The temperature may drop in the evening.
        </p>
      </div>
    </motion.div>
  );
};

export default OutfitHero;
