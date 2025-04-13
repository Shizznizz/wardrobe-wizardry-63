
import { useState, useEffect } from 'react';
import { ClothingItem, ClothingType, ClothingColor, ClothingMaterial, ClothingSeason, ClothingOccasion } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import ImageUploader from '@/components/wardrobe/ImageUploader';
import ClothingDetailsForm from '@/components/wardrobe/ClothingDetailsForm';
import { toast } from 'sonner';

interface EditItemDialogProps {
  item: ClothingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: ClothingItem) => void;
}

const EditItemDialog = ({ item, isOpen, onClose, onSave }: EditItemDialogProps) => {
  const [name, setName] = useState(item?.name || '');
  const [type, setType] = useState<ClothingType | ''>(item?.type || '');
  const [color, setColor] = useState<ClothingColor | ''>(item?.color || '');
  const [material, setMaterial] = useState<ClothingMaterial | ''>(item?.material || '');
  const [seasons, setSeasons] = useState<ClothingSeason[]>(item?.seasons || []);
  const [favorite, setFavorite] = useState(item?.favorite || false);
  const [imageUrl, setImageUrl] = useState(item?.imageUrl || '');
  const [occasions, setOccasions] = useState<ClothingOccasion[]>(item?.occasions || []);
  
  // Reset form when item changes
  useEffect(() => {
    if (item) {
      setName(item.name);
      setType(item.type);
      setColor(item.color);
      setMaterial(item.material);
      setSeasons(item.seasons);
      setFavorite(item.favorite);
      setImageUrl(item.imageUrl);
      setOccasions(item.occasions || []);
    }
  }, [item]);
  
  const handleImageChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setImageUrl(reader.result.toString());
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleClearImage = () => {
    setImageUrl('');
  };
  
  const toggleSeason = (season: ClothingSeason) => {
    setSeasons(prev => 
      prev.includes(season) 
        ? prev.filter(s => s !== season) 
        : [...prev, season]
    );
  };
  
  const handleSave = () => {
    if (!item || !name || !type || !color || !imageUrl) return;
    
    const updatedItem: ClothingItem = {
      ...item,
      name,
      type,
      color,
      material: material as ClothingMaterial,
      seasons,
      favorite,
      imageUrl,
      occasions: occasions || []
    };
    
    onSave(updatedItem);
    toast.success(`${name} has been updated`);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Edit Clothing Item</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex justify-center">
            <ImageUploader
              imagePreview={imageUrl}
              onImageChange={handleImageChange}
              onClearImage={handleClearImage}
              persistentDisplay={true}
              className="max-w-[200px] mx-auto"
            />
          </div>
          
          <ClothingDetailsForm
            name={name}
            setName={setName}
            type={type}
            setType={setType}
            color={color}
            setColor={setColor}
            material={material}
            setMaterial={setMaterial}
            seasons={seasons}
            toggleSeason={toggleSeason}
            favorite={favorite}
            setFavorite={setFavorite}
          />
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            onClick={handleSave}
            disabled={!name || !type || !color || !imageUrl}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog;
