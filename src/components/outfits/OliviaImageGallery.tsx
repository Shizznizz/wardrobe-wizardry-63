import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface OliviaImage {
  id: number;
  src: string;
  alt: string;
}

interface OliviaImageGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageSrc: string) => void;
}

const OliviaImageGallery = ({ isOpen, onClose, onSelectImage }: OliviaImageGalleryProps) => {
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  
  const oliviaImages: OliviaImage[] = [
    {
      id: 1,
      src: "/lovable-uploads/f1154816-6766-4478-ba89-6342580bc85b.png",
      alt: "Olivia in white top and skirt"
    },
    {
      id: 2,
      src: "/lovable-uploads/510dbdf2-837f-4649-8da3-bd06977fa677.png",
      alt: "Olivia in white top and white jeans"
    },
    {
      id: 3,
      src: "/lovable-uploads/352f9956-7bac-4f42-a91b-d20e04157b0d.png",
      alt: "Olivia with pink hair and blue jeans"
    },
    {
      id: 4,
      src: "/lovable-uploads/075a98ab-d879-4919-8898-87590f8f919a.png",
      alt: "Olivia with pink hair and pink leggings"
    },
    {
      id: 5,
      src: "/lovable-uploads/05c430e3-091c-4f96-a77b-c360610435d3.png",
      alt: "Olivia in white top and blue jeans"
    }
  ];

  const handleImageClick = (imageId: number) => {
    setSelectedImageId(imageId);
  };

  const handleConfirmSelection = () => {
    if (selectedImageId !== null) {
      const selectedImage = oliviaImages.find(img => img.id === selectedImageId);
      if (selectedImage) {
        onSelectImage(selectedImage.src);
        toast.success(`Selected Olivia's image successfully!`);
        onClose();
      }
    } else {
      toast.error("Please select an image first");
    }
  };

  return (
    <div className="p-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2">
        {oliviaImages.map((image) => (
          <motion.div
            key={image.id}
            className={`relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer aspect-[3/4] 
              ${selectedImageId === image.id ? 'border-purple-500 shadow-lg shadow-purple-500/20' : 'border-transparent'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleImageClick(image.id)}
          >
            <img 
              src={image.src} 
              alt={image.alt} 
              className="w-full h-full object-cover" 
            />
            
            {selectedImageId === image.id && (
              <div className="absolute top-1 right-1 bg-purple-600 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
              <div className="absolute bottom-1 left-1 right-1 text-[10px] text-white/90 bg-black/50 p-1 rounded text-center">
                {image.alt}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="flex flex-row justify-end space-x-2 sticky bottom-0 bg-black/90 p-3 mt-2 -mx-2 -mb-2 border-t border-white/10">
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="text-white/70 hover:text-white hover:bg-white/10 text-xs py-1 h-7"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleConfirmSelection}
          disabled={selectedImageId === null}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs py-1 h-7"
        >
          Use Selected
        </Button>
      </div>
    </div>
  );
};

export default OliviaImageGallery;
