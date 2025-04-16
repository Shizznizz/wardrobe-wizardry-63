
import { useIsMobile } from '@/hooks/use-mobile';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Calendar, Grid3X3, Calendar as CalendarIcon } from 'lucide-react';

interface ViewToggleProps {
  view: 'month' | 'week' | 'day';
  onViewChange: (value: 'month' | 'week' | 'day') => void;
}

const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  const isMobile = useIsMobile();

  return (
    <ToggleGroup type="single" value={view} onValueChange={(value: any) => onViewChange(value)}>
      <ToggleGroupItem value="month" aria-label="Month view">
        <Grid3X3 className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="week" aria-label="Week view">
        <Calendar className="h-4 w-4" />
      </ToggleGroupItem>
      {isMobile && (
        <ToggleGroupItem value="day" aria-label="Day view">
          <CalendarIcon className="h-4 w-4" />
        </ToggleGroupItem>
      )}
    </ToggleGroup>
  );
};

export default ViewToggle;
