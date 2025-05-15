
import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Slider } from '@/components/ui/slider';

const VirtualTryOnSteps = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const controls = useAnimation();
  
  // Slider value state (0-100)
  const [sliderValue, setSliderValue] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const beforeImageRef = useRef<HTMLDivElement>(null);
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0]);
    updateSliderPosition(value[0]);
  };
  
  // Update the slider position and image clipping
  const updateSliderPosition = (value: number) => {
    if (beforeImageRef.current) {
      // Calculate clip path based on slider value (0-100)
      beforeImageRef.current.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
    }
  };
  
  useEffect(() => {
    // Setup intersection observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          controls.start({ opacity: 1, y: 0, transition: { duration: 0.7 } });
        }
      },
      { threshold: 0.2 }
    );
    
    const section = document.getElementById('virtual-tryon-section');
    if (section) observer.observe(section);
    
    return () => {
      if (section) observer.unobserve(section);
    };
  }, [controls]);
  
  // Update slider position on resize
  useEffect(() => {
    updateSliderPosition(sliderValue);
    
    const handleResize = () => updateSliderPosition(sliderValue);
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [sliderValue]);

  return (
    <section 
      id="virtual-tryon-section" 
      className="py-24 relative overflow-hidden bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500">
            Experience the Magic of Virtual Try-On
          </h2>
          <div className="w-28 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full mx-auto"></div>
          <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto">
            We gave Olivia a fashion makeover using our virtual fitting room. Want to see how a new top and shorts look on her? 
            Swipe below to reveal the transformation — powered by our advanced AI fashion tech.
          </p>
        </motion.div>
        
        {/* Before/After Slider Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mb-14 rounded-xl overflow-hidden shadow-xl"
        >
          <div className="relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden">
            {/* After Image (Background) */}
            <div className="absolute inset-0 w-full h-full">
              <img 
                src="/lovable-uploads/035906c3-0580-4e7f-8266-6ba2686dba56.png" 
                alt="After virtual try-on" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                After
              </div>
            </div>
            
            {/* Before Image (Clipped) */}
            <div 
              ref={beforeImageRef} 
              className="absolute inset-0 w-full h-full"
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            >
              <img 
                src="/lovable-uploads/5e4cbd61-c50a-41d4-bdf0-21ca9306c976.png" 
                alt="Before virtual try-on" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                Before
              </div>
            </div>
            
            {/* Center Slider Handle */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg left-1/2 transform -translate-x-1/2"
              style={{ left: `${sliderValue}%` }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center z-10">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <ChevronDown className="h-4 w-4 text-white transform rotate-90" />
                </div>
              </div>
            </div>
            
            {/* Slider Control (Hidden visually but used for interaction) */}
            <div className="absolute bottom-6 left-6 right-6 z-20" ref={sliderRef}>
              <Slider
                defaultValue={[50]}
                max={100}
                step={1}
                value={[sliderValue]}
                onValueChange={handleSliderChange}
                className="absolute bottom-[-15px] left-0 right-0 z-20 opacity-0"
              />
            </div>
          </div>
        </motion.div>
        
        {/* Featured Items Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ delay: 0.5 }}
          className="mb-10 max-w-md mx-auto"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Featured Outfit</h3>
            <p className="text-gray-600">The perfect summer combination</p>
          </div>
          <div className="flex justify-center gap-6 p-4 rounded-xl bg-white/80 backdrop-blur shadow-md">
            <div className="flex-1 text-center">
              <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-yellow-100/50 to-yellow-200/50 border border-yellow-200/30">
                <img 
                  src="/lovable-uploads/fdd3366f-1a61-4441-8e31-cb52a3d305ed.png" 
                  alt="Yellow T-shirt and white shorts" 
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <p className="text-sm font-medium text-gray-700">Summer Vibes Set</p>
              <p className="text-xs text-gray-500">Yellow Tee + White Shorts</p>
            </div>
          </div>
        </motion.div>
        
        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ delay: 0.7 }}
          className="text-center mt-12"
        >
          <Button 
            onClick={() => navigate('/shop-and-try')}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-6 text-lg rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-500/20 transition-all group"
          >
            Try It Yourself
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default VirtualTryOnSteps;
