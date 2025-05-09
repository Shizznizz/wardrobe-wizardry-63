
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  title?: string;
  content: string | React.ReactNode;
  image?: string;
}

interface OnboardingFlowProps {
  onClose: () => void;
  isOpen: boolean;
}

const steps: OnboardingStep[] = [
  {
    content: (
      <>
        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
          Welcome!
        </h2>
        <p>
          Hi there, fashion lover! I'm Olivia — your AI stylist and wardrobe wizard. 💜<br /><br />
          Before we dive into the fashion fun, I'll walk you through how to get the most out of your digital wardrobe.<br /><br />
          Ready to become your most stylish self? Let's go!
        </p>
      </>
    ),
  },
  {
    title: "Start by signing up ✨",
    content: (
      <p>
        First things first — make sure you're signed in and subscribed.<br /><br />
        This way, I can save your wardrobe, preferences, and style journey.<br /><br />
        (If you're already signed up — you're ahead of the game!)
      </p>
    ),
  },
  {
    title: "Take the Quizzes 🧠👠",
    content: (
      <p>
        To style you like a pro, I need to get to know you!<br /><br />
        Head to the Quizzes section and answer a few fun questions about your lifestyle and fashion vibe.<br /><br />
        I'll use your answers to give personalized advice that really fits.
      </p>
    ),
  },
  {
    title: "Fill in your Settings ⚙️",
    content: (
      <p>
        Help me understand your style even better.<br /><br />
        Go to Settings and add your clothing sizes, favorite fits, color preferences, and everything else that makes you... you.<br /><br />
        These details help me choose looks you'll truly love.
      </p>
    ),
  },
  {
    title: "Upload your wardrobe 👗📸",
    content: (
      <p>
        Now the real magic begins!<br /><br />
        Head to My Wardrobe and upload clear photos of your clothes.<br /><br />
        The more you add, the more I can mix and match amazing looks just for you.
      </p>
    ),
  },
  {
    title: "Outfits, Weather & Calendar 🧥🌤📅",
    content: (
      <p>
        Once your wardrobe is full, the fun really starts:<br /><br />
        ✨ Create outfits yourself or let me suggest looks based on your style AND the weather!<br /><br />
        🗓 Use the Style Planner to schedule your outfits and track style stats over time.
      </p>
    ),
  },
  {
    title: "Go Premium if you're loving it 💎",
    content: (
      <p>
        Having fun so far? Take it to the next level with Premium Membership:<br /><br />
        - Try on outfits in the Fitting Room<br />
        - Preview new clothes on a photo of yourself or me (Olivia) in Shop & Try<br />
        - Chat directly with me about trends, advice, and style dilemmas 💬<br /><br />
        Fashion should be smart, personal, and fun. Let's make it yours.
      </p>
    ),
  },
];

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onClose, isOpen }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const isLastStep = currentStep === steps.length - 1;
  
  const handleSignIn = () => {
    onClose();
    navigate('/auth');
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div 
          className="relative w-full max-w-3xl bg-gradient-to-br from-[#12002f] to-[#2c0055] rounded-2xl shadow-xl p-6 md:p-10 overflow-hidden border border-purple-500/30"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          {/* Background gradient elements */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/10 rounded-full filter blur-3xl"></div>
          
          {/* Close button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            aria-label="Close onboarding"
          >
            <X className="h-5 w-5 text-white/70" />
          </button>
          
          <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
            {/* Left side - Olivia avatar */}
            <div className="w-full md:w-1/3 flex flex-col items-center md:items-start">
              <Avatar className="w-24 h-24 border-2 border-purple-400/30 shadow-lg mb-4">
                <AvatarImage 
                  src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" 
                  alt="Olivia" 
                />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-500">OB</AvatarFallback>
              </Avatar>
              
              <div className="hidden md:block w-full mt-6">
                {/* Progress indicator */}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/70">Step {currentStep + 1} of {steps.length}</span>
                  <span className="text-sm text-white/70">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
                    initial={{ width: `${(currentStep / steps.length) * 100}%` }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
            
            {/* Right side - Content */}
            <div className="w-full md:w-2/3 text-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {steps[currentStep].title && (
                    <h3 className="text-xl md:text-2xl font-semibold text-purple-300">
                      {steps[currentStep].title}
                    </h3>
                  )}
                  
                  <div className="text-sm md:text-base text-white/90 leading-relaxed">
                    {steps[currentStep].content}
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Mobile progress indicator */}
              <div className="md:hidden w-full mt-6 mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-white/70">Step {currentStep + 1} of {steps.length}</span>
                  <span className="text-xs text-white/70">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
                    initial={{ width: `${(currentStep / steps.length) * 100}%` }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
              
              {/* Navigation buttons */}
              <div className={cn(
                "flex justify-between mt-8",
                currentStep === 0 ? "justify-end" : "justify-between"
              )}>
                {currentStep > 0 && (
                  <Button 
                    onClick={goToPrevStep}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                )}
                
                {isLastStep ? (
                  <Button 
                    onClick={handleSignIn}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white"
                  >
                    Sign In & Start Your Style Journey
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button 
                    onClick={goToNextStep}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingFlow;
