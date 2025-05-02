
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  showAvatar?: boolean;
  className?: string;
  children?: React.ReactNode;
  avatarSrc?: string;
  halfBodyImage?: string;
  imagePosition?: 'left' | 'right';
}

const PageHeader = ({
  title,
  subtitle,
  showAvatar = true,
  className,
  children,
  avatarSrc = "/lovable-uploads/34e8d801-61ee-4254-a7ce-39b52a3a7e65.png",
  halfBodyImage,
  imagePosition = 'right'
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn(
        "relative overflow-hidden py-4 md:py-6 px-4 md:px-6",
        halfBodyImage ? "min-h-[280px] md:min-h-[320px]" : "",
        !halfBodyImage && "text-center",
        className
      )}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl"></div>
      </div>
      
      <div className={`flex ${halfBodyImage ? 'flex-row items-center' : 'flex-col items-center'} ${halfBodyImage && imagePosition === 'left' ? 'flex-row-reverse' : ''}`}>
        {/* Text content */}
        <div className={`z-10 ${halfBodyImage ? (imagePosition === 'left' ? 'pr-4' : 'pl-4') : 'w-full'} ${halfBodyImage ? 'max-w-[60%]' : ''}`}>
          {/* Main headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-3xl xs:text-4xl sm:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 leading-tight"
          >
            {title}
          </motion.h1>
          
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
        
        {/* Half-body image (if provided) */}
        {halfBodyImage && (
          <motion.div 
            className={`relative z-10 flex-shrink-0 ${imagePosition === 'left' ? 'mr-4' : 'ml-4'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-2xl"></div>
            <img 
              src={halfBodyImage} 
              alt="Olivia" 
              className="max-h-[280px] md:max-h-[320px] drop-shadow-lg"
            />
          </motion.div>
        )}
        
        {/* Avatar (optional) */}
        {showAvatar && !halfBodyImage && (
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
