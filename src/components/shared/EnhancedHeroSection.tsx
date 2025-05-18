
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import OptimizedImage from '@/components/ui/optimized-image';

export interface HeroButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'neutral' | 'gradient' | 'lavender' | 'black';
  icon?: React.ReactNode;
  className?: string;
  component?: React.ReactNode; // Added this new property to support custom button components
}

export interface EnhancedHeroSectionProps {
  title: string;
  subtitle: string;
  description?: string | React.ReactNode;
  image: {
    src: string;
    alt?: string;
    variant?: 'portrait' | 'standing' | 'headshot';
  };
  buttons?: HeroButtonProps[];
  className?: string;
  children?: React.ReactNode;
  hasSparkleEffect?: boolean;
  actions?: React.ReactNode; // Added prop for actions
}

const EnhancedHeroSection = ({
  title,
  subtitle,
  description,
  image,
  buttons,
  className,
  children,
  hasSparkleEffect = false,
  actions, // Added to component props
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
    }
  };

  const getButtonClassName = (variant?: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-coral-500 to-coral-400 text-white';
      case 'secondary':
        return 'bg-slate-800 text-white hover:bg-slate-700';
      case 'neutral':
        return 'bg-slate-800 text-white hover:bg-slate-700';
      case 'gradient':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'lavender':
        return 'bg-purple-500 text-white hover:bg-purple-600';
      case 'black':
        return 'bg-black text-white hover:bg-gray-800';
      default:
        return 'bg-gradient-to-r from-coral-500 to-coral-400 text-white';
    }
  };

  return (
    <motion.section
      className={cn(
        "relative py-8 md:py-16 lg:py-20 px-4 sm:px-6 overflow-hidden",
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
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-purple-900/10 to-transparent"></div>
      </div>

      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Text content - always stacks above image on mobile */}
          <div className="w-full md:w-1/2 text-center md:text-left md:pl-8 space-y-6 order-2 md:order-1">
            <motion.div variants={itemVariants} className="relative">
              {hasSparkleEffect && (
                <motion.div 
                  className="absolute -top-6 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    transition: {
                      delay: 0.8,
                      duration: 0.5,
                      ease: "easeOut"
                    }
                  }}
                >
                  <Sparkles className="w-5 h-5 text-coral-400" />
                </motion.div>
              )}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-coral-400 to-purple-400 leading-tight">
                {title}
              </h1>
            </motion.div>
            
            <motion.p variants={itemVariants} className="text-lg sm:text-xl text-white/80 font-montserrat">
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
                  button.component ? (
                    // If a custom component is provided, render it directly
                    <React.Fragment key={index}>
                      {button.component}
                    </React.Fragment>
                  ) : (
                    // Otherwise render the default button with props
                    <Button
                      key={index}
                      onClick={button.onClick}
                      className={cn(
                        getButtonClassName(button.variant),
                        "hover:scale-[1.03] transition-transform font-bold py-2 px-6 rounded-xl shadow-md",
                        "sm:w-auto w-full",
                        button.className
                      )}
                      size="lg"
                    >
                      {button.icon && <span className="mr-2">{button.icon}</span>}
                      {button.label}
                    </Button>
                  )
                ))}
              </motion.div>
            )}
            
            {actions && (
              <motion.div variants={itemVariants} className="pt-4">
                {actions}
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
            className="w-full md:w-1/2 flex justify-center order-1 md:order-2"
            variants={imageVariants}
          >
            <div className="relative">
              {/* Glowing backlight effect for the image */}
              <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-purple-500/20 via-coral-500/20 to-purple-500/20 blur-2xl"></div>
              
              {/* Subtle animated rings */}
              <div className="absolute inset-0 -z-5 rounded-full border border-coral-400/10 animate-pulse-glow"></div>
              <div className="absolute inset-2 -z-5 rounded-full border border-purple-400/5"></div>
              
              {/* The image */}
              <OptimizedImage 
                src={image.src} 
                alt={image.alt || "Olivia AI Fashion Assistant"}
                className={cn(
                  "drop-shadow-lg animate-float",
                  image.variant === 'portrait' ? "max-h-[300px] md:max-h-[400px]" : 
                  image.variant === 'headshot' ? "max-h-[250px] md:max-h-[350px]" : "max-h-[350px] md:max-h-[550px]"
                )}
                objectFit="contain"
              />
              
              {/* Subtle light effect */}
              <div className="absolute top-0 right-1/4 w-10 h-10 bg-white/10 rounded-full blur-xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default EnhancedHeroSection;
