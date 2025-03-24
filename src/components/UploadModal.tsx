
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';
import { ClothingType, ClothingColor, ClothingMaterial, ClothingSeason } from '@/lib/types';
import ImageUploader from './wardrobe/ImageUploader';
import ClothingDetailsForm from './wardrobe/ClothingDetailsForm';

interface UploadModalProps {
  onUpload: (item: any) => void;
  buttonText?: string;
}

const UploadModal = ({ onUpload, buttonText = "Add Item" }: UploadModalProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<ClothingType | ''>('');
  const [color, setColor] = useState<ClothingColor | ''>('');
  const [material, setMaterial] = useState<ClothingMaterial | ''>('');
  const [seasons, setSeasons] = useState<ClothingSeason[]>([]);
  const [favorite, setFavorite] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImagePreview(null);
  };

  const toggleSeason = (season: ClothingSeason) => {
    setSeasons(prev => 
      prev.includes(season)
        ? prev.filter(s => s !== season)
        : [...prev, season]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !type || !color || !material || seasons.length === 0 || !imagePreview) {
      toast.error('Please fill out all fields and upload an image');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newItem = {
        id: Date.now().toString(),
        name,
        type,
        color,
        material,
        seasons,
        imageUrl: imagePreview,
        favorite,
        timesWorn: 0,
        dateAdded: new Date()
      };
      
      onUpload(newItem);
      toast.success('Item added to your wardrobe');
      
      setName('');
      setType('');
      setColor('');
      setMaterial('');
      setSeasons([]);
      setFavorite(false);
      setImagePreview(null);
      
      setOpen(false);
    } catch (error) {
      toast.error('Error adding item. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="space-x-2 group">
          <span>{buttonText}</span>
          <Camera className="h-4 w-4 transition-transform group-hover:scale-110" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Add Clothing Item</DialogTitle>
          <DialogDescription className="sr-only">
            Add a new item to your wardrobe
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <ImageUploader 
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onClearImage={clearImage}
          />

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

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add to Wardrobe'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
