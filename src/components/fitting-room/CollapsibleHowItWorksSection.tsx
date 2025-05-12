
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Shirt, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface CollapsibleHowItWorksSectionProps {
  isOpen: boolean;
  onToggle: () => void;
}

const CollapsibleHowItWorksSection: React.FC<CollapsibleHowItWorksSectionProps> = ({ 
  isOpen, 
  onToggle 
}) => {
  const steps = [
    {
      icon: <Upload className="h-8 w-8 text-blue-400" />,
      title: "Upload a Photo",
      points: [
        "Use your own photo", 
        "Or choose Olivia as a model"
      ]
    },
    {
      icon: <Shirt className="h-8 w-8 text-purple-400" />,
      title: "Select an Outfit",
      points: [
        "From your saved outfits", 
        "Or try AI suggestions"
      ]
    },
    {
      icon: <Eye className="h-8 w-8 text-pink-400" />,
      title: "See the Result",
      points: [
        "Instant virtual try-on",
        "Mix & match to perfect your look"
      ]
    }
  ];

  return (
    <Card className="glass-dark border-white/10 overflow-hidden shadow-lg">
      <motion.button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
      >
        <div className="flex items-center">
          <div className="mr-2 p-1 rounded-full bg-purple-500/20">
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-purple-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-purple-400" />
            )}
          </div>
          <h2 className="text-lg font-medium text-white">How does this work?</h2>
        </div>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="relative">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-slate-700/80 to-slate-900/80 flex items-center justify-center mb-2 border border-white/10 shadow-lg">
                        {step.icon}
                      </div>
                      {index < steps.length - 1 && (
                        <div className="hidden md:block absolute top-7 left-full w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-4" />
                      )}
                    </div>
                    <h3 className="text-base font-medium mb-1 text-white">{step.title}</h3>
                    <ul className="text-sm text-white/70 list-disc list-inside text-left">
                      {step.points.map((point, i) => (
                        <li key={i} className="mb-1">{point}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default CollapsibleHowItWorksSection;
