
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export interface HeroButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
  className?: string;
}

export interface EnhancedHeroSectionProps {
  title: string;
  subtitle: string;
  description?: string | React.ReactNode;
  image: {
    src: string;
    alt?: string;
    variant?: 'portrait' | 'standing';
  };
  buttons?: HeroButtonProps[];
  layoutPosition?: 'left' | 'right';
  extraContent?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  hasSparkleEffect?: boolean;
  mainActionLabel?: string;
  onMainAction?: () => void;
}

const EnhancedHeroSection = ({
  title,
  subtitle,
  description,
  image,
  buttons,
  layoutPosition = 'right',
  extraContent,
  className,
  children,
  hasSparkleEffect = false,
  mainActionLabel,
  onMainAction,
}: EnhancedHeroSectionProps) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.3,
        duration: 0.8,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      filter: "drop-shadow(0 0 15px rgba(236, 111, 241, 0.5))",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const sparkleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: 0.8,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section
      className={cn(
        "relative py-12 md:py-16 lg:py-20 px-4 sm:px-6 overflow-hidden",
        className
      )}
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

      <div className="container mx-auto max-w-7xl">
        <div className={`flex flex-col ${layoutPosition === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-12`}>
          {/* Text content - always stacks above image on mobile */}
          <div className={`w-full md:w-1/2 text-center md:text-left ${layoutPosition === 'left' ? 'md:pr-8' : 'md:pl-8'} space-y-6`}>
            <motion.div variants={itemVariants} className="relative">
              {hasSparkleEffect && (
                <motion.div 
                  className="absolute -top-6 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0"
                  variants={sparkleVariants}
                  initial="initial"
                  animate="animate"
                >
                  <Sparkles className="w-5 h-5 text-coral-400" />
                </motion.div>
              )}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-coral-400 to-purple-400 leading-tight">
                {title}
              </h1>
            </motion.div>
            
            <motion.p variants={itemVariants} className="text-xl sm:text-2xl text-white/80 font-montserrat">
              {subtitle}
            </motion.p>
            
            {description && (
              <motion.div variants={itemVariants} className="text-white/70 text-base sm:text-lg max-w-xl mx-auto md:mx-0">
                {description}
              </motion.div>
            )}
            
            {(buttons && buttons.length > 0) && (
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4"
              >
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    onClick={button.onClick}
                    className={cn(
                      button.variant === 'secondary' ? "bg-white text-[#2A004F] hover:bg-white/90" : "bg-gradient-to-r from-[#EC6FF1] to-[#9C68FF]",
                      "text-white hover:opacity-90 transition-opacity font-semibold py-3 px-6 rounded-xl shadow-md",
                      "min-h-[44px]", // Ensure minimum tap target size
                      button.className
                    )}
                    size="lg"
                  >
                    {button.icon && <span className="mr-2">{button.icon}</span>}
                    {button.label}
                  </Button>
                ))}
              </motion.div>
            )}
            
            {mainActionLabel && (
              <motion.div variants={itemVariants} className="pt-4">
                <Button 
                  className="bg-gradient-to-r from-[#EC6FF1] to-[#9C68FF] text-white hover:opacity-90 transition-opacity font-semibold py-6 px-8 rounded-xl shadow-md h-auto text-lg min-h-[44px]"
                  onClick={onMainAction}
                >
                  {mainActionLabel}
                </Button>
              </motion.div>
            )}
            
            {extraContent && (
              <motion.div variants={itemVariants} className="pt-4">
                {extraContent}
              </motion.div>
            )}

            {children && (
              <motion.div variants={itemVariants} className="pt-4">
                {children}
              </motion.div>
            )}
          </div>

          {/* Image container */}
          <motion.div 
            className={`w-full md:w-1/2 flex justify-center`}
            variants={imageVariants}
          >
            <motion.div 
              className="relative"
              whileHover="hover"
              variants={imageVariants}
            >
              {/* Glowing backlight effect for the image */}
              <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-purple-500/20 via-coral-500/20 to-purple-500/20 blur-2xl"></div>
              
              {/* Subtle animated rings */}
              <div className="absolute inset-0 -z-5 rounded-full border border-coral-400/10 animate-pulse-glow"></div>
              <div className="absolute inset-2 -z-5 rounded-full border border-purple-400/5"></div>
              
              {/* The image */}
              <img 
                src={image.src} 
                alt={image.alt || "Olivia AI Fashion Assistant"}
                className={cn(
                  "drop-shadow-lg animate-float",
                  image.variant === 'portrait' ? "max-h-[350px] w-auto" : "max-h-[400px] w-auto"
                )}
              />
              
              {/* Subtle light effect */}
              <div className="absolute top-0 right-1/4 w-10 h-10 bg-white/10 rounded-full blur-xl"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default EnhancedHeroSection;
