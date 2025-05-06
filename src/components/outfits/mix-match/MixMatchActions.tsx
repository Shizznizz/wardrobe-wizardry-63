
import { Button } from '@/components/ui/button';
import { Plus, Shirt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useOutfitContext } from '@/hooks/useOutfitContext';

interface MixMatchActionsProps {
  onScrollToOutfits?: () => void;
}

const MixMatchActions = ({ onScrollToOutfits }: MixMatchActionsProps) => {
  const navigate = useNavigate();
  const { 
    setIsBuilderOpen, 
    setSelectedOutfitId, 
    setIsCreatingNewOutfit,
    setSelectedOutfit
  } = useOutfitContext();

  const handleAddOutfit = () => {
    console.log("Opening outfit builder to create a new outfit");
    // Reset all outfit selection and editing state to ensure we're creating, not editing
    setSelectedOutfitId(null);
    setSelectedOutfit(null);
    setIsCreatingNewOutfit(true); // Set creation mode to true
    // Most importantly, make sure we open the builder modal
    setIsBuilderOpen(true); 
    toast.info("Creating a new outfit");
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
