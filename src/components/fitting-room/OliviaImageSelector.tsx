
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface OliviaImageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageSrc: string) => void;
}

const OliviaImageSelector = ({ isOpen, onClose, onSelectImage }: OliviaImageSelectorProps) => {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  // Reset selected image when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedImageId(null);
    }
  }, [isOpen]);
  
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
      <DialogContent 
        className="bg-slate-900 border border-white/10 text-white p-0 overflow-hidden"
        style={{ 
          maxHeight: "90vh",
          width: isMobile ? "90vw" : "90vw",
          maxWidth: isMobile ? "none" : "1400px",
        }}
      >
        <DialogHeader className="px-6 pt-6 pb-3 border-b border-white/10 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">Choose an Olivia Look</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white/70 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-4 md:p-6">
          {isMobile ? (
            // Mobile layout: Carousel with one image at a time
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {oliviaImages.map((image) => (
                    <CarouselItem key={image.id} className="flex items-center justify-center">
                      <motion.div
                        className={`relative cursor-pointer transition-all duration-300
                          ${selectedImageId === image.id 
                            ? 'ring-2 ring-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.5)]' 
                            : ''}`}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleImageSelect(image)}
                      >
                        <div className="aspect-[3/4] w-full">
                          <img 
                            src={image.src} 
                            alt={image.alt} 
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-end justify-center p-4">
                            <span className="text-white text-sm font-medium">
                              Select this look
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-1 bg-black/30 border-white/10 text-white hover:bg-black/50 hover:text-white" />
                <CarouselNext className="right-1 bg-black/30 border-white/10 text-white hover:bg-black/50 hover:text-white" />
              </Carousel>
            </div>
          ) : (
            // Desktop layout: Row with all images side by side
            <div className="grid grid-cols-4 gap-4 mx-auto">
              {oliviaImages.map((image) => (
                <motion.div
                  key={image.id}
                  className={`relative rounded-lg overflow-hidden border cursor-pointer group transition-all duration-300
                    ${selectedImageId === image.id 
                      ? 'border-purple-500/80 ring-2 ring-purple-500/50' 
                      : 'border-white/10'}`}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
                  }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleImageSelect(image)}
                >
                  <div className="aspect-[3/4] relative">
                    <img 
                      src={image.src} 
                      alt={image.alt} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center p-4">
                      <span className="text-white text-sm font-medium">
                        Select this look
                      </span>
                    </div>
                    
                    {/* Selected indicator */}
                    {selectedImageId === image.id && (
                      <div className="absolute inset-0 border-2 border-purple-500 rounded-lg" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-4 text-center text-white/60 text-sm">
            <p>Choose one of these Olivia looks to use as your model for virtual try-on</p>
          </div>
        </div>
        
        <DialogFooter className="px-6 py-4 border-t border-white/10 bg-slate-900/80">
          <Button
            variant="outline"
            onClick={onClose}
            className="ml-auto border-white/20 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OliviaImageSelector;
