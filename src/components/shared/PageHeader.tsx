
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  children?: React.ReactNode;
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
  children,
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className={cn(
        "relative py-8 md:py-12 overflow-hidden",
        isLeftAligned ? "text-left" : "text-center",
        className
      )}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl"></div>
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
              "text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4",
              isLeftAligned ? "text-left" : "text-center"
            )}>
              {title}
            </h1>
          </motion.div>

          <motion.p variants={itemVariants} className={cn(
            "text-base md:text-lg text-white/80 mb-6",
            isLeftAligned ? "text-left" : "text-center"
          )}>
            {subtitle}
          </motion.p>

          {children && <motion.div variants={itemVariants}>{children}</motion.div>}
        </div>

        {showAvatar && (
          <motion.div 
            className={cn(
              "relative mt-6 md:mt-0",
              isLeftAligned ? "md:w-1/2 order-1 md:order-2 flex justify-center" : "",
              isLeftAligned && imagePosition === 'right' ? "md:order-2" : "",
              isLeftAligned && imagePosition === 'left' ? "md:order-1" : ""
            )}
            variants={itemVariants}
          >
            <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-2xl"></div>
            <img 
              src={getVariantImage()} 
              alt="Olivia" 
              className={cn(
                "relative z-10 max-w-full",
                imageVariant === 'pink-suit' ? 'max-h-[400px]' : 'max-h-[300px]',
                isLeftAligned ? 'md:max-h-[450px]' : ''
              )}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PageHeader;
