
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface OliviaImageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageSrc: string) => void;
}

const OliviaImageSelector: React.FC<OliviaImageSelectorProps> = ({ isOpen, onClose, onSelectImage }) => {
  const isMobile = useIsMobile();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const oliviaImages = [
    {
      src: '/lovable-uploads/0e9ba14f-845b-4c56-a82c-5a616b0a3efb.png',
      name: 'Olivia - Casual',
      description: 'Perfect for everyday casual outfits',
    },
    {
      src: '/lovable-uploads/b8ab03e1-025f-4e8e-8f75-31495ba951c5.png',
      name: 'Olivia - Formal',
      description: 'Great for professional and formal wear',
    },
    {
      src: '/lovable-uploads/7c23e108-9a95-45f8-825c-da85e8d29bbd.png',
      name: 'Olivia - Full Body',
      description: 'Shows complete outfits including shoes',
    },
    {
      src: '/lovable-uploads/124e62fe-3004-4331-a80d-a4581b66da5d.png',
      name: 'Olivia - Stylish',
      description: 'Perfect for trendy and fashion-forward styles',
    }
  ];

  // Set up scroll snap for mobile
  useEffect(() => {
    if (isMobile && carouselRef.current) {
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
    setSelectedImage(index);
  };
  
  const handleConfirmSelection = () => {
    if (selectedImage !== null) {
      const selectedSrc = oliviaImages[selectedImage].src;
      onSelectImage(selectedSrc);
      onClose();
      
      // Wait for modal to close before scrolling to outfit selection
      setTimeout(() => {
        const outfitSelectionSection = document.getElementById('outfit-selection-section');
        if (outfitSelectionSection) {
          outfitSelectionSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
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
          
          {/* Mobile Carousel */}
          {isMobile && (
            <div className="relative flex-grow">
              <div 
                ref={carouselRef}
                className="flex snap-x snap-mandatory overflow-x-auto h-full"
                style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}
              >
                {oliviaImages.map((image, index) => (
                  <div 
                    key={index}
                    className="snap-center flex-shrink-0 w-full h-full flex flex-col items-center justify-center p-6"
                  >
                    <div 
                      className={`relative cursor-pointer rounded-xl overflow-hidden h-[70vh] w-full bg-slate-800`}
                      onClick={() => handleSelectImage(index)}
                    >
                      <img 
                        src={image.src}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                      
                      {selectedImage === index && (
                        <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                          <CheckCircle className="h-12 w-12 text-purple-500" />
                        </div>
                      )}
                      
                      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                        <h3 className="font-medium text-white">{image.name}</h3>
                        <p className="text-white/70 text-sm">{image.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Mobile Navigation */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2">
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
              
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
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
          )}
          
          {/* Desktop Grid */}
          {!isMobile && (
            <div className="flex-grow overflow-auto p-6">
              <div className="flex flex-row gap-6 h-[90vh]">
                {oliviaImages.map((image, index) => (
                  <motion.div 
                    key={index}
                    className={`relative cursor-pointer rounded-xl overflow-hidden flex-1 bg-slate-800 transition-all duration-300 ${
                      selectedImage === index ? 'ring-4 ring-purple-600' : 'hover:ring-2 hover:ring-purple-400'
                    }`}
                    onClick={() => handleSelectImage(index)}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img 
                      src={image.src}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {selectedImage === index && (
                      <motion.div 
                        className="absolute inset-0 bg-purple-600/20 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CheckCircle className="h-12 w-12 text-purple-500" />
                      </motion.div>
                    )}
                    
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
          )}
          
          {/* Selection buttons */}
          <div className="p-4 border-t border-white/10 mt-auto">
            <div className="flex justify-between">
              <Button variant="outline" onClick={onClose} className="border-white/10 text-white hover:bg-white/10">
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmSelection} 
                disabled={selectedImage === null}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
              >
                Confirm Selection
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OliviaImageSelector;
