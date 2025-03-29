
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UserPhotoSectionProps {
  userPhoto: string | null;
  isUsingOliviaImage: boolean;
  onUserPhotoChange: (photo: string) => void;
  onShowOliviaImageGallery: () => void;
}

const UserPhotoSection = ({
  userPhoto,
  isUsingOliviaImage,
  onUserPhotoChange,
  onShowOliviaImageGallery
}: UserPhotoSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onUserPhotoChange(e.target.result as string);
          toast.success('Photo uploaded successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleTakePhoto = () => {
    toast('Camera functionality would open here', {
      description: 'This feature would access your device camera in a real implementation.'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <Card className="glass-dark border-white/10 overflow-hidden">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Your Photo</h2>
          
          {!userPhoto ? (
            <div className="flex flex-col items-center justify-center py-8 flex-grow bg-black/20 rounded-lg border border-white/10">
              <div className="mb-6 bg-slate-800/50 p-6 rounded-full">
                <Camera className="h-12 w-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Upload Your Photo</h3>
              <p className="text-white/70 mb-6 text-center max-w-sm px-2">
                See how outfits look on you with our virtual try-on feature
              </p>
              <div className="flex flex-col gap-3 w-full max-w-xs px-4">
                <Button 
                  onClick={triggerFileUpload}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
                >
                  <Upload className="mr-2 h-5 w-5" /> Choose Photo
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
                <Button
                  variant="outline"
                  className="w-full border-purple-400/30 text-white hover:bg-white/10"
                  onClick={handleTakePhoto}
                >
                  <Camera className="mr-2 h-5 w-5" /> Take a Photo
                </Button>
                <Button
                  variant="outline"
                  onClick={onShowOliviaImageGallery}
                  className="w-full text-sm border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-purple-100 hover:border-purple-500/50 transition-colors"
                >
                  <User className="mr-2 h-4 w-4" />
                  Choose an Image of Olivia Bloom
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="relative flex-grow bg-black/20 rounded-lg border border-white/10 overflow-hidden">
                <img 
                  src={userPhoto} 
                  alt="Your uploaded photo" 
                  className="w-full h-full object-contain"
                />
                {isUsingOliviaImage && (
                  <div className="absolute top-2 left-2 bg-purple-600/80 rounded-full py-0.5 px-2 text-xs text-white flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    Olivia's Image
                  </div>
                )}
              </div>
              <div className="flex justify-center mt-4 gap-3">
                <Button 
                  variant="outline"
                  onClick={triggerFileUpload}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Upload className="mr-2 h-4 w-4" /> Change Photo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default UserPhotoSection;
