
import { ClothingSeason } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SeasonsSelectorProps {
  selectedSeasons: ClothingSeason[];
  onToggleSeason: (season: ClothingSeason) => void;
}

const SeasonsSelector = ({ selectedSeasons, onToggleSeason }: SeasonsSelectorProps) => {
  const allSeasons: ClothingSeason[] = ['spring', 'summer', 'autumn', 'winter'];
  
  return (
    <div className="space-y-2">
      <Label>Seasons</Label>
      <div className="grid grid-cols-2 gap-3">
        {allSeasons.map((season) => (
          <div key={season} className="flex items-center space-x-2">
            <Checkbox
              id={`season-${season}`}
              checked={selectedSeasons.includes(season)}
              onCheckedChange={() => onToggleSeason(season)}
              className="bg-slate-800 border-slate-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            />
            <Label
              htmlFor={`season-${season}`}
              className="capitalize cursor-pointer text-sm font-medium"
            >
              {season}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonsSelector;
