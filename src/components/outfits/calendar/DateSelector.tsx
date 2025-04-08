
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, isSameDay } from 'date-fns';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import { DayContentProps } from 'react-day-picker';

// Interface for our rich metadata about dates
interface DateDisplayMeta {
  hasOutfit: boolean;
  isSelected: boolean;
}

// Storage for our rich metadata, separate from Calendar's modifiers
type DateMetadataMap = Record<string, DateDisplayMeta>;

interface DateSelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  outfitLogs: OutfitLog[];
  className?: string;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

// Custom DayContent component to show outfit indicators
const DayContent = ({ 
  date, 
  displayMonth,
  dateMetadata
}: DayContentProps & { 
  displayMonth: Date; 
  dateMetadata: DateMetadataMap;
}) => {
  // Format the date to a string key for lookup
  const dateKey = date.toISOString().split('T')[0];
  const meta = dateMetadata[dateKey] || { hasOutfit: false, isSelected: false };

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <div>{date.getDate()}</div>
      {meta.hasOutfit && (
        <div 
          className={`absolute bottom-0.5 h-1.5 w-1.5 rounded-full ${
            meta.isSelected ? 'bg-white' : 'bg-purple-500'
          }`}
        />
      )}
    </div>
  );
};

const DateSelector = ({ 
  selectedDate, 
  onSelectDate, 
  outfitLogs,
  className = '',
  currentMonth,
  onMonthChange
}: DateSelectorProps) => {
  // Store our rich metadata separate from Calendar's modifiers
  const [dateMetadata, setDateMetadata] = useState<DateMetadataMap>({});
  
  // Update the metadata when outfit logs or selected date changes
  useEffect(() => {
    const newMetadata: DateMetadataMap = {};
    
    // Add outfit indicators
    outfitLogs.forEach(log => {
      if (log.date) {
        const dateKey = new Date(log.date).toISOString().split('T')[0];
        newMetadata[dateKey] = {
          hasOutfit: true,
          isSelected: isSameDay(new Date(log.date), selectedDate)
        };
      }
    });
    
    // Mark selected date
    const selectedDateKey = selectedDate.toISOString().split('T')[0];
    newMetadata[selectedDateKey] = {
      hasOutfit: newMetadata[selectedDateKey]?.hasOutfit || false,
      isSelected: true
    };
    
    setDateMetadata(newMetadata);
  }, [outfitLogs, selectedDate]);
  
  const handleMonthChange = (newMonth: Date) => {
    onMonthChange(newMonth);
  };

  const goToPreviousMonth = () => {
    handleMonthChange(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    handleMonthChange(addMonths(currentMonth, 1));
  };

  // Create arrays of dates with outfits for the DayPicker component
  const daysWithOutfits = outfitLogs
    .filter(log => log.date)
    .map(log => new Date(log.date));

  // Create simple boolean modifiers that the Calendar component expects
  // This is what fixes the TypeScript error
  const modifiers = {
    hasOutfit: daysWithOutfits,
    selected: [selectedDate]
  };

  // The 'modifiersClassNames' prop expects this specific format
  const modifiersClassNames = {
    selected: "bg-purple-600 text-white",
    hasOutfit: "", // We'll handle this in the DayContent component
  };

  return (
    <Card className={`bg-slate-800/60 border-purple-500/20 shadow-lg backdrop-blur-sm ${className}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={goToPreviousMonth}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h3 className="text-lg font-medium text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={goToNextMonth}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onSelectDate(date)}
          month={currentMonth}
          onMonthChange={handleMonthChange}
          className="border-none"
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          components={{
            DayContent: (props) => (
              <DayContent 
                {...props} 
                displayMonth={currentMonth} 
                dateMetadata={dateMetadata} 
              />
            )
          }}
        />
      </CardContent>
    </Card>
  );
};

export default DateSelector;
