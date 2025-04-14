
import { Button } from '@/components/ui/button';
import { Heart, SunMedium, Briefcase, Moon, Coffee } from 'lucide-react';
import { ClothingSeason, ClothingOccasion } from '@/lib/types';

interface OutfitFiltersProps {
  selectedSeason: ClothingSeason | null;
  selectedOccasion: ClothingOccasion | null;
  showFavoritesOnly: boolean;
  onSeasonChange: (season: ClothingSeason) => void;
  onOccasionChange: (occasion: ClothingOccasion) => void;
  onFavoritesToggle: () => void;
}

const OutfitFilters = ({
  selectedSeason,
  selectedOccasion,
  showFavoritesOnly,
  onSeasonChange,
  onOccasionChange,
  onFavoritesToggle
}: OutfitFiltersProps) => {
  // Define proper typed arrays with default values to prevent undefined errors
  const seasons: ClothingSeason[] = ['spring', 'summer', 'autumn', 'winter'];
  const occasions: ClothingOccasion[] = ['casual', 'business', 'party', 'date'];
  
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-white/60 w-full">Season:</span>
        {seasons.map((season) => (
          <Button
            key={season}
            variant={selectedSeason === season ? "default" : "outline"}
            size="sm"
            onClick={() => onSeasonChange(season)}
            className={selectedSeason === season ? 
              "bg-purple-600 hover:bg-purple-700" : 
              "border-white/20 text-white hover:bg-white/10"}
          >
            {season.charAt(0).toUpperCase() + season.slice(1)}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-white/60 w-full">Occasion:</span>
        {occasions.map((occasion) => (
          <Button
            key={occasion}
            variant={selectedOccasion === occasion ? "default" : "outline"}
            size="sm"
            onClick={() => onOccasionChange(occasion)}
            className={selectedOccasion === occasion ? 
              "bg-purple-600 hover:bg-purple-700" : 
              "border-white/20 text-white hover:bg-white/10"}
          >
            {occasion === 'business' && <Briefcase className="w-4 h-4 mr-1" />}
            {occasion === 'party' && <SunMedium className="w-4 h-4 mr-1" />}
            {occasion === 'date' && <Moon className="w-4 h-4 mr-1" />}
            {occasion === 'casual' && <Coffee className="w-4 h-4 mr-1" />}
            {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
          </Button>
        ))}
      </div>

      <Button
        variant={showFavoritesOnly ? "default" : "outline"}
        size="sm"
        onClick={onFavoritesToggle}
        className={showFavoritesOnly ? 
          "bg-pink-600 hover:bg-pink-700" : 
          "border-white/20 text-white hover:bg-white/10"}
      >
        <Heart className={`w-4 h-4 mr-2 ${showFavoritesOnly ? "fill-current" : ""}`} />
        Favorites Only
      </Button>
    </div>
  );
};

export default OutfitFilters;
