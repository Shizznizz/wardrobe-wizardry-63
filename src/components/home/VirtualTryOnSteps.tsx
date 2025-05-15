
import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Slider } from '@/components/ui/slider';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const VirtualTryOnSteps = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const controls = useAnimation();
  
  // Slider value state (0-100)
  const [sliderValue, setSliderValue] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const beforeImageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  
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

  // Handle pointer down
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    handlePointerMove(e);
    // Add event listeners to window for pointer move and up
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Handle pointer move
  const handlePointerMove = (e: React.PointerEvent | PointerEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const containerWidth = rect.width;
    const percentage = Math.max(0, Math.min(100, (x / containerWidth) * 100));
    
    setSliderValue(percentage);
    updateSliderPosition(percentage);
  };

  // Handle pointer up
  const handlePointerUp = () => {
    isDraggingRef.current = false;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
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
      // Clean up event listeners
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
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
      className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-purple-950/80 via-purple-900/60 to-slate-900/80"
    >
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          className="text-center mb-10 md:mb-14 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-purple-200">
            Experience the Magic of Virtual Try-On
          </h2>
          <div className="w-28 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400 rounded-full mx-auto"></div>
          <p className="mt-6 text-lg text-gray-200 max-w-2xl mx-auto">
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
          <div 
            ref={containerRef}
            className="relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-xl border border-purple-500/30 shadow-[0_0_25px_rgba(139,92,246,0.3)]"
            onPointerDown={handlePointerDown}
            style={{ touchAction: 'none' }}
          >
            {/* After Image (Background) */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-900/30 to-black/50">
              <img 
                src="/lovable-uploads/9a8ee0e4-a024-4874-938c-ef52dc4e6f44.png" 
                alt="After virtual try-on" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-4 right-4 bg-purple-500/70 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                After
              </div>
            </div>
            
            {/* Before Image (Clipped) */}
            <div 
              ref={beforeImageRef} 
              className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-900/30 to-black/50"
              style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
            >
              <img 
                src="/lovable-uploads/17a15329-e4ad-4eb0-a482-871a48774ecc.png" 
                alt="Before virtual try-on" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-4 left-4 bg-indigo-500/70 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                Before
              </div>
            </div>
            
            {/* Center Slider Handle */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10"
              style={{ left: `${sliderValue}%` }}
            >
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 shadow-lg backdrop-blur-md flex items-center justify-center z-10 border-2 border-purple-300/50 animate-pulse-glow"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 via-pink-400 to-purple-400 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.6)]">
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
          className="mb-10 max-w-md mx-auto relative"
        >
          <div className="absolute inset-0 -top-4 bg-gradient-to-t from-purple-500/10 to-transparent blur-xl"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-2">
              <p className="text-purple-300 text-sm font-medium">Olivia is now wearing...</p>
            </div>
            
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-white">Featured Outfit</h3>
              <p className="text-gray-300">The perfect summer combination</p>
            </div>
            
            <div className="flex justify-center gap-6 p-5 rounded-xl bg-white/5 backdrop-blur shadow-lg border border-purple-500/20">
              <div className="flex-1 text-center">
                <AspectRatio ratio={1/1} className="relative mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-yellow-100/20 to-yellow-200/10 border border-yellow-200/30 shadow-inner">
                  <img 
                    src="/lovable-uploads/fdd3366f-1a61-4441-8e31-cb52a3d305ed.png" 
                    alt="Yellow T-shirt and white shorts" 
                    className="w-full h-full object-contain p-2"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </AspectRatio>
                <p className="text-sm font-medium text-white">Summer Vibes Set</p>
                <p className="text-xs text-gray-300">Yellow Tee + White Shorts</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ delay: 0.7 }}
          className="text-center mt-12 sticky bottom-4 md:relative md:bottom-auto"
        >
          <Button 
            onClick={() => navigate('/shop-and-try')}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-6 text-lg rounded-lg font-semibold shadow-[0_4px_20px_rgba(168,85,247,0.5)] hover:shadow-[0_4px_25px_rgba(168,85,247,0.7)] transition-all group"
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
