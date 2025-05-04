
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import OptimizedImage from '@/components/ui/optimized-image';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  showAvatar?: boolean;
  avatarImage?: string;
  imageVariant?: 'default' | 'pink-suit' | 'portrait';
  imagePosition?: 'left' | 'right';
  className?: string;
  showSparkles?: boolean;
  isLeftAligned?: boolean;
  halfBodyImage?: string;
  children?: React.ReactNode;
  animationStyle?: 'fade' | 'slide' | 'zoom' | 'float';
  overlayEffect?: 'glow' | 'shimmer' | 'none';
}

const PageHeader = ({
  title,
  subtitle,
  showAvatar = true,
  avatarImage = '/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png',
  imageVariant = 'default',
  imagePosition = 'right',
  className,
  showSparkles = false,
  isLeftAligned = false,
  halfBodyImage,
  children,
  animationStyle = 'fade',
  overlayEffect = 'glow',
}: PageHeaderProps) => {
  const getVariantImage = () => {
    switch (imageVariant) {
      case 'pink-suit':
        return '/lovable-uploads/e29a1d16-e806-4664-a744-c1f7b25262ed.png';
      case 'portrait':
        return '/lovable-uploads/5be0da00-2b86-420e-b2b4-3cc8e5e4dc1a.png';
      default:
        return avatarImage;
    }
  };

  // Define animation variants based on the selected style
  const getContainerVariants = () => {
    switch (animationStyle) {
      case 'slide':
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
          }
        };
      case 'zoom':
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.05 }
          }
        };
      case 'float':
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.02 }
          }
        };
      default: // fade
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        };
    }
  };

  // Define item animation variants based on the selected style
  const getItemVariants = () => {
    switch (animationStyle) {
      case 'slide':
        return {
          hidden: { opacity: 0, x: imagePosition === 'right' ? -30 : 30 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.6 }
          }
        };
      case 'zoom':
        return {
          hidden: { opacity: 0, scale: 0.92 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: { type: "spring", stiffness: 120, duration: 0.7 }
          }
        };
      case 'float':
        return {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { 
              type: "spring", 
              stiffness: 80, 
              damping: 12,
              duration: 0.8
            }
          }
        };
      default: // fade
        return {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
          }
        };
    }
  };

  // Define image animation variants with more dramatic effects
  const getImageVariants = () => {
    return {
      hidden: { 
        opacity: 0, 
        scale: 0.85, 
        x: imagePosition === 'right' ? 40 : -40 
      },
      visible: {
        opacity: 1,
        scale: 1,
        x: 0,
        transition: { 
          type: "spring", 
          stiffness: 70, 
          damping: 15, 
          duration: 0.9,
          delay: 0.3
        }
      },
      hover: {
        scale: 1.03,
        transition: { duration: 0.4 }
      }
    };
  };

  // Get the specific variant functions
  const containerVariants = getContainerVariants();
  const itemVariants = getItemVariants();
  const imageVariants = getImageVariants();

  return (
    <motion.div
      className={cn(
        "relative py-8 md:py-14 overflow-hidden",
        isLeftAligned ? "text-left" : "text-center",
        className
      )}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Enhanced background elements with more dynamic effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-purple-500/15 blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1], 
            opacity: [0.6, 0.8, 0.6] 
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-pink-500/15 blur-3xl"
          animate={{ 
            scale: [1, 1.15, 1], 
            opacity: [0.7, 0.9, 0.7] 
          }}
          transition={{ 
            duration: 8,
            delay: 1,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-1/2 w-64 h-64 rounded-full bg-indigo-400/15 blur-3xl"
          animate={{ 
            scale: [1, 1.08, 1], 
            opacity: [0.5, 0.7, 0.5] 
          }}
          transition={{ 
            duration: 7, 
            delay: 2,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
      </div>
      
      <div className={cn(
        "container mx-auto px-4",
        isLeftAligned ? "flex flex-col md:flex-row items-center gap-8" : ""
      )}>
        <div className={cn(
          "max-w-3xl mx-auto",
          isLeftAligned ? "mx-0 md:w-1/2 order-2 md:order-1" : "",
          isLeftAligned && imagePosition === 'right' ? "md:pr-8" : "",
          isLeftAligned && imagePosition === 'left' ? "md:pl-8 md:order-2" : ""
        )}>
          <motion.div variants={itemVariants} className="relative">
            {showSparkles && (
              <Sparkles className="absolute -top-6 left-1/3 w-5 h-5 text-pink-400" />
            )}
            <h1 className={cn(
              "text-3xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-400 to-purple-500 mb-6",
              isLeftAligned ? "text-left" : "text-center"
            )}>
              {title}
            </h1>
          </motion.div>

          <motion.p 
            variants={itemVariants} 
            className={cn(
              "text-base md:text-lg lg:text-xl text-white/80 mb-8",
              isLeftAligned ? "text-left" : "text-center"
            )}
          >
            {subtitle}
          </motion.p>

          {children && (
            <motion.div 
              variants={itemVariants}
              className="relative z-20"
            >
              {children}
            </motion.div>
          )}
        </div>

        {showAvatar && (
          <motion.div 
            className={cn(
              "relative mt-6 md:mt-0",
              isLeftAligned ? "md:w-1/2 order-1 md:order-2 flex justify-center" : "",
              isLeftAligned && imagePosition === 'right' ? "md:order-2" : "",
              isLeftAligned && imagePosition === 'left' ? "md:order-1" : ""
            )}
            variants={imageVariants}
            whileHover="hover"
          >
            {/* Enhanced image styling with more dramatic, animated glow effects */}
            {overlayEffect === 'glow' && (
              <>
                <motion.div 
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-purple-500/40 to-pink-500/40 blur-2xl transform translate-y-4"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.6, 0.8, 0.6]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                <motion.div 
                  className="absolute -inset-4 -z-10 bg-gradient-to-tl from-purple-500/20 via-transparent to-pink-500/20 rounded-full blur-xl"
                  animate={{ 
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </>
            )}
            
            {overlayEffect === 'shimmer' && (
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            )}
            
            <img 
              src={halfBodyImage || getVariantImage()} 
              alt="Model"
              className={cn(
                "relative z-10 max-w-full",
                halfBodyImage ? "max-h-[600px] object-contain" : 'max-h-[300px]',
                isLeftAligned ? 'md:max-h-[550px]' : ''
              )}
              style={{
                filter: "drop-shadow(0 8px 20px rgba(159, 122, 234, 0.4))"
              }}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PageHeader;
