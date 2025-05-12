
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface OliviaImageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageSrc: string) => void;
}

const OliviaImageSelector: React.FC<OliviaImageSelectorProps> = ({ isOpen, onClose, onSelectImage }) => {
  const isMobile = useIsMobile();
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const oliviaImages = [
    {
      src: '/lovable-uploads/446878e5-9a46-4779-af1f-3b96a896f81c.png',
      name: 'Classic Casual',
      description: 'White top with light jeans and sunglasses',
    },
    {
      src: '/lovable-uploads/ba771b95-f70c-4fb3-b306-66b21e14dba7.png',
      name: 'Pink Hair Style',
      description: 'White t-shirt with blue jeans',
    },
    {
      src: '/lovable-uploads/363e61f4-22b2-4830-be21-23a0c9266ce5.png',
      name: 'Athleisure Look',
      description: 'White tank top with pink leggings',
    },
    {
      src: '/lovable-uploads/673cd608-25a6-4a41-93f1-870e5d9be759.png',
      name: 'Everyday Style',
      description: 'White top with dark blue jeans',
    }
  ];

  // Set up scroll snap for mobile
  useEffect(() => {
    if (isMobile && carouselRef.current && isOpen) {
      const scrollContainer = carouselRef.current;
      
      const handleScroll = () => {
        if (scrollContainer) {
          const slideWidth = scrollContainer.clientWidth;
          const scrollPosition = scrollContainer.scrollLeft;
          const newSlide = Math.round(scrollPosition / slideWidth);
          
          setCurrentSlide(newSlide);
        }
      };
      
      scrollContainer.addEventListener('scroll', handleScroll);
      
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isMobile, isOpen]);
  
  const handleSelectImage = (index: number) => {
    const selectedSrc = oliviaImages[index].src;
    onSelectImage(selectedSrc);
    onClose();
    
    // Wait for modal to close before scrolling to outfit selection
    setTimeout(() => {
      const outfitSelectionSection = document.getElementById('outfit-selection-section');
      if (outfitSelectionSection) {
        outfitSelectionSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 250);
  };

  const nextSlide = () => {
    if (isMobile && carouselRef.current) {
      const newSlide = Math.min(currentSlide + 1, oliviaImages.length - 1);
      carouselRef.current.scrollTo({
        left: newSlide * carouselRef.current.clientWidth,
        behavior: 'smooth'
      });
      setCurrentSlide(newSlide);
    }
  };
  
  const prevSlide = () => {
    if (isMobile && carouselRef.current) {
      const newSlide = Math.max(currentSlide - 1, 0);
      carouselRef.current.scrollTo({
        left: newSlide * carouselRef.current.clientWidth,
        behavior: 'smooth'
      });
      setCurrentSlide(newSlide);
    }
  };

  // For mobile: use a full-screen sheet instead of a dialog
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent 
          side="bottom" 
          className="p-0 rounded-t-xl max-h-[90vh] bg-slate-900 border-white/10"
        >
          <div className="flex flex-col h-full">
            <div className="p-4">
              <h2 className="text-xl font-semibold text-white mb-2">
                Select Olivia Model
              </h2>
              <p className="text-white/70 text-sm max-w-md">
                Choose which Olivia you'd like to use
              </p>
            </div>
            
            <div className="relative flex-grow">
              <div 
                ref={carouselRef}
                className="flex snap-x snap-mandatory overflow-x-auto h-[60vh]"
                style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}
              >
                {oliviaImages.map((image, index) => (
                  <div 
                    key={index}
                    className="snap-center flex-shrink-0 w-full h-full flex flex-col items-center justify-center p-4"
                  >
                    <motion.div 
                      className="relative cursor-pointer rounded-xl overflow-hidden h-full w-full bg-slate-800"
                      onClick={() => handleSelectImage(index)}
                      whileTap={{ scale: 0.98 }}
                    >
                      <img 
                        src={image.src}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                      
                      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                        <h3 className="font-medium text-white">{image.name}</h3>
                        <p className="text-white/70 text-sm">{image.description}</p>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
              
              {/* Mobile Navigation */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="rounded-full bg-black/30 backdrop-blur-sm text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={nextSlide}
                  disabled={currentSlide === oliviaImages.length - 1}
                  className="rounded-full bg-black/30 backdrop-blur-sm text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
                {oliviaImages.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentSlide ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop dialog
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 sm:p-6 max-w-5xl max-h-[90vh] overflow-hidden bg-slate-900 border-white/10">
        <div className="flex flex-col h-full">
          <div className="p-4 sm:p-0">
            <h2 className="text-xl font-semibold text-white mb-2">
              Select Olivia Model
            </h2>
            <p className="text-white/70 text-sm max-w-md">
              Choose which version of Olivia you'd like to use to try on outfits
            </p>
          </div>
          
          {/* Desktop Grid - single row with equal widths */}
          <div className="flex-grow overflow-auto p-6">
            <div className="flex flex-row justify-between gap-4 h-[60vh]">
              {oliviaImages.map((image, index) => (
                <motion.div 
                  key={index}
                  className="relative cursor-pointer rounded-xl overflow-hidden flex-1 bg-slate-800 transition-all duration-300 hover:ring-2 hover:ring-purple-400"
                  onClick={() => handleSelectImage(index)}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img 
                    src={image.src}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  
                  <motion.div 
                    className="absolute inset-0 bg-purple-600/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    whileHover={{ opacity: 1 }}
                  >
                    <CheckCircle className="h-12 w-12 text-purple-500" />
                  </motion.div>
                  
                  <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="font-medium text-white">{image.name}</h3>
                    <p className="text-white/70 text-sm">{image.description}</p>
                    
                    <Badge className="mt-2 bg-white/10 hover:bg-white/20">
                      Select this look
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OliviaImageSelector;
