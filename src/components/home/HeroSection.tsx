
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import MobileHeroSection from './MobileHeroSection';
import DesktopHeroSection from './DesktopHeroSection';

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: React.ReactNode;
  imageSrc: string;
  imageAlt?: string;
  layoutPosition?: 'left' | 'right';
  onStartJourney: () => void;
  onTakeStyleQuiz: () => void;
  hasSparkleEffect?: boolean;
}

const HeroSection = ({
  title,
  subtitle,
  description,
  imageSrc,
  imageAlt = "Olivia AI Fashion Assistant",
  layoutPosition = 'right',
  onStartJourney,
  onTakeStyleQuiz,
  hasSparkleEffect = false,
}: HeroSectionProps) => {
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const extraContent = (
    <div className="flex items-center gap-2 text-white/80 mt-6 justify-center md:justify-start">
      <Sparkles className="h-4 w-4 text-coral-400" />
      <p>Olivia styles your day in seconds. Let's go!</p>
    </div>
  );

  return (
    <motion.section
      className="relative py-12 md:py-16 lg:py-20 px-4 sm:px-6 overflow-hidden hero-section"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-coral-500/10 blur-3xl"></div>
        
        {/* Additional futuristic elements */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-purple-900/10 to-transparent"></div>
        <div className="absolute -left-20 top-1/4 w-40 h-40 rounded-full border border-coral-300/20"></div>
        <div className="absolute right-10 bottom-1/4 w-20 h-20 rounded-full border border-purple-300/20"></div>
      </div>

      {/* Responsive container */}
      <div className="mx-auto lg:max-w-[70vw] md:max-w-[90vw]">
        {/* Mobile Hero Section */}
        <MobileHeroSection
          title={title}
          subtitle={subtitle}
          description={description}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          onStartJourney={onStartJourney}
          onTakeStyleQuiz={onTakeStyleQuiz}
          extraContent={extraContent}
        />
        
        {/* Desktop/Tablet Hero Section */}
        <DesktopHeroSection
          title={title}
          subtitle={subtitle}
          description={description}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          layoutPosition={layoutPosition}
          onStartJourney={onStartJourney}
          onTakeStyleQuiz={onTakeStyleQuiz}
          extraContent={extraContent}
          hasSparkleEffect={hasSparkleEffect}
        />
      </div>
    </motion.section>
  );
};

export default HeroSection;
