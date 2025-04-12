
import React from 'react';
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
      <TabsList className="grid w-full md:w-1/2 mx-auto grid-cols-2 mb-6">
        <TabsTrigger value="calendar" className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          Calendar
        </TabsTrigger>
        <TabsTrigger value="stats" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Statistics
        </TabsTrigger>
      </TabsList>
    
      <TabsContent value="calendar">
        {calendarContent}
      </TabsContent>
      
      <TabsContent value="stats">
        {statsContent}
      </TabsContent>
    </Tabs>
  );
};

export default CalendarTabs;
