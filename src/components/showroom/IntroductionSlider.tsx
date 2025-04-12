
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sliderContent = [
  {
    title: "Upload Your Photo",
    description: "Start by uploading a full-body photo or choose from our sample images.",
    icon: "📸"
  },
  {
    title: "Choose Your Style",
    description: "Browse through our curated clothing collections and find your perfect look.",
    icon: "👗"
  },
  {
    title: "See the Magic",
    description: "Our AI technology will show you exactly how the outfit looks on you!",
    icon: "✨"
  }
];

const IntroductionSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const nextSlide = () => {
    setActiveSlide((prev) => (prev === sliderContent.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? sliderContent.length - 1 : prev - 1));
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gradient-to-r from-indigo-950/40 to-purple-950/40 rounded-xl border border-white/10 overflow-hidden shadow-lg backdrop-blur-md"
    >
      <div className="p-6 relative">
        <div className="absolute top-1/2 left-4 -translate-y-1/2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-black/20 text-white hover:bg-black/30 hover:text-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="absolute top-1/2 right-4 -translate-y-1/2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-black/20 text-white hover:bg-black/30 hover:text-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="w-full max-w-md mx-auto px-8">
          {sliderContent.map((slide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ 
                opacity: activeSlide === index ? 1 : 0,
                x: activeSlide === index ? 0 : 20,
                display: activeSlide === index ? 'block' : 'none'
              }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="text-4xl mb-4">{slide.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-white">{slide.title}</h3>
              <p className="text-white/80 text-sm">{slide.description}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-center gap-2 mt-4">
          {sliderContent.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`h-2 rounded-full transition-all ${
                activeSlide === index 
                  ? 'w-8 bg-purple-500' 
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default IntroductionSlider;
