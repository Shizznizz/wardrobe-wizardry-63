
import { useIsMobile } from '@/hooks/use-mobile';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Grid3X3, Calendar as CalendarIcon, CalendarDays } from 'lucide-react';

interface ViewToggleProps {
  view: 'month' | 'week' | 'day';
  onViewChange: (value: 'month' | 'week' | 'day') => void;
}

const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  const isMobile = useIsMobile();

  return (
    <ToggleGroup 
      type="single" 
      value={view} 
      onValueChange={(value: any) => onViewChange(value)}
      className="bg-slate-800/50 backdrop-blur-sm p-1 rounded-lg border border-slate-700/30"
    >
      <ToggleGroupItem 
        value="month" 
        aria-label="Month view"
        className={`${view === 'month' ? 'bg-primary/30 text-white' : ''} hover:bg-primary/20`}
      >
        <Grid3X3 className="h-4 w-4 mr-1" />
        {!isMobile && <span className="text-xs">Month</span>}
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="week" 
        aria-label="Week view"
        className={`${view === 'week' ? 'bg-primary/30 text-white' : ''} hover:bg-primary/20`}
      >
        <CalendarDays className="h-4 w-4 mr-1" />
        {!isMobile && <span className="text-xs">Week</span>}
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="day" 
        aria-label="Day view"
        className={`${view === 'day' ? 'bg-primary/30 text-white' : ''} hover:bg-primary/20`}
      >
        <CalendarIcon className="h-4 w-4 mr-1" />
        {!isMobile && <span className="text-xs">Day</span>}
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ViewToggle;
