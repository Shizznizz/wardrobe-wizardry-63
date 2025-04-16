
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Upload, Sparkle, Shirt, User2, CheckCircle, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface PremiumTryOnHeroProps {
  isPremiumUser: boolean;
  onStartStyling: () => void;
  onShowPremiumPopup: () => void;
}

const PremiumTryOnHero = ({
  isPremiumUser,
  onStartStyling,
  onShowPremiumPopup
}: PremiumTryOnHeroProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { isAuthenticated } = useAuth();

  // Auto-rotate steps for demonstration
  useEffect(() => {
    if (!isInView) return;
    
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= 2 ? 0 : prev + 1));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isInView]);

  const handleActionClick = () => {
    if (isPremiumUser || isAuthenticated) {
      onStartStyling();
    } else {
      onShowPremiumPopup();
    }
  };

  const steps = [
    {
      icon: <User2 className="h-6 w-6 text-blue-300" />,
      title: "Upload your photo",
      description: "Or choose Olivia as your model",
      color: "from-blue-600/20 to-indigo-600/20"
    },
    {
      icon: <Shirt className="h-6 w-6 text-pink-300" />,
      title: "Select clothing",
      description: "Choose from our curated collection or upload your own",
      color: "from-pink-600/20 to-purple-600/20"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-300" />,
      title: "See the result",
      description: "Instantly preview how it looks on you",
      color: "from-green-600/20 to-teal-600/20"
    }
  ];

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="overflow-hidden rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-950/40 to-indigo-950/40 shadow-lg backdrop-blur-sm"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Left section with text */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300">
                Try Before You Buy
              </h2>
              <div className="hidden md:flex items-center gap-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-2 py-0.5 rounded-full text-xs font-medium text-purple-200">
                <Sparkle className="h-3 w-3 text-yellow-300" />
                <span>Premium Feature</span>
              </div>
            </div>
            
            <p className="text-white/70 mb-6 max-w-md">
              Upload your photo or use Olivia to see trending fashion on you before you shop.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <Button
                onClick={handleActionClick}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-full shadow-lg shadow-purple-900/20 transition-all duration-300 hover:shadow-purple-700/30"
              >
                Start Styling
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              {!isPremiumUser && !isAuthenticated && (
                <Button
                  variant="outline"
                  onClick={onShowPremiumPopup}
                  className="border border-purple-500/30 bg-purple-950/30 text-purple-300 hover:bg-purple-900/40 hover:text-purple-200"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Unlock Premium
                </Button>
              )}
            </div>
            
            <div className="md:hidden flex items-center gap-1 mt-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-2 py-1 rounded-full text-xs font-medium text-purple-200 self-start">
              <Sparkle className="h-3 w-3 text-yellow-300" />
              <span>Premium Feature</span>
            </div>
          </div>
          
          {/* Right section with steps */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-900/60 to-indigo-950/60 p-6 md:p-8 border-t lg:border-t-0 lg:border-l border-purple-500/20">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6 text-white/80">
                <div className="flex space-x-2">
                  {steps.map((_, idx) => (
                    <button
                      key={idx}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        idx === activeStep
                          ? "bg-purple-500 w-8"
                          : idx < activeStep
                          ? "bg-purple-700"
                          : "bg-gray-700"
                      }`}
                      onClick={() => setActiveStep(idx)}
                      aria-label={`Go to step ${idx + 1}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">
                  Step {activeStep + 1} of 3
                </span>
              </div>
              
              <div className="relative h-44 sm:h-52">
                <AnimatePresence mode="wait">
                  {steps.map((step, idx) => (
                    activeStep === idx && (
                      <motion.div
                        key={idx}
                        className="absolute inset-0 flex items-center"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex flex-col sm:flex-row items-center gap-6 w-full">
                          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                            {step.icon}
                          </div>
                          <div className="text-center sm:text-left">
                            <h3 className="text-xl font-medium text-white mb-2">{step.title}</h3>
                            <p className="text-white/70 max-w-md">{step.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
              </div>
              
              <div className="flex justify-center sm:justify-end mt-4">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
                    onClick={() => setActiveStep(prev => (prev === 0 ? 2 : prev - 1))}
                    aria-label="Previous step"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" />
                  </Button>
                  <Button
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
                    onClick={() => setActiveStep(prev => (prev >= 2 ? 0 : prev + 1))}
                    aria-label="Next step"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PremiumTryOnHero;
