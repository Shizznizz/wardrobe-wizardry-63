
import React from 'react';
import { motion } from 'framer-motion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { CalendarIcon, BarChart3 } from 'lucide-react';

interface CalendarTabsProps {
  selectedTab: string;
  setSelectedTab: (value: string) => void;
  calendarContent: React.ReactNode;
  statsContent: React.ReactNode;
}

const CalendarTabs = ({
  selectedTab,
  setSelectedTab,
  calendarContent,
  statsContent
}: CalendarTabsProps) => {
  return (
    <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
      <TabsList className="grid w-full md:w-1/2 mx-auto grid-cols-2 mb-6 bg-slate-800/50 border border-purple-500/20">
        <TabsTrigger 
          value="calendar" 
          className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 transition-all duration-300"
        >
          <CalendarIcon className="h-4 w-4" />
          Calendar
        </TabsTrigger>
        <TabsTrigger 
          value="stats" 
          className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 transition-all duration-300"
        >
          <BarChart3 className="h-4 w-4" />
          Statistics
        </TabsTrigger>
      </TabsList>
    
      <TabsContent value="calendar">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          {calendarContent}
        </motion.div>
      </TabsContent>
      
      <TabsContent value="stats">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {statsContent}
        </motion.div>
      </TabsContent>
    </Tabs>
  );
};

export default CalendarTabs;
