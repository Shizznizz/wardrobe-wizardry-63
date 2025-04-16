
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, Shirt, SparkleIcon, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

interface UnifiedIntroSectionProps {
  isPremiumUser: boolean;
  onStartStyling: () => void;
  onShowPremiumPopup: () => void;
}

const UnifiedIntroSection = ({ 
  isPremiumUser, 
  onStartStyling, 
  onShowPremiumPopup 
}: UnifiedIntroSectionProps) => {
  const { isAuthenticated } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const effectivePremiumUser = isPremiumUser || isAuthenticated;
  
  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 4);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const slides = [
    {
      icon: <Upload className="h-6 w-6 text-purple-400" />,
      title: "1. Upload Your Photo",
      description: "Start with your photo or choose Olivia as your model",
      color: "from-blue-500/20 to-blue-500/5",
      textColor: "text-blue-200"
    },
    {
      icon: <Shirt className="h-6 w-6 text-pink-400" />,
      title: "2. Pick an Item",
      description: "Select from our curated collection or upload your own",
      color: "from-pink-500/20 to-pink-500/5",
      textColor: "text-pink-200"
    },
    {
      icon: <SparkleIcon className="h-6 w-6 text-amber-400" />,
      title: "3. Try It On",
      description: "See how it looks on you with our AI magic",
      color: "from-amber-500/20 to-amber-500/5",
      textColor: "text-amber-200"
    },
    {
      icon: <ArrowRight className="h-6 w-6 text-green-400" />,
      title: "4. Shop or Save",
      description: "Purchase what you love or save for later",
      color: "from-green-500/20 to-green-500/5",
      textColor: "text-green-200"
    }
  ];

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900/80 to-purple-950/80 backdrop-blur-md shadow-xl overflow-hidden">
      <CardContent className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
            Virtual Try-On Experience
          </h2>
          
          {!effectivePremiumUser && (
            <div className="flex items-center space-x-1 bg-gray-800/50 px-3 py-1 rounded-full text-xs text-white/70">
              <Lock className="h-3 w-3 text-yellow-400 mr-1" />
              Premium Feature
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Carousel */}
          <div className="relative h-[300px] md:h-[350px] overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/0 to-slate-950/0"></div>
              {[0, 1, 2, 3].map((dotPosition) => (
                <motion.div
                  key={`sparkle-${dotPosition}`}
                  className="absolute w-1 h-1 rounded-full bg-purple-300"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
            
            {/* Slide content */}
            {slides.map((slide, index) => (
              <motion.div
                key={`slide-${index}`}
                className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                initial={{ opacity: 0, x: 50 }}
                animate={{ 
                  opacity: currentSlide === index ? 1 : 0,
                  x: currentSlide === index ? 0 : 50,
                }}
                transition={{ duration: 0.5 }}
              >
                <div className={`h-16 w-16 rounded-full flex items-center justify-center bg-gradient-to-br ${slide.color} border border-white/10 mb-4`}>
                  {slide.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${slide.textColor}`}>{slide.title}</h3>
                <p className="text-white/70 max-w-xs">{slide.description}</p>
              </motion.div>
            ))}
            
            {/* Slide indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {slides.map((_, index) => (
                <button
                  key={`indicator-${index}`}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index ? 'bg-white w-4' : 'bg-white/30'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
          
          {/* Right side - CTA */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Your Style, Enhanced</h3>
              <p className="text-white/70">
                Our AI-powered try-on experience lets you see how clothes look on you before you buy. 
                No more guessing if something will suit you – see it in real-time!
              </p>
              
              <div className="pt-2">
                <div className="flex gap-1 flex-wrap">
                  {['Realistic', 'Fast', 'Fun', 'No Commitment'].map((tag) => (
                    <span key={tag} className="bg-purple-500/20 text-purple-200 text-xs px-2.5 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {effectivePremiumUser ? (
                <Button 
                  onClick={onStartStyling}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 h-12 text-lg"
                >
                  Start Styling
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={onShowPremiumPopup}
                    className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-90 h-12 text-lg"
                  >
                    <Lock className="mr-2 h-5 w-5" /> 
                    Unlock Premium Features
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={onStartStyling}
                    className="w-full border-white/20 text-white hover:bg-white/10 h-10"
                  >
                    Try Demo Version
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedIntroSection;
