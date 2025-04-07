
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

interface DateSelectorProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  datesWithOutfits: Array<{ date: Date; logs: any[]; hasLogs: boolean }>;
  onLogButtonClick: (date?: Date) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  renderCalendarDay?: (date: Date) => React.ReactNode;
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
  const isMobile = useIsMobile();
  
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  return (
    <Card className="col-span-1 bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-purple-200">Date Selection</CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-7 w-7 border-purple-500/30 hover:bg-purple-500/20"
            onClick={handlePrevMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-7 w-7 border-purple-500/30 hover:bg-purple-500/20"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="border border-purple-500/20 rounded-md bg-slate-900/50"
            modifiers={{
              hasOutfit: datesWithOutfits.map(d => d.date)
            }}
            modifiersStyles={{
              hasOutfit: {
                fontWeight: 'bold',
                borderBottom: '2px solid #8b5cf6'
              }
            }}
            components={{
              DayContent: ({ date, ...props }) => (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div {...props} />
                  {renderCalendarDay && renderCalendarDay(date)}
                </div>
              )
            }}
          />
        </div>
        
        <div className="flex justify-center">
          <Button 
            className="border-purple-500/30 hover:bg-purple-500/20"
            variant="outline"
            onClick={() => onLogButtonClick(selectedDate)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isMobile ? "Log Outfit" : "Log Outfit for Selected Date"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateSelector;
