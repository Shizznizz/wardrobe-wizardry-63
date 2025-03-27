
import { useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageChange: (file: File) => void;
  onClearImage: () => void;
  persistentDisplay?: boolean; // New prop to control persistent display behavior
}

const ImageUploader = ({ 
  imagePreview, 
  onImageChange, 
  onClearImage, 
  persistentDisplay = false 
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
    <div className="flex flex-col items-center justify-center">
      <div 
        onClick={triggerFileInput}
        className={cn(
          "relative w-full max-w-[200px] h-[200px] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-200",
          !imagePreview && "hover:border-primary hover:bg-primary/5",
          persistentDisplay && imagePreview && "border-solid border-purple-500"
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
              onClick={clearImage}
              className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            {persistentDisplay && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 py-1 px-2 text-white text-xs text-center">
                Click to change
              </div>
            )}
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
  );
};

export default ImageUploader;
