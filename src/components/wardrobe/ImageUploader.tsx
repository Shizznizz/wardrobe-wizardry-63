
import { useRef } from 'react';
import { X, Upload, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageChange: (file: File) => void;
  onClearImage: () => void;
  persistentDisplay?: boolean; // Prop to control persistent display behavior
  className?: string; // Add className prop for custom styling
  label?: string; // Optional label prop
  isOliviaImage?: boolean; // New prop to indicate if the image is of Olivia
  showOliviaButton?: boolean; // New prop to show the Olivia button
  onOliviaButtonClick?: () => void; // New prop for handling Olivia button click
}

const ImageUploader = ({ 
  imagePreview, 
  onImageChange, 
  onClearImage, 
  persistentDisplay = false,
  className,
  label = "Upload an image",
  isOliviaImage = false,
  showOliviaButton = false,
  onOliviaButtonClick
}: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClearImage();
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <motion.div 
        onClick={triggerFileInput}
        className={cn(
          "relative w-full max-w-[200px] h-[200px] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-200",
          !imagePreview && "hover:border-primary hover:bg-primary/5",
          persistentDisplay && imagePreview && "border-solid border-purple-500"
        )}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {imagePreview ? (
          <>
            <motion.img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <button 
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            {persistentDisplay && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2 text-xs text-center">
                Click to change
              </div>
            )}
            {isOliviaImage && (
              <div className="absolute top-2 left-2 bg-purple-600/80 rounded-full py-0.5 px-2 text-xs text-white flex items-center">
                <User className="h-3 w-3 mr-1" />
                Olivia's Image
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center space-y-2 p-4 text-center">
            <Upload className="h-10 w-10 text-gray-400" />
            <p className="text-sm font-medium text-gray-600">
              {label}
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, GIF, or WEBP
            </p>
          </div>
        )}
      </motion.div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {/* Olivia Button */}
      {showOliviaButton && (
        <Button
          variant="outline"
          onClick={onOliviaButtonClick}
          className="w-full mt-2 text-sm border-purple-500/30 text-purple-300 hover:bg-white/5 hover:text-purple-100 hover:border-purple-500/50"
        >
          <User className="h-4 w-4 mr-2" />
          Use Image of Olivia Bloom
        </Button>
      )}
    </div>
  );
};

export default ImageUploader;
