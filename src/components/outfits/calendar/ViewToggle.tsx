
import React from 'react';
import { CalendarIcon, CalendarDays } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ViewToggleProps {
  view: 'month' | 'week';
  onViewChange: (value: 'month' | 'week') => void;
}

const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex justify-center mb-4">
      <ToggleGroup 
        type="single" 
        value={view} 
        onValueChange={(value) => value && onViewChange(value as 'month' | 'week')}
      >
        <ToggleGroupItem value="month" aria-label="Month view" className="px-3 py-1">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Month
        </ToggleGroupItem>
        <ToggleGroupItem value="week" aria-label="Week view" className="px-3 py-1">
          <CalendarDays className="h-4 w-4 mr-2" />
          Week
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ViewToggle;
