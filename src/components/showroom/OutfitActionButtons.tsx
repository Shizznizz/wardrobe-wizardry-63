
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface OutfitActionButtonsProps {
  selectedOutfit: any | null;
  userPhoto: string | null;
  finalImage: string | null;
  showClothingOptions: boolean;
  onToggleOptions: () => void;
}

const OutfitActionButtons = ({
  selectedOutfit,
  userPhoto,
  finalImage,
  showClothingOptions,
  onToggleOptions
}: OutfitActionButtonsProps) => {
  return (
    <div className="flex gap-2">
      {selectedOutfit && finalImage && (
        <Button 
          variant="outline"
          size="sm"
          onClick={onToggleOptions}
          className="border-purple-400/30 text-white hover:bg-white/10"
        >
          {showClothingOptions ? (
            <>Hide Options</>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" /> Customize Outfit
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default OutfitActionButtons;
