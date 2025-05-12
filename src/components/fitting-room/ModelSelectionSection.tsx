
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera, User, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import UserPhotoDisplay from '@/components/fitting-room/UserPhotoDisplay';

interface ModelSelectionSectionProps {
  userPhoto: string | null;
  isUploading: boolean;
  isUsingOliviaImage: boolean;
  onUserPhotoChange: (photo: string) => void;
  onShowOliviaImageGallery: () => void;
}

const ModelSelectionSection = ({
  userPhoto,
  isUploading,
  isUsingOliviaImage,
  onUserPhotoChange,
  onShowOliviaImageGallery
}: ModelSelectionSectionProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onUserPhotoChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleTakePhoto = () => {
    // In a real implementation, this would access the device camera
    // For now, let's just trigger the file input as a fallback
    triggerFileInput();
  };

  // If already uploaded, show the photo instead
  if (userPhoto) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <UserPhotoDisplay 
          userPhoto={userPhoto} 
          isUsingOliviaImage={isUsingOliviaImage} 
          onResetPhoto={() => onUserPhotoChange('')} 
        />
        
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline"
            onClick={triggerFileInput}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Upload className="mr-2 h-4 w-4" /> Change Photo
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>
      </motion.div>
    );
  }

  if (isUploading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <div className="w-12 h-12 border-4 border-t-purple-500 border-purple-300/30 rounded-full"></div>
          </motion.div>
          
          <h3 className="text-xl font-medium mb-2 text-white">Getting everything ready...</h3>
          <p className="text-white/70 text-center max-w-md">
            We're preparing your virtual try-on experience. This will just take a moment.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-medium text-white">Choose how you want to try outfits on</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2 h-6 w-6">
                <Info className="h-4 w-4 text-white/70" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-800 border-white/10 text-white max-w-xs">
              <p>Choose one of the methods below to preview outfits using your own photo or Olivia Bloom.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Option 1: Choose a Photo */}
        <motion.div 
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" }}
          transition={{ duration: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-lg p-5 shadow-lg"
        >
          <h3 className="text-lg font-medium mb-3 text-blue-200">Choose a Photo</h3>
          <p className="text-white/70 mb-5 text-sm">
            Upload a full-body photo of yourself to see how outfits fit you.
          </p>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handlePhotoUpload}
          />
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={triggerFileInput}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-90 shadow-lg shadow-blue-900/20 transition-all duration-300"
            >
              <Upload className="h-5 w-5 mr-2" />
              Choose Photo
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Option 2: Take a Photo */}
        <motion.div 
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(74, 222, 128, 0.2)" }}
          transition={{ duration: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-lg p-5 shadow-lg"
        >
          <h3 className="text-lg font-medium mb-3 text-green-200">Take a Photo</h3>
          <p className="text-white/70 mb-5 text-sm">
            Use your device's camera to take a picture now for the try-on.
          </p>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleTakePhoto}
              variant="outline"
              className="w-full border-green-400/30 text-white hover:bg-green-500/10 transition-all duration-300"
            >
              <Camera className="h-5 w-5 mr-2" />
              Take a Photo
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Option 3: Use Olivia Bloom */}
        <motion.div 
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(147, 51, 234, 0.2)" }}
          transition={{ duration: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-lg p-5 shadow-lg"
        >
          <h3 className="text-lg font-medium mb-3 text-purple-200">Use Olivia Bloom</h3>
          <p className="text-white/70 mb-5 text-sm">
            Try outfits on our virtual AI model — Olivia — for a quick preview.
          </p>
          
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center border border-purple-400/20">
              <User className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          
          {/* Olivia Image Gallery Preview */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {['c5d18e51-b1be-4b55-99af-88f93354a3a6.png', 
              'db09e7ac-8b04-4ef1-9694-8d634e49ebd8.png',
              '05a3fd2c-0807-490b-99bb-ef65d286661e.png',
              'bdf02308-7834-4d88-b198-d8f27f2d325e.png'].map((image, index) => (
              <motion.div 
                key={index}
                className="relative aspect-[3/4] rounded-md overflow-hidden border border-purple-400/20 cursor-pointer"
                whileHover={{ scale: 1.05, borderColor: 'rgba(168, 85, 247, 0.5)' }}
                onClick={() => onShowOliviaImageGallery()}
              >
                <img 
                  src={`/lovable-uploads/${image}`} 
                  alt={`Olivia model ${index + 1}`}
                  className="w-full h-full object-cover object-top"
                />
              </motion.div>
            ))}
          </div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onShowOliviaImageGallery}
              className="w-full text-sm border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-purple-100 hover:border-purple-500/50 transition-all duration-300"
              variant="outline"
            >
              <User className="h-5 w-5 mr-2" />
              Choose Olivia
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ModelSelectionSection;
