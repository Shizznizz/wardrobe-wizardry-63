
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface OliviaImageGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageSrc: string) => void;
}

const OliviaImageGallery = ({ isOpen, onClose, onSelectImage }: OliviaImageGalleryProps) => {
  // Olivia's model images
  const oliviaImages = [
    {
      id: 'olivia-1',
      src: '/lovable-uploads/7bf89910-ba2c-43e0-a523-899d90c3022e.png',
      alt: 'Olivia in white outfit with crop top and skirt'
    },
    {
      id: 'olivia-2',
      src: '/lovable-uploads/1d4e81c7-dcef-4208-ba9f-77c0544f9e12.png',
      alt: 'Olivia in white fitted jeans and t-shirt'
    },
    {
      id: 'olivia-3',
      src: '/lovable-uploads/f1154816-6766-4478-ba89-6342580bc85b.png',
      alt: 'Olivia in white t-shirt and blue jeans'
    }
  ];

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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {oliviaImages.map((image) => (
              <motion.div
                key={image.id}
                className="relative rounded-lg overflow-hidden border border-white/10 cursor-pointer group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  onSelectImage(image.src);
                  onClose();
                }}
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
              This can give you a better idea of fit and style before making a purchase.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OliviaImageGallery;
