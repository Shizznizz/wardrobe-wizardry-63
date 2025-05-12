
import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Shirt, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Upload className="h-8 w-8 text-blue-400" />,
      title: "Upload a Photo",
      description: "Use your own photo or choose Olivia as a model"
    },
    {
      icon: <Shirt className="h-8 w-8 text-purple-400" />,
      title: "Select an Outfit",
      description: "Choose from your saved outfits or AI suggestions"
    },
    {
      icon: <Eye className="h-8 w-8 text-pink-400" />,
      title: "See the Result",
      description: "View your outfit virtually styled on your photo"
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-4 pb-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
            whileHover={{ y: -5 }}
            className="flex-1"
          >
            <Card className="p-5 h-full flex flex-col items-center text-center bg-white/5 border-white/10 hover:border-purple-500/30 transition-all duration-300">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-700/80 to-slate-900/80 flex items-center justify-center mb-4 border border-white/10 shadow-lg">
                {step.icon}
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">{step.title}</h3>
              <p className="text-white/70 text-sm">{step.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default HowItWorksSection;
