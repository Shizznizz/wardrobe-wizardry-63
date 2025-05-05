
import { Button } from '@/components/ui/button';
import { Plus, Shirt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useOutfitContext } from '@/hooks/useOutfitContext';

interface MixMatchActionsProps {
  onScrollToOutfits?: () => void;
  onCreateOutfit?: () => void;
}

const MixMatchActions = ({ onScrollToOutfits, onCreateOutfit }: MixMatchActionsProps) => {
  const navigate = useNavigate();
  const { setIsBuilderOpen, setSelectedOutfitId } = useOutfitContext();

  const handleAddOutfit = () => {
    if (onCreateOutfit) {
      onCreateOutfit();
    } else {
      // Ensure we clear any selected outfit
      setSelectedOutfitId(null);
      setIsBuilderOpen(true);
      toast.info("Opening outfit builder");
    }
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center sm:justify-start mb-6">
      <Button
        onClick={onScrollToOutfits}
        variant="hero-primary"
        className="flex-1 sm:flex-none min-w-[160px]"
      >
        <Shirt className="h-4 w-4 mr-1" />
        See My Outfits
      </Button>
      <Button
        onClick={handleAddOutfit}
        variant="hero-secondary"
        className="flex-1 sm:flex-none min-w-[160px]"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add New Outfit
      </Button>
    </div>
  );
};

export default MixMatchActions;
