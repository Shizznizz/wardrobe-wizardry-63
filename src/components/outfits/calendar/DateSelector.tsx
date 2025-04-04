
import { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

interface DateSelectorProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  datesWithOutfits: { date: Date; logs: any[]; hasLogs: boolean }[];
  onLogButtonClick: (date?: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  renderCalendarDay: (date: Date) => React.ReactNode;
}

const DateSelector = ({
  selectedDate,
  setSelectedDate,
  datesWithOutfits,
  onLogButtonClick,
  currentMonth,
  setCurrentMonth,
  renderCalendarDay
}: DateSelectorProps) => {
  const handlePreviousMonth = () => {
    const newDate = subMonths(currentMonth, 1);
    setCurrentMonth(newDate);
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentMonth, 1);
    setCurrentMonth(newDate);
  };

  return (
    <Card className="col-span-1 bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-purple-200">Date Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <Button
            variant="outline"
            size="sm"
            className="border-purple-500/30 bg-slate-800/70"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="font-medium text-purple-200">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            className="border-purple-500/30 bg-slate-800/70"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal border-purple-500/30 bg-slate-800/70"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-slate-900 border border-purple-500/30" align="start">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              className="p-3 pointer-events-auto"
              components={{
                DayContent: (props) => (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div>{props.date?.getDate()}</div>
                    {props.date && renderCalendarDay(props.date)}
                  </div>
                ),
              }}
              modifiers={{
                highlighted: datesWithOutfits.map(d => d.date)
              }}
              modifiersClassNames={{
                highlighted: "bg-purple-700/30 text-white rounded-md"
              }}
            />
          </PopoverContent>
        </Popover>
      </CardContent>
      <CardFooter className="pt-2 flex justify-center">
        <Button 
          size="lg" 
          className="w-full bg-purple-600 hover:bg-purple-700 font-medium"
          onClick={() => onLogButtonClick(selectedDate)}
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          Log Outfit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DateSelector;
