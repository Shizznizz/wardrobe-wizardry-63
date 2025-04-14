
import { Button } from "@/components/ui/button";
import { Heart, SunMedium, Martini } from "lucide-react";

interface OutfitFiltersProps {
  selectedSeason: string;
  selectedOccasion: string;
  favoritesOnly: boolean;
  onSeasonChange: (season: string) => void;
  onOccasionChange: (occasion: string) => void;
  onFavoritesToggle: () => void;
}

const OutfitFilters = ({
  selectedSeason,
  selectedOccasion,
  favoritesOnly,
  onSeasonChange,
  onOccasionChange,
  onFavoritesToggle
}: OutfitFiltersProps) => {
  const seasons = ["All", "Spring", "Summer", "Autumn", "Winter"];
  const occasions = ["All", "Casual", "Business", "Date Night", "Party"];

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {seasons.map((season) => (
          <Button
            key={season}
            variant={selectedSeason === season ? "default" : "outline"}
            size="sm"
            onClick={() => onSeasonChange(season)}
            className={selectedSeason === season ? 
              "bg-purple-600 hover:bg-purple-700" : 
              "border-white/10 hover:bg-white/5"
            }
          >
            <SunMedium className="w-4 h-4 mr-1" />
            {season}
          </Button>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {occasions.map((occasion) => (
          <Button
            key={occasion}
            variant={selectedOccasion === occasion ? "default" : "outline"}
            size="sm"
            onClick={() => onOccasionChange(occasion)}
            className={selectedOccasion === occasion ? 
              "bg-purple-600 hover:bg-purple-700" : 
              "border-white/10 hover:bg-white/5"
            }
          >
            <Martini className="w-4 h-4 mr-1" />
            {occasion}
          </Button>
        ))}
      </div>
      
      <Button
        variant={favoritesOnly ? "default" : "outline"}
        size="sm"
        onClick={onFavoritesToggle}
        className={favoritesOnly ? 
          "bg-pink-600 hover:bg-pink-700" : 
          "border-white/10 hover:bg-white/5"
        }
      >
        <Heart className={`w-4 h-4 mr-1 ${favoritesOnly ? "fill-current" : ""}`} />
        Favorites Only
      </Button>
    </div>
  );
};

export default OutfitFilters;
