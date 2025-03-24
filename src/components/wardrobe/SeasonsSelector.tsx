
import { ClothingSeason } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SeasonsSelectorProps {
  selectedSeasons: ClothingSeason[];
  onToggleSeason: (season: ClothingSeason) => void;
}

const SeasonsSelector = ({ selectedSeasons, onToggleSeason }: SeasonsSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Seasons</Label>
      <div className="grid grid-cols-2 gap-2">
        {(['spring', 'summer', 'autumn', 'winter'] as ClothingSeason[]).map((season) => (
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
      </div>
    </div>
  );
};

export default SeasonsSelector;
