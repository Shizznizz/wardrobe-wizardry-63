
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Outfit, ClothingSeason } from '@/lib/types';
import OutfitPreview from './OutfitPreview';
import { X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface OutfitSelectorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (outfitId: string) => void;
  outfits: Outfit[];
}

const OutfitSelectorDialog = ({ isOpen, onClose, onSubmit, outfits }: OutfitSelectorDialogProps) => {
  const [selectedSeason, setSelectedSeason] = useState<ClothingSeason | null>(null);
  const [selectedOutfitId, setSelectedOutfitId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSelectedSeason(null);
      setSelectedOutfitId('');
      setSearchQuery('');
    }
  }, [isOpen]);

  const seasons: ClothingSeason[] = ['spring', 'summer', 'autumn', 'winter', 'all'];
  
  // Filter outfits based on season and search query
  const filteredOutfits = outfits.filter(outfit => {
    const matchesSeason = !selectedSeason || outfit.seasons?.includes(selectedSeason);
    const matchesSearch = !searchQuery || 
      outfit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (outfit.occasions?.some(o => o.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesSeason && matchesSearch;
  });

  // Group outfits by occasions for better organization
  const getOutfitsByOccasion = () => {
    const occasionMap = new Map<string, Outfit[]>();
    
    filteredOutfits.forEach(outfit => {
      if (outfit.occasions && outfit.occasions.length > 0) {
        outfit.occasions.forEach(occasion => {
          if (!occasionMap.has(occasion)) {
            occasionMap.set(occasion, []);
          }
          occasionMap.get(occasion)?.push(outfit);
        });
      } else {
        if (!occasionMap.has('Other')) {
          occasionMap.set('Other', []);
        }
        occasionMap.get('Other')?.push(outfit);
      }
    });
    
    return occasionMap;
  };

  const outfitsByOccasion = getOutfitsByOccasion();
  const selectedOutfit = outfits.find(o => o.id === selectedOutfitId);

  const handleOutfitSelect = (outfitId: string) => {
    setSelectedOutfitId(outfitId);
  };

  const handleSubmit = () => {
    if (selectedOutfitId) {
      onSubmit(selectedOutfitId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-slate-900 border-purple-500/20 text-white">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 ring-offset-background transition-opacity focus:outline-none disabled:pointer-events-none">
          <X className="h-4 w-4 text-white" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Select an Outfit
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search outfits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white pl-8"
                />
              </div>
            </div>
            <div className="w-full sm:w-1/3">
              <Select
                value={selectedSeason || undefined}
                onValueChange={(value: ClothingSeason) => {
                  setSelectedSeason(value);
                }}
              >
                <SelectTrigger className="w-full bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent 
                  className="bg-slate-800 border-slate-700 text-white max-h-[300px]"
                  position="popper"
                  sideOffset={5}
                >
                  <SelectItem key="all-seasons" value="">All seasons</SelectItem>
                  {seasons.map(season => (
                    <SelectItem key={season} value={season}>
                      {season.charAt(0).toUpperCase() + season.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <ScrollArea className="h-[300px] pr-4">
            {Array.from(outfitsByOccasion.entries()).map(([occasion, outfitList]) => (
              <div key={occasion} className="mb-4">
                <h3 className="text-sm font-semibold text-purple-300 mb-2">
                  {occasion.charAt(0).toUpperCase() + occasion.slice(1)}
                </h3>
                <div className="space-y-2">
                  {outfitList.map(outfit => (
                    <div 
                      key={outfit.id} 
                      className={`p-2 rounded-lg border cursor-pointer transition-colors
                        ${selectedOutfitId === outfit.id 
                          ? 'bg-purple-800/50 border-purple-500' 
                          : 'bg-slate-800/30 border-slate-700/30 hover:bg-slate-700/40'}`}
                      onClick={() => handleOutfitSelect(outfit.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-slate-700/50 rounded-md flex items-center justify-center overflow-hidden">
                          {/* Outfit preview placeholder */}
                          <span className="text-2xl text-slate-400">👔</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{outfit.name}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {outfit.seasons?.map(season => (
                              <Badge key={season} variant="secondary" className="text-[10px] py-0">
                                {season}
                              </Badge>
                            ))}
                            {outfit.favorite && (
                              <Badge variant="gradient" className="text-[10px] py-0">
                                Favorite
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredOutfits.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                No outfits match your search
              </div>
            )}
          </ScrollArea>

          <div className="flex justify-end gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!selectedOutfitId}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Select Outfit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OutfitSelectorDialog;
