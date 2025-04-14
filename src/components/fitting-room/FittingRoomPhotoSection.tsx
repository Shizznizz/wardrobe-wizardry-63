
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

interface FittingRoomPhotoSectionProps {
  onUserPhotoUpload: (photo: string) => void;
  onSelectOliviaImage: (imageSrc: string) => void;
}

const FittingRoomPhotoSection = ({
  onUserPhotoUpload,
  onSelectOliviaImage
}: FittingRoomPhotoSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const isMobile = useIsMobile();
  
  const handleFileUpload = (file: File) => {
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onUserPhotoUpload(result);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };
  
  const handleSelectOlivia = () => {
    // Use a random placeholder Olivia image for demo
    const oliviaImages = [
      '/lovable-uploads/45448793-cb34-4e4c-9dd8-de95f86f25ca.png',
      '/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png',
      '/lovable-uploads/e29a1d16-e806-4664-a744-c1f7b25262ed.png'
    ];
    
    const randomOliviaImage = oliviaImages[Math.floor(Math.random() * oliviaImages.length)];
    onSelectOliviaImage(randomOliviaImage);
    toast.success('Olivia selected as your model!');
  };
  
  return (
    <Card className="mx-auto max-w-2xl glass-dark border-white/10">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6 text-center">Choose Your Model</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div 
              className={`w-full aspect-[3/4] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 transition-all cursor-pointer ${
                isDragging 
                  ? 'border-purple-400 bg-purple-900/20' 
                  : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('photo-upload')?.click()}
            >
              <input
                type="file"
                id="photo-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileInputChange}
              />
              
              <Camera className="w-12 h-12 text-white/60 mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Your Photo</h3>
              <p className="text-white/60 text-sm text-center mb-4">
                Drag & drop or click to upload a full-body photo
              </p>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <Upload className="w-4 h-4 mr-2" />
                Select Image
              </Button>
            </div>
            
            <p className="mt-2 text-xs text-white/60 text-center">
              We recommend using a well-lit, full-body photo against a simple background
            </p>
          </motion.div>
          
          {/* Olivia Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div 
              className="w-full aspect-[3/4] border-2 border-white/20 rounded-xl flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer overflow-hidden relative"
              onClick={handleSelectOlivia}
            >
              <div className="absolute inset-0">
                <img 
                  src="/lovable-uploads/45448793-cb34-4e4c-9dd8-de95f86f25ca.png"
                  alt="Olivia" 
                  className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              </div>
              
              <div className="relative z-10 flex flex-col items-center">
                <User className="w-12 h-12 text-white/60 mb-4" />
                <h3 className="text-lg font-medium mb-2">Use Olivia</h3>
                <p className="text-white/60 text-sm text-center mb-4">
                  Try outfits on our virtual model
                </p>
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  Select Olivia
                </Button>
              </div>
            </div>
            
            <p className="mt-2 text-xs text-white/60 text-center">
              Perfect for quickly visualizing how outfits will look
            </p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FittingRoomPhotoSection;
