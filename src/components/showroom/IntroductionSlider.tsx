
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSwipeable } from 'react-swipeable';

const slides = [
  {
    id: 'intro',
    title: 'Meet Olivia',
    message: "Hi there! I'm Olivia, your AI stylist. Let me show you how our virtual try-on works—it's quick, stylish, and all about you!",
    image: '/lovable-uploads/153b37d6-dd2c-4574-b45b-10db91fe8a0c.png', // Updated image for Slide 1
    imageSide: 'right',
  },
  {
    id: 'outfit',
    title: 'Choose the clothing',
    message: "Found a piece you like? Upload it here and see how it could look—on Olivia or yourself!",
    image: '/lovable-uploads/af8ddcef-7ca3-4cdb-a77f-4cdf410510be.png', // Updated image for Slide 2 (t-shirt only)
    imageSide: 'left',
  },
  {
    id: 'result',
    title: 'See the Magic',
    message: "See the difference? You can try this look too—just upload your photo and let the magic begin!",
    image: '/lovable-uploads/b9589b3d-cc0b-4092-891c-72bfce833557.png', // Updated image for Slide 3 (Olivia with t-shirt)
    imageSide: 'right',
  },
];

export default function IntroductionSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const carouselRef = useRef(null);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current === slides.length - 1 ? 0 : current + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  // Handle swipe gestures for mobile
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setActiveIndex((current) => (current === slides.length - 1 ? 0 : current + 1));
    },
    onSwipedRight: () => {
      setActiveIndex((current) => (current === 0 ? slides.length - 1 : current - 1));
    },
    preventScrollOnSwipe: true,
    trackMouse: false
  });

  return (
    <div 
      className="w-full max-w-5xl mx-auto mb-16 mt-4 relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...handlers}
      ref={carouselRef}
    >
      <Carousel
        className="w-full"
        setApi={(api) => {
          api?.on('select', () => {
            setActiveIndex(api.selectedScrollSnap());
          });
          // Allow external navigation
          if (api) {
            api.scrollTo(activeIndex);
          }
        }}
        opts={{
          align: 'start',
          loop: true,
        }}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id} className="w-full">
              <div className="flex flex-col-reverse md:flex-row items-center justify-between w-full p-4 md:p-8 rounded-xl relative overflow-hidden">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-slate-900/60 to-slate-950/80 rounded-xl backdrop-blur-sm border border-white/5"></div>
                
                {/* Text content */}
                <motion.div 
                  className={cn(
                    "z-10 flex-1 p-6 text-center md:text-left",
                    slide.imageSide === 'right' ? 'md:pr-8' : 'md:pl-8 md:order-2'
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-xl md:text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                    {slide.title}
                  </h3>
                  <p className="text-white/90 text-base md:text-lg leading-relaxed">
                    {slide.message}
                  </p>
                  
                  {index === slides.length - 1 && (
                    <Button 
                      className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90"
                      onClick={() => {
                        // Scroll to photo upload section
                        document.getElementById('photo-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Try It Now
                    </Button>
                  )}
                </motion.div>
                
                {/* Image */}
                <motion.div 
                  className={cn(
                    "relative flex-1 flex justify-center items-center p-4",
                    slide.imageSide === 'right' ? 'md:order-2' : 'md:order-1'
                  )}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative w-full max-w-xs md:max-w-sm mx-auto">
                    {/* Decorative glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-purple-600/20 rounded-full blur-xl"></div>
                    
                    {/* The image */}
                    <div className={cn(
                      "relative w-full aspect-[3/4] overflow-hidden rounded-xl",
                      slide.id === 'outfit' && "border-2 border-purple-400/30 shadow-lg shadow-purple-500/20"
                    )}>
                      <img 
                        src={slide.image} 
                        alt={slide.title}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Dot indicators showing the current slide */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index);
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                activeIndex === index 
                  ? "bg-white w-6" 
                  : "bg-white/30 hover:bg-white/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Custom navigation buttons with improved visual style */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 border border-white/10 shadow-lg transition-all duration-300 hidden md:flex"
          onClick={() => {
            setActiveIndex(activeIndex === 0 ? slides.length - 1 : activeIndex - 1);
          }}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 border border-white/10 shadow-lg transition-all duration-300 hidden md:flex"
          onClick={() => {
            setActiveIndex(activeIndex === slides.length - 1 ? 0 : activeIndex + 1);
          }}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </Carousel>
    </div>
  );
}
