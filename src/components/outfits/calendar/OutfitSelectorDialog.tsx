
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from 'lucide-react';
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
  const filteredOutfits = selectedSeason 
    ? outfits.filter(outfit => outfit.seasons.includes(selectedSeason))
    : [];

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
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 hover:bg-slate-800"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Select
            value={selectedSeason}
            onValueChange={(value: ClothingSeason) => {
              setSelectedSeason(value);
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
