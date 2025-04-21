
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ClothingType, ClothingColor, ClothingMaterial, ClothingSeason, ClothingOccasion } from '@/lib/types';
import ImageUploader from './wardrobe/ImageUploader';
import ClothingDetailsForm from './wardrobe/ClothingDetailsForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UploadModalProps {
  onUpload: (item: any) => void;
  buttonText?: string;
  children?: React.ReactNode;
}

const UploadModal = ({ onUpload, buttonText = "Add Item", children }: UploadModalProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<ClothingType | ''>('');
  const [color, setColor] = useState<ClothingColor | ''>('');
  const [material, setMaterial] = useState<ClothingMaterial | ''>('');
  const [seasons, setSeasons] = useState<ClothingSeason[]>([]);
  const [favorite, setFavorite] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

  const handleImageChange = (file: File) => {
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Please upload a PNG, JPG, or JPEG image.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size too large. Maximum allowed size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  const toggleSeason = (season: ClothingSeason) => {
    setSeasons(prev => 
      prev.includes(season)
        ? prev.filter(s => s !== season)
        : [...prev, season]
    );
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    // Check for special characters in name (alphanumeric, spaces, and basic punctuation allowed)
    if (name && !/^[a-zA-Z0-9\s.,'-]*$/.test(name)) {
      errors.push("Name contains invalid characters. Please use only letters, numbers, and basic punctuation.");
    }

    // Required fields check
    if (!name) errors.push("Name is required");
    if (!type) errors.push("Category is required");
    if (!imagePreview) errors.push("Image is required");
    if (!color) errors.push("Color is required");
    if (!material) errors.push("Material is required");
    if (seasons.length === 0) errors.push("At least one season is required");

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Clear previous errors
    setValidationErrors([]);
    setIsSubmitting(true);
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Default occasions
      const defaultOccasions: ClothingOccasion[] = ['casual'];
      
      // Create new item
      const newItem = {
        id: Date.now().toString(),
        name,
        type,
        color,
        material,
        season: seasons,  // Make sure we're using the right property name
        seasons: seasons, // For compatibility
        image: imagePreview,
        imageUrl: imagePreview,
        favorite,
        timesWorn: 0,
        occasions: defaultOccasions,
        dateAdded: new Date()
      };
      
      onUpload(newItem);
      toast.success('Item added to your wardrobe!');
      
      // Reset form
      setName('');
      setType('');
      setColor('');
      setMaterial('');
      setSeasons([]);
      setFavorite(false);
      setImagePreview(null);
      setImageFile(null);
      
      setOpen(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error('Error adding item. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setType('');
    setColor('');
    setMaterial('');
    setSeasons([]);
    setFavorite(false);
    setImagePreview(null);
    setImageFile(null);
    setValidationErrors([]);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          resetForm();
        }
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>
        {children || (
          <Button className="space-x-2 group">
            <span>{buttonText}</span>
            <Camera className="h-4 w-4 transition-transform group-hover:scale-110" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-center text-white">Add Clothing Item</DialogTitle>
          <DialogDescription className="sr-only">
            Add a new item to your wardrobe
          </DialogDescription>
        </DialogHeader>
        
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="bg-red-900/20 border-red-500/50 mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <p className="font-medium mb-1">Please fix the following errors:</p>
              <ul className="list-disc pl-4">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <form onSubmit={handleSubmit} className="space-y-4 py-2 px-1">
            <ImageUploader 
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              onClearImage={clearImage}
              label="Upload an image (PNG, JPG, or JPEG, max 10MB)"
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
          </form>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              resetForm();
              setOpen(false);
            }}
            className="bg-transparent border-slate-600 text-white hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading}
            className="relative bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting || isLoading ? (
              <>
                <span className="opacity-0">Adding...</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              </>
            ) : 'Add to Wardrobe'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
