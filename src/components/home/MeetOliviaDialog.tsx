
import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface MeetOliviaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartOnboarding: () => void;
  onGetStarted: () => void;
}

const MeetOliviaDialog = ({ 
  open, 
  onOpenChange,
  onStartOnboarding,
  onGetStarted
}: MeetOliviaDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[480px] w-[90%] mx-auto bg-[#2A004F] border-none rounded-3xl p-6 md:p-8 shadow-lg"
        onEscapeKeyDown={() => onOpenChange(false)}
        aria-labelledby="olivia-modal-title"
        aria-describedby="olivia-modal-description"
      >
        <div className="flex flex-col items-center text-center">
          {/* Close button - accessible and positioned at top-right */}
          <DialogClose asChild>
            <Button 
              className="absolute top-4 right-4 rounded-full w-8 h-8 p-0 bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4 text-white" />
            </Button>
          </DialogClose>
          
          {/* Olivia's avatar - circular and centered */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#EC6FF1]/50 mb-4 relative shadow-lg">
            <img 
              src="/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png" 
              alt="Olivia Bloom"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#EC6FF1]/20 to-transparent"></div>
          </div>
          
          {/* Heading - styled with accent color */}
          <h1 
            id="olivia-modal-title"
            className="text-2xl sm:text-[28px] font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#EC6FF1] to-[#9C68FF]"
          >
            Meet Olivia Bloom
          </h1>
          
          {/* Body text - responsive sizing and proper line height */}
          <div id="olivia-modal-description" className="space-y-4 text-sm sm:text-base text-white leading-relaxed max-w-md">
            <p>
              Hi there! I'm Olivia Bloom, your personal AI fashion stylist and style confidante. 
              I'm here to transform your wardrobe experience and make getting dressed the easiest 
              part of your day.
            </p>
            
            <p>
              Whether you're looking for weather-appropriate outfits, want to discover your unique 
              style, or need help mixing and matching pieces you already own — I've got you covered!
            </p>
          </div>
          
          {/* CTA buttons - responsive and accessible */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full">
            {/* Primary CTA button */}
            <Button 
              className="w-full py-4 text-white rounded-xl font-semibold bg-gradient-to-r from-[#EC6FF1] to-[#FF8AF0] hover:opacity-90 transition-opacity min-h-[44px]"
              onClick={onStartOnboarding}
              aria-label="Start onboarding tour"
            >
              Let me show you what you can do here!
            </Button>
            
            {/* Secondary CTA button */}
            <DialogClose asChild>
              <Button 
                onClick={onGetStarted}
                className="w-full py-4 bg-white text-[#2A004F] hover:bg-white/90 rounded-xl font-semibold min-h-[44px]"
                aria-label="Start using the app"
              >
                Let's Get Started
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetOliviaDialog;
