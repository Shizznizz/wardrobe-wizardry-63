
import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Camera, Upload, X } from 'lucide-react';
import { ClothingType, ClothingColor, ClothingMaterial, ClothingSeason } from '@/lib/types';
import { cn } from '@/lib/utils';

interface UploadModalProps {
  onUpload: (item: any) => void;
}

const UploadModal = ({ onUpload }: UploadModalProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<ClothingType | ''>('');
  const [color, setColor] = useState<ClothingColor | ''>('');
  const [material, setMaterial] = useState<ClothingMaterial | ''>('');
  const [seasons, setSeasons] = useState<ClothingSeason[]>([]);
  const [favorite, setFavorite] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
          <span>Add Item</span>
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
          <div className="flex flex-col items-center justify-center">
            <div 
              onClick={triggerFileInput}
              className={cn(
                "relative w-full max-w-[200px] h-[200px] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-200",
                !imagePreview && "hover:border-primary hover:bg-primary/5"
              )}
            >
              {imagePreview ? (
                <>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearImage();
                    }}
                    className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-black/70 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center space-y-2 p-4 text-center">
                  <Upload className="h-10 w-10 text-gray-400" />
                  <p className="text-sm font-medium text-gray-600">
                    Click to upload
                  </p>
                  <p className="text-xs text-gray-500">
                    JPG, PNG or GIF
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="White T-Shirt"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={type}
                  onValueChange={(value) => setType(value as ClothingType)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shirt">Shirt</SelectItem>
                    <SelectItem value="jeans">Jeans</SelectItem>
                    <SelectItem value="pants">Pants</SelectItem>
                    <SelectItem value="shorts">Shorts</SelectItem>
                    <SelectItem value="sweater">Sweater</SelectItem>
                    <SelectItem value="hoodie">Hoodie</SelectItem>
                    <SelectItem value="jacket">Jacket</SelectItem>
                    <SelectItem value="dress">Dress</SelectItem>
                    <SelectItem value="skirt">Skirt</SelectItem>
                    <SelectItem value="shoes">Shoes</SelectItem>
                    <SelectItem value="sneakers">Sneakers</SelectItem>
                    <SelectItem value="boots">Boots</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select
                  value={color}
                  onValueChange={(value) => setColor(value as ClothingColor)}
                >
                  <SelectTrigger id="color">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="gray">Gray</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="pink">Pink</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="brown">Brown</SelectItem>
                    <SelectItem value="multicolor">Multicolor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Select
                value={material}
                onValueChange={(value) => setMaterial(value as ClothingMaterial)}
              >
                <SelectTrigger id="material">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cotton">Cotton</SelectItem>
                  <SelectItem value="wool">Wool</SelectItem>
                  <SelectItem value="silk">Silk</SelectItem>
                  <SelectItem value="polyester">Polyester</SelectItem>
                  <SelectItem value="leather">Leather</SelectItem>
                  <SelectItem value="denim">Denim</SelectItem>
                  <SelectItem value="linen">Linen</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Seasons</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['spring', 'summer', 'autumn', 'winter'] as ClothingSeason[]).map((season) => (
                  <div key={season} className="flex items-center space-x-2">
                    <Checkbox
                      id={`season-${season}`}
                      checked={seasons.includes(season)}
                      onCheckedChange={() => toggleSeason(season)}
                    />
                    <Label
                      htmlFor={`season-${season}`}
                      className="capitalize cursor-pointer text-sm"
                    >
                      {season}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="favorite"
                checked={favorite}
                onCheckedChange={(checked) => setFavorite(!!checked)}
              />
              <Label htmlFor="favorite" className="cursor-pointer">
                Mark as favorite
              </Label>
            </div>
          </div>

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
