
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Shirt, Sparkles, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useToast } from '@/components/ui/use-toast';

const VirtualTryOnSteps = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  
  // Slide data with images, titles and descriptions
  const slides = [
    {
      title: "Upload a Photo",
      description: "Use a photo of yourself or choose Olivia as your model to begin your virtual try-on experience.",
      icon: <Upload className="h-8 w-8 text-purple-400" />,
      imageSrc: "/lovable-uploads/d547488e-9454-4c2c-a1a0-3d767b45357a.png",
      imagePosition: "left", // image on left side
      step: "1/3"
    },
    {
      title: "Select Your Outfit",
      description: "Choose from your digital wardrobe or explore trending items to preview your look instantly.",
      icon: <Shirt className="h-8 w-8 text-pink-400" />,
      imageSrc1: "/lovable-uploads/bfaef886-abbd-4207-a2de-99cfeb0aee94.png", // shorts
      imageSrc2: "/lovable-uploads/5b4ac746-a6e4-4d29-8f41-3a8a6724b87d.png", // t-shirt
      imagePosition: "right", // images on right side
      step: "2/3"
    },
    {
      title: "See Magic Happen",
      description: "Olivia uses AI to show you wearing the outfit in seconds — no changing room needed!",
      icon: <Sparkles className="h-8 w-8 text-blue-400" />,
      imageSrc: "/lovable-uploads/b4fa68dc-984b-44fe-856e-2d5d9d22724f.png",
      imagePosition: "left", // image on left side
      step: "3/3",
      hasAiBadge: true
    }
  ];

  // Setup autoplay - change slides every 5 seconds
  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoPlay, slides.length]);

  // Handle manual navigation
  const goToNextSlide = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setAutoPlay(false); // Pause autoplay when manually navigating
  };
  
  const goToPrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setAutoPlay(false); // Pause autoplay when manually navigating
  };

  // Resume autoplay after a period of inactivity
  useEffect(() => {
    if (autoPlay) return;
    
    const timeout = setTimeout(() => {
      setAutoPlay(true);
    }, 10000); // Resume autoplay after 10 seconds of inactivity
    
    return () => clearTimeout(timeout);
  }, [autoPlay]);

  return (
    <section className="py-24 relative overflow-hidden bg-[#1b013c]">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 to-blue-900/30 pointer-events-none"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300">
            How Virtual Try-On Works
          </h2>
          <div className="w-28 h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full mx-auto"></div>
          <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
            Experience clothes on yourself before buying with our advanced AI technology
          </p>
        </motion.div>
        
        {/* Interactive Carousel */}
        <div className="relative">
          <div className="max-w-6xl mx-auto">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`${activeSlide === index ? 'block' : 'hidden'} relative overflow-hidden rounded-xl shadow-lg`}
              >
                <div className={`flex flex-col ${isMobile ? '' : 'md:flex-row'} bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm border border-white/10`}>
                  {/* Content arrangement based on slide specs and screen size */}
                  {isMobile ? (
                    <>
                      {/* Mobile layout - always image first, then content */}
                      <div className="w-full">
                        {index === 1 ? (
                          // Slide 2 - Two images side by side
                          <div className="flex space-x-2 p-4 justify-center bg-gradient-to-br from-purple-900/70 to-indigo-900/70">
                            <div className="w-1/2 transform rotate-[-3deg] shadow-lg shadow-pink-500/20">
                              <AspectRatio ratio={1/1.5} className="relative overflow-hidden rounded-lg">
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20"></div>
                                <img src={slide.imageSrc1} alt="Outfit piece 1" className="w-full h-full object-contain" />
                              </AspectRatio>
                            </div>
                            <div className="w-1/2 transform rotate-[3deg] shadow-lg shadow-blue-500/20">
                              <AspectRatio ratio={1/1.5} className="relative overflow-hidden rounded-lg">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                                <img src={slide.imageSrc2} alt="Outfit piece 2" className="w-full h-full object-contain" />
                              </AspectRatio>
                            </div>
                          </div>
                        ) : (
                          // Slide 1 and 3 - Single full-body image
                          <div className="relative">
                            <AspectRatio ratio={3/4} className="relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20"></div>
                              <img src={slide.imageSrc} alt={slide.title} className="w-full h-full object-contain" />
                              {slide.hasAiBadge && (
                                <div className="absolute bottom-4 right-4">
                                  <div className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm animate-pulse">
                                    AI Generated
                                  </div>
                                </div>
                              )}
                            </AspectRatio>
                          </div>
                        )}
                      </div>

                      {/* Text content */}
                      <div className="w-full p-6 md:p-8 flex flex-col justify-center">
                        <div className="flex items-center mb-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 mr-4 border border-white/10">
                            {slide.icon}
                          </div>
                          <h3 className="text-2xl font-bold text-white">{slide.title}</h3>
                        </div>
                        
                        <p className="text-white/80 mb-4">{slide.description}</p>
                        
                        <div className="text-white/60 text-sm">
                          Step {slide.step}
                        </div>
                      </div>
                    </>
                  ) : (
                    // Desktop layout - alternating based on slide specs
                    slide.imagePosition === "left" ? (
                      <>
                        {/* Image on left */}
                        <div className="md:w-1/2 relative">
                          <AspectRatio ratio={3/4} className="relative h-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20"></div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-xl blur-lg -z-10"></div>
                            <img 
                              src={slide.imageSrc} 
                              alt={slide.title} 
                              className="w-full h-full object-cover shadow-lg rounded-l-lg"
                              style={{ filter: 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.3))' }} 
                            />
                            {slide.hasAiBadge && (
                              <div className="absolute bottom-4 right-4">
                                <div className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm animate-pulse">
                                  AI Generated
                                </div>
                              </div>
                            )}
                          </AspectRatio>
                        </div>
                        
                        {/* Text on right */}
                        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                          <div className="flex items-center mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 mr-4 border border-white/10">
                              {slide.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white">{slide.title}</h3>
                          </div>
                          
                          <p className="text-white/80 mb-6">{slide.description}</p>
                          
                          <div className="text-white/60 text-sm mt-4">
                            Step {slide.step}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Text on left */}
                        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                          <div className="flex items-center mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-900/50 to-indigo-900/50 mr-4 border border-white/10">
                              {slide.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white">{slide.title}</h3>
                          </div>
                          
                          <p className="text-white/80 mb-6">{slide.description}</p>
                          
                          <div className="text-white/60 text-sm mt-4">
                            Step {slide.step}
                          </div>
                        </div>
                        
                        {/* Two images on right */}
                        <div className="md:w-1/2 p-6 flex items-center justify-center">
                          <div className="flex space-x-4 h-full items-center justify-center">
                            <div className="transform rotate-[-5deg] shadow-lg shadow-pink-500/20">
                              <div className="relative rounded-lg overflow-hidden">
                                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl blur-md -z-10"></div>
                                <img 
                                  src={slide.imageSrc1} 
                                  alt="Outfit piece 1" 
                                  className="w-full object-contain rounded-lg"
                                  style={{ filter: 'drop-shadow(0 0 10px rgba(236, 72, 153, 0.3))' }}
                                />
                              </div>
                            </div>
                            <div className="transform rotate-[5deg] shadow-lg shadow-blue-500/20">
                              <div className="relative rounded-lg overflow-hidden">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-md -z-10"></div>
                                <img 
                                  src={slide.imageSrc2} 
                                  alt="Outfit piece 2" 
                                  className="w-full object-contain rounded-lg"
                                  style={{ filter: 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.3))' }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation buttons */}
          <button 
            onClick={goToPrevSlide}
            className="absolute left-4 md:left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 flex items-center justify-center z-20 border border-white/10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          
          <button 
            onClick={goToNextSlide}
            className="absolute right-4 md:right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 flex items-center justify-center z-20 border border-white/10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </div>
        
        {/* Slide indicators */}
        <div className="flex justify-center mt-6 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveSlide(index);
                setAutoPlay(false);
              }}
              className={`h-2 rounded-full transition-all ${
                activeSlide === index 
                  ? 'w-8 bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button 
            onClick={() => navigate('/shop-and-try')}
            className="bg-gradient-to-r from-[#EC6FF1] to-[#FF8AF0] text-white px-8 py-6 text-lg rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-500/20 transition-all group"
          >
            Try it Now
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default VirtualTryOnSteps;
