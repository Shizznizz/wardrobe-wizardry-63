
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, isSameDay } from 'date-fns';
import { OutfitLog } from '@/components/outfits/OutfitLogItem';
import { DayContentProps } from 'react-day-picker';

interface ActiveModifiers {
  [date: string]: {
    hasOutfit: boolean;
    isSelected: boolean;
  };
}

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
  activeModifiers
}: DayContentProps & { 
  displayMonth: Date; 
  activeModifiers: ActiveModifiers;
}) => {
  // Format the date to a string key for lookup
  const dateKey = date.toISOString().split('T')[0];
  const hasOutfit = activeModifiers[dateKey]?.hasOutfit || false;
  const isSelected = activeModifiers[dateKey]?.isSelected || false;

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <div>{date.getDate()}</div>
      {hasOutfit && (
        <div 
          className={`absolute bottom-0.5 h-1.5 w-1.5 rounded-full ${
            isSelected ? 'bg-white' : 'bg-purple-500'
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
  const [activeModifiers, setActiveModifiers] = useState<ActiveModifiers>({});
  
  // Update the active modifiers when outfit logs or selected date changes
  useEffect(() => {
    const newModifiers: ActiveModifiers = {};
    
    // Add outfit indicators
    outfitLogs.forEach(log => {
      if (log.date) {
        const dateKey = new Date(log.date).toISOString().split('T')[0];
        newModifiers[dateKey] = {
          hasOutfit: true,
          isSelected: isSameDay(new Date(log.date), selectedDate)
        };
      }
    });
    
    // Mark selected date
    const selectedDateKey = selectedDate.toISOString().split('T')[0];
    newModifiers[selectedDateKey] = {
      hasOutfit: newModifiers[selectedDateKey]?.hasOutfit || false,
      isSelected: true
    };
    
    setActiveModifiers(newModifiers);
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

  // Create custom modifiers from our activeModifiers structure
  const customModifiers = Object.keys(activeModifiers).reduce((acc, dateKey) => {
    const mods = activeModifiers[dateKey];
    // Convert our custom format to day-picker format
    if (mods.hasOutfit) {
      acc[`hasOutfit-${dateKey}`] = new Date(dateKey);
    }
    if (mods.isSelected) {
      acc[`isSelected-${dateKey}`] = new Date(dateKey);
    }
    return acc;
  }, {} as Record<string, Date>);

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
          modifiers={customModifiers}
          modifiersClassNames={{
            selected: "bg-purple-600 text-white",
          }}
          components={{
            DayContent: (props) => (
              <DayContent 
                {...props} 
                displayMonth={currentMonth} 
                activeModifiers={activeModifiers} 
              />
            )
          }}
        />
      </CardContent>
    </Card>
  );
};

export default DateSelector;
