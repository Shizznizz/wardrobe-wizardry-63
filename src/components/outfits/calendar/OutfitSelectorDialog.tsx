
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Outfit, ClothingSeason } from '@/lib/types';
import OutfitPreview from './OutfitPreview';

interface OutfitSelectorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (outfitId: string) => void;
  outfits: Outfit[];
}

const OutfitSelectorDialog = ({ isOpen, onClose, onSubmit, outfits }: OutfitSelectorDialogProps) => {
  const [selectedSeason, setSelectedSeason] = useState<ClothingSeason | ''>('');
  const [selectedOutfitId, setSelectedOutfitId] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setSelectedSeason('');
      setSelectedOutfitId('');
    }
  }, [isOpen]);

  const seasons: ClothingSeason[] = ['spring', 'summer', 'autumn', 'winter'];
  
  // Group outfits by category (e.g., casual, formal, etc.) for the second dropdown
  const getOutfitCategories = () => {
    if (!selectedSeason) return [];
    
    const seasonOutfits = outfits.filter(outfit => outfit.seasons.includes(selectedSeason));
    const categories = new Set<string>();
    
    seasonOutfits.forEach(outfit => {
      if (outfit.category) {
        categories.add(outfit.category);
      } else {
        categories.add('Uncategorized');
      }
    });
    
    return Array.from(categories);
  };
  
  const getCategoryOutfits = (category: string) => {
    return outfits.filter(outfit => 
      outfit.seasons.includes(selectedSeason) && 
      (outfit.category === category || (!outfit.category && category === 'Uncategorized'))
    );
  };
  
  const outfitCategories = getOutfitCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const filteredOutfits = selectedCategory ? getCategoryOutfits(selectedCategory) : [];

  const selectedOutfit = outfits.find(o => o.id === selectedOutfitId);

  const handleSubmit = () => {
    if (selectedOutfitId) {
      onSubmit(selectedOutfitId);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-purple-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Add Outfit
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Select
            value={selectedSeason}
            onValueChange={(value: ClothingSeason) => {
              setSelectedSeason(value);
              setSelectedCategory('');
              setSelectedOutfitId('');
            }}
          >
            <SelectTrigger className="w-full bg-slate-800 border-slate-700">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              {seasons.map(season => (
                <SelectItem key={season} value={season}>
                  {season.charAt(0).toUpperCase() + season.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedSeason && (
            <Select
              value={selectedCategory}
              onValueChange={(value: string) => {
                setSelectedCategory(value);
                setSelectedOutfitId('');
              }}
            >
              <SelectTrigger className="w-full bg-slate-800 border-slate-700">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                {outfitCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {selectedCategory && (
            <Select
              value={selectedOutfitId}
              onValueChange={setSelectedOutfitId}
            >
              <SelectTrigger className="w-full bg-slate-800 border-slate-700">
                <SelectValue placeholder="Select outfit" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                {filteredOutfits.map(outfit => (
                  <SelectItem key={outfit.id} value={outfit.id}>
                    {outfit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {selectedOutfit && (
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <OutfitPreview outfit={selectedOutfit} />
            </div>
          )}
        </div>

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
            Add Outfit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OutfitSelectorDialog;
