
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  showAvatar?: boolean;
  className?: string;
  children?: React.ReactNode;
  avatarSrc?: string;
  imagePosition?: 'left' | 'right';
  showSparkles?: boolean;
  imageVariant?: 'pink-suit';
}

const PageHeader = ({
  title,
  subtitle,
  showAvatar = true,
  className,
  children,
  avatarSrc = "/lovable-uploads/34e8d801-61ee-4254-a7ce-39b52a3a7e65.png",
  imagePosition = 'right',
  showSparkles = false,
  imageVariant = 'pink-suit'
}: PageHeaderProps) => {
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

  // Get the appropriate image based on the variant
  const getImageSrc = () => {
    if (imageVariant === 'pink-suit') {
      return "/lovable-uploads/f29b0fb8-330c-409a-8488-2e7ae2b351ed.png";
    } else {
      return "/lovable-uploads/7fc023d8-bd78-47c7-8725-d8cb48855e20.png";
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn(
        "relative overflow-hidden py-4 md:py-6 px-4 md:px-6",
        imageVariant ? "min-h-[280px] md:min-h-[320px]" : "",
        !imageVariant && "text-center",
        className
      )}
    >
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl"></div>
        {/* Additional futuristic elements */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-purple-900/10 to-transparent"></div>
        <div className="absolute -left-20 top-1/4 w-40 h-40 rounded-full border border-pink-300/20"></div>
        <div className="absolute right-10 bottom-1/4 w-20 h-20 rounded-full border border-indigo-300/20"></div>
      </div>
      
      <div className={`flex ${imageVariant ? 'flex-row items-center' : 'flex-col items-center'} ${imageVariant && imagePosition === 'left' ? 'flex-row-reverse' : ''}`}>
        {/* Text content */}
        <div className={`z-10 ${imageVariant ? (imagePosition === 'left' ? 'pr-4' : 'pl-4') : 'w-full'} ${imageVariant ? 'max-w-[60%] md:max-w-[60%]' : ''}`}>
          {/* Main headline */}
          <motion.div className="relative">
            {showSparkles && (
              <motion.div 
                className="absolute -top-6 -left-6"
                variants={sparkleVariants}
                initial="initial"
                animate="animate"
              >
                <Sparkles className="w-5 h-5 text-pink-400" />
              </motion.div>
            )}
            <motion.h1 
              variants={itemVariants}
              className="text-3xl xs:text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 leading-tight"
            >
              {title}
            </motion.h1>
          </motion.div>
          
          {/* Subheadline */}
          <motion.p 
            variants={itemVariants}
            className="text-base xs:text-lg text-white/80 mb-6"
          >
            {subtitle.includes('Olivia') ? (
              <>
                {subtitle.split('Olivia')[0]}
                <span className="relative">
                  <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-medium">
                    Olivia
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-pink-400 to-purple-400 opacity-70"></span>
                </span>
                {subtitle.split('Olivia')[1]}
              </>
            ) : subtitle}
          </motion.p>
          
          {/* Optional additional content */}
          {children && (
            <motion.div variants={itemVariants}>
              {children}
            </motion.div>
          )}
        </div>
        
        {/* Olivia image */}
        {imageVariant && (
          <motion.div 
            className={`relative z-10 flex-shrink-0 ${imagePosition === 'left' ? 'mr-4' : 'ml-4'}`}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            {/* Glowing backlight effect for the image */}
            <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 blur-2xl"></div>
            
            {/* Subtle animated rings */}
            <div className="absolute inset-0 -z-5 rounded-full border border-pink-400/10 animate-pulse"></div>
            <div className="absolute inset-2 -z-5 rounded-full border border-indigo-400/5"></div>
            
            {/* The image - with mobile adjustments */}
            <img 
              src={getImageSrc()} 
              alt="Olivia" 
              className="max-h-[200px] xs:max-h-[220px] sm:max-h-[250px] md:max-h-[320px] drop-shadow-lg mobile-olivia-image"
              style={{
                maxWidth: '100%',
                height: 'auto'
              }}
            />
            
            {/* Added mobile-specific styles */}
            <style>
              {`
                @media (max-width: 640px) {
                  .mobile-olivia-image {
                    max-height: 180px !important;
                    transform: translateX(-15%) scale(0.85);
                    opacity: 0.85;
                  }
                }
              `}
            </style>
            
            {/* Subtle light effect */}
            <div className="absolute top-0 right-1/4 w-10 h-10 bg-white/10 rounded-full blur-xl"></div>
          </motion.div>
        )}
        
        {/* Avatar (optional) */}
        {showAvatar && !imageVariant && (
          <motion.div 
            variants={itemVariants}
            className="mb-6"
          >
            <Avatar className="h-16 w-16 border-2 border-purple-400/50 bg-gradient-to-br from-purple-600/80 to-pink-600/80">
              <AvatarImage src={avatarSrc} alt="Olivia" />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-lg">OB</AvatarFallback>
            </Avatar>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PageHeader;
