
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <div className="flex gap-2">
      {selectedOutfit && finalImage && (
        <Button 
          variant="outline"
          size={isMobile ? "sm" : "default"}
          onClick={onToggleOptions}
          className={`border-purple-400/30 text-white hover:bg-white/10 ${isMobile ? 'py-2 px-3 text-sm' : ''}`}
        >
          {showClothingOptions ? (
            <>Hide Options</>
          ) : (
            <>
              <Edit className={`${isMobile ? 'mr-1' : 'mr-2'} h-4 w-4`} /> 
              {isMobile ? 'Customize' : 'Customize Outfit'}
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default OutfitActionButtons;
