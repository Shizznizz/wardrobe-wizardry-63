
import { Button } from "@/components/ui/button";
import { Heart, SunMedium, Martini } from "lucide-react";
import { ClothingSeason, ClothingOccasion } from "@/lib/types";

interface OutfitFiltersProps {
  selectedSeason: ClothingSeason;
  selectedOccasion: ClothingOccasion;
  favoritesOnly: boolean;
  onSeasonChange: (season: ClothingSeason) => void;
  onOccasionChange: (occasion: ClothingOccasion) => void;
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
  const seasons: ClothingSeason[] = ["all", "spring", "summer", "autumn", "winter"];
  const occasions: ClothingOccasion[] = ["casual", "business", "party", "formal"];

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
            {season.charAt(0).toUpperCase() + season.slice(1)}
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
            {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
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
