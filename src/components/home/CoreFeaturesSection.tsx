
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import FeatureCards from './FeatureCards';
import { Button } from '@/components/ui/button';

interface CoreFeaturesSectionProps {
  onMeetOlivia: () => void;
}

const CoreFeaturesSection = ({ onMeetOlivia }: CoreFeaturesSectionProps) => {
  return (
    <motion.section
      className="py-20 px-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3, duration: 0.7 }}
    >
      <div className="container mx-auto max-w-6xl">
        <FeatureCards />
        
        <div className="mt-16 text-center">
          <Button 
            className="bg-gradient-to-r from-[#EC6FF1] to-[#FF8AF0] text-white hover:opacity-90 transition-opacity font-semibold py-6 px-10 rounded-xl shadow-md h-auto text-lg flex items-center gap-2 mx-auto min-h-[44px]"
            onClick={onMeetOlivia}
          >
            Meet Olivia Now
            <ArrowRight className="h-5 w-5 animate-pulse" />
          </Button>
        </div>
      </div>
    </motion.section>
  );
};

export default CoreFeaturesSection;
