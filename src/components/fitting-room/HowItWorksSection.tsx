
import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Shirt, Eye, ArrowUp } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Upload className="h-10 w-10 text-blue-400" />,
      title: "Upload a Photo",
      description: "Use your own photo or choose Olivia as a model"
    },
    {
      icon: <Shirt className="h-10 w-10 text-purple-400" />,
      title: "Select an Outfit",
      description: "Choose from your saved outfits or AI suggestions"
    },
    {
      icon: <Eye className="h-10 w-10 text-pink-400" />,
      title: "See the Result",
      description: "View your outfit virtually styled on your photo"
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-8 pb-4"
    >
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
          How It Works
        </h2>
        <p className="text-lg text-white/80 max-w-3xl mx-auto">
          Upload a photo of yourself or use Olivia. Then select one of your outfits and see it styled on your body.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * index, duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-slate-700/80 to-slate-900/80 flex items-center justify-center mb-4 border border-white/10 shadow-lg">
                {step.icon}
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-4" />
              )}
            </div>
            <h3 className="text-lg font-medium mb-2 text-white">{step.title}</h3>
            <p className="text-white/70">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default HowItWorksSection;
