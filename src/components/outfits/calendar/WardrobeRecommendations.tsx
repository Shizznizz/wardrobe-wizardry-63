
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Outfit } from '@/lib/types';
import { CalendarClock, RepeatIcon, Sparkles } from 'lucide-react';

interface WardrobeRecommendationsProps {
  rarelyWornOutfits: Outfit[];
  frequentlyWornOutfits: Outfit[];
  seasonalSuggestions: Outfit[];
  handleSelectOutfit: (outfitId: string) => void;
}

const WardrobeRecommendations = ({
  rarelyWornOutfits,
  frequentlyWornOutfits,
  seasonalSuggestions,
  handleSelectOutfit,
}: WardrobeRecommendationsProps) => {
  return (
    <Card className="col-span-1 md:col-span-3 bg-slate-800/40 border-purple-500/20 shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-purple-200">Wardrobe Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-900/30 p-4 rounded-md border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              <CalendarClock className="h-4 w-4 text-purple-300" />
              <h4 className="font-medium text-purple-200">Rarely Worn Items</h4>
            </div>
            <p className="text-sm text-slate-300 mb-3">
              Consider wearing these outfits that haven't been worn in the last 30 days:
            </p>
            {rarelyWornOutfits.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {rarelyWornOutfits.slice(0, 3).map(outfit => (
                  <Badge 
                    key={outfit.id} 
                    className="bg-purple-800/50 hover:bg-purple-700/70 cursor-pointer transition-colors"
                    onClick={() => handleSelectOutfit(outfit.id)}
                  >
                    {outfit.name}
                  </Badge>
                ))}
                {rarelyWornOutfits.length > 3 && (
                  <Badge className="bg-slate-700/70">+{rarelyWornOutfits.length - 3} more</Badge>
                )}
              </div>
            ) : (
              <p className="text-slate-400 italic">All outfits have been worn recently</p>
            )}
          </div>
          
          <div className="bg-amber-900/20 p-4 rounded-md border border-amber-500/30">
            <div className="flex items-center gap-2 mb-2">
              <RepeatIcon className="h-4 w-4 text-amber-300" />
              <h4 className="font-medium text-amber-200">Frequently Worn Items</h4>
            </div>
            <p className="text-sm text-slate-300 mb-3">
              Consider giving these frequently worn outfits a break:
            </p>
            {frequentlyWornOutfits.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {frequentlyWornOutfits.slice(0, 3).map(outfit => (
                  <Badge 
                    key={outfit.id}
                    className="bg-amber-800/50 hover:bg-amber-700/70 cursor-pointer transition-colors"
                  >
                    {outfit.name} (worn {outfit.timesWorn || 0} times)
                  </Badge>
                ))}
                {frequentlyWornOutfits.length > 3 && (
                  <Badge className="bg-slate-700/70">+{frequentlyWornOutfits.length - 3} more</Badge>
                )}
              </div>
            ) : (
              <p className="text-slate-400 italic">No outfits have been worn frequently</p>
            )}
          </div>
          
          <div className="bg-blue-900/20 p-4 rounded-md border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-blue-300" />
              <h4 className="font-medium text-blue-200">Seasonal Suggestions</h4>
            </div>
            <p className="text-sm text-slate-300 mb-3">
              Based on the current season and your wardrobe history:
            </p>
            {seasonalSuggestions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {seasonalSuggestions.slice(0, 3).map(outfit => (
                  <Badge 
                    key={outfit.id}
                    className="bg-blue-800/50 hover:bg-blue-700/70 cursor-pointer transition-colors"
                    onClick={() => handleSelectOutfit(outfit.id)}
                  >
                    {outfit.name}
                  </Badge>
                ))}
                {seasonalSuggestions.length > 3 && (
                  <Badge className="bg-slate-700/70">+{seasonalSuggestions.length - 3} more</Badge>
                )}
              </div>
            ) : (
              <p className="text-slate-400 italic">
                Try mixing your rarely worn blue jeans with your favorite white top, or pairing your black dress with a colorful accessory for variation.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WardrobeRecommendations;
