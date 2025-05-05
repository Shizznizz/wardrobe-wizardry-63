
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string | React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  showAvatar?: boolean;
  avatarSrc?: string;
  imagePosition?: 'left' | 'right';
  isLeftAligned?: boolean;
  showSparkles?: boolean;
  fullWidthImage?: boolean;
  imageVariant?: 'default' | 'pink-suit' | 'portrait';
  imageAlt?: string;
  halfBodyImage?: string;
  animationStyle?: 'fade' | 'slide' | 'scale';
  overlayEffect?: 'none' | 'glow' | 'shadow';
  useCustomMobileLayout?: boolean;
  imageOnTop?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  description,
  className,
  children,
  showAvatar = false,
  avatarSrc = '/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png',
  imagePosition = 'right',
  isLeftAligned = false,
  showSparkles = false,
  fullWidthImage = false,
  imageVariant = 'default',
  imageAlt = 'Olivia AI Fashion Assistant',
  halfBodyImage,
  animationStyle = 'fade',
  overlayEffect = 'none',
  useCustomMobileLayout = false,
  imageOnTop = false,
}) => {
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
        damping: 12
      }
    }
  };

  const imageVariants = {
    fade: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.8
        }
      }
    },
    slide: {
      hidden: { opacity: 0, x: imagePosition === 'right' ? 50 : -50 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          type: 'spring',
          stiffness: 50,
          damping: 20
        }
      }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 100,
          damping: 15
        }
      }
    }
  };

  // Get the specific animation variant based on the animation style
  const getAnimationVariant = (style: string) => {
    switch (style) {
      case 'fade':
        return imageVariants.fade;
      case 'slide':
        return imageVariants.slide;
      case 'scale':
        return imageVariants.scale;
      default:
        return imageVariants.fade;
    }
  };

  // Determine the image source based on variant
  const getImageSrc = () => {
    if (halfBodyImage) return halfBodyImage;
    
    switch (imageVariant) {
      case 'pink-suit':
        return '/lovable-uploads/f1154816-6766-4478-ba89-6342580bc85b.png';
      case 'portrait':
        return '/lovable-uploads/60ffb487-6be9-4d8d-b767-ade57592238d.png'; // Portrait variant image
      default:
        return '/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png';
    }
  };

  return (
    <section className={cn(
      "relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/50 to-purple-900/30 backdrop-blur-sm border border-white/10 shadow-xl",
      fullWidthImage ? "p-0" : "p-6 md:p-8",
      className
    )}>
      {/* Background effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/50 to-slate-900/80"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content layout changes based on imageOnTop prop */}
      {imageOnTop ? (
        // Layout for image positioned right of title/CTAs
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 z-10">
          {/* Text and CTAs section - takes full width on mobile, left side on desktop */}
          <div className={cn(
            "flex-1 text-center md:text-left space-y-4",
            useCustomMobileLayout ? "w-full md:w-auto" : ""
          )}>
            {showSparkles && (
              <motion.div
                className="inline-block mb-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Sparkles className="h-6 w-6 text-purple-400" />
              </motion.div>
            )}

            <motion.h1 
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-400 to-purple-500"
              variants={itemVariants}
            >
              {title}
            </motion.h1>
            
            {subtitle && (
              <motion.p 
                className="text-lg text-white/80 max-w-2xl"
                variants={itemVariants}
              >
                {subtitle}
              </motion.p>
            )}
            
            {description && (
              <motion.div 
                className="text-white/70 max-w-2xl"
                variants={itemVariants}
              >
                {description}
              </motion.div>
            )}
            
            {children && (
              <motion.div variants={itemVariants}>
                {children}
              </motion.div>
            )}
          </div>
          
          {/* Image section - takes full width on mobile, right side on desktop */}
          {showAvatar && (
            <motion.div 
              className={cn(
                "relative shrink-0",
                useCustomMobileLayout ? "w-full md:w-auto" : "",
                fullWidthImage ? "w-full" : "w-1/3 md:w-64"
              )}
              variants={getAnimationVariant(animationStyle)}
              initial="hidden"
              animate="visible"
            >
              {/* Image with optional effects */}
              <div className={cn(
                "relative z-10",
                overlayEffect === 'glow' ? "after:absolute after:inset-0 after:bg-gradient-to-t after:from-purple-500/20 after:to-transparent after:z-10" : ""
              )}>
                <img 
                  src={getImageSrc()}
                  alt={imageAlt}
                  className="w-auto h-auto max-h-[400px] object-contain"
                />
              </div>
              
              {/* Optional glow effect */}
              {overlayEffect === 'glow' && (
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent blur-2xl rounded-full"></div>
              )}
            </motion.div>
          )}
        </div>
      ) : (
        // Original layout (left-right or right-left depending on imagePosition)
        <div className={cn(
          "relative flex flex-col md:flex-row items-center gap-6 md:gap-10 z-10",
          imagePosition === 'left' ? "md:flex-row-reverse" : ""
        )}>
          {/* Text and CTA section */}
          <div className={cn(
            "flex-1 text-center md:text-left space-y-4",
            useCustomMobileLayout ? "w-full md:w-auto" : "",
            isLeftAligned ? "md:text-left" : ""
          )}>
            {showSparkles && (
              <motion.div
                className="inline-block mb-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Sparkles className="h-6 w-6 text-purple-400" />
              </motion.div>
            )}

            <motion.h1 
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-400 to-purple-500"
              variants={itemVariants}
            >
              {title}
            </motion.h1>
            
            {subtitle && (
              <motion.p 
                className="text-lg text-white/80 max-w-2xl"
                variants={itemVariants}
              >
                {subtitle}
              </motion.p>
            )}
            
            {description && (
              <motion.div 
                className="text-white/70 max-w-2xl"
                variants={itemVariants}
              >
                {description}
              </motion.div>
            )}
            
            {children && (
              <motion.div variants={itemVariants}>
                {children}
              </motion.div>
            )}
          </div>

          {/* Image section */}
          {showAvatar && (
            <motion.div 
              className={cn(
                "relative shrink-0",
                useCustomMobileLayout ? "w-full md:w-auto" : "",
                fullWidthImage ? "w-full" : "w-1/3 md:w-64"
              )}
              variants={getAnimationVariant(animationStyle)}
              initial="hidden"
              animate="visible"
            >
              {/* Image with optional effects */}
              <div className={cn(
                "relative z-10",
                overlayEffect === 'glow' ? "after:absolute after:inset-0 after:bg-gradient-to-t after:from-purple-500/20 after:to-transparent after:z-10" : ""
              )}>
                <img 
                  src={getImageSrc()}
                  alt={imageAlt}
                  className="w-auto h-auto max-h-[400px] object-contain"
                />
              </div>
              
              {/* Optional glow effect */}
              {overlayEffect === 'glow' && (
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent blur-2xl rounded-full"></div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </section>
  );
};

export default PageHeader;
