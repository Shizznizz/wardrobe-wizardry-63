
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Outfit } from '@/lib/types';

interface WardrobeRecommendationsProps {
  rarelyWornOutfits: Outfit[];
  frequentlyWornOutfits: Outfit[];
  handleSelectOutfit: (outfitId: string) => void;
}

const WardrobeRecommendations = ({
  rarelyWornOutfits,
  frequentlyWornOutfits,
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
            <h4 className="font-medium text-purple-200 mb-2">Rarely Worn Items</h4>
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
            <h4 className="font-medium text-amber-200 mb-2">Frequently Worn Items</h4>
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
                    {outfit.name} (worn {outfit.timesWorn} times)
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
            <h4 className="font-medium text-blue-200 mb-2">Seasonal Suggestions</h4>
            <p className="text-sm text-slate-300">
              Based on the current season and your wardrobe history, consider trying these combinations:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-slate-300">
              <li>• Mix your rarely worn blue jeans with your favorite white top</li>
              <li>• Try pairing your black dress with a colorful accessory for variation</li>
              <li>• Your summer collection hasn't been used much - perfect time to try it</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WardrobeRecommendations;
