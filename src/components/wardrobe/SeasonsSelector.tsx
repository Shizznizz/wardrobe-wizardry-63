
import { ClothingSeason } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface SeasonsSelectorProps {
  selectedSeasons: ClothingSeason[];
  onToggleSeason: (season: ClothingSeason) => void;
}

const SeasonsSelector = ({ selectedSeasons, onToggleSeason }: SeasonsSelectorProps) => {
  const [showAll, setShowAll] = useState(false);
  const MAX_VISIBLE = 3;
  const allSeasons: ClothingSeason[] = ['spring', 'summer', 'autumn', 'winter'];
  
  const visibleSeasons = showAll ? allSeasons : allSeasons.slice(0, MAX_VISIBLE);
  const hiddenCount = allSeasons.length - MAX_VISIBLE;

  return (
    <div className="space-y-2">
      <Label>Seasons</Label>
      <div className="grid grid-cols-2 gap-2">
        {visibleSeasons.map((season) => (
          <div key={season} className="flex items-center space-x-2">
            <Checkbox
              id={`season-${season}`}
              checked={selectedSeasons.includes(season)}
              onCheckedChange={() => onToggleSeason(season)}
            />
            <Label
              htmlFor={`season-${season}`}
              className="capitalize cursor-pointer text-sm"
            >
              {season}
            </Label>
          </div>
        ))}
        
        {!showAll && hiddenCount > 0 && (
          <button 
            type="button"
            className="flex items-center text-xs text-primary hover:text-primary/80 transition-colors"
            onClick={() => setShowAll(true)}
          >
            <ChevronDown className="h-3 w-3 mr-1" />
            Show {hiddenCount} more
          </button>
        )}
        
        {showAll && (
          <button 
            type="button"
            className="flex items-center text-xs text-primary hover:text-primary/80 transition-colors"
            onClick={() => setShowAll(false)}
          >
            <ChevronUp className="h-3 w-3 mr-1" />
            Show less
          </button>
        )}
      </div>
    </div>
  );
};

export default SeasonsSelector;
