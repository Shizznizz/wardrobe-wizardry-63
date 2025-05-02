
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Cloud, Shirt } from 'lucide-react';

const FeatureCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
      <FeatureCard 
        title="Personal Style Discovery"
        description="Olivia learns your style preferences and helps you discover new looks that express your unique personality."
        icon={<FeatureIcon><Sparkles className="h-8 w-8 text-coral-400" /></FeatureIcon>}
      />
      
      <FeatureCard 
        title="Weather-Smart Fashion"
        description="Never dress inappropriately for the weather again. Olivia checks your local forecast and suggests outfits accordingly."
        icon={<FeatureIcon><Cloud className="h-8 w-8 text-blue-400" /></FeatureIcon>}
      />
      
      <FeatureCard 
        title="Virtual Try-On"
        description="See how clothes look on you before buying or wearing them. Olivia's virtual fitting room makes fashion decisions easy."
        icon={<FeatureIcon><Shirt className="h-8 w-8 text-purple-400" /></FeatureIcon>}
      />
      
      {/* Blurred background shape */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-30">
        <div className="absolute top-0 left-1/3 w-64 h-64 rounded-full bg-purple-600/20"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-coral-600/20"></div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  withOliviaAvatar?: boolean;
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <motion.div 
      className="glass-dark p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden group"
      whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.2)' }}
    >
      {/* Subtle gradient background that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-coral-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <motion.div 
        className="mb-4"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {icon}
      </motion.div>
      
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-coral-400 to-purple-400">
          {title}
        </h3>
      </div>
      
      <p className="text-white/70 relative z-10">
        {description}
      </p>
    </motion.div>
  );
};

const FeatureIcon = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-coral-500/20 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors duration-300">
      {children}
    </div>
  );
};

export default FeatureCards;
