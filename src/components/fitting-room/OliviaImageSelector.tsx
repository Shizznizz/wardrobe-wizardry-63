
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface OliviaImageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageSrc: string) => void;
}

const OliviaImageSelector = ({ isOpen, onClose, onSelectImage }: OliviaImageSelectorProps) => {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  
  // Olivia's model images
  const oliviaImages = [
    {
      id: 'olivia-1',
      src: '/lovable-uploads/0d5d5fa4-9b69-48ef-8257-bed55efdbbe1.png',
      alt: 'Olivia in white top and white jeans with sunglasses'
    },
    {
      id: 'olivia-2',
      src: '/lovable-uploads/f19c0a23-eb9d-4387-b2cf-7cfa1c908099.png',
      alt: 'Olivia with pink hair in white top and blue jeans'
    },
    {
      id: 'olivia-3',
      src: '/lovable-uploads/7bf790bd-ecfc-412e-8c2b-57962b42a807.png',
      alt: 'Olivia with pink hair in white crop top and pink leggings'
    },
    {
      id: 'olivia-4',
      src: '/lovable-uploads/50e39742-8005-47d8-86ab-8ac3942a743d.png',
      alt: 'Olivia in white top and blue jeans with black heels'
    }
  ];

  const handleImageSelect = (image: typeof oliviaImages[0]) => {
    setSelectedImageId(image.id);
    onSelectImage(image.src);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl bg-slate-900 border border-white/10 text-white p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-3 border-b border-white/10 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">Choose an Olivia Image</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white/70 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6">
          <p className="text-white/70 mb-6 text-sm">
            Select one of these images of Olivia to use as your model for virtual try-on.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {oliviaImages.map((image) => (
              <motion.div
                key={image.id}
                className={`relative rounded-lg overflow-hidden border cursor-pointer group
                  ${selectedImageId === image.id 
                    ? 'border-purple-500 ring-2 ring-purple-500/50' 
                    : 'border-white/10 hover:border-purple-400/30'}`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleImageSelect(image)}
              >
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-auto aspect-[3/4] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center p-4">
                  <Button variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
                    Select this image
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 p-3 bg-purple-900/30 border border-purple-500/30 rounded-md">
            <p className="text-white/90 text-sm">
              Using Olivia as your model allows you to see how clothes would look on a professional model.
              This gives you a better idea of fit and style before making a purchase.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OliviaImageSelector;
